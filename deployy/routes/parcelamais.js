const express = require('express');
const axios = require('axios');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configuração da API do Parcelamais
const PARCELAMAIS_API_URL = process.env.PARCELAMAIS_API_URL || 'https://api.parcelamais.com.br';
const CLIENT_ID = process.env.PARCELAMAIS_CLIENT_ID;
const CLIENT_SECRET = process.env.PARCELAMAIS_CLIENT_SECRET;

// Função para obter token de acesso
const getAccessToken = async () => {
  try {
    const response = await axios.post(`${PARCELAMAIS_API_URL}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao obter token Parcelamais:', error.response?.data || error.message);
    throw new Error('Falha na autenticação com Parcelamais');
  }
};

// POST /api/parcelamais/simulate - Simular financiamento
router.post('/simulate', authenticateToken, async (req, res) => {
  try {
    const { amount, installments, customer_data } = req.body;

    if (!amount || !installments) {
      return res.status(400).json({ error: 'Valor e número de parcelas são obrigatórios' });
    }

    // Simulação local (em produção, usar API real do Parcelamais)
    const interestRate = 2.5; // 2.5% ao mês
    const monthlyInterest = interestRate / 100;
    const monthlyPayment = (amount * monthlyInterest * Math.pow(1 + monthlyInterest, installments)) / 
                          (Math.pow(1 + monthlyInterest, installments) - 1);
    const totalAmount = monthlyPayment * installments;
    const totalInterest = totalAmount - amount;

    const simulation = {
      requested_amount: amount,
      installments: installments,
      monthly_payment: Math.round(monthlyPayment * 100) / 100,
      total_amount: Math.round(totalAmount * 100) / 100,
      total_interest: Math.round(totalInterest * 100) / 100,
      interest_rate: interestRate,
      first_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      approval_probability: Math.random() > 0.3 ? 'high' : 'medium' // Simulação
    };

    res.json({
      success: true,
      simulation
    });
  } catch (error) {
    console.error('Erro na simulação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/parcelamais/create-request - Criar solicitação no Parcelamais
router.post('/create-request', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { loan_request_id } = req.body;

    if (!loan_request_id) {
      return res.status(400).json({ error: 'ID da solicitação é obrigatório' });
    }

    // Buscar dados da solicitação
    const loanRequests = await query(`
      SELECT 
        lr.*,
        p.name as patient_name,
        p.email as patient_email,
        p.phone as patient_phone,
        c.name as clinic_name,
        c.cnpj as clinic_cnpj
      FROM loan_requests lr
      JOIN users p ON lr.patient_id = p.id
      JOIN clinics c ON lr.clinic_id = c.id
      WHERE lr.id = ? AND lr.status = 'clinic_approved'
    `, [loan_request_id]);

    if (loanRequests.length === 0) {
      return res.status(404).json({ error: 'Solicitação não encontrada ou não aprovada pela clínica' });
    }

    const loanRequest = loanRequests[0];

    // Preparar dados para o Parcelamais
    const parcelamaisData = {
      customer: {
        name: loanRequest.patient_name,
        email: loanRequest.patient_email,
        phone: loanRequest.patient_phone,
        document: '000.000.000-00' // Em produção, buscar CPF real
      },
      merchant: {
        name: loanRequest.clinic_name,
        cnpj: loanRequest.clinic_cnpj
      },
      loan: {
        amount: loanRequest.amount,
        installments: loanRequest.installments,
        purpose: loanRequest.purpose,
        external_id: loan_request_id.toString()
      }
    };

    try {
      // Simular chamada para API do Parcelamais
      // const token = await getAccessToken();
      // const response = await axios.post(`${PARCELAMAIS_API_URL}/v1/loan-requests`, parcelamaisData, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

      // Simulação da resposta do Parcelamais
      const simulatedResponse = {
        id: `PM_${Date.now()}_${loan_request_id}`,
        status: 'under_analysis',
        created_at: new Date().toISOString(),
        estimated_response_time: '24-48 hours',
        tracking_url: `https://parcelamais.com.br/track/${Date.now()}`
      };

      // Atualizar solicitação no banco
      await query(`
        UPDATE loan_requests SET
          status = 'admin_processing',
          parcelamais_request_id = ?,
          parcelamais_status = ?,
          parcelamais_response = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        simulatedResponse.id,
        simulatedResponse.status,
        JSON.stringify(simulatedResponse),
        loan_request_id
      ]);

      // Criar notificação para o paciente
      await query(`
        INSERT INTO notifications (user_id, title, message, type, related_type, related_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        loanRequest.patient_id,
        'Solicitação Enviada ao Parcelamais',
        'Sua solicitação foi enviada ao Parcelamais e está sendo analisada',
        'info',
        'loan_request',
        loan_request_id
      ]);

      res.json({
        success: true,
        parcelamais_request_id: simulatedResponse.id,
        status: simulatedResponse.status,
        tracking_url: simulatedResponse.tracking_url
      });

    } catch (apiError) {
      console.error('Erro na API do Parcelamais:', apiError.response?.data || apiError.message);
      
      // Atualizar status para erro
      await query(`
        UPDATE loan_requests SET
          status = 'rejected',
          admin_notes = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, ['Erro na integração com Parcelamais: ' + (apiError.response?.data?.message || apiError.message), loan_request_id]);

      res.status(500).json({ error: 'Erro na integração com Parcelamais' });
    }

  } catch (error) {
    console.error('Erro ao criar solicitação no Parcelamais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/parcelamais/status/:parcelamais_id - Consultar status no Parcelamais
router.get('/status/:parcelamais_id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { parcelamais_id } = req.params;

    try {
      // Simular consulta na API do Parcelamais
      // const token = await getAccessToken();
      // const response = await axios.get(`${PARCELAMAIS_API_URL}/v1/loan-requests/${parcelamais_id}`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });

      // Simulação da resposta
      const statuses = ['under_analysis', 'approved', 'rejected', 'pending_documents'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      const simulatedResponse = {
        id: parcelamais_id,
        status: randomStatus,
        updated_at: new Date().toISOString(),
        analysis_details: {
          score: Math.floor(Math.random() * 1000),
          risk_level: randomStatus === 'approved' ? 'low' : 'medium'
        }
      };

      // Atualizar no banco de dados
      await query(`
        UPDATE loan_requests SET
          parcelamais_status = ?,
          parcelamais_response = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE parcelamais_request_id = ?
      `, [
        simulatedResponse.status,
        JSON.stringify(simulatedResponse),
        parcelamais_id
      ]);

      res.json({
        success: true,
        status: simulatedResponse.status,
        details: simulatedResponse
      });

    } catch (apiError) {
      console.error('Erro na consulta ao Parcelamais:', apiError.response?.data || apiError.message);
      res.status(500).json({ error: 'Erro na consulta ao Parcelamais' });
    }

  } catch (error) {
    console.error('Erro ao consultar status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/parcelamais/approve/:loan_request_id - Aprovar solicitação
router.post('/approve/:loan_request_id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { loan_request_id } = req.params;
    const { contract_url, first_due_date } = req.body;

    // Buscar solicitação
    const loanRequests = await query(`
      SELECT * FROM loan_requests WHERE id = ? AND status = 'admin_processing'
    `, [loan_request_id]);

    if (loanRequests.length === 0) {
      return res.status(404).json({ error: 'Solicitação não encontrada ou não está em processamento' });
    }

    const loanRequest = loanRequests[0];

    // Atualizar status para aprovado
    await query(`
      UPDATE loan_requests SET
        status = 'approved',
        approved_at = CURRENT_TIMESTAMP,
        parcelamais_status = 'approved',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [loan_request_id]);

    // Criar notificação para o paciente
    await query(`
      INSERT INTO notifications (user_id, title, message, type, related_type, related_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      loanRequest.patient_id,
      'Empréstimo Aprovado! 🎉',
      `Parabéns! Seu empréstimo de R$ ${loanRequest.amount.toFixed(2)} foi aprovado`,
      'success',
      'loan_request',
      loan_request_id
    ]);

    res.json({
      success: true,
      message: 'Solicitação aprovada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao aprovar solicitação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/parcelamais/reject/:loan_request_id - Rejeitar solicitação
router.post('/reject/:loan_request_id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { loan_request_id } = req.params;
    const { reason } = req.body;

    // Buscar solicitação
    const loanRequests = await query(`
      SELECT * FROM loan_requests WHERE id = ? AND status = 'admin_processing'
    `, [loan_request_id]);

    if (loanRequests.length === 0) {
      return res.status(404).json({ error: 'Solicitação não encontrada ou não está em processamento' });
    }

    const loanRequest = loanRequests[0];

    // Atualizar status para rejeitado
    await query(`
      UPDATE loan_requests SET
        status = 'rejected',
        rejected_at = CURRENT_TIMESTAMP,
        admin_notes = ?,
        parcelamais_status = 'rejected',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [reason, loan_request_id]);

    // Criar notificação para o paciente
    await query(`
      INSERT INTO notifications (user_id, title, message, type, related_type, related_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      loanRequest.patient_id,
      'Solicitação Rejeitada',
      reason || 'Sua solicitação de empréstimo foi rejeitada',
      'error',
      'loan_request',
      loan_request_id
    ]);

    res.json({
      success: true,
      message: 'Solicitação rejeitada'
    });

  } catch (error) {
    console.error('Erro ao rejeitar solicitação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/parcelamais/stats - Estatísticas do Parcelamais
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [stats] = await query(`
      SELECT 
        COUNT(*) as total_requests,
        COUNT(CASE WHEN parcelamais_status = 'approved' THEN 1 END) as approved_requests,
        COUNT(CASE WHEN parcelamais_status = 'rejected' THEN 1 END) as rejected_requests,
        COUNT(CASE WHEN parcelamais_status = 'under_analysis' THEN 1 END) as pending_requests,
        SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as total_approved_amount,
        AVG(CASE WHEN status = 'approved' THEN amount END) as average_loan_amount
      FROM loan_requests 
      WHERE parcelamais_request_id IS NOT NULL
    `);

    const [monthlyStats] = await query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as requests,
        SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as approved_amount
      FROM loan_requests 
      WHERE parcelamais_request_id IS NOT NULL
        AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
    `);

    res.json({
      overview: stats,
      monthly_trends: monthlyStats
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;