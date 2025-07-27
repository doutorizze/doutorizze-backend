const express = require('express');
const crypto = require('crypto');
const { query } = require('../config/database');

const router = express.Router();

// Middleware para verificar assinatura do webhook (segurança)
const verifyWebhookSignature = (req, res, next) => {
  try {
    const signature = req.headers['x-parcelamais-signature'];
    const payload = JSON.stringify(req.body);
    const secret = process.env.PARCELAMAIS_WEBHOOK_SECRET || 'webhook_secret';
    
    if (!signature) {
      return res.status(401).json({ error: 'Assinatura do webhook ausente' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const providedSignature = signature.replace('sha256=', '');

    if (!crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(providedSignature))) {
      return res.status(401).json({ error: 'Assinatura do webhook inválida' });
    }

    next();
  } catch (error) {
    console.error('Erro na verificação do webhook:', error);
    res.status(500).json({ error: 'Erro na verificação do webhook' });
  }
};

// POST /api/webhooks/parcelamais - Webhook do Parcelamais
router.post('/parcelamais', verifyWebhookSignature, async (req, res) => {
  try {
    const { event_type, data } = req.body;

    // Log do webhook
    const webhookLogId = await query(`
      INSERT INTO webhook_logs (source, event_type, payload, status)
      VALUES (?, ?, ?, ?)
    `, ['parcelamais', event_type, JSON.stringify(req.body), 'received']);

    console.log(`Webhook Parcelamais recebido: ${event_type}`, data);

    try {
      switch (event_type) {
        case 'loan_request.approved':
          await handleLoanApproved(data);
          break;
        
        case 'loan_request.rejected':
          await handleLoanRejected(data);
          break;
        
        case 'loan_request.under_analysis':
          await handleLoanUnderAnalysis(data);
          break;
        
        case 'loan_request.pending_documents':
          await handleLoanPendingDocuments(data);
          break;
        
        case 'payment.received':
          await handlePaymentReceived(data);
          break;
        
        case 'payment.overdue':
          await handlePaymentOverdue(data);
          break;
        
        default:
          console.log(`Evento não tratado: ${event_type}`);
      }

      // Atualizar log como processado
      await query(`
        UPDATE webhook_logs SET
          status = 'processed',
          processed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [webhookLogId.insertId]);

      res.json({ success: true, message: 'Webhook processado com sucesso' });

    } catch (processingError) {
      console.error('Erro ao processar webhook:', processingError);
      
      // Atualizar log como falha
      await query(`
        UPDATE webhook_logs SET
          status = 'failed',
          error_message = ?,
          processed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [processingError.message, webhookLogId.insertId]);

      res.status(500).json({ error: 'Erro ao processar webhook' });
    }

  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Função para tratar aprovação de empréstimo
const handleLoanApproved = async (data) => {
  const { external_id, parcelamais_id, contract_url, first_due_date, installment_details } = data;

  // Buscar solicitação pelo external_id
  const loanRequests = await query(`
    SELECT * FROM loan_requests WHERE id = ? AND parcelamais_request_id = ?
  `, [external_id, parcelamais_id]);

  if (loanRequests.length === 0) {
    throw new Error(`Solicitação não encontrada: ${external_id}`);
  }

  const loanRequest = loanRequests[0];

  // Atualizar status da solicitação
  await query(`
    UPDATE loan_requests SET
      status = 'approved',
      parcelamais_status = 'approved',
      approved_at = CURRENT_TIMESTAMP,
      parcelamais_response = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [JSON.stringify(data), external_id]);

  // Criar notificação para o paciente
  await query(`
    INSERT INTO notifications (user_id, title, message, type, related_type, related_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    loanRequest.patient_id,
    'Empréstimo Aprovado! 🎉',
    `Parabéns! Seu empréstimo de R$ ${loanRequest.amount.toFixed(2)} foi aprovado pelo Parcelamais`,
    'success',
    'loan_request',
    external_id
  ]);

  // Notificar clínica
  const clinics = await query('SELECT user_id FROM clinics WHERE id = ?', [loanRequest.clinic_id]);
  if (clinics.length > 0) {
    await query(`
      INSERT INTO notifications (user_id, title, message, type, related_type, related_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      clinics[0].user_id,
      'Empréstimo Aprovado',
      `Empréstimo de R$ ${loanRequest.amount.toFixed(2)} aprovado para paciente`,
      'success',
      'loan_request',
      external_id
    ]);
  }

  console.log(`Empréstimo aprovado: ${external_id}`);
};

// Função para tratar rejeição de empréstimo
const handleLoanRejected = async (data) => {
  const { external_id, parcelamais_id, rejection_reason } = data;

  // Buscar solicitação
  const loanRequests = await query(`
    SELECT * FROM loan_requests WHERE id = ? AND parcelamais_request_id = ?
  `, [external_id, parcelamais_id]);

  if (loanRequests.length === 0) {
    throw new Error(`Solicitação não encontrada: ${external_id}`);
  }

  const loanRequest = loanRequests[0];

  // Atualizar status da solicitação
  await query(`
    UPDATE loan_requests SET
      status = 'rejected',
      parcelamais_status = 'rejected',
      rejected_at = CURRENT_TIMESTAMP,
      admin_notes = ?,
      parcelamais_response = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [rejection_reason, JSON.stringify(data), external_id]);

  // Criar notificação para o paciente
  await query(`
    INSERT INTO notifications (user_id, title, message, type, related_type, related_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    loanRequest.patient_id,
    'Solicitação Rejeitada',
    rejection_reason || 'Sua solicitação de empréstimo foi rejeitada pelo Parcelamais',
    'error',
    'loan_request',
    external_id
  ]);

  console.log(`Empréstimo rejeitado: ${external_id} - ${rejection_reason}`);
};

// Função para tratar análise em andamento
const handleLoanUnderAnalysis = async (data) => {
  const { external_id, parcelamais_id, estimated_response_time } = data;

  // Atualizar status
  await query(`
    UPDATE loan_requests SET
      parcelamais_status = 'under_analysis',
      parcelamais_response = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND parcelamais_request_id = ?
  `, [JSON.stringify(data), external_id, parcelamais_id]);

  console.log(`Empréstimo em análise: ${external_id}`);
};

// Função para tratar documentos pendentes
const handleLoanPendingDocuments = async (data) => {
  const { external_id, parcelamais_id, required_documents, upload_url } = data;

  // Buscar solicitação
  const loanRequests = await query(`
    SELECT * FROM loan_requests WHERE id = ? AND parcelamais_request_id = ?
  `, [external_id, parcelamais_id]);

  if (loanRequests.length === 0) {
    throw new Error(`Solicitação não encontrada: ${external_id}`);
  }

  const loanRequest = loanRequests[0];

  // Atualizar status
  await query(`
    UPDATE loan_requests SET
      parcelamais_status = 'pending_documents',
      parcelamais_response = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [JSON.stringify(data), external_id]);

  // Criar notificação para o paciente
  await query(`
    INSERT INTO notifications (user_id, title, message, type, related_type, related_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    loanRequest.patient_id,
    'Documentos Pendentes',
    `Documentos necessários para análise: ${required_documents.join(', ')}`,
    'warning',
    'loan_request',
    external_id
  ]);

  console.log(`Documentos pendentes: ${external_id}`);
};

// Função para tratar pagamento recebido
const handlePaymentReceived = async (data) => {
  const { external_id, installment_number, amount, payment_date } = data;

  console.log(`Pagamento recebido: ${external_id} - Parcela ${installment_number} - R$ ${amount}`);

  // Buscar solicitação
  const loanRequests = await query(`
    SELECT * FROM loan_requests WHERE id = ?
  `, [external_id]);

  if (loanRequests.length > 0) {
    const loanRequest = loanRequests[0];

    // Criar notificação para o paciente
    await query(`
      INSERT INTO notifications (user_id, title, message, type, related_type, related_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      loanRequest.patient_id,
      'Pagamento Confirmado ✅',
      `Pagamento da parcela ${installment_number} confirmado - R$ ${amount}`,
      'success',
      'loan_request',
      external_id
    ]);
  }
};

// Função para tratar pagamento em atraso
const handlePaymentOverdue = async (data) => {
  const { external_id, installment_number, amount, due_date, days_overdue } = data;

  console.log(`Pagamento em atraso: ${external_id} - Parcela ${installment_number} - ${days_overdue} dias`);

  // Buscar solicitação
  const loanRequests = await query(`
    SELECT * FROM loan_requests WHERE id = ?
  `, [external_id]);

  if (loanRequests.length > 0) {
    const loanRequest = loanRequests[0];

    // Criar notificação para o paciente
    await query(`
      INSERT INTO notifications (user_id, title, message, type, related_type, related_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      loanRequest.patient_id,
      'Pagamento em Atraso ⚠️',
      `Parcela ${installment_number} está ${days_overdue} dias em atraso - R$ ${amount}`,
      'error',
      'loan_request',
      external_id
    ]);
  }
};

// GET /api/webhooks/logs - Listar logs de webhooks (apenas admin)
router.get('/logs', async (req, res) => {
  try {
    const { page = 1, limit = 50, source, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (source) {
      whereClause += ' AND source = ?';
      params.push(source);
    }

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    const logs = await query(`
      SELECT * FROM webhook_logs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    const [countResult] = await query(`
      SELECT COUNT(*) as total FROM webhook_logs ${whereClause}
    `, params);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/webhooks/test - Endpoint para testar webhooks (desenvolvimento)
router.post('/test', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Endpoint de teste não disponível em produção' });
    }

    const { event_type, data } = req.body;

    // Simular webhook
    const testWebhook = {
      event_type: event_type || 'loan_request.approved',
      data: data || {
        external_id: '1',
        parcelamais_id: 'PM_TEST_123',
        contract_url: 'https://example.com/contract.pdf',
        first_due_date: '2024-02-01'
      }
    };

    // Processar webhook de teste
    req.body = testWebhook;
    
    // Simular processamento
    console.log('Webhook de teste processado:', testWebhook);

    res.json({ success: true, message: 'Webhook de teste processado', data: testWebhook });
  } catch (error) {
    console.error('Erro no webhook de teste:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;