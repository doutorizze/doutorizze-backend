const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Middleware de autenticação
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário no banco
    const users = await query('SELECT id, email, name, role, status FROM users WHERE id = ?', [decoded.userId]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const user = users[0];
    
    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Usuário inativo' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado' });
    }
    console.error('Erro na autenticação:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Middleware para verificar role específica
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const userRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!userRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
    }

    next();
  };
};

// Middleware para verificar se é admin
const requireAdmin = requireRole('admin');

// Middleware para verificar se é clínica
const requireClinic = requireRole(['clinic', 'admin']);

// Middleware para verificar se é paciente
const requirePatient = requireRole(['patient', 'admin']);

// Middleware para verificar se o usuário pode acessar o recurso
const requireOwnershipOrAdmin = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return next();
    }

    // Para clínicas, verificar se o recurso pertence à clínica
    if (req.user.role === 'clinic') {
      const clinics = await query('SELECT id FROM clinics WHERE user_id = ?', [req.user.id]);
      if (clinics.length > 0) {
        req.userClinicId = clinics[0].id;
        return next();
      }
    }

    // Para pacientes, verificar se o recurso pertence ao paciente
    if (req.user.role === 'patient') {
      req.userPatientId = req.user.id;
      return next();
    }

    return res.status(403).json({ error: 'Acesso negado' });
  } catch (error) {
    console.error('Erro na verificação de propriedade:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Função para gerar token JWT
const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireClinic,
  requirePatient,
  requireOwnershipOrAdmin,
  generateToken
};