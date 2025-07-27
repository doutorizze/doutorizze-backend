# 🚀 Deploy do Backend DOUTORIZZE no GitHub e Render

## 📋 Pré-requisitos

- Git instalado no seu sistema
- Conta no GitHub
- Conta no Render.com

## 🔧 Passo 1: Preparar o Repositório Git

### 1.1 Inicializar o repositório Git no backend

```bash
cd backend
git init
```

### 1.2 Adicionar arquivos ao repositório

```bash
git add .
git commit -m "Initial commit: DOUTORIZZE Backend"
```

### 1.3 Criar repositório no GitHub

1. Acesse [GitHub.com](https://github.com)
2. Clique em "New repository"
3. Nome: `doutorizze-backend`
4. Descrição: `Backend API para o sistema DOUTORIZZE`
5. Deixe como **Público** (necessário para plano gratuito do Render)
6. **NÃO** marque "Add a README file"
7. Clique em "Create repository"

### 1.4 Conectar repositório local ao GitHub

```bash
# Substitua SEU_USUARIO pelo seu username do GitHub
git remote add origin https://github.com/SEU_USUARIO/doutorizze-backend.git
git branch -M main
git push -u origin main
```

## 🌐 Passo 2: Deploy no Render

### 2.1 Acessar o Render

1. Acesse [render.com](https://render.com)
2. Faça login ou crie uma conta
3. Conecte sua conta do GitHub

### 2.2 Criar novo Web Service

1. No dashboard do Render, clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório `doutorizze-backend`
4. Configure os seguintes campos:

**Configurações Básicas:**
- **Name:** `doutorizze-backend`
- **Environment:** `Node`
- **Region:** `Oregon (US West)` (mais próximo)
- **Branch:** `main`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### 2.3 Configurar Variáveis de Ambiente

No Render, vá para a seção "Environment" e adicione:

```
NODE_ENV=production
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://doutorizze-b1mwk6hpr-doutorizzes-projects.vercel.app
DB_HOST=193.203.175.195
DB_USER=du664361971_doutorizze
DB_PASSWORD=sua_senha_do_banco
DB_NAME=u664361971_doutorizze
DB_PORT=3306
PARCELAMAIS_API_URL=https://api.parcelamais.com.br
PARCELAMAIS_CLIENT_ID=mellofelipe17@gmail.com
PARCELAMAIS_CLIENT_SECRET=seu_client_secret_parcelamais
PARCELAMAIS_ENVIRONMENT=production
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,application/pdf
LOG_LEVEL=info
```

### 2.4 Finalizar Deploy

1. Clique em "Create Web Service"
2. O Render iniciará o build automaticamente
3. Aguarde o deploy ser concluído (pode levar alguns minutos)
4. Sua URL será algo como: `https://doutorizze-backend.onrender.com`

## 🔄 Passo 3: Atualizar Frontend

Após o deploy do backend, você precisará atualizar a URL da API no frontend:

1. No projeto frontend, edite o arquivo `src/config/api.ts`
2. Altere a `baseURL` para a URL do seu backend no Render
3. Faça um novo deploy do frontend no Vercel

## 📝 Comandos Git Úteis

### Para futuras atualizações:

```bash
# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para GitHub
git push origin main
```

### Verificar status:

```bash
git status
git log --oneline
```

## 🔍 Verificação do Deploy

### Testar a API:

```bash
# Teste básico
curl https://seu-backend.onrender.com/api/health

# Ou acesse no navegador:
https://seu-backend.onrender.com/api/health
```

## ⚠️ Observações Importantes

1. **Plano Gratuito do Render:**
   - Aplicação "hiberna" após 15 minutos de inatividade
   - Primeiro acesso após hibernação pode ser lento (30-60 segundos)
   - 750 horas gratuitas por mês

2. **Banco de Dados:**
   - Certifique-se de que o banco MySQL está acessível externamente
   - Configure as credenciais corretas nas variáveis de ambiente

3. **Segurança:**
   - Nunca commite arquivos `.env` no Git
   - Use variáveis de ambiente para dados sensíveis
   - Mantenha o JWT_SECRET seguro

## 🆘 Solução de Problemas

### Build falhou:
- Verifique os logs no Render
- Certifique-se de que `package.json` está correto
- Verifique se todas as dependências estão listadas

### Aplicação não inicia:
- Verifique as variáveis de ambiente
- Confirme se a porta está configurada corretamente
- Verifique os logs de erro no Render

### Banco de dados não conecta:
- Teste a conexão com o banco externamente
- Verifique as credenciais nas variáveis de ambiente
- Confirme se o firewall permite conexões externas

## 🎯 Próximos Passos

1. ✅ Deploy do backend no Render
2. 🔄 Atualizar URL da API no frontend
3. 🚀 Novo deploy do frontend no Vercel
4. 🧪 Testar integração completa
5. 📊 Monitorar logs e performance

---

**Sucesso!** 🎉 Seu backend estará rodando no Render e integrado com o frontend no Vercel!