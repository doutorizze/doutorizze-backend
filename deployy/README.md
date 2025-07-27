# DOUTORIZZE Backend API

## 🚀 Sistema de Gestão para Clínicas Odontológicas

Backend completo desenvolvido em Node.js + Express + MySQL para o sistema DOUTORIZZE, incluindo integração com Parcelamais para financiamento de tratamentos odontológicos.

## 📋 Funcionalidades

### 🔐 Autenticação e Autorização
- Sistema de login/registro com JWT
- Controle de acesso baseado em roles (admin, clinic, patient)
- Middleware de autenticação e autorização
- Refresh token automático

### 🏥 Gestão de Clínicas
- Cadastro e aprovação de clínicas
- Perfil completo com especialidades e horários
- Dashboard com estatísticas
- Integração com Parcelamais

### 📅 Sistema de Agendamentos
- Agendamento de consultas
- Verificação de disponibilidade
- Gestão de status (agendado, confirmado, concluído, cancelado)
- Notificações automáticas

### 💰 Parcelamais Integration
- Simulação de financiamento
- Fluxo de aprovação (Paciente → Clínica → Admin → Parcelamais)
- Webhooks para atualizações de status
- Dashboard administrativo

### 🔔 Sistema de Notificações
- Notificações em tempo real
- Diferentes tipos (info, success, warning, error)
- Histórico completo

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Express Rate Limit** - Rate limiting
- **Express Validator** - Validação de dados

## 📁 Estrutura do Projeto

```
backend/
├── config/
│   └── database.js          # Configuração do MySQL
├── middleware/
│   └── auth.js              # Middleware de autenticação
├── routes/
│   ├── auth.js              # Rotas de autenticação
│   ├── clinics.js           # Rotas de clínicas
│   ├── appointments.js      # Rotas de agendamentos
│   ├── loanRequests.js      # Rotas de empréstimos
│   ├── parcelamais.js       # Integração Parcelamais
│   └── webhooks.js          # Webhooks
├── scripts/
│   ├── migrate.js           # Script de migração
│   └── seed.js              # Script de seed
├── database/
│   └── doutorizze.sql       # Script SQL completo
├── server.js                # Servidor principal
├── package.json             # Dependências
├── .env.example             # Variáveis de ambiente
└── README.md                # Documentação
```

## 🚀 Instalação e Configuração

### 1. Pré-requisitos

- Node.js 16+ 
- MySQL 8.0+
- npm ou yarn

### 2. Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd doutorizze/backend

# Instale as dependências
npm install

# Copie o arquivo de ambiente
cp .env.example .env
```

### 3. Configuração do Banco de Dados

#### Opção A: Script SQL Completo
```bash
# Execute o script SQL no MySQL
mysql -u root -p < database/doutorizze.sql
```

#### Opção B: Migração via Node.js
```bash
# Configure as variáveis no .env
# Execute a migração
npm run migrate

# Execute o seed (dados iniciais)
npm run seed
```

### 4. Configuração das Variáveis de Ambiente

Edite o arquivo `.env`:

```env
# Servidor
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://seudominio.com

# Banco de Dados
DB_HOST=localhost
DB_USER=doutorizze_app
DB_PASSWORD=D0ut0r1zz3_S3cur3_P4ss!
DB_NAME=doutorizze
DB_PORT=3306

# JWT
JWT_SECRET=sua_chave_jwt_super_secreta_aqui
JWT_EXPIRES_IN=7d

# Parcelamais
PARCELAMAIS_API_URL=https://api.parcelamais.com.br
PARCELAMAIS_CLIENT_ID=seu_client_id
PARCELAMAIS_CLIENT_SECRET=seu_client_secret
```

### 5. Inicialização

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📊 Banco de Dados

### Estrutura das Tabelas

#### users
- Usuários do sistema (pacientes, clínicas, admin)
- Autenticação e perfis

#### clinics
- Dados das clínicas odontológicas
- Configurações do Parcelamais

#### appointments
- Agendamentos de consultas
- Status e histórico

#### loan_requests
- Solicitações de empréstimo
- Fluxo de aprovação completo

#### notifications
- Sistema de notificações
- Diferentes tipos e status

#### webhook_logs
- Logs de webhooks recebidos
- Auditoria e debugging

### Credenciais Padrão

```
👨‍💼 Admin: admin@doutorizze.com / admin123
🏥 Clínica: clinica@exemplo.com / clinic123
👤 Paciente: paciente@exemplo.com / patient123
```

## 🔌 API Endpoints

### Autenticação
```
POST /api/auth/login          # Login
POST /api/auth/register       # Registro
GET  /api/auth/me             # Perfil do usuário
POST /api/auth/refresh        # Renovar token
POST /api/auth/logout         # Logout
```

### Clínicas
```
GET    /api/clinics           # Listar clínicas
GET    /api/clinics/:id       # Buscar clínica
PUT    /api/clinics/:id       # Atualizar clínica
PUT    /api/clinics/:id/status # Atualizar status (admin)
GET    /api/clinics/:id/stats  # Estatísticas
DELETE /api/clinics/:id       # Deletar (admin)
```

### Agendamentos
```
GET    /api/appointments      # Listar agendamentos
GET    /api/appointments/:id  # Buscar agendamento
POST   /api/appointments      # Criar agendamento
PUT    /api/appointments/:id  # Atualizar agendamento
DELETE /api/appointments/:id  # Cancelar agendamento
GET    /api/appointments/available-slots/:clinic_id # Horários disponíveis
```

### Empréstimos
```
GET    /api/loan-requests     # Listar solicitações
GET    /api/loan-requests/:id # Buscar solicitação
POST   /api/loan-requests     # Criar solicitação
PUT    /api/loan-requests/:id/clinic-action # Ação da clínica
PUT    /api/loan-requests/:id/admin-action  # Ação do admin
GET    /api/loan-requests/stats/dashboard   # Estatísticas
DELETE /api/loan-requests/:id # Cancelar
```

### Parcelamais
```
POST /api/parcelamais/simulate        # Simular financiamento
POST /api/parcelamais/create-request  # Criar no Parcelamais
GET  /api/parcelamais/status/:id      # Consultar status
POST /api/parcelamais/approve/:id     # Aprovar
POST /api/parcelamais/reject/:id      # Rejeitar
GET  /api/parcelamais/stats           # Estatísticas
```

### Webhooks
```
POST /api/webhooks/parcelamais # Webhook do Parcelamais
GET  /api/webhooks/logs        # Logs de webhooks
POST /api/webhooks/test        # Teste (desenvolvimento)
```

## 🔒 Segurança

### Implementações de Segurança

- **Helmet**: Headers de segurança HTTP
- **CORS**: Configuração de origem cruzada
- **Rate Limiting**: Proteção contra ataques de força bruta
- **JWT**: Tokens seguros com expiração
- **bcrypt**: Hash seguro de senhas
- **Validação**: Sanitização de dados de entrada
- **SQL Injection**: Proteção via prepared statements

### Middleware de Autenticação

```javascript
// Proteger rotas
router.get('/protected', authenticateToken, (req, res) => {
  // Rota protegida
});

// Verificar role específica
router.get('/admin-only', authenticateToken, requireAdmin, (req, res) => {
  // Apenas admin
});
```

## 🔄 Fluxo do Parcelamais

### 1. Solicitação do Paciente
```
Paciente → Clínica (pending)
```

### 2. Aprovação da Clínica
```
Clínica → Admin (clinic_approved)
```

### 3. Processamento Admin
```
Admin → Parcelamais (admin_processing)
```

### 4. Resposta Final
```
Parcelamais → Sistema (approved/rejected)
```

## 📈 Monitoramento

### Health Check
```
GET /health
```

### Logs
- Logs de aplicação no console
- Logs de webhook no banco
- Logs de erro detalhados

### Métricas
- Estatísticas de uso
- Performance de APIs
- Status de integrações

## 🚀 Deploy em Produção

### 1. Servidor

```bash
# PM2 para gerenciamento de processos
npm install -g pm2

# Iniciar aplicação
pm2 start server.js --name "doutorizze-api"

# Configurar auto-restart
pm2 startup
pm2 save
```

### 2. Nginx (Proxy Reverso)

```nginx
server {
    listen 80;
    server_name api.doutorizze.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. SSL/HTTPS

```bash
# Certbot para SSL gratuito
sudo certbot --nginx -d api.doutorizze.com
```

### 4. Backup do Banco

```bash
# Script de backup diário
#!/bin/bash
DATE=$(date +"%Y%m%d_%H%M%S")
mysqldump -u doutorizze_app -p doutorizze > backup_$DATE.sql
```

## 🧪 Testes

### Teste Manual das APIs

```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@doutorizze.com","password":"admin123"}'
```

### Webhook de Teste

```bash
curl -X POST http://localhost:3001/api/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{"event_type":"loan_request.approved","data":{"external_id":"1"}}'
```

## 📞 Suporte

### Logs de Debug

```bash
# Ver logs em tempo real
pm2 logs doutorizze-api

# Logs do MySQL
sudo tail -f /var/log/mysql/error.log
```

### Comandos Úteis

```bash
# Reiniciar aplicação
pm2 restart doutorizze-api

# Status da aplicação
pm2 status

# Monitoramento
pm2 monit
```

## 🔄 Atualizações

### Deploy de Nova Versão

```bash
# Pull do código
git pull origin main

# Instalar dependências
npm install

# Executar migrações (se houver)
npm run migrate

# Reiniciar aplicação
pm2 restart doutorizze-api
```

## 📝 Changelog

### v1.0.0 (2024-01-15)
- ✅ Sistema de autenticação completo
- ✅ Gestão de clínicas e pacientes
- ✅ Sistema de agendamentos
- ✅ Integração Parcelamais
- ✅ Sistema de notificações
- ✅ Webhooks e logs
- ✅ Dashboard administrativo
- ✅ Documentação completa

---

**DOUTORIZZE Backend API v1.0.0**  
*Sistema completo para gestão de clínicas odontológicas com integração Parcelamais*

🚀 **Pronto para produção!**