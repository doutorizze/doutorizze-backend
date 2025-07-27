# 🚀 INSTALAÇÃO DO DOUTORIZZE NA HOSPEDAGEM

## ❌ **PROBLEMA IDENTIFICADO**

O erro que você está enfrentando acontece porque o arquivo SQL original tenta criar um usuário MySQL:

```sql
CREATE USER IF NOT EXISTS 'doutorizze_app'@'localhost' IDENTIFIED BY 'D0ut0r1zz3_S3cur3_P4ss!';
```

**Em hospedagens compartilhadas, não é permitido criar usuários via SQL!**

## ✅ **SOLUÇÃO**

Criei um arquivo SQL corrigido especificamente para hospedagem compartilhada:

📁 **Arquivo:** `backend/database/doutorizze_hosting.sql`

### 🔧 **Principais Correções:**

1. ❌ **Removido:** Comandos de criação de usuário
2. ❌ **Removido:** Comandos GRANT e FLUSH PRIVILEGES
3. ✅ **Adicionado:** `USE u664361971_doutorizze;` (seu banco)
4. ✅ **Adicionado:** `CREATE TABLE IF NOT EXISTS` (evita erros)
5. ✅ **Adicionado:** `INSERT IGNORE` (evita duplicatas)
6. ✅ **Adicionado:** `CREATE OR REPLACE VIEW` (atualiza views)
7. ✅ **Adicionado:** `CREATE INDEX IF NOT EXISTS` (evita erros)

## 📋 **PASSO A PASSO PARA INSTALAÇÃO**

### **1. Acesse o phpMyAdmin da sua hospedagem**
- Entre no painel da sua hospedagem
- Acesse o phpMyAdmin
- Selecione o banco `u664361971_doutorizze`

### **2. Execute o SQL corrigido**
- Clique na aba "SQL"
- Copie todo o conteúdo do arquivo `doutorizze_hosting.sql`
- Cole no campo de texto
- Clique em "Executar"

### **3. Verifique a instalação**
Após executar, você deve ver:
- ✅ 6 tabelas criadas
- ✅ 2 views criadas
- ✅ Dados de exemplo inseridos
- ✅ Mensagem de sucesso

## 🗃️ **ESTRUTURA DO BANCO CRIADA**

### **📊 Tabelas:**
1. `users` - Usuários do sistema
2. `clinics` - Clínicas cadastradas
3. `appointments` - Agendamentos
4. `loan_requests` - Solicitações de empréstimo
5. `notifications` - Notificações
6. `webhook_logs` - Logs de webhooks

### **👁️ Views:**
1. `clinic_stats` - Estatísticas das clínicas
2. `admin_dashboard` - Dashboard administrativo

### **🔐 Usuários de Teste Criados:**

| Tipo | Email | Senha | Descrição |
|------|-------|-------|-----------|
| **Admin** | admin@doutorizze.com | admin123 | Administrador Master |
| **Clínica** | clinica@exemplo.com | clinic123 | Dr. João Silva |
| **Paciente** | paciente@exemplo.com | patient123 | Maria Santos |

## ⚙️ **CONFIGURAÇÃO DO BACKEND**

Após instalar o banco, configure o arquivo `.env` do backend:

```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_USER=u664361971_doutorizze
DB_PASSWORD=sua_senha_do_banco
DB_NAME=u664361971_doutorizze
DB_PORT=3306

# Configurações da Aplicação
PORT=3000
JWT_SECRET=seu_jwt_secret_super_seguro
NODE_ENV=production

# Configurações do Parcelamais
PARCELAMAIS_CLIENT_ID=seu_client_id
PARCELAMAIS_CLIENT_SECRET=seu_client_secret
PARCELAMAIS_SANDBOX=false
```

## 🚀 **DEPLOY DO SISTEMA**

### **Frontend (React):**
1. Execute: `npm run build`
2. Faça upload da pasta `dist/` para o domínio principal

### **Backend (Node.js):**
1. Faça upload da pasta `backend/` para uma subpasta
2. Configure as variáveis de ambiente
3. Execute: `npm install --production`
4. Inicie: `npm start`

## 🔍 **VERIFICAÇÃO PÓS-INSTALAÇÃO**

### **Teste o banco:**
```sql
-- Verificar tabelas criadas
SHOW TABLES;

-- Verificar usuários
SELECT * FROM users;

-- Verificar clínicas
SELECT * FROM clinics;

-- Verificar estatísticas
SELECT * FROM admin_dashboard;
```

### **Teste a aplicação:**
1. ✅ Acesse o frontend
2. ✅ Faça login com admin@doutorizze.com / admin123
3. ✅ Acesse o painel administrativo
4. ✅ Teste as funcionalidades

## 🆘 **PROBLEMAS COMUNS**

### **Erro de JSON:**
- Alguns provedores não suportam tipo JSON
- Substitua `JSON` por `TEXT` se necessário

### **Erro de Foreign Key:**
- Verifique se InnoDB está habilitado
- Execute: `SET foreign_key_checks = 0;` antes do script

### **Erro de Charset:**
- Certifique-se que o banco usa `utf8mb4`
- Configure no painel da hospedagem

## 📞 **SUPORTE**

Se ainda tiver problemas:
1. Verifique os logs do phpMyAdmin
2. Teste executar o SQL em partes menores
3. Entre em contato com o suporte da hospedagem

---

**✅ Agora você pode instalar o DOUTORIZZE sem erros na sua hospedagem!**