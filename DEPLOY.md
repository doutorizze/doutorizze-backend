<<<<<<< HEAD
# Deploy do Backend DOUTORIZZE

Este guia contém instruções para fazer o deploy do backend em diferentes plataformas de hospedagem gratuita.

## 🚀 Opções de Deploy Gratuito

### 1. Render.com (Recomendado)

**Vantagens:**
- Deploy automático via Git
- SSL gratuito
- 750 horas gratuitas por mês
- Suporte nativo a Node.js
- Banco de dados PostgreSQL gratuito

**Passos:**
1. Acesse [render.com](https://render.com)
2. Conecte sua conta GitHub
3. Clique em "New" → "Web Service"
4. Selecione o repositório do projeto
5. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
6. Adicione as variáveis de ambiente (veja seção abaixo)
7. Clique em "Create Web Service"

### 2. Railway.app

**Vantagens:**
- $5 de crédito gratuito por mês
- Deploy automático
- Suporte a bancos de dados
- Interface simples

**Passos:**
1. Acesse [railway.app](https://railway.app)
2. Conecte sua conta GitHub
3. Clique em "Deploy from GitHub repo"
4. Selecione o repositório
5. Railway detectará automaticamente que é um projeto Node.js
6. Configure as variáveis de ambiente
7. Deploy será feito automaticamente

### 3. Cyclic.sh

**Vantagens:**
- Completamente gratuito
- 1GB de memória
- 10.000 requests por mês
- Deploy via GitHub

**Passos:**
1. Acesse [cyclic.sh](https://cyclic.sh)
2. Conecte sua conta GitHub
3. Selecione o repositório
4. Configure as variáveis de ambiente
5. Deploy automático

## 🔧 Variáveis de Ambiente Necessárias

Configure estas variáveis na plataforma escolhida:

```env
# Essenciais
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-frontend-url.vercel.app

# JWT
JWT_SECRET=sua_chave_jwt_super_secreta_aqui_producao
JWT_EXPIRES_IN=7d

# Banco de Dados
DB_HOST=193.203.175.195
DB_USER=du664361971_doutorizze
DB_PASSWORD=Asd@080782@
DB_NAME=u664361971_doutorizze
DB_PORT=3306

# Parcelamais
PARCELAMAIS_API_URL=https://api.parcelamais.com.br
PARCELAMAIS_CLIENT_ID=mellofelipe17@gmail.com
PARCELAMAIS_CLIENT_SECRET=Mello1
PARCELAMAIS_ENVIRONMENT=production

# Upload
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,application/pdf

# Logs
LOG_LEVEL=info
```

## 📝 Configurações Importantes

### 1. CORS
O backend já está configurado para aceitar requests do frontend no Vercel. Se mudar a URL do frontend, atualize a variável `FRONTEND_URL`.

### 2. Banco de Dados
O projeto está configurado para usar MySQL. As credenciais já estão no arquivo, mas considere usar variáveis de ambiente para maior segurança.

### 3. Health Check
O endpoint `/health` está disponível para verificar se o servidor está funcionando:
```
GET https://seu-backend-url.com/health
```

## 🔗 Conectando Frontend e Backend

Após o deploy do backend:

1. Copie a URL do backend (ex: `https://doutorizze-backend.onrender.com`)
2. No frontend, atualize o arquivo `src/utils/useStore.ts`
3. Substitua `http://localhost:3001` pela URL do backend em produção
4. Faça um novo deploy do frontend no Vercel

## 🐛 Troubleshooting

### Erro de CORS
- Verifique se `FRONTEND_URL` está correta
- Certifique-se de que não há barra no final da URL

### Erro de Conexão com Banco
- Verifique as credenciais do banco de dados
- Confirme se o banco está acessível externamente

### Aplicação não inicia
- Verifique os logs da plataforma
- Confirme se todas as variáveis de ambiente estão configuradas
- Verifique se o comando de start está correto: `npm start`

## 📊 Monitoramento

Todas as plataformas oferecem:
- Logs em tempo real
- Métricas de uso
- Alertas de erro
- Histórico de deploys

## 💡 Dicas

1. **Render.com** é a opção mais estável e confiável
2. **Railway** oferece boa performance mas tem limite de crédito
3. **Cyclic** é totalmente gratuito mas pode ter limitações de performance
4. Sempre teste o endpoint `/health` após o deploy
5. Configure alertas de monitoramento se disponível
6. Mantenha backups das variáveis de ambiente

---

**Próximos passos:** Após escolher uma plataforma e fazer o deploy, atualize a URL do backend no frontend e teste todas as funcionalidades.
=======
# 🚀 DOUTORIZZE - Guia de Deploy em Produção

Guia completo para deploy do sistema DOUTORIZZE em ambiente de produção.

## 📋 Pré-requisitos

### Servidor
- **OS**: Ubuntu 20.04+ ou CentOS 8+
- **RAM**: Mínimo 4GB (Recomendado 8GB+)
- **CPU**: Mínimo 2 cores (Recomendado 4+ cores)
- **Disco**: Mínimo 50GB SSD
- **Rede**: IP público com portas 80, 443, 22 abertas

### Domínios
- Domínio principal: `doutorizze.com`
- API: `api.doutorizze.com`
- Opcional: `www.doutorizze.com`

### Contas Necessárias
- **Parcelamais**: Client ID e Client Secret
- **Email SMTP**: Para notificações
- **SSL**: Let's Encrypt (gratuito) ou certificado pago

## 🛠️ Opções de Deploy

### Opção 1: Deploy com Docker (Recomendado)

#### 1.1 Instalação do Docker

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Reiniciar sessão
logout
```

#### 1.2 Configuração

```bash
# Clone o repositório
git clone <repository-url>
cd doutorizze

# Copiar arquivo de ambiente
cp .env.example .env

# Editar configurações
nano .env
```

#### 1.3 Configurar .env

```env
# Banco de Dados
MYSQL_ROOT_PASSWORD=SuaSenhaRootMuitoSegura123!
DB_NAME=doutorizze
DB_USER=doutorizze_app
DB_PASSWORD=SuaSenhaAppMuitoSegura123!

# JWT
JWT_SECRET=SuaChaveJWTSuperSecretaComMaisDe32Caracteres!
JWT_EXPIRES_IN=7d

# Parcelamais
PARCELAMAIS_API_URL=https://api.parcelamais.com.br
PARCELAMAIS_CLIENT_ID=seu_client_id_real
PARCELAMAIS_CLIENT_SECRET=seu_client_secret_real
PARCELAMAIS_ENVIRONMENT=production

# Frontend
FRONTEND_URL=https://doutorizze.com

# Redis (opcional)
REDIS_PASSWORD=SuaSenhaRedisMuitoSegura123!
```

#### 1.4 Deploy

```bash
# Deploy completo
docker-compose --profile production up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f api
```

### Opção 2: Deploy Manual

#### 2.1 Preparação do Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y curl wget git nginx mysql-server certbot python3-certbot-nginx

# Executar script de instalação
cd doutorizze/backend
chmod +x install.sh
./install.sh
```

#### 2.2 Configuração Manual do MySQL

```bash
# Configurar MySQL
sudo mysql_secure_installation

# Criar banco
sudo mysql -u root -p < backend/database/doutorizze.sql
```

#### 2.3 Configuração do Nginx

```bash
# Copiar configurações
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp nginx/conf.d/* /etc/nginx/conf.d/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

## 🔒 Configuração SSL

### Let's Encrypt (Gratuito)

```bash
# Obter certificados
sudo certbot --nginx -d doutorizze.com -d www.doutorizze.com -d api.doutorizze.com

# Configurar renovação automática
sudo crontab -e
# Adicionar linha:
0 12 * * * /usr/bin/certbot renew --quiet
```

### Certificado Personalizado

```bash
# Criar diretório SSL
sudo mkdir -p /etc/nginx/ssl

# Copiar certificados
sudo cp seu_certificado.crt /etc/nginx/ssl/doutorizze.com.crt
sudo cp sua_chave_privada.key /etc/nginx/ssl/doutorizze.com.key

# Definir permissões
sudo chmod 600 /etc/nginx/ssl/*
sudo chown root:root /etc/nginx/ssl/*
```

## 🔧 Configurações Avançadas

### Firewall

```bash
# UFW (Ubuntu)
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw status
```

### Monitoramento

```bash
# Instalar htop e iotop
sudo apt install htop iotop

# Configurar monitoramento com Docker
docker-compose --profile monitoring up -d

# Acessar Prometheus: http://seu-servidor:9090
```

### Backup Automático

```bash
# Configurar cron jobs
cd backend/scripts
chmod +x setup-cron.sh
./setup-cron.sh

# Verificar cron jobs
crontab -l
```

## 📊 Verificação do Deploy

### 1. Health Checks

```bash
# API Health
curl https://api.doutorizze.com/health

# Resposta esperada:
{"status":"ok","timestamp":"...","uptime":"..."}
```

### 2. Teste de Login

```bash
# Teste de autenticação
curl -X POST https://api.doutorizze.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@doutorizze.com","password":"admin123"}'

# Resposta esperada:
{"token":"...","user":{...}}
```

### 3. Teste do Frontend

```bash
# Verificar se o frontend carrega
curl -I https://doutorizze.com

# Status esperado: 200 OK
```

### 4. Teste do Banco

```bash
# Conectar ao MySQL
mysql -u doutorizze_app -p doutorizze

# Verificar tabelas
SHOW TABLES;

# Verificar usuário admin
SELECT * FROM users WHERE email = 'admin@doutorizze.com';
```

## 🚨 Troubleshooting

### Problemas Comuns

#### API não responde

```bash
# Verificar logs
docker-compose logs api
# ou
pm2 logs doutorizze-api

# Verificar se está rodando
docker-compose ps
# ou
pm2 status

# Reiniciar
docker-compose restart api
# ou
pm2 restart doutorizze-api
```

#### Erro de conexão com banco

```bash
# Verificar MySQL
docker-compose logs mysql
# ou
sudo systemctl status mysql

# Testar conexão
mysql -h localhost -u doutorizze_app -p

# Verificar configurações
cat .env | grep DB_
```

#### Erro de SSL

```bash
# Verificar certificados
sudo certbot certificates

# Renovar certificados
sudo certbot renew

# Testar configuração Nginx
sudo nginx -t
```

#### Alto uso de recursos

```bash
# Verificar uso de CPU/RAM
htop

# Verificar logs de erro
tail -f /var/log/nginx/error.log
docker-compose logs --tail=100 api

# Otimizar MySQL
mysql -u root -p -e "OPTIMIZE TABLE doutorizze.users, doutorizze.clinics, doutorizze.appointments, doutorizze.loan_requests;"
```

## 📈 Otimização de Performance

### 1. MySQL

```sql
-- Adicionar índices adicionais
CREATE INDEX idx_appointments_date_clinic ON appointments(appointment_date, clinic_id);
CREATE INDEX idx_loan_requests_status_date ON loan_requests(status, created_at);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
```

### 2. Nginx Cache

```nginx
# Adicionar ao nginx.conf
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m use_temp_path=off;

# Adicionar às locations da API
proxy_cache api_cache;
proxy_cache_valid 200 5m;
proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
```

### 3. Redis Cache (Opcional)

```bash
# Ativar Redis
docker-compose --profile cache up -d redis

# Configurar no .env
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=SuaSenhaRedisMuitoSegura123!
```

## 🔄 Atualizações

### Deploy de Nova Versão

```bash
# Com Docker
git pull origin main
docker-compose build api
docker-compose up -d api

# Manual
git pull origin main
cd backend
npm install
pm2 restart doutorizze-api
```

### Migração de Banco

```bash
# Backup antes da migração
./backend/scripts/backup.sh

# Executar migrações
npm run migrate

# Verificar integridade
mysql -u doutorizze_app -p doutorizze -e "SELECT COUNT(*) FROM users;"
```

## 📞 Suporte e Manutenção

### Logs Importantes

```bash
# Logs da aplicação
tail -f /var/log/doutorizze_*.log

# Logs do Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Logs do MySQL
sudo tail -f /var/log/mysql/error.log

# Logs do Docker
docker-compose logs -f
```

### Comandos de Manutenção

```bash
# Limpeza do sistema
sudo apt autoremove -y
sudo apt autoclean
docker system prune -f

# Backup manual
./backend/scripts/backup.sh

# Health check completo
./backend/scripts/health-check.sh

# Limpeza de logs antigos
./backend/scripts/cleanup.sh
```

### Contatos de Emergência

- **Desenvolvedor**: [seu-email@exemplo.com]
- **Suporte Parcelamais**: [suporte@parcelamais.com.br]
- **Hosting**: [suporte@seu-provedor.com]

---

## ✅ Checklist de Deploy

- [ ] Servidor configurado com requisitos mínimos
- [ ] Domínios apontando para o servidor
- [ ] Docker e Docker Compose instalados
- [ ] Arquivo .env configurado corretamente
- [ ] Credenciais do Parcelamais configuradas
- [ ] SSL configurado e funcionando
- [ ] Banco de dados criado e populado
- [ ] API respondendo no health check
- [ ] Frontend carregando corretamente
- [ ] Login de teste funcionando
- [ ] Backup automático configurado
- [ ] Monitoramento ativo
- [ ] Firewall configurado
- [ ] Logs sendo gerados corretamente
- [ ] Cron jobs configurados
- [ ] Documentação atualizada

---

**🎉 Parabéns! Seu sistema DOUTORIZZE está em produção!**

*Para suporte técnico, consulte os logs ou entre em contato com a equipe de desenvolvimento.*
>>>>>>> 71acf97b27cb7d0e92dd05cfed922c6f55e97d68
