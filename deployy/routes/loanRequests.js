const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin, requireOwnershipOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Validações
const loanRequestValidation = [
  body('clinic_id').isInt().withMessage('ID da clínica inválido'),
  body('amount').isFloat({ min: 100, max: 100000 }).withMessage('Valor deve estar entre R$ 100 e R$ 100.000'),
  body('installments').isInt({ min: 2, max: 60 }).withMessage('Parcelas devem estar entre 2 e 60'),
  body('purpose').isLength({ min: 10, max: 500 }).withMessage('Finalidade deve ter entre 10 e 500 caracteres')
];

// GET /api/loan-requests - Listar solicitações de empréstimo
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, clinic_id, date_from, date_to } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    // Filtros baseados no role do usuário
    if (req.user.role === 'patient') {
      whereClause += ' AND lr.patient_id = ?';
      params.push(req.user.id);
    } else if (req.user.role === 'clinic') {
      // Buscar ID da clínica do usuário
      const clinics = await query('SELECT id FROM clinics WHERE user_id = ?', [req.user.id]);
      if (clinics.length > 0) {
        whereClause += ' AND lr.clinic_id = ?';
        params.push(clinics[0].id);
      } else {
        return res.json({ loan_requests: [], pagination: { page: 1, limit, total: 0, pages: 0 } });
      }
    }

    // Filtros adicionais
    if (status) {
      whereClause += ' AND lr.status = ?';
      params.push(status);
    }

    if (clinic_id && req.user.role === 'admin') {
      whereClause += ' AND lr.clinic_id = ?';
      params.push(clinic_id);
    }

    if (date_from) {
      whereClause += ' AND DATE(lr.created_at) >= ?';
      params.push(date_from);
    }

    if (date_to) {
      whereClause += ' AND DATE(lr.created_at) <= ?';
      params.push(date_to);
    }

    const loanRequests = await query(`
      SELECT 
        lr.*,
        p.name as patient_name,
        p.email as patient_email,
        p.phone as patient_phone,
        c.name as clinic_name,
        c.email as clinic_email
      FROM loan_requests lr
      JOIN users p ON lr.patient_id = p.id
      JOIN clinics c ON lr.clinic_id = c.id
      ${whereClause}
      ORDER BY lr.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    // Contar total
    const [countResult] = await query(`
      SELECT COUNT(*) as total
      FROM loan_requests lr
      JOIN users p ON lr.patient_id = p.id
      JOIN clinics c ON lr.clinic_id = c.id
      ${whereClause}
    `, params);

    res.json({
      loan_requests: loanRequests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar solicitações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/loan-requests/:id - Buscar solicitação específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    let whereClause = 'WHERE lr.id = ?';
    const params = [id];

    // Verificar permissões
    if (req.user.role === 'patient') {
      whereClause += ' AND lr.patient_id = ?';
      params.push(req.user.id);
    } else if (req.user.role === 'clinic') {
      const clinics = await query('SELECT id FROM clinics WHERE user_id = ?', [req.user.id]);
      if (clinics.length > 0) {
        whereClause += ' AND lr.clinic_id = ?';
        params.push(clinics[0].id);
      } else {
        return res.status(404).json({ error: 'Solicitação não encontrada' });
      }
    }

    const loanRequests = await query(`
      SELECT 
        lr.*,
        p.name as patient_name,
        p.email as patient_email,
        p.phone as patient_phone,
        c.name as clinic_name,
        c.email as clinic_email
      FROM loan_requests lr
      JOIN users p ON lr.patient_id = p.id
      JOIN clinics c ON lr.clinic_id = c.id
      ${whereClause}
    `, params);

    if (loanRequests.length === 0) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    res.json(loanRequests[0]);
  } catch (error) {
    console.error('Erro ao buscar solicitação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/loan-requests - Criar solicitação de empréstimo
router.post('/', authenticateToken, loanRequestValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clinic_id, amount, installments, purpose } = req.body;

    // Verificar se a clínica existe, está ativa e tem Parcelamais habilitado
    const clinics = await query(`
      SELECT id FROM clinics 
      WHERE id = ? AND status = 'active' AND parcelamais_enabled = true
    `, [clinic_id]);
    
    if (clinics.length === 0) {
      return res.status(400).json({ error: 'Clínica não encontrada, inativa ou sem Parcelamais habilitado' });
    }

    // Calcular valores (simulação - em produção usar API do Parcelamais)
    const interestRate = 2.5; // 2.5% ao mês
    const monthlyInterest = interestRate / 100;
    const monthlyPayment = (amount * monthlyInterest * Math.pow(1 + monthlyInterest, installments)) / 
                          (Math.pow(1 + monthlyInterest, installments) - 1);
    const totalAmount = monthlyPayment * installments;

    // Criar solicitação
    const result = await query(`
      INSERT INTO loan_requests (
        patient_id, clinic_id, amount, installments, monthly_payment, 
        total_amount, interest_rate, purpose, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id,
      clinic_id,
      amount,
      installments,
      Math.round(monthlyPayment * 100) / 100,
      Math.round(totalAmount * 100) / 100,
      interestRate,
      purpose,
      'pending'
    ]);

    // Criar notificação para a clínica
    const clinicUsers = await query('SELECT user_id FROM clinics WHERE id = ?', [clinic_id]);
    if (clinicUsers.length > 0) {
      await query(`
        INSERT INTO notifications (user_id, title, message, type, related_type, related_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        clinicUsers[0].user_id,
        'Nova Solicitação de Empréstimo',
        `Nova solicitação de R$ ${amount.toFixed(2)} em ${installments}x`,
        'info',
        'loan_request',
        result.insertId
      ]);
    }

    res.status(201).json({
      message: 'Solicitação criada com sucesso',
      loan_request_id: result.insertId,
      calculation: {
        monthly_payment: Math.round(monthlyPayment * 100) / 100,
        total_amount: Math.round(totalAmount * 100) / 100,
        interest_rate: interestRate
      }
    });
  } catch (error) {
    console.error('Erro ao criar solicitação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/loan-requests/:id/clinic-action - Ação da clínica (aprovar/rejeitar)
router.put('/:id/clinic-action', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notes } = req.body; // action: 'approve' ou 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Ação inválida' });
    }

    // Verificar se é uma clínica e se a solicitação pertence a ela
    if (req.user.role !== 'clinic') {
      return res.status(403).json({ error: 'Apenas clínicas podem executar esta ação' });
    }

    const clinics = await query('SELECT id FROM clinics WHERE user_id = ?', [req.user.id]);
    if (clinics.length === 0) {
      return res.status(403).json({ error: 'Clínica não encontrada' });
    }

    const clinicId = clinics[0].id;

    // Buscar solicitação
    const loanRequests = await query(`
      SELECT * FROM loan_requests 
      WHERE id = ? AND clinic_id = ? AND status = 'pending'
    `, [id, clinicId]);

    if (loanRequests.length === 0) {
      return res.status(404).json({ error: 'Solicitação não encontrada ou já processada' });
    }

    const newStatus = action === 'approve' ? 'clinic_approved' : 'clinic_rejected';

    // Atualizar solicitação
    await query(`
      UPDATE loan_requests SET
        status = ?,
        clinic_notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [newStatus, notes, id]);

    // Criar notificação para o paciente
    const loanRequest = loanRequests[0];
    const actionText = action === 'approve' ? 'aprovada' : 'rejeitada';
    
    await query(`
      INSERT INTO notifications (user_id, title, message, type, related_type, related_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      loanRequest.patient_id,
      `Solicitação ${actionText}`,
      `Sua solicitação de empréstimo foi ${actionText} pela clínica`,
      action === 'approve' ? 'success' : 'warning',
      'loan_request',
      id
    ]);

    // Se aprovada, criar notificação para o admin
    if (action === 'approve') {
      const admins = await query('SELECT id FROM users WHERE role = "admin"');
      for (const admin of admins) {
        await query(`
          INSERT INTO notifications (user_id, title, message, type, related_type, related_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          admin.id,
          'Solicitação Aprovada pela Clínica',
          `Solicitação #${id} aprovada e aguardando processamento`,
          'info',
          'loan_request',
          id
        ]);
      }
    }

    res.json({ message: `Solicitação ${actionText} com sucesso` });
  } catch (error) {
    console.error('Erro na ação da clínica:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/loan-requests/:id/admin-action - Ação do admin (processar no Parcelamais)
router.put('/:id/admin-action', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notes } = req.body; // action: 'process', 'approve', 'reject'

    if (!['process', 'approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Ação inválida' });
    }

    // Buscar solicitação
    const loanRequests = await query(`
      SELECT lr.*, p.name as patient_name, p.email as patient_email, c.name as clinic_name
      FROM loan_requests lr
      JOIN users p ON lr.patient_id = p.id
      JOIN clinics c ON lr.clinic_id = c.id
      WHERE lr.id = ?
    `, [id]);

    if (loanRequests.length === 0) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    const loanRequest = loanRequests[0];
    let newStatus;
    let notificationMessage;

    if (action === 'process') {
      // Simular integração com Parcelamais
      const parcelamaisRequestId = `PM_${Date.now()}_${id}`;
      const parcelamaisResponse = {
        request_id: parcelamaisRequestId,
        status: 'processing',
        created_at: new Date().toISOString()
      };

      newStatus = 'admin_processing';
      notificationMessage = 'Sua solicitação está sendo processada no Parcelamais';

      await query(`
        UPDATE loan_requests SET
          status = ?,
          admin_notes = ?,
          parcelamais_request_id = ?,
          parcelamais_status = ?,
          parcelamais_response = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [newStatus, notes, parcelamaisRequestId, 'processing', JSON.stringify(parcelamaisResponse), id]);

    } else if (action === 'approve') {
      newStatus = 'approved';
      notificationMessage = 'Sua solicitação de empréstimo foi aprovada!';

      await query(`
        UPDATE loan_requests SET
          status = ?,
          admin_notes = ?,
          approved_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [newStatus, notes, id]);

    } else if (action === 'reject') {
      newStatus = 'rejected';
      notificationMessage = 'Sua solicitação de empréstimo foi rejeitada';

      await query(`
        UPDATE loan_requests SET
          status = ?,
          admin_notes = ?,
          rejected_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [newStatus, notes, id]);
    }

    // Criar notificação para o paciente
    await query(`
      INSERT INTO notifications (user_id, title, message, type, related_type, related_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      loanRequest.patient_id,
      'Atualização da Solicitação',
      notificationMessage,
      action === 'approve' ? 'success' : action === 'reject' ? 'error' : 'info',
      'loan_request',
      id
    ]);

    res.json({ message: 'Ação executada com sucesso' });
  } catch (error) {
    console.error('Erro na ação do admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/loan-requests/stats/dashboard - Estatísticas para dashboard
router.get('/stats/dashboard', authenticateToken, async (req, res) => {
  try {
    let whereClause = '';
    const params = [];

    // Filtrar por role
    if (req.user.role === 'patient') {
      whereClause = 'WHERE patient_id = ?';
      params.push(req.user.id);
    } else if (req.user.role === 'clinic') {
      const clinics = await query('SELECT id FROM clinics WHERE user_id = ?', [req.user.id]);
      if (clinics.length > 0) {
        whereClause = 'WHERE clinic_id = ?';
        params.push(clinics[0].id);
      } else {
        return res.json({ total: 0, pending: 0, approved: 0, rejected: 0, total_amount: 0 });
      }
    }

    const [stats] = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status IN ('pending', 'clinic_approved', 'admin_processing') THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status IN ('rejected', 'clinic_rejected') THEN 1 END) as rejected,
        SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as total_amount
      FROM loan_requests ${whereClause}
    `, params);

    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/loan-requests/:id - Cancelar solicitação
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o usuário pode cancelar
    let whereClause = 'WHERE id = ? AND status IN ("pending", "clinic_approved")';
    const params = [id];

    if (req.user.role === 'patient') {
      whereClause += ' AND patient_id = ?';
      params.push(req.user.id);
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão para cancelar esta solicitação' });
    }

    const existingRequests = await query(`SELECT * FROM loan_requests ${whereClause}`, params);
    if (existingRequests.length === 0) {
      return res.status(404).json({ error: 'Solicitação não encontrada ou não pode ser cancelada' });
    }

    // Cancelar solicitação
    await query('UPDATE loan_requests SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);

    res.json({ message: 'Solicitação cancelada com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar solicitação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;