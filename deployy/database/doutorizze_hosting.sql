-- =====================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS DOUTORIZZE
-- Sistema de Gestão para Clínicas Odontológicas
-- com Integração Parcelamais
-- VERSÃO PARA HOSPEDAGEM COMPARTILHADA
-- =====================================================

-- Usar o banco de dados existente (u664361971_doutorizze)
USE u664361971_doutorizze;

-- =====================================================
-- TABELA DE USUÁRIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('patient', 'clinic', 'admin') NOT NULL DEFAULT 'patient',
    status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA DE CLÍNICAS
-- =====================================================
CREATE TABLE IF NOT EXISTS clinics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    specialties JSON,
    working_hours JSON,
    parcelamais_enabled BOOLEAN DEFAULT FALSE,
    parcelamais_client_id VARCHAR(255),
    status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_cnpj (cnpj),
    INDEX idx_status (status),
    INDEX idx_city_state (city, state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA DE AGENDAMENTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    clinic_id INT NOT NULL,
    service VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INT DEFAULT 60,
    status ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    notes TEXT,
    price DECIMAL(10,2),
    payment_status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
    INDEX idx_patient_id (patient_id),
    INDEX idx_clinic_id (clinic_id),
    INDEX idx_date (date),
    INDEX idx_status (status),
    INDEX idx_date_time (date, time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA DE SOLICITAÇÕES DE EMPRÉSTIMO
-- =====================================================
CREATE TABLE IF NOT EXISTS loan_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    clinic_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    installments INT NOT NULL,
    monthly_payment DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    purpose TEXT,
    status ENUM('pending', 'clinic_approved', 'clinic_rejected', 'admin_processing', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    clinic_notes TEXT,
    admin_notes TEXT,
    parcelamais_request_id VARCHAR(255),
    parcelamais_status VARCHAR(50),
    parcelamais_response JSON,
    approved_at TIMESTAMP NULL,
    rejected_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
    INDEX idx_patient_id (patient_id),
    INDEX idx_clinic_id (clinic_id),
    INDEX idx_status (status),
    INDEX idx_parcelamais_request_id (parcelamais_request_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA DE NOTIFICAÇÕES
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    read_at TIMESTAMP NULL,
    related_type ENUM('appointment', 'loan_request', 'payment', 'system') NULL,
    related_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_read_at (read_at),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA DE LOGS DE WEBHOOK
-- =====================================================
CREATE TABLE IF NOT EXISTS webhook_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    source VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSON NOT NULL,
    status ENUM('received', 'processed', 'failed') DEFAULT 'received',
    response_data JSON,
    error_message TEXT,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_source (source),
    INDEX idx_event_type (event_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DADOS INICIAIS (SEED)
-- =====================================================

-- Usuário Administrador Master
INSERT IGNORE INTO users (email, password, name, role, status, email_verified) VALUES 
('admin@doutorizze.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador Master', 'admin', 'active', true);
-- Senha: admin123

-- Clínica de Exemplo
INSERT IGNORE INTO users (email, password, name, role, status, email_verified) VALUES 
('clinica@exemplo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. João Silva', 'clinic', 'active', true);
-- Senha: clinic123

INSERT IGNORE INTO clinics (user_id, name, cnpj, address, city, state, zip_code, phone, email, specialties, working_hours, parcelamais_enabled, status) VALUES 
(2, 'Clínica Odontológica Exemplo', '12.345.678/0001-90', 'Rua das Flores, 123', 'São Paulo', 'SP', '01234-567', '(11) 99999-9999', 'clinica@exemplo.com', 
'["Ortodontia", "Implantodontia", "Clínica Geral"]', 
'{"monday": {"start": "08:00", "end": "18:00"}, "tuesday": {"start": "08:00", "end": "18:00"}, "wednesday": {"start": "08:00", "end": "18:00"}, "thursday": {"start": "08:00", "end": "18:00"}, "friday": {"start": "08:00", "end": "17:00"}, "saturday": {"start": "08:00", "end": "12:00"}, "sunday": {"closed": true}}', 
true, 'active');

-- Paciente de Exemplo
INSERT IGNORE INTO users (email, password, name, phone, role, status, email_verified) VALUES 
('paciente@exemplo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Maria Santos', '(11) 88888-8888', 'patient', 'active', true);
-- Senha: patient123

-- Solicitações de Empréstimo de Exemplo
INSERT IGNORE INTO loan_requests (patient_id, clinic_id, amount, installments, monthly_payment, total_amount, interest_rate, purpose, status) VALUES 
(3, 1, 5000.00, 12, 458.33, 5500.00, 2.5, 'Tratamento ortodôntico completo', 'pending'),
(3, 1, 3000.00, 6, 525.00, 3150.00, 1.8, 'Implante dentário', 'clinic_approved');

-- Agendamentos de Exemplo
INSERT IGNORE INTO appointments (patient_id, clinic_id, service, date, time, duration, status, price) VALUES 
(3, 1, 'Consulta de Avaliação', '2024-02-15', '09:00:00', 60, 'scheduled', 150.00),
(3, 1, 'Limpeza Dental', '2024-02-20', '14:30:00', 45, 'confirmed', 120.00);

-- Notificações de Exemplo
INSERT IGNORE INTO notifications (user_id, title, message, type, related_type, related_id) VALUES 
(3, 'Bem-vindo ao DOUTORIZZE!', 'Sua conta foi criada com sucesso. Explore nossos serviços.', 'success', 'system', NULL),
(2, 'Nova Solicitação de Empréstimo', 'Nova solicitação de R$ 5.000,00 em 12x aguardando aprovação', 'info', 'loan_request', 1);

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para estatísticas de clínicas
CREATE OR REPLACE VIEW clinic_stats AS
SELECT 
    c.id,
    c.name,
    c.status,
    COUNT(DISTINCT a.id) as total_appointments,
    COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_appointments,
    COUNT(DISTINCT lr.id) as total_loan_requests,
    COUNT(DISTINCT CASE WHEN lr.status = 'approved' THEN lr.id END) as approved_loans,
    COALESCE(SUM(CASE WHEN lr.status = 'approved' THEN lr.amount END), 0) as total_loan_amount
FROM clinics c
LEFT JOIN appointments a ON c.id = a.clinic_id
LEFT JOIN loan_requests lr ON c.id = lr.clinic_id
GROUP BY c.id, c.name, c.status;

-- View para dashboard do admin
CREATE OR REPLACE VIEW admin_dashboard AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'clinic') as total_clinics,
    (SELECT COUNT(*) FROM users WHERE role = 'patient') as total_patients,
    (SELECT COUNT(*) FROM loan_requests WHERE status IN ('pending', 'clinic_approved', 'admin_processing')) as pending_loans,
    (SELECT COUNT(*) FROM loan_requests WHERE status = 'approved' AND DATE(approved_at) = CURDATE()) as loans_approved_today,
    (SELECT COALESCE(SUM(amount), 0) FROM loan_requests WHERE status = 'approved') as total_approved_amount,
    (SELECT COUNT(*) FROM appointments WHERE DATE(date) = CURDATE()) as appointments_today;

-- =====================================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- =====================================================

-- Índices compostos para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_date ON appointments(clinic_id, date);
CREATE INDEX IF NOT EXISTS idx_loan_requests_status_created ON loan_requests(status, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read_at);

-- =====================================================
-- SCRIPT CONCLUÍDO
-- =====================================================

SELECT 'Banco de dados DOUTORIZZE criado com sucesso!' as 'Status';
SELECT 'Credenciais de acesso:' as 'Info';
SELECT 'Admin: admin@doutorizze.com / admin123' as 'Login';
SELECT 'Clínica: clinica@exemplo.com / clinic123' as 'Login';
SELECT 'Paciente: paciente@exemplo.com / patient123' as 'Login';