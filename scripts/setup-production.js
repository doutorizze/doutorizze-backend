#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Interface para input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para fazer perguntas ao usuário
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Configurações padrão
let config = {
  domain: 'https://meusite.com',
  dbHost: 'localhost',
  dbUser: 'doutorizze_user',
  dbPassword: '',
  dbName: 'doutorizze_db',
  jwtSecret: '',
  parcelAmaisApiKey: '',
  parcelAmaisSecret: ''
};

console.log('🚀 Configuração de Produção - DOUTORIZZE');
console.log('=========================================\n');

// Função para gerar senha aleatória
function generateRandomString(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Função para coletar configurações do usuário
async function collectConfig() {
  console.log('📋 Vamos configurar seu ambiente de produção...\n');
  
  // Configurações básicas
  config.domain = await question(`Domínio da aplicação [${config.domain}]: `) || config.domain;
  config.dbPassword = await question('Senha do banco MySQL: ');
  
  if (!config.dbPassword) {
    config.dbPassword = generateRandomString(16);
    console.log(`🔐 Senha gerada automaticamente: ${config.dbPassword}`);
  }
  
  config.jwtSecret = generateRandomString(64);
  console.log('🔑 JWT Secret gerado automaticamente');
  
  // Configurações do Parcelamais
  console.log('\n💳 CONFIGURAÇÕES DO PARCELAMAIS:');
  config.parcelAmaisApiKey = await question('API Key do Parcelamais: ');
  config.parcelAmaisSecret = await question('Secret do Parcelamais: ');
  
  rl.close();
}

// Função para criar arquivo .env
function createEnvFile() {
  const envContent = `# Configurações de Produção - DOUTORIZZE
# Gerado automaticamente em ${new Date().toISOString()}

NODE_ENV=production
PORT=3000

# Banco de Dados
DB_HOST=${config.dbHost}
DB_USER=${config.dbUser}
DB_PASSWORD=${config.dbPassword}
DB_NAME=${config.dbName}
DB_PORT=3306

# JWT
JWT_SECRET=${config.jwtSecret}
JWT_EXPIRES_IN=7d

# Parcelamais
PARCELAMAIS_API_KEY=${config.parcelAmaisApiKey}
PARCELAMAIS_SECRET=${config.parcelAmaisSecret}
PARCELAMAIS_BASE_URL=https://api.parcelamais.com.br

# CORS
CORS_ORIGIN=${config.domain}

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
  
  fs.writeFileSync('.env.production', envContent);
  console.log('✅ Arquivo .env.production criado');
}

// Função para criar configuração do Nginx
function createNginxConfig() {
  const domain = config.domain.replace(/https?:\/\//, '');
  
  const nginxConfig = `# Configuração Nginx para DOUTORIZZE
server {
    listen 80;
    server_name ${domain} www.${domain};
    
    # Frontend (React)
    location / {
        root /var/www/doutorizze/frontend;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
`;
  
  fs.writeFileSync('nginx.conf', nginxConfig);
  console.log('✅ Configuração do Nginx criada: nginx.conf');
}

// Função para criar script de instalação
function createInstallScript() {
  const installScript = `#!/bin/bash

# Script de Instalação - DOUTORIZZE
echo "🚀 Instalando DOUTORIZZE em produção..."

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y curl wget git unzip nginx mysql-server

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Configurar MySQL
sudo mysql -e "CREATE DATABASE IF NOT EXISTS ${config.dbName};"
sudo mysql -e "CREATE USER IF NOT EXISTS '${config.dbUser}'@'localhost' IDENTIFIED BY '${config.dbPassword}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON ${config.dbName}.* TO '${config.dbUser}'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Criar diretórios
sudo mkdir -p /var/www/doutorizze
sudo mkdir -p /var/www/doutorizze/logs
sudo chown -R $USER:$USER /var/www/doutorizze

# Configurar firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw --force enable

# Configurar Nginx
sudo cp nginx.conf /etc/nginx/sites-available/doutorizze
sudo ln -sf /etc/nginx/sites-available/doutorizze /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Configurar PM2
pm2 startup

echo "✅ Instalação concluída!"
echo "📋 Próximos passos:"
echo "1. Faça upload dos arquivos da aplicação"
echo "2. Configure o backend e inicie com PM2"
echo "3. Configure SSL se necessário"
`;
  
  fs.writeFileSync('install.sh', installScript);
  try {
    fs.chmodSync('install.sh', '755');
  } catch (error) {
    console.log('⚠️ Não foi possível definir permissões do script (Windows)');
  }
  console.log('✅ Script de instalação criado: install.sh');
}

// Função para criar package de deploy
function createDeployPackage() {
  console.log('📦 Criando package de produção...');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const zipName = `doutorizze-production-${timestamp}.zip`;
  
  try {
    if (process.platform === 'win32') {
      const files = ['.env.production', 'nginx.conf', 'install.sh'].filter(f => fs.existsSync(f));
      if (files.length > 0) {
        const fileList = files.map(f => `'${f}'`).join(', ');
        execSync(`powershell "Compress-Archive -Path ${fileList} -DestinationPath '${zipName}' -Force"`, { stdio: 'inherit' });
      }
    } else {
      execSync(`zip ${zipName} .env.production nginx.conf install.sh`, { stdio: 'inherit' });
    }
    
    console.log(`📦 Package criado: ${zipName}`);
  } catch (error) {
    console.log('⚠️ Erro ao criar ZIP, arquivos disponíveis individualmente');
  }
}

// Função principal
async function main() {
  try {
    await collectConfig();
    
    console.log('\n⚙️ Criando arquivos de configuração...');
    createEnvFile();
    createNginxConfig();
    createInstallScript();
    
    console.log('\n📦 Criando package de deploy...');
    createDeployPackage();
    
    console.log('\n🎉 Configuração de produção concluída!');
    console.log('\n📋 Arquivos criados:');
    console.log('- .env.production (configurações da aplicação)');
    console.log('- nginx.conf (configuração do servidor web)');
    console.log('- install.sh (script de instalação)');
    
    console.log('\n📖 Consulte DEPLOY-COMMANDS.md para instruções detalhadas');
    
  } catch (error) {
    console.error('❌ Erro durante a configuração:', error.message);
    process.exit(1);
  }
}

// Executar configuração
main();