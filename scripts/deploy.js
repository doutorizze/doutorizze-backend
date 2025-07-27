#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 DOUTORIZZE - Deploy Automatizado');
console.log('===================================\n');

// Verificar se o diretório de build existe
const buildDir = './dist';
if (!fs.existsSync(buildDir)) {
  console.error('❌ Diretório de build não encontrado: ./dist');
  console.log('💡 Execute "npm run build" primeiro.');
  process.exit(1);
}

console.log('✅ Diretório de build encontrado');

// Criar arquivo ZIP para deploy
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
const zipName = `doutorizze-deploy-${timestamp}.zip`;

console.log(`📦 Criando arquivo de deploy: ${zipName}`);

try {
  if (process.platform === 'win32') {
    // Comando PowerShell para Windows
    const command = `powershell "Compress-Archive -Path '.\\dist\\*' -DestinationPath '${zipName}' -Force"`;
    console.log('📋 Executando compressão...');
    execSync(command, { stdio: 'inherit' });
  } else {
    // Comando zip para Linux/Mac
    execSync(`zip -r ${zipName} dist/*`, { stdio: 'inherit' });
  }
  
  console.log('\n🎉 Deploy preparado com sucesso!');
  console.log(`📦 Arquivo criado: ${zipName}`);
  console.log('\n📋 Próximos passos:');
  console.log('1. Faça upload deste arquivo para seu servidor');
  console.log('2. Extraia o arquivo no diretório web do servidor');
  console.log('3. Configure o servidor web (Nginx/Apache)');
  console.log('\n🌐 Seu site estará pronto para produção!');
  
} catch (error) {
  console.error('❌ Erro ao criar arquivo ZIP:', error.message);
  console.log('\n💡 Alternativa manual:');
  console.log('1. Copie todos os arquivos da pasta ./dist');
  console.log('2. Faça upload manual para seu servidor');
  console.log('3. Coloque os arquivos no diretório web');
}

console.log('\n📖 Para mais informações, consulte DEPLOY-COMMANDS.md');