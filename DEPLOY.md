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