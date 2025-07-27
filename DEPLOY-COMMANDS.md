# 🚀 DOUTORIZZE - Comandos de Deploy

Este documento explica como usar os comandos de deploy automatizados do sistema DOUTORIZZE.

## 📋 Comandos Disponíveis

### 1. Deploy Completo
```bash
npm run deploy:full
```
**O que faz:**
- Faz deploy do backend
- Faz deploy do frontend
- Cria todos os arquivos necessários

### 2. Deploy apenas do Frontend
```bash
npm run deploy
```
**O que faz:**
- Executa `npm run build`
- Cria arquivo ZIP para upload manual
- Ou faz upload automático (se configurado)

### 3. Deploy apenas do Backend
```bash
npm run deploy:backend
```
**O que faz:**
- Cria configurações do PM2
- Gera scripts de instalação
- Cria arquivo ZIP com backend completo

### 4. Configuração de Produção
```bash
npm run setup:production
```
**O que faz:**
- Coleta configurações do servidor
- Cria arquivos .env.production
- Gera configuração do Nginx
- Cria scripts de instalação
- Gera documentação completa

### 5. Build para Deploy
```bash
npm run deploy:build
```
**O que faz:**
- Executa verificação de tipos
- Faz build otimizado para produção

## 🔧 Configuração Inicial

Antes de fazer o primeiro deploy, execute:

```bash
npm run setup:production
```

Este comando irá perguntar:
- **Host do servidor**: Endereço do seu servidor
- **Usuário SSH**: Usuário para acesso SSH
- **Domínio**: URL da sua aplicação
- **Configurações do banco**: MySQL host, usuário, senha
- **Chaves do Parcelamais**: API Key e Secret
- **Método de deploy**: Manual, rsync, SCP ou FTP

## 🌐 Variáveis de Ambiente

Para deploy automático, configure estas variáveis:

```bash
# Servidor
export DEPLOY_HOST="seu-servidor.com"
export DEPLOY_USER="usuario"
export DEPLOY_PASSWORD="senha"
export DEPLOY_PATH="/var/www/html"
export DEPLOY_METHOD="rsync" # ou scp, ftp

# Backend
export BACKEND_HOST="seu-servidor.com"
export BACKEND_USER="usuario"
export BACKEND_PATH="/var/www/api"

# Banco de dados
export DB_HOST="localhost"
export DB_USER="doutorizze_user"
export DB_PASSWORD="sua_senha"
export DB_NAME="doutorizze_db"

# Segurança
export JWT_SECRET="seu_jwt_secret_super_seguro"

# Parcelamais
export PARCELAMAIS_API_KEY="sua_api_key"
export PARCELAMAIS_SECRET="seu_secret"
```

## 📦 Métodos de Deploy

### 1. Deploy Manual (Padrão)
- Cria arquivo ZIP
- Você faz upload manual
- Mais seguro para iniciantes

### 2. Deploy Automático via Rsync
```bash
export DEPLOY_METHOD="rsync"
npm run deploy
```

### 3. Deploy Automático via SCP
```bash
export DEPLOY_METHOD="scp"
npm run deploy
```

### 4. Deploy Automático via FTP
```bash
export DEPLOY_METHOD="ftp"
npm run deploy
```

## 🔄 Fluxo de Deploy Completo

### Primeira vez:
```bash
# 1. Configurar produção
npm run setup:production

# 2. Deploy completo
npm run deploy:full

# 3. No servidor, executar:
# chmod +x install.sh && ./install.sh
```

### Atualizações:
```bash
# Deploy rápido (apenas frontend)
npm run deploy

# Ou deploy completo (frontend + backend)
npm run deploy:full
```

## 📁 Arquivos Gerados

Após executar os comandos, você terá:

### Frontend:
- `deploy-YYYY-MM-DD.zip` - Arquivos do frontend

### Backend:
- `backend-deploy-YYYY-MM-DD.zip` - Backend completo
- `ecosystem.config.js` - Configuração PM2
- `server-setup.sh` - Script de instalação
- `.env.production` - Variáveis de ambiente

### Produção:
- `doutorizze-production-YYYY-MM-DD.zip` - Package completo
- `nginx.conf` - Configuração do Nginx
- `install.sh` - Script de instalação completa
- `DEPLOY.md` - Documentação detalhada

## 🆘 Troubleshooting

### Erro: "Diretório de build não encontrado"
```bash
npm run build
npm run deploy
```

### Erro: "Arquivos do backend não encontrados"
Verifique se existe a pasta `./backend` com:
- `package.json`
- `src/app.ts`
- Estrutura completa do backend

### Erro de permissão SSH
```bash
# Configurar chave SSH
ssh-keygen -t rsa -b 4096
ssh-copy-id usuario@servidor
```

### Erro de conexão FTP
Verifique:
- Credenciais corretas
- Servidor FTP ativo
- Firewall liberado

## 🔐 Segurança

### Boas práticas:
1. **Nunca commite** arquivos `.env.production`
2. **Use chaves SSH** em vez de senhas
3. **Configure firewall** no servidor
4. **Use HTTPS** em produção
5. **Faça backups** regulares

### Arquivos sensíveis:
- `.env.production` - Contém senhas e chaves
- `ecosystem.config.js` - Contém configurações do PM2
- Arquivos de backup

## 📊 Monitoramento

Após o deploy, monitore:

```bash
# Status da aplicação
pm2 status

# Logs em tempo real
pm2 logs

# Uso de recursos
pm2 monit

# Status do Nginx
sudo systemctl status nginx

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
```

## 🎯 Exemplos Práticos

### Deploy rápido para teste:
```bash
npm run deploy:build && npm run deploy
```

### Deploy completo para produção:
```bash
npm run setup:production
npm run deploy:full
```

### Atualização apenas do frontend:
```bash
npm run build
npm run deploy:upload
```

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs dos comandos
2. Consulte a documentação em `DEPLOY.md`
3. Verifique as configurações de rede
4. Teste a conectividade SSH/FTP

**DOUTORIZZE** - Sistema de Gestão Odontológica  
Versão: 1.0.0 | Deploy Automatizado