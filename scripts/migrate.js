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
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'clinic', 'admin')),
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
        email_verified INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)`);
    console.log('✅ Tabela users criada');

    // Tabela de clínicas
    await query(`
      CREATE TABLE IF NOT EXISTS clinics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        cnpj TEXT UNIQUE,
        address TEXT,
        city TEXT,
        state TEXT,
        zip_code TEXT,
        phone TEXT,
        email TEXT,
        website TEXT,
        description TEXT,
        specialties TEXT,
        working_hours TEXT,
        parcelamais_enabled INTEGER DEFAULT 0,
        parcelamais_client_id TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
        rating REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    await query(`CREATE INDEX IF NOT EXISTS idx_clinics_user_id ON clinics(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_clinics_cnpj ON clinics(cnpj)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_clinics_status ON clinics(status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_clinics_city_state ON clinics(city, state)`);
    console.log('✅ Tabela clinics criada');

    // Tabela de agendamentos
    await query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        clinic_id INTEGER NOT NULL,
        service TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        duration INTEGER DEFAULT 60,
        status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
        notes TEXT,
        price REAL,
        payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
      )
    `);
    
    await query(`CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_appointments_clinic_id ON appointments(clinic_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(date, time)`);
    console.log('✅ Tabela appointments criada');

    // Tabela de solicitações de empréstimo
    await query(`
      CREATE TABLE IF NOT EXISTS loan_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        clinic_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        installments INTEGER NOT NULL,
        monthly_payment REAL NOT NULL,
        total_amount REAL NOT NULL,
        interest_rate REAL NOT NULL,
        purpose TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'clinic_approved', 'clinic_rejected', 'admin_processing', 'approved', 'rejected', 'cancelled')),
        clinic_notes TEXT,
        admin_notes TEXT,
        parcelamais_request_id TEXT,
        parcelamais_status TEXT,
        parcelamais_response TEXT,
        approved_at DATETIME NULL,
        rejected_at DATETIME NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
      )
    `);
    
    await query(`CREATE INDEX IF NOT EXISTS idx_loan_requests_patient_id ON loan_requests(patient_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_loan_requests_clinic_id ON loan_requests(clinic_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_loan_requests_status ON loan_requests(status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_loan_requests_parcelamais_request_id ON loan_requests(parcelamais_request_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_loan_requests_created_at ON loan_requests(created_at)`);
    console.log('✅ Tabela loan_requests criada');

    // Tabela de notificações
    await query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
        read_at DATETIME NULL,
        related_type TEXT NULL CHECK (related_type IN ('appointment', 'loan_request', 'payment', 'system')),
        related_id INTEGER NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    await query(`CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at)`);
    console.log('✅ Tabela notifications criada');

    // Tabela de logs de webhook
    await query(`
      CREATE TABLE IF NOT EXISTS webhook_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT NOT NULL,
        event_type TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT DEFAULT 'received' CHECK (status IN ('received', 'processed', 'failed')),
        response_data TEXT,
        error_message TEXT,
        processed_at DATETIME NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await query(`CREATE INDEX IF NOT EXISTS idx_webhook_logs_source ON webhook_logs(source)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON webhook_logs(event_type)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_webhook_logs_status ON webhook_logs(status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at)`);
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