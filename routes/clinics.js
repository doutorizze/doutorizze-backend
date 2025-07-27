const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin, requireClinic, requireOwnershipOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Validações
const clinicValidation = [
  body('name').isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('cnpj').optional().isLength({ min: 14, max: 18 }).withMessage('CNPJ inválido'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Email inválido'),
  body('phone').optional().isLength({ min: 10 }).withMessage('Telefone inválido')
];

// GET /api/clinics/public - Listar clínicas públicas (sem autenticação)
router.get('/public', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, city, state } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE c.status = "active"';
    const params = [];

    // Aplicar filtros
    if (search) {
      whereClause += ' AND (c.name LIKE ? OR c.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (city) {
      whereClause += ' AND c.city = ?';
      params.push(city);
    }

    if (state) {
      whereClause += ' AND c.state = ?';
      params.push(state);
    }

    // Buscar clínicas do banco de dados
    const clinics = await query(`
      SELECT 
        c.id,
        c.name,
        c.address,
        c.city,
        c.state,
        c.phone,
        c.email,
        c.website,
        c.description,
        c.specialties,
        c.working_hours,
        c.created_at,
        c.rating,
        u.name as owner_name
      FROM clinics c
      JOIN users u ON c.user_id = u.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    // Contar total para paginação
    const [countResult] = await query(`
      SELECT COUNT(*) as total
      FROM clinics c
      JOIN users u ON c.user_id = u.id
      ${whereClause}
    `, params);

    // Processar dados para compatibilidade com o frontend
    const processedClinics = clinics.map(clinic => ({
      ...clinic,
      servicos: clinic.specialties ? JSON.parse(clinic.specialties) : [],
      reviewCount: Math.floor(Math.random() * 200) + 50, // Temporário até implementar sistema de reviews
      avatar: `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=dental%20clinic%20logo%20professional%20modern&image_size=square`,
      nomeFantasia: clinic.name,
      cidade: clinic.city,
      estado: clinic.state,
      price: '150' // Temporário até implementar sistema de preços
    }));

    res.json({
      clinics: processedClinics,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar clínicas públicas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/clinics - Listar clínicas (com autenticação)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, city, state } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    // Filtros
    if (search) {
      whereClause += ' AND (c.name LIKE ? OR c.email LIKE ? OR u.name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (status) {
      whereClause += ' AND c.status = ?';
      params.push(status);
    }

    if (city) {
      whereClause += ' AND c.city = ?';
      params.push(city);
    }

    if (state) {
      whereClause += ' AND c.state = ?';
      params.push(state);
    }

    // Se não for admin, mostrar apenas a própria clínica
    if (req.user.role === 'clinic') {
      whereClause += ' AND c.user_id = ?';
      params.push(req.user.id);
    }

    const clinics = await query(`
      SELECT 
        c.*,
        u.name as owner_name,
        u.email as owner_email,
        u.phone as owner_phone
      FROM clinics c
      JOIN users u ON c.user_id = u.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    // Contar total
    const [countResult] = await query(`
      SELECT COUNT(*) as total
      FROM clinics c
      JOIN users u ON c.user_id = u.id
      ${whereClause}
    `, params);

    res.json({
      clinics,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar clínicas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/clinics/:id - Buscar clínica específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    let whereClause = 'WHERE c.id = ?';
    const params = [id];

    // Se não for admin, verificar se é a própria clínica
    if (req.user.role === 'clinic') {
      whereClause += ' AND c.user_id = ?';
      params.push(req.user.id);
    }

    const clinics = await query(`
      SELECT 
        c.*,
        u.name as owner_name,
        u.email as owner_email,
        u.phone as owner_phone
      FROM clinics c
      JOIN users u ON c.user_id = u.id
      ${whereClause}
    `, params);

    if (clinics.length === 0) {
      return res.status(404).json({ error: 'Clínica não encontrada' });
    }

    res.json(clinics[0]);
  } catch (error) {
    console.error('Erro ao buscar clínica:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/clinics/:id - Atualizar clínica
router.put('/:id', authenticateToken, requireOwnershipOrAdmin, clinicValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      name,
      cnpj,
      address,
      city,
      state,
      zip_code,
      phone,
      email,
      website,
      description,
      specialties,
      working_hours,
      parcelamais_enabled
    } = req.body;

    // Verificar se a clínica existe e se o usuário tem permissão
    let whereClause = 'WHERE id = ?';
    const checkParams = [id];

    if (req.user.role === 'clinic') {
      whereClause += ' AND user_id = ?';
      checkParams.push(req.user.id);
    }

    const existingClinics = await query(`SELECT id FROM clinics ${whereClause}`, checkParams);
    if (existingClinics.length === 0) {
      return res.status(404).json({ error: 'Clínica não encontrada' });
    }

    // Atualizar clínica
    await query(`
      UPDATE clinics SET
        name = ?,
        cnpj = ?,
        address = ?,
        city = ?,
        state = ?,
        zip_code = ?,
        phone = ?,
        email = ?,
        website = ?,
        description = ?,
        specialties = ?,
        working_hours = ?,
        parcelamais_enabled = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      name,
      cnpj,
      address,
      city,
      state,
      zip_code,
      phone,
      email,
      website,
      description,
      JSON.stringify(specialties),
      JSON.stringify(working_hours),
      parcelamais_enabled,
      id
    ]);

    res.json({ message: 'Clínica atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar clínica:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/clinics/:id/status - Atualizar status da clínica (apenas admin)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    await query('UPDATE clinics SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
    
    // Atualizar também o status do usuário
    await query(`
      UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = (SELECT user_id FROM clinics WHERE id = ?)
    `, [status, id]);

    res.json({ message: 'Status da clínica atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/clinics/:id/stats - Estatísticas da clínica
router.get('/:id/stats', authenticateToken, requireOwnershipOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se a clínica existe e se o usuário tem permissão
    let whereClause = 'WHERE id = ?';
    const checkParams = [id];

    if (req.user.role === 'clinic') {
      whereClause += ' AND user_id = ?';
      checkParams.push(req.user.id);
    }

    const existingClinics = await query(`SELECT id FROM clinics ${whereClause}`, checkParams);
    if (existingClinics.length === 0) {
      return res.status(404).json({ error: 'Clínica não encontrada' });
    }

    // Buscar estatísticas
    const [appointmentsStats] = await query(`
      SELECT 
        COUNT(*) as total_appointments,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_appointments,
        COUNT(CASE WHEN DATE(date) = CURDATE() THEN 1 END) as today_appointments
      FROM appointments WHERE clinic_id = ?
    `, [id]);

    const [loanStats] = await query(`
      SELECT 
        COUNT(*) as total_loan_requests,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_loans,
        SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as total_loan_amount
      FROM loan_requests WHERE clinic_id = ?
    `, [id]);

    res.json({
      appointments: appointmentsStats,
      loans: loanStats
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/clinics/:id - Deletar clínica (apenas admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se a clínica existe
    const existingClinics = await query('SELECT user_id FROM clinics WHERE id = ?', [id]);
    if (existingClinics.length === 0) {
      return res.status(404).json({ error: 'Clínica não encontrada' });
    }

    const userId = existingClinics[0].user_id;

    // Deletar clínica (cascade irá deletar relacionamentos)
    await query('DELETE FROM clinics WHERE id = ?', [id]);
    
    // Deletar usuário associado
    await query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: 'Clínica deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar clínica:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;