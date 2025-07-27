const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validações
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
];

const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('name').isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('role').isIn(['patient', 'clinic']).withMessage('Role inválido')
];

// POST /api/auth/login
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Buscar usuário
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = users[0];

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar status do usuário
    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Usuário inativo ou pendente' });
    }

    // Gerar token
    const token = generateToken(user.id, user.email, user.role);

    // Buscar dados da clínica se for usuário clinic
    let clinicData = null;
    if (user.role === 'clinic') {
      const clinics = await query('SELECT * FROM clinics WHERE user_id = ?', [user.id]);
      if (clinics.length > 0) {
        clinicData = clinics[0];
      }
    }

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        clinic: clinicData
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/auth/register
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, phone, role } = req.body;

    // Verificar se usuário já existe
    const existingUsers = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const result = await query(`
      INSERT INTO users (email, password, name, phone, role, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [email, hashedPassword, name, phone, role, role === 'clinic' ? 'pending' : 'active']);

    const userId = result.insertId;

    // Se for clínica, criar registro na tabela clinics
    if (role === 'clinic') {
      await query(`
        INSERT INTO clinics (user_id, name, email, status)
        VALUES (?, ?, ?, ?)
      `, [userId, name, email, 'pending']);
    }

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: userId,
        email,
        name,
        role,
        status: role === 'clinic' ? 'pending' : 'active'
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    // Buscar dados da clínica se for usuário clinic
    let clinicData = null;
    if (user.role === 'clinic') {
      const clinics = await query('SELECT * FROM clinics WHERE user_id = ?', [user.id]);
      if (clinics.length > 0) {
        clinicData = clinics[0];
      }
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        clinic: clinicData
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const newToken = generateToken(user.id, user.email, user.role);
    
    res.json({ token: newToken });
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, (req, res) => {
  // Em uma implementação mais robusta, você poderia adicionar o token a uma blacklist
  res.json({ message: 'Logout realizado com sucesso' });
});

module.exports = router;