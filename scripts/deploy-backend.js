#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurações do backend
const config = {
  // Configurações do servidor
  host: process.env.BACKEND_HOST || 'seu-servidor.com',
  username: process.env.BACKEND_USER || 'usuario',
  password: process.env.BACKEND_PASSWORD || 'senha',
  remotePath: process.env.BACKEND_PATH || '/var/www/api',
  
  // Configurações do banco
  dbHost: process.env.DB_HOST || 'localhost',
  dbUser: process.env.DB_USER || 'doutorizze_user',
  dbPassword: process.env.DB_PASSWORD || 'senha_segura',
  dbName: process.env.DB_NAME || 'doutorizze_db',
  
  // Configurações locais
  backendDir: './backend',
  sqlDir: './backend/database',
  
  // PM2 configurações
  pm2AppName: 'doutorizze-api',
  nodeVersion: '18'
};

console.log('🚀 Iniciando deploy do backend...');

// Função para executar comandos
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} concluído!`);
  } catch (error) {
    console.error(`❌ Erro em ${description}:`, error.message);
    process.exit(1);
  }
}

// Função para verificar se os arquivos do backend existem
function checkBackendFiles() {
  if (!fs.existsSync(config.backendDir)) {
    console.error(`❌ Diretório do backend não encontrado: ${config.backendDir}`);
    process.exit(1);
  }
  
  const requiredFiles = [
    path.join(config.backendDir, 'package.json'),
    path.join(config.backendDir, 'server.js'),
    path.join(config.backendDir, 'database', 'doutorizze_hosting.sql')
  ];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      console.error(`❌ Arquivo obrigatório não encontrado: ${file}`);
      process.exit(1);
    }
  }
}

// Função para criar arquivo de configuração do PM2
function createPM2Config() {
  const pm2Config = {
    apps: [{
      name: config.pm2AppName,
      script: './server.js',
      cwd: config.remotePath,
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DB_HOST: config.dbHost,
        DB_USER: config.dbUser,
        DB_PASSWORD: config.dbPassword,
        DB_NAME: config.dbName,
        JWT_SECRET: process.env.JWT_SECRET || 'seu_jwt_secret_super_seguro',
        PARCELAMAIS_API_KEY: process.env.PARCELAMAIS_API_KEY || 'sua_api_key',
        PARCELAMAIS_SECRET: process.env.PARCELAMAIS_SECRET || 'seu_secret'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }]
  };
  
  fs.writeFileSync('./ecosystem.config.js', `module.exports = ${JSON.stringify(pm2Config, null, 2)};`);
  console.log('✅ Arquivo PM2 criado: ecosystem.config.js');
}

// Função para criar script de instalação do servidor
function createServerSetupScript() {
  const setupScript = `#!/bin/bash

# Script de configuração do servidor para DOUTORIZZE
echo "🚀 Configurando servidor para DOUTORIZZE..."

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js ${config.nodeVersion}
curl -fsSL https://deb.nodesource.com/setup_${config.nodeVersion}.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Instalar MySQL
sudo apt install -y mysql-server

# Configurar MySQL
sudo mysql -e "CREATE DATABASE IF NOT EXISTS ${config.dbName};"
sudo mysql -e "CREATE USER IF NOT EXISTS '${config.dbUser}'@'localhost' IDENTIFIED BY '${config.dbPassword}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON ${config.dbName}.* TO '${config.dbUser}'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Instalar Nginx
sudo apt install -y nginx

# Configurar firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw --force enable

# Criar diretórios
sudo mkdir -p ${config.remotePath}
sudo mkdir -p ${config.remotePath}/logs
sudo chown -R $USER:$USER ${config.remotePath}

echo "✅ Servidor configurado com sucesso!"
echo "📋 Próximos passos:"
echo "1. Faça upload dos arquivos do backend"
echo "2. Execute: cd ${config.remotePath} && npm install"
echo "3. Execute: npm run build"
echo "4. Importe o banco: mysql -u ${config.dbUser} -p ${config.dbName} < schema.sql"
echo "5. Inicie com PM2: pm2 start ecosystem.config.js"
`;
  
  fs.writeFileSync('./server-setup.sh', setupScript);
  fs.chmodSync('./server-setup.sh', '755');
  console.log('✅ Script de configuração criado: server-setup.sh');
}

// Função para criar arquivo .env de produção
function createProductionEnv() {
  const envContent = `# Configurações de Produção - DOUTORIZZE
NODE_ENV=production
PORT=3000

# Banco de Dados
DB_HOST=${config.dbHost}
DB_USER=${config.dbUser}
DB_PASSWORD=${config.dbPassword}
DB_NAME=${config.dbName}
DB_PORT=3306

# JWT
JWT_SECRET=${process.env.JWT_SECRET || 'seu_jwt_secret_super_seguro_mude_isso'}
JWT_EXPIRES_IN=7d

# Parcelamais
PARCELAMAIS_API_KEY=${process.env.PARCELAMAIS_API_KEY || 'sua_api_key_parcelamais'}
PARCELAMAIS_SECRET=${process.env.PARCELAMAIS_SECRET || 'seu_secret_parcelamais'}
PARCELAMAIS_BASE_URL=https://api.parcelamais.com.br

# CORS
CORS_ORIGIN=https://seu-dominio.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logs
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Backup
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
`;
  
  fs.writeFileSync('./.env.production', envContent);
  console.log('✅ Arquivo .env.production criado');
}

// Função para criar script de deploy via rsync
function deployBackend() {
  console.log('📦 Preparando arquivos para deploy...');
  
  // Criar diretório temporário para deploy
  const deployDir = './deploy-temp';
  if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true });
  }
  fs.mkdirSync(deployDir);
  
  // Copiar arquivos do backend
  fs.cpSync(config.backendDir, path.join(deployDir, 'backend'), { recursive: true });
  
  // Copiar arquivos SQL
  if (fs.existsSync(config.sqlDir)) {
    fs.cpSync(config.sqlDir, path.join(deployDir, 'database'), { recursive: true });
  }
  
  // Copiar arquivos de configuração
  const configFiles = ['ecosystem.config.js', '.env.production', 'server-setup.sh'];
  for (const file of configFiles) {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(deployDir, file));
    }
  }
  
  console.log('📁 Criando arquivo de deploy...');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const zipName = `backend-deploy-${timestamp}.zip`;
  
  if (process.platform === 'win32') {
    runCommand(`powershell Compress-Archive -Path "${deployDir}\\*" -DestinationPath "${zipName}"`, 'Criando arquivo ZIP do backend');
  } else {
    runCommand(`zip -r ${zipName} ${deployDir}/*`, 'Criando arquivo ZIP do backend');
  }
  
  // Limpar diretório temporário
  fs.rmSync(deployDir, { recursive: true });
  
  console.log(`📦 Arquivo de deploy criado: ${zipName}`);
  console.log('💡 Instruções de deploy:');
  console.log('1. Faça upload deste arquivo para seu servidor');
  console.log('2. Extraia o arquivo no servidor');
  console.log('3. Execute: chmod +x server-setup.sh && ./server-setup.sh');
  console.log('4. Configure as variáveis de ambiente no .env.production');
  console.log('5. Execute: npm install && npm run build');
  console.log('6. Importe o banco: mysql -u usuario -p database < database/schema.sql');
  console.log('7. Inicie: pm2 start ecosystem.config.js');
}

// Função principal
function deployBackendMain() {
  try {
    console.log('🔍 Verificando arquivos do backend...');
    checkBackendFiles();
    
    console.log('⚙️ Criando configurações...');
    createPM2Config();
    createServerSetupScript();
    createProductionEnv();
    
    console.log('🚀 Preparando deploy...');
    deployBackend();
    
    console.log('🎉 Deploy do backend preparado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante o deploy do backend:', error.message);
    process.exit(1);
  }
}

// Executa o deploy do backend
deployBackendMain();