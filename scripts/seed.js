const bcrypt = require('bcryptjs');
const { query, testConnection } = require('../config/database');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');
    
    // Testar conexão
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Não foi possível conectar ao banco de dados');
    }

    // Criar usuário admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminExists = await query('SELECT id FROM users WHERE email = ?', ['admin@doutorizze.com']);
    
    if (adminExists.length === 0) {
      await query(`
        INSERT INTO users (email, password, name, role, status, email_verified)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['admin@doutorizze.com', adminPassword, 'Administrador Master', 'admin', 'active', true]);
      console.log('✅ Usuário admin criado: admin@doutorizze.com / admin123');
    } else {
      console.log('ℹ️ Usuário admin já existe');
    }

    // Criar clínica de exemplo
    const clinicPassword = await bcrypt.hash('clinic123', 10);
    const clinicExists = await query('SELECT id FROM clinics WHERE email = ?', ['clinica@exemplo.com']);
    
    if (clinicExists.length === 0) {
      // Verificar se o usuário da clínica já existe
      const existingUser = await query('SELECT id FROM users WHERE email = ?', ['clinica@exemplo.com']);
      let clinicUserId;
      
      if (existingUser.length === 0) {
        // Criar usuário da clínica
        const clinicUser = await query(`
          INSERT INTO users (email, password, name, role, status, email_verified)
          VALUES (?, ?, ?, ?, ?, ?)
        `, ['clinica@exemplo.com', clinicPassword, 'Dr. João Silva', 'clinic', 'active', 1]);
        clinicUserId = clinicUser.insertId;
      } else {
        // Usar o usuário existente
        clinicUserId = existingUser[0].id;
      }
      
      // Criar a clínica
      await query(`
        INSERT INTO clinics (user_id, name, cnpj, address, city, state, zip_code, phone, email, specialties, working_hours, parcelamais_enabled, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        clinicUserId,
        'Clínica Odontológica Exemplo',
        '12.345.678/0001-90',
        'Rua das Flores, 123',
        'São Paulo',
        'SP',
        '01234-567',
        '(11) 99999-9999',
        'clinica@exemplo.com',
        JSON.stringify(['Ortodontia', 'Implantodontia', 'Clínica Geral']),
        JSON.stringify({
          monday: { start: '08:00', end: '18:00' },
          tuesday: { start: '08:00', end: '18:00' },
          wednesday: { start: '08:00', end: '18:00' },
          thursday: { start: '08:00', end: '18:00' },
          friday: { start: '08:00', end: '17:00' },
          saturday: { start: '08:00', end: '12:00' },
          sunday: { closed: true }
        }),
        1,
        'active'
      ]);
      console.log('✅ Clínica de exemplo criada: clinica@exemplo.com / clinic123');
    } else {
      console.log('ℹ️ Clínica de exemplo já existe');
    }

    // Criar paciente de exemplo
    const patientPassword = await bcrypt.hash('patient123', 10);
    const patientExists = await query('SELECT id FROM users WHERE email = ?', ['paciente@exemplo.com']);
    
    if (patientExists.length === 0) {
      await query(`
        INSERT INTO users (email, password, name, phone, role, status, email_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, ['paciente@exemplo.com', patientPassword, 'Maria Santos', '(11) 88888-8888', 'patient', 'active', 1]);
      console.log('✅ Paciente de exemplo criado: paciente@exemplo.com / patient123');
    } else {
      console.log('ℹ️ Paciente de exemplo já existe');
    }

    // Criar algumas solicitações de empréstimo de exemplo
    const patients = await query('SELECT id FROM users WHERE role = "patient"');
    const clinics = await query('SELECT id FROM clinics LIMIT 1');
    
    if (patients.length > 0 && clinics.length > 0) {
      const loanExists = await query('SELECT id FROM loan_requests LIMIT 1');
      
      if (loanExists.length === 0) {
        const sampleLoans = [
          {
            patient_id: patients[0].id,
            clinic_id: clinics[0].id,
            amount: 5000.00,
            installments: 12,
            monthly_payment: 458.33,
            total_amount: 5500.00,
            interest_rate: 2.5,
            purpose: 'Tratamento ortodôntico completo',
            status: 'pending'
          },
          {
            patient_id: patients[0].id,
            clinic_id: clinics[0].id,
            amount: 3000.00,
            installments: 6,
            monthly_payment: 525.00,
            total_amount: 3150.00,
            interest_rate: 1.8,
            purpose: 'Implante dentário',
            status: 'clinic_approved'
          }
        ];

        for (const loan of sampleLoans) {
          await query(`
            INSERT INTO loan_requests (patient_id, clinic_id, amount, installments, monthly_payment, total_amount, interest_rate, purpose, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [loan.patient_id, loan.clinic_id, loan.amount, loan.installments, loan.monthly_payment, loan.total_amount, loan.interest_rate, loan.purpose, loan.status]);
        }
        console.log('✅ Solicitações de empréstimo de exemplo criadas');
      } else {
        console.log('ℹ️ Solicitações de empréstimo já existem');
      }
    }

    console.log('🎉 Seed concluído com sucesso!');
    console.log('');
    console.log('📋 Credenciais de acesso:');
    console.log('👨‍💼 Admin: admin@doutorizze.com / admin123');
    console.log('🏥 Clínica: clinica@exemplo.com / clinic123');
    console.log('👤 Paciente: paciente@exemplo.com / patient123');
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  }
};

// Executar seed se chamado diretamente
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('✅ Processo de seed finalizado');
    process.exit(0);
  });
}

module.exports = { seedDatabase };