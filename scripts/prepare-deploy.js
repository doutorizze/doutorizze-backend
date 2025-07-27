#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparando backend para deploy...');

// Verificar se todas as dependências estão instaladas
function checkDependencies() {
  console.log('📦 Verificando dependências...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const nodeModulesExists = fs.existsSync('node_modules');
  
  if (!nodeModulesExists) {
    console.log('❌ node_modules não encontrado. Execute: npm install');
    return false;
  }
  
  console.log('✅ Dependências verificadas');
  return true;
}

// Verificar variáveis de ambiente essenciais
function checkEnvironmentVariables() {
  console.log('🔧 Verificando variáveis de ambiente...');
  
  const requiredVars = [
    'JWT_SECRET',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME'
  ];
  
  const envFile = '.env';
  if (!fs.existsSync(envFile)) {
    console.log('❌ Arquivo .env não encontrado');
    return false;
  }
  
  const envContent = fs.readFileSync(envFile, 'utf8');
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName + '=')) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.log('❌ Variáveis de ambiente faltando:', missingVars.join(', '));
    return false;
  }
  
  console.log('✅ Variáveis de ambiente verificadas');
  return true;
}

// Criar arquivo de exemplo para variáveis de ambiente de produção
function createProductionEnvExample() {
  console.log('📝 Criando exemplo de .env para produção...');
  
  const productionEnvExample = `# Configurações de Produção - DOUTORIZZE Backend
# Copie este arquivo e configure as variáveis para sua plataforma de deploy

# Configurações do Servidor
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-frontend-url.vercel.app

# JWT Secret (GERE UMA NOVA CHAVE PARA PRODUÇÃO!)
JWT_SECRET=sua_chave_jwt_super_secreta_aqui_producao
JWT_EXPIRES_IN=7d

# Configurações do Banco de Dados
DB_HOST=193.203.175.195
DB_USER=du664361971_doutorizze
DB_PASSWORD=Asd@080782@
DB_NAME=u664361971_doutorizze
DB_PORT=3306

# Configurações do Parcelamais
PARCELAMAIS_API_URL=https://api.parcelamais.com.br
PARCELAMAIS_CLIENT_ID=mellofelipe17@gmail.com
PARCELAMAIS_CLIENT_SECRET=Mello1
PARCELAMAIS_ENVIRONMENT=production

# Configurações de Upload
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,application/pdf

# Configurações de Logs
LOG_LEVEL=info
`;
  
  fs.writeFileSync('.env.production.example', productionEnvExample);
  console.log('✅ Arquivo .env.production.example criado');
}

// Verificar estrutura de arquivos
function checkFileStructure() {
  console.log('📁 Verificando estrutura de arquivos...');
  
  const requiredFiles = [
    'server.js',
    'package.json',
    'routes/auth.js',
    'routes/clinics.js',
    'routes/appointments.js'
  ];
  
  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length > 0) {
    console.log('❌ Arquivos faltando:', missingFiles.join(', '));
    return false;
  }
  
  console.log('✅ Estrutura de arquivos verificada');
  return true;
}

// Gerar JWT Secret seguro para produção
function generateSecureJWTSecret() {
  const crypto = require('crypto');
  const secret = crypto.randomBytes(64).toString('hex');
  
  console.log('🔐 JWT Secret gerado para produção:');
  console.log('⚠️  IMPORTANTE: Use este secret em produção:');
  console.log(`JWT_SECRET=${secret}`);
  console.log('⚠️  NÃO use o mesmo secret de desenvolvimento!');
  
  return secret;
}

// Função principal
function main() {
  console.log('=' .repeat(50));
  console.log('🏥 DOUTORIZZE - Preparação para Deploy');
  console.log('=' .repeat(50));
  
  let allChecksPass = true;
  
  // Executar verificações
  allChecksPass &= checkDependencies();
  allChecksPass &= checkEnvironmentVariables();
  allChecksPass &= checkFileStructure();
  
  // Criar arquivos auxiliares
  createProductionEnvExample();
  
  // Gerar JWT Secret
  console.log('');
  generateSecureJWTSecret();
  
  console.log('');
  console.log('=' .repeat(50));
  
  if (allChecksPass) {
    console.log('✅ Backend pronto para deploy!');
    console.log('');
    console.log('📋 Próximos passos:');
    console.log('1. Escolha uma plataforma de deploy (Render, Railway, Cyclic)');
    console.log('2. Configure as variáveis de ambiente na plataforma');
    console.log('3. Use o JWT Secret gerado acima para produção');
    console.log('4. Atualize FRONTEND_URL com a URL do seu frontend');
    console.log('5. Faça o deploy!');
    console.log('');
    console.log('📖 Consulte DEPLOY.md para instruções detalhadas');
  } else {
    console.log('❌ Corrija os problemas acima antes do deploy');
    process.exit(1);
  }
  
  console.log('=' .repeat(50));
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  checkDependencies,
  checkEnvironmentVariables,
  checkFileStructure,
  generateSecureJWTSecret
};