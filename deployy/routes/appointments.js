const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireOwnershipOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Validações
const appointmentValidation = [
  body('clinic_id').isInt().withMessage('ID da clínica inválido'),
  body('service').isLength({ min: 2 }).withMessage('Serviço deve ter pelo menos 2 caracteres'),
  body('date').isISO8601().withMessage('Data inválida'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Horário inválido'),
  body('duration').optional().isInt({ min: 15, max: 480 }).withMessage('Duração inválida'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Preço inválido')
];

// GET /api/appointments - Listar agendamentos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, date_from, date_to, clinic_id } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    // Filtros baseados no role do usuário
    if (req.user.role === 'patient') {
      whereClause += ' AND a.patient_id = ?';
      params.push(req.user.id);
    } else if (req.user.role === 'clinic') {
      // Buscar ID da clínica do usuário
      const clinics = await query('SELECT id FROM clinics WHERE user_id = ?', [req.user.id]);
      if (clinics.length > 0) {
        whereClause += ' AND a.clinic_id = ?';
        params.push(clinics[0].id);
      } else {
        return res.json({ appointments: [], pagination: { page: 1, limit, total: 0, pages: 0 } });
      }
    }

    // Filtros adicionais
    if (status) {
      whereClause += ' AND a.status = ?';
      params.push(status);
    }

    if (date_from) {
      whereClause += ' AND a.date >= ?';
      params.push(date_from);
    }

    if (date_to) {
      whereClause += ' AND a.date <= ?';
      params.push(date_to);
    }

    if (clinic_id && req.user.role === 'admin') {
      whereClause += ' AND a.clinic_id = ?';
      params.push(clinic_id);
    }

    const appointments = await query(`
      SELECT 
        a.*,
        p.name as patient_name,
        p.email as patient_email,
        p.phone as patient_phone,
        c.name as clinic_name,
        c.address as clinic_address,
        c.phone as clinic_phone
      FROM appointments a
      JOIN users p ON a.patient_id = p.id
      JOIN clinics c ON a.clinic_id = c.id
      ${whereClause}
      ORDER BY a.date DESC, a.time DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    // Contar total
    const [countResult] = await query(`
      SELECT COUNT(*) as total
      FROM appointments a
      JOIN users p ON a.patient_id = p.id
      JOIN clinics c ON a.clinic_id = c.id
      ${whereClause}
    `, params);

    res.json({
      appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/appointments/:id - Buscar agendamento específico
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    let whereClause = 'WHERE a.id = ?';
    const params = [id];

    // Verificar permissões
    if (req.user.role === 'patient') {
      whereClause += ' AND a.patient_id = ?';
      params.push(req.user.id);
    } else if (req.user.role === 'clinic') {
      const clinics = await query('SELECT id FROM clinics WHERE user_id = ?', [req.user.id]);
      if (clinics.length > 0) {
        whereClause += ' AND a.clinic_id = ?';
        params.push(clinics[0].id);
      } else {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }
    }

    const appointments = await query(`
      SELECT 
        a.*,
        p.name as patient_name,
        p.email as patient_email,
        p.phone as patient_phone,
        c.name as clinic_name,
        c.address as clinic_address,
        c.phone as clinic_phone
      FROM appointments a
      JOIN users p ON a.patient_id = p.id
      JOIN clinics c ON a.clinic_id = c.id
      ${whereClause}
    `, params);

    if (appointments.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    res.json(appointments[0]);
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/appointments - Criar agendamento
router.post('/', authenticateToken, appointmentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      clinic_id,
      service,
      date,
      time,
      duration = 60,
      notes,
      price
    } = req.body;

    // Verificar se a clínica existe e está ativa
    const clinics = await query('SELECT id FROM clinics WHERE id = ? AND status = "active"', [clinic_id]);
    if (clinics.length === 0) {
      return res.status(400).json({ error: 'Clínica não encontrada ou inativa' });
    }

    // Verificar se o horário está disponível
    const conflictingAppointments = await query(`
      SELECT id FROM appointments 
      WHERE clinic_id = ? AND date = ? AND time = ? AND status NOT IN ('cancelled')
    `, [clinic_id, date, time]);

    if (conflictingAppointments.length > 0) {
      return res.status(400).json({ error: 'Horário não disponível' });
    }

    // Criar agendamento
    const result = await query(`
      INSERT INTO appointments (patient_id, clinic_id, service, date, time, duration, notes, price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [req.user.id, clinic_id, service, date, time, duration, notes, price, 'scheduled']);

    // Criar notificação para a clínica
    const clinicUsers = await query('SELECT user_id FROM clinics WHERE id = ?', [clinic_id]);
    if (clinicUsers.length > 0) {
      await query(`
        INSERT INTO notifications (user_id, title, message, type, related_type, related_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        clinicUsers[0].user_id,
        'Novo Agendamento',
        `Novo agendamento para ${service} em ${date} às ${time}`,
        'info',
        'appointment',
        result.insertId
      ]);
    }

    res.status(201).json({
      message: 'Agendamento criado com sucesso',
      appointment_id: result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/appointments/:id - Atualizar agendamento
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { service, date, time, duration, notes, price, status } = req.body;

    // Verificar se o agendamento existe e se o usuário tem permissão
    let whereClause = 'WHERE id = ?';
    const checkParams = [id];

    if (req.user.role === 'patient') {
      whereClause += ' AND patient_id = ?';
      checkParams.push(req.user.id);
    } else if (req.user.role === 'clinic') {
      const clinics = await query('SELECT id FROM clinics WHERE user_id = ?', [req.user.id]);
      if (clinics.length > 0) {
        whereClause += ' AND clinic_id = ?';
        checkParams.push(clinics[0].id);
      } else {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }
    }

    const existingAppointments = await query(`SELECT * FROM appointments ${whereClause}`, checkParams);
    if (existingAppointments.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    const appointment = existingAppointments[0];

    // Se mudando data/hora, verificar conflitos
    if ((date && date !== appointment.date) || (time && time !== appointment.time)) {
      const conflictingAppointments = await query(`
        SELECT id FROM appointments 
        WHERE clinic_id = ? AND date = ? AND time = ? AND id != ? AND status NOT IN ('cancelled')
      `, [appointment.clinic_id, date || appointment.date, time || appointment.time, id]);

      if (conflictingAppointments.length > 0) {
        return res.status(400).json({ error: 'Horário não disponível' });
      }
    }

    // Atualizar agendamento
    await query(`
      UPDATE appointments SET
        service = COALESCE(?, service),
        date = COALESCE(?, date),
        time = COALESCE(?, time),
        duration = COALESCE(?, duration),
        notes = COALESCE(?, notes),
        price = COALESCE(?, price),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [service, date, time, duration, notes, price, status, id]);

    res.json({ message: 'Agendamento atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/appointments/:id - Cancelar agendamento
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o agendamento existe e se o usuário tem permissão
    let whereClause = 'WHERE id = ?';
    const checkParams = [id];

    if (req.user.role === 'patient') {
      whereClause += ' AND patient_id = ?';
      checkParams.push(req.user.id);
    } else if (req.user.role === 'clinic') {
      const clinics = await query('SELECT id FROM clinics WHERE user_id = ?', [req.user.id]);
      if (clinics.length > 0) {
        whereClause += ' AND clinic_id = ?';
        checkParams.push(clinics[0].id);
      } else {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }
    }

    const existingAppointments = await query(`SELECT * FROM appointments ${whereClause}`, checkParams);
    if (existingAppointments.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Cancelar agendamento
    await query('UPDATE appointments SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);

    res.json({ message: 'Agendamento cancelado com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/appointments/available-slots/:clinic_id - Buscar horários disponíveis
router.get('/available-slots/:clinic_id', authenticateToken, async (req, res) => {
  try {
    const { clinic_id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Data é obrigatória' });
    }

    // Buscar horário de funcionamento da clínica
    const clinics = await query('SELECT working_hours FROM clinics WHERE id = ? AND status = "active"', [clinic_id]);
    if (clinics.length === 0) {
      return res.status(404).json({ error: 'Clínica não encontrada' });
    }

    const workingHours = JSON.parse(clinics[0].working_hours || '{}');
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    const daySchedule = workingHours[dayOfWeek];

    if (!daySchedule || daySchedule.closed) {
      return res.json({ available_slots: [] });
    }

    // Buscar agendamentos existentes
    const existingAppointments = await query(`
      SELECT time, duration FROM appointments 
      WHERE clinic_id = ? AND date = ? AND status NOT IN ('cancelled')
    `, [clinic_id, date]);

    // Gerar slots disponíveis (exemplo: slots de 30 em 30 minutos)
    const slots = [];
    const startTime = daySchedule.start;
    const endTime = daySchedule.end;
    
    // Lógica simplificada - em produção, implementar algoritmo mais robusto
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Verificar se o slot está ocupado
        const isOccupied = existingAppointments.some(apt => apt.time === timeSlot);
        
        if (!isOccupied) {
          slots.push(timeSlot);
        }
      }
    }

    res.json({ available_slots: slots });
  } catch (error) {
    console.error('Erro ao buscar horários disponíveis:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;