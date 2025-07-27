const { query, testConnection } = require('../config/database');
require('dotenv').config();

const createTables = async () => {
  try {
    console.log('🔄 Iniciando migração do banco de dados...');
    
    // Testar conexão
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Não foi possível conectar ao banco de dados');
    }

    // Tabela de usuários
    await query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela users criada');

    // Tabela de clínicas
    await query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela clinics criada');

    // Tabela de agendamentos
    await query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela appointments criada');

    // Tabela de solicitações de empréstimo
    await query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela loan_requests criada');

    // Tabela de notificações
    await query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela notifications criada');

    // Tabela de logs de webhook
    await query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela webhook_logs criada');

    console.log('🎉 Migração concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
};

// Executar migração se chamado diretamente
if (require.main === module) {
  createTables().then(() => {
    console.log('✅ Processo de migração finalizado');
    process.exit(0);
  });
}

module.exports = { createTables };