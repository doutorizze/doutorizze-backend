# 🚀 GUIA DE DEPLOY - DOUTORIZZE

## ✅ **Arquivos Prontos para Deploy**

### 📦 **Arquivo Principal:**
- **`doutorizze-deploy-2025-07-26.zip`** - Contém todo o sistema (frontend + backend)

### 📋 **Arquivos de Configuração Criados:**
- **`.env.production`** - Variáveis de ambiente para produção
- **`ecosystem.config.js`** - Configuração do PM2 para o backend
- **`server-setup.sh`** - Script de configuração do servidor

---

## 🎯 **PASSO A PASSO PARA DEPLOY**

### **1. 📤 Upload dos Arquivos**
```bash
# Extrair o arquivo ZIP na sua hospedagem
# Estrutura após extração:
/public_html/          # Frontend (arquivos da pasta dist/)
/api/                  # Backend (arquivos da pasta backend/)
```

### **2. 🗂️ Organização dos Arquivos**

#### **Frontend (Pasta public_html ou www):**
- Copie todos os arquivos da pasta `dist/` para a raiz do seu domínio
- Arquivos: `index.html`, `assets/`, `favicon.svg`

#### **Backend (Subpasta /api):**
- Copie todos os arquivos da pasta `backend/` para `/api/`
- Inclui: `server.js`, `package.json`, `routes/`, `config/`, etc.

### **3. ⚙️ Configuração do Backend**

#### **Instalar Dependências:**
```bash
cd /caminho/para/api
npm install
```

#### **Configurar Variáveis de Ambiente:**
Crie o arquivo `.env` na pasta `/api/` com:
```env
NODE_ENV=production
PORT=3000

# Banco de Dados (suas credenciais)
DB_HOST=localhost
DB_USER=u664361971_doutorizze
DB_PASSWORD=sua_senha_mysql
DB_NAME=u664361971_doutorizze
DB_PORT=3306

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_mude_isso
JWT_EXPIRES_IN=7d

# Parcelamais
PARCELAMAIS_API_KEY=sua_api_key_parcelamais
PARCELAMAIS_SECRET=seu_secret_parcelamais
PARCELAMAIS_BASE_URL=https://api.parcelamais.com.br

# CORS
CORS_ORIGIN=https://seu-dominio.com
```

### **4. 🚀 Iniciar o Backend**

#### **Opção 1: Node.js Simples**
```bash
cd /api
node server.js
```

#### **Opção 2: PM2 (Recomendado)**
```bash
cd /api
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **5. 🌐 Configuração do Servidor Web**

#### **Nginx (se disponível):**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    # Frontend
    location / {
        root /caminho/para/public_html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### **Apache (.htaccess):**
Crie `.htaccess` na raiz:
```apache
RewriteEngine On
RewriteRule ^api/(.*)$ http://localhost:3000/$1 [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

---

## 🔧 **CONFIGURAÇÕES IMPORTANTES**

### **1. Banco de Dados**
- ✅ SQL já importado: `u664361971_doutorizze`
- ✅ Tabelas criadas com dados de exemplo
- ✅ Usuários de teste disponíveis

### **2. Credenciais de Teste**
- **Admin:** `admin@doutorizze.com` / `admin123`
- **Clínica:** `clinica@exemplo.com` / `clinic123`
- **Paciente:** `paciente@exemplo.com` / `patient123`

### **3. URLs do Sistema**
- **Frontend:** `https://seu-dominio.com`
- **Backend API:** `https://seu-dominio.com/api`
- **Admin Dashboard:** `https://seu-dominio.com/admin-dashboard`

---

## 🆘 **SOLUÇÃO DE PROBLEMAS**

### **Erro 500 no Backend:**
```bash
# Verificar logs
cd /api
npm run logs
# ou
pm2 logs
```

### **Erro de Conexão com Banco:**
- Verificar credenciais no `.env`
- Testar conexão: `mysql -u usuario -p banco`

### **Frontend não carrega:**
- Verificar se `index.html` está na raiz
- Verificar configuração do servidor web

### **API não responde:**
- Verificar se o backend está rodando: `pm2 status`
- Verificar porta 3000: `netstat -tulpn | grep 3000`

---

## 📞 **SUPORTE**

### **Verificar Status:**
```bash
# Status do backend
pm2 status

# Logs em tempo real
pm2 logs --lines 50

# Reiniciar se necessário
pm2 restart all
```

### **Health Check:**
Acesse: `https://seu-dominio.com/api/health`

---

## 🎉 **DEPLOY CONCLUÍDO!**

Seu sistema DOUTORIZZE está pronto para produção com:
- ✅ Frontend React otimizado
- ✅ Backend Node.js + Express
- ✅ Banco MySQL configurado
- ✅ Integração Parcelamais
- ✅ Sistema de autenticação
- ✅ Dashboard administrativo
- ✅ 21 páginas funcionais

**🚀 Acesse seu domínio e comece a usar!**