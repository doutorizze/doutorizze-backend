#!/bin/bash

# Script de configuração do servidor para DOUTORIZZE
echo "🚀 Configurando servidor para DOUTORIZZE..."

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Instalar MySQL
sudo apt install -y mysql-server

# Configurar MySQL
sudo mysql -e "CREATE DATABASE IF NOT EXISTS doutorizze_db;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'doutorizze_user'@'localhost' IDENTIFIED BY 'senha_segura';"
sudo mysql -e "GRANT ALL PRIVILEGES ON doutorizze_db.* TO 'doutorizze_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Instalar Nginx
sudo apt install -y nginx

# Configurar firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw --force enable

# Criar diretórios
sudo mkdir -p /var/www/api
sudo mkdir -p /var/www/api/logs
sudo chown -R $USER:$USER /var/www/api

echo "✅ Servidor configurado com sucesso!"
echo "📋 Próximos passos:"
echo "1. Faça upload dos arquivos do backend"
echo "2. Execute: cd /var/www/api && npm install"
echo "3. Execute: npm run build"
echo "4. Importe o banco: mysql -u doutorizze_user -p doutorizze_db < schema.sql"
echo "5. Inicie com PM2: pm2 start ecosystem.config.js"
