#!/bin/bash

# DOUTORIZZE Backend - Script de Instalação Automatizada
# Este script configura automaticamente o backend em produção

set -e

echo "🚀 DOUTORIZZE Backend - Instalação Automatizada"
echo "================================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está rodando como root
if [[ $EUID -eq 0 ]]; then
   log_error "Este script não deve ser executado como root"
   exit 1
fi

# Verificar sistema operacional
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
else
    log_error "Sistema operacional não suportado: $OSTYPE"
    exit 1
fi

log_info "Sistema detectado: $OS"

# Função para instalar Node.js
install_nodejs() {
    log_info "Verificando Node.js..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        log_success "Node.js já instalado: $NODE_VERSION"
    else
        log_info "Instalando Node.js..."
        
        if [[ "$OS" == "linux" ]]; then
            # Instalar Node.js via NodeSource
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif [[ "$OS" == "macos" ]]; then
            # Instalar via Homebrew
            if command -v brew &> /dev/null; then
                brew install node
            else
                log_error "Homebrew não encontrado. Instale manualmente o Node.js"
                exit 1
            fi
        fi
        
        log_success "Node.js instalado com sucesso"
    fi
}

# Função para instalar MySQL
install_mysql() {
    log_info "Verificando MySQL..."
    
    if command -v mysql &> /dev/null; then
        MYSQL_VERSION=$(mysql --version)
        log_success "MySQL já instalado: $MYSQL_VERSION"
    else
        log_info "Instalando MySQL..."
        
        if [[ "$OS" == "linux" ]]; then
            sudo apt-get update
            sudo apt-get install -y mysql-server
            sudo systemctl start mysql
            sudo systemctl enable mysql
        elif [[ "$OS" == "macos" ]]; then
            brew install mysql
            brew services start mysql
        fi
        
        log_success "MySQL instalado com sucesso"
        log_warning "Configure a senha do root do MySQL: sudo mysql_secure_installation"
    fi
}

# Função para instalar PM2
install_pm2() {
    log_info "Verificando PM2..."
    
    if command -v pm2 &> /dev/null; then
        PM2_VERSION=$(pm2 --version)
        log_success "PM2 já instalado: $PM2_VERSION"
    else
        log_info "Instalando PM2..."
        sudo npm install -g pm2
        log_success "PM2 instalado com sucesso"
    fi
}

# Função para configurar o banco de dados
setup_database() {
    log_info "Configurando banco de dados..."
    
    # Solicitar credenciais do MySQL
    echo -n "Digite a senha do root do MySQL: "
    read -s MYSQL_ROOT_PASSWORD
    echo
    
    # Testar conexão
    if mysql -u root -p$MYSQL_ROOT_PASSWORD -e "SELECT 1;" &> /dev/null; then
        log_success "Conexão com MySQL estabelecida"
    else
        log_error "Falha na conexão com MySQL. Verifique a senha"
        exit 1
    fi
    
    # Executar script SQL
    log_info "Executando script de criação do banco..."
    mysql -u root -p$MYSQL_ROOT_PASSWORD < database/doutorizze.sql
    
    log_success "Banco de dados configurado com sucesso"
}

# Função para configurar variáveis de ambiente
setup_environment() {
    log_info "Configurando variáveis de ambiente..."
    
    if [[ ! -f .env ]]; then
        cp .env.example .env
        log_info "Arquivo .env criado a partir do .env.example"
        
        # Gerar JWT secret aleatório
        JWT_SECRET=$(openssl rand -base64 32)
        sed -i "s/sua_chave_jwt_super_secreta_aqui/$JWT_SECRET/g" .env
        
        log_warning "Configure as variáveis no arquivo .env antes de continuar"
        log_warning "Especialmente: DB_PASSWORD, PARCELAMAIS_CLIENT_ID, PARCELAMAIS_CLIENT_SECRET"
        
        echo -n "Pressione Enter após configurar o .env..."
        read
    else
        log_success "Arquivo .env já existe"
    fi
}

# Função para instalar dependências
install_dependencies() {
    log_info "Instalando dependências do projeto..."
    npm install
    log_success "Dependências instaladas com sucesso"
}

# Função para configurar PM2
setup_pm2() {
    log_info "Configurando PM2..."
    
    # Criar arquivo de configuração do PM2
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'doutorizze-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024'
  }]
};
EOF
    
    # Criar diretório de logs
    mkdir -p logs
    
    log_success "Configuração do PM2 criada"
}

# Função para configurar Nginx
setup_nginx() {
    log_info "Configurando Nginx..."
    
    if command -v nginx &> /dev/null; then
        log_success "Nginx já instalado"
    else
        if [[ "$OS" == "linux" ]]; then
            sudo apt-get install -y nginx
        elif [[ "$OS" == "macos" ]]; then
            brew install nginx
        fi
        log_success "Nginx instalado"
    fi
    
    # Solicitar domínio
    echo -n "Digite o domínio da API (ex: api.doutorizze.com): "
    read API_DOMAIN
    
    # Criar configuração do Nginx
    NGINX_CONFIG="/etc/nginx/sites-available/doutorizze-api"
    
    sudo tee $NGINX_CONFIG > /dev/null << EOF
server {
    listen 80;
    server_name $API_DOMAIN;
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    
    location / {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:3001/health;
        access_log off;
    }
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
EOF
    
    # Ativar site
    sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
    
    # Testar configuração
    sudo nginx -t
    
    # Recarregar Nginx
    sudo systemctl reload nginx
    
    log_success "Nginx configurado para $API_DOMAIN"
    log_info "Para SSL, execute: sudo certbot --nginx -d $API_DOMAIN"
}

# Função para iniciar aplicação
start_application() {
    log_info "Iniciando aplicação..."
    
    # Parar PM2 se estiver rodando
    pm2 delete doutorizze-api 2>/dev/null || true
    
    # Iniciar com PM2
    pm2 start ecosystem.config.js
    
    # Configurar auto-start
    pm2 startup
    pm2 save
    
    log_success "Aplicação iniciada com sucesso"
    
    # Mostrar status
    pm2 status
}

# Função para testar instalação
test_installation() {
    log_info "Testando instalação..."
    
    # Aguardar aplicação iniciar
    sleep 5
    
    # Testar health check
    if curl -f http://localhost:3001/health &> /dev/null; then
        log_success "Health check passou"
    else
        log_error "Health check falhou"
        return 1
    fi
    
    # Testar login
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@doutorizze.com","password":"admin123"}')
    
    if echo $LOGIN_RESPONSE | grep -q "token"; then
        log_success "Login de teste passou"
    else
        log_error "Login de teste falhou"
        return 1
    fi
    
    log_success "Todos os testes passaram!"
}

# Função principal
main() {
    log_info "Iniciando instalação do DOUTORIZZE Backend..."
    
    # Verificar se estamos no diretório correto
    if [[ ! -f "package.json" ]]; then
        log_error "Execute este script no diretório do backend"
        exit 1
    fi
    
    # Menu de opções
    echo
    echo "Selecione o tipo de instalação:"
    echo "1) Instalação completa (recomendado para novo servidor)"
    echo "2) Apenas aplicação (Node.js e MySQL já instalados)"
    echo "3) Apenas banco de dados"
    echo "4) Apenas configuração"
    echo -n "Opção [1-4]: "
    read INSTALL_TYPE
    
    case $INSTALL_TYPE in
        1)
            install_nodejs
            install_mysql
            install_pm2
            setup_database
            install_dependencies
            setup_environment
            setup_pm2
            setup_nginx
            start_application
            test_installation
            ;;
        2)
            install_dependencies
            setup_environment
            setup_pm2
            start_application
            test_installation
            ;;
        3)
            setup_database
            ;;
        4)
            setup_environment
            setup_pm2
            ;;
        *)
            log_error "Opção inválida"
            exit 1
            ;;
    esac
    
    echo
    log_success "🎉 Instalação concluída com sucesso!"
    echo
    echo "📋 Próximos passos:"
    echo "   1. Configure SSL: sudo certbot --nginx -d seu-dominio.com"
    echo "   2. Configure backup automático do banco"
    echo "   3. Configure monitoramento"
    echo "   4. Teste todas as funcionalidades"
    echo
    echo "📊 Comandos úteis:"
    echo "   pm2 status          - Status da aplicação"
    echo "   pm2 logs            - Ver logs"
    echo "   pm2 restart all     - Reiniciar aplicação"
    echo "   pm2 monit           - Monitor em tempo real"
    echo
    echo "🌐 URLs:"
    echo "   Health Check: http://localhost:3001/health"
    echo "   API Docs: http://localhost:3001/api"
    echo
}

# Executar função principal
main "$@"