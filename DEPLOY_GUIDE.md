# 🚀 Guia Completo de Deploy - DOUTORIZZE

Este guia contém instruções passo a passo para fazer o deploy completo da aplicação DOUTORIZZE (Frontend + Backend).

## 📋 Visão Geral

- **Frontend**: React + Vite + TypeScript (já deployado no Vercel)
- **Backend**: Node.js + Express + MySQL
- **Banco de Dados**: MySQL (já configurado)

## 🎯 Status Atual

✅ **Frontend**: Deployado no Vercel  
🔗 URL: https://traeqgd39g0p-pa6voxvna-rozanaqueiroz5-1761s-projects.vercel.app

⏳ **Backend**: Pronto para deploy  
📁 Localização: `./backend/`

## 🚀 Deploy do Backend

### Opção 1: Render.com (Recomendado)

**Por que Render?**
- ✅ 750 horas gratuitas por mês
- ✅ Deploy automático via Git
- ✅ SSL gratuito
- ✅ Suporte nativo a Node.js
- ✅ Fácil configuração

**Passos:**

1. **Preparar o projeto**
   ```bash
   cd backend
   npm run prepare-deploy
   ```

2. **Criar conta no Render**
   - Acesse [render.com](https://render.com)
   - Conecte sua conta GitHub

3. **Criar Web Service**
   - Clique em "New" → "Web Service"
   - Conecte seu repositório GitHub
   - Selecione o repositório do projeto

4. **Configurar o serviço**
   - **Name**: `doutorizze-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend` (se o backend estiver em subpasta)

5. **Configurar variáveis de ambiente**
   
   Adicione estas variáveis no painel do Render:
   
   ```env
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://traeqgd39g0p-pa6voxvna-rozanaqueiroz5-1761s-projects.vercel.app
   
   # Use o JWT Secret gerado pelo script prepare-deploy
   JWT_SECRET=c1f0bc8721bc7507806a03b8c3d100f577ab9883f2bbe483b4e8c0eb873e0f34c37d24922115d263aab0ad739ef0be8b525065f9e49bc2db803b947ef949e707
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

6. **Deploy**
   - Clique em "Create Web Service"
   - Aguarde o deploy (5-10 minutos)
   - Anote a URL gerada (ex: `https://doutorizze-backend.onrender.com`)

### Opção 2: Railway.app

1. **Acesse [railway.app](https://railway.app)**
2. **Conecte GitHub e selecione o repositório**
3. **Railway detectará automaticamente Node.js**
4. **Configure as mesmas variáveis de ambiente**
5. **Deploy automático**

### Opção 3: Cyclic.sh

1. **Acesse [cyclic.sh](https://cyclic.sh)**
2. **Conecte GitHub**
3. **Selecione repositório**
4. **Configure variáveis de ambiente**
5. **Deploy automático**

## 🔗 Conectar Frontend ao Backend

Após o deploy do backend:

1. **Copie a URL do backend** (ex: `https://doutorizze-backend.onrender.com`)

2. **Atualize a configuração do frontend**
   
   Edite o arquivo `src/config/api.ts`:
   ```typescript
   const API_URLS = {
     development: 'http://localhost:3001',
     production: 'https://doutorizze-backend.onrender.com' // ← Sua URL aqui
   };
   ```

3. **Fazer novo deploy do frontend**
   ```bash
   npm run build
   # O Vercel fará deploy automático se conectado ao Git
   ```

## ✅ Verificação do Deploy

### 1. Testar Backend
```bash
# Health Check
curl https://sua-url-backend.onrender.com/health

# API de clínicas
curl https://sua-url-backend.onrender.com/api/clinics/public
```

### 2. Testar Frontend
- Acesse: https://traeqgd39g0p-pa6voxvna-rozanaqueiroz5-1761s-projects.vercel.app
- Verifique se as clínicas carregam na página inicial
- Teste o sistema de busca
- Verifique se não há erros no console do navegador

### 3. Testar Integração
- Abra o DevTools (F12)
- Vá para a aba Network
- Recarregue a página
- Verifique se as chamadas para `/api/clinics/public` retornam status 200

## 🐛 Troubleshooting

### Backend não inicia
```bash
# Verificar logs no painel da plataforma
# Problemas comuns:
# - Variáveis de ambiente faltando
# - Porta incorreta
# - Comando de start incorreto
```

### Erro de CORS
```bash
# Verificar se FRONTEND_URL está correta
# Não deve ter barra no final
# Exemplo correto: https://seu-site.vercel.app
# Exemplo incorreto: https://seu-site.vercel.app/
```

### Frontend não conecta ao Backend
```bash
# 1. Verificar se a URL do backend está correta em src/config/api.ts
# 2. Verificar se o backend está online
# 3. Verificar logs do navegador (F12 → Console)
# 4. Verificar se não há erro de HTTPS/HTTP mixed content
```

### Banco de dados não conecta
```bash
# Verificar:
# - Credenciais do banco
# - Se o banco permite conexões externas
# - Se as variáveis de ambiente estão corretas
```

## 📊 Monitoramento

### Render.com
- Dashboard com logs em tempo real
- Métricas de CPU e memória
- Histórico de deploys
- Alertas automáticos

### Vercel
- Analytics de performance
- Logs de build e runtime
- Métricas de Core Web Vitals

## 🔒 Segurança

### ✅ Implementado
- HTTPS automático
- CORS configurado
- Rate limiting
- Helmet.js para headers de segurança
- JWT para autenticação
- Validação de entrada

### 🔄 Recomendações
- Monitorar logs regularmente
- Manter dependências atualizadas
- Backup regular do banco de dados
- Configurar alertas de erro

## 💰 Custos

### Gratuito
- **Vercel**: Frontend (100GB bandwidth/mês)
- **Render**: Backend (750 horas/mês)
- **MySQL**: Já configurado

### Se precisar escalar
- **Vercel Pro**: $20/mês
- **Render Starter**: $7/mês
- **Railway**: $5 crédito/mês

## 🎉 Próximos Passos

1. ✅ Deploy do backend
2. ✅ Conectar frontend ao backend
3. ✅ Testar todas as funcionalidades
4. 📊 Configurar monitoramento
5. 🔒 Revisar configurações de segurança
6. 📱 Testar em dispositivos móveis
7. 🚀 Divulgar a aplicação!

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs da plataforma
2. Consulte a documentação específica da plataforma
3. Verifique se todas as variáveis de ambiente estão configuradas
4. Teste os endpoints individualmente

**Boa sorte com o deploy! 🚀**