#!/bin/bash

# DOUTORIZZE - Configuração de Cron Jobs
# Este script configura backups automáticos e tarefas de manutenção

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Obter diretório atual do script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

log_info "Configurando cron jobs para DOUTORIZZE"
log_info "Diretório do backend: $BACKEND_DIR"

# Verificar se os scripts existem
if [[ ! -f "$SCRIPT_DIR/backup.sh" ]]; then
    log_error "Script de backup não encontrado: $SCRIPT_DIR/backup.sh"
    exit 1
fi

# Tornar scripts executáveis
chmod +x "$SCRIPT_DIR/backup.sh"
chmod +x "$SCRIPT_DIR/cleanup.sh" 2>/dev/null || true
chmod +x "$SCRIPT_DIR/health-check.sh" 2>/dev/null || true

log_success "Scripts tornados executáveis"

# Função para adicionar cron job
add_cron_job() {
    local schedule="$1"
    local command="$2"
    local description="$3"
    
    # Verificar se o job já existe
    if crontab -l 2>/dev/null | grep -q "$command"; then
        log_warning "Cron job já existe: $description"
        return 0
    fi
    
    # Adicionar novo job
    (crontab -l 2>/dev/null; echo "$schedule $command # $description") | crontab -
    log_success "Cron job adicionado: $description"
}

# Função para remover cron jobs antigos
remove_old_cron_jobs() {
    log_info "Removendo cron jobs antigos do DOUTORIZZE..."
    
    # Remover jobs que contenham 'doutorizze' ou 'backup.sh'
    crontab -l 2>/dev/null | grep -v -i 'doutorizze\|backup.sh' | crontab - 2>/dev/null || true
    
    log_success "Cron jobs antigos removidos"
}

# Função para configurar logrotate
setup_logrotate() {
    log_info "Configurando logrotate..."
    
    local logrotate_config="/etc/logrotate.d/doutorizze"
    
    sudo tee $logrotate_config > /dev/null << EOF
# DOUTORIZZE - Rotação de logs
$BACKEND_DIR/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}

/var/log/doutorizze_backup.log {
    weekly
    missingok
    rotate 12
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF
    
    log_success "Logrotate configurado"
}

# Função para criar script de limpeza
create_cleanup_script() {
    log_info "Criando script de limpeza..."
    
    cat > "$SCRIPT_DIR/cleanup.sh" << 'EOF'
#!/bin/bash

# DOUTORIZZE - Script de Limpeza
# Remove arquivos temporários e otimiza o sistema

set -e

# Diretório do backend
BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a /var/log/doutorizze_cleanup.log
}

log "Iniciando limpeza do sistema DOUTORIZZE"

# Limpar logs antigos do PM2
if command -v pm2 &> /dev/null; then
    pm2 flush
    log "Logs do PM2 limpos"
fi

# Limpar cache do npm
if command -v npm &> /dev/null; then
    npm cache clean --force
    log "Cache do npm limpo"
fi

# Limpar arquivos temporários
find /tmp -name "*doutorizze*" -type f -mtime +1 -delete 2>/dev/null || true
log "Arquivos temporários limpos"

# Otimizar banco de dados
if [[ -f "$BACKEND_DIR/.env" ]]; then
    source "$BACKEND_DIR/.env"
    
    if [[ -n "$DB_HOST" && -n "$DB_USER" && -n "$DB_PASSWORD" && -n "$DB_NAME" ]]; then
        mysql -h$DB_HOST -u$DB_USER -p$DB_PASSWORD -e "OPTIMIZE TABLE $DB_NAME.users, $DB_NAME.clinics, $DB_NAME.appointments, $DB_NAME.loan_requests, $DB_NAME.notifications, $DB_NAME.webhook_logs;" 2>/dev/null || true
        log "Tabelas do banco otimizadas"
    fi
fi

# Verificar espaço em disco
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | cut -d'%' -f1)
if [[ $DISK_USAGE -gt 80 ]]; then
    log "ALERTA: Uso de disco alto: ${DISK_USAGE}%"
fi

log "Limpeza concluída"
EOF
    
    chmod +x "$SCRIPT_DIR/cleanup.sh"
    log_success "Script de limpeza criado"
}

# Função para criar script de health check
create_health_check_script() {
    log_info "Criando script de health check..."
    
    cat > "$SCRIPT_DIR/health-check.sh" << 'EOF'
#!/bin/bash

# DOUTORIZZE - Health Check
# Verifica se a aplicação está funcionando corretamente

set -e

# Configurações
API_URL="http://localhost:3001"
LOG_FILE="/var/log/doutorizze_health.log"
WEBHOOK_URL="${HEALTH_CHECK_WEBHOOK_URL:-}"
ADMIN_EMAIL="${ADMIN_EMAIL:-}"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

send_alert() {
    local message="$1"
    
    # Webhook
    if [[ -n "$WEBHOOK_URL" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚨 DOUTORIZZE ALERT: $message\"}" \
            "$WEBHOOK_URL" 2>/dev/null || true
    fi
    
    # Email
    if command -v mail &> /dev/null && [[ -n "$ADMIN_EMAIL" ]]; then
        echo "$message" | mail -s "DOUTORIZZE Health Check Alert" "$ADMIN_EMAIL" || true
    fi
}

# Verificar se a aplicação está rodando
if ! pm2 list | grep -q "doutorizze-api.*online"; then
    log "ERRO: Aplicação não está rodando"
    send_alert "Aplicação DOUTORIZZE não está rodando"
    
    # Tentar reiniciar
    log "Tentando reiniciar aplicação..."
    pm2 restart doutorizze-api || pm2 start ecosystem.config.js
    
    sleep 10
    
    if pm2 list | grep -q "doutorizze-api.*online"; then
        log "Aplicação reiniciada com sucesso"
        send_alert "Aplicação DOUTORIZZE reiniciada automaticamente"
    else
        log "ERRO: Falha ao reiniciar aplicação"
        send_alert "CRÍTICO: Falha ao reiniciar aplicação DOUTORIZZE"
        exit 1
    fi
fi

# Verificar health endpoint
if ! curl -f "$API_URL/health" &>/dev/null; then
    log "ERRO: Health endpoint não responde"
    send_alert "Health endpoint do DOUTORIZZE não responde"
    exit 1
fi

# Verificar banco de dados
if [[ -f "$(dirname "${BASH_SOURCE[0]}")/../.env" ]]; then
    source "$(dirname "${BASH_SOURCE[0]}")/../.env"
    
    if ! mysql -h$DB_HOST -u$DB_USER -p$DB_PASSWORD -e "SELECT 1 FROM $DB_NAME.users LIMIT 1;" &>/dev/null; then
        log "ERRO: Banco de dados não responde"
        send_alert "Banco de dados do DOUTORIZZE não responde"
        exit 1
    fi
fi

# Verificar uso de recursos
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 | cut -d'.' -f1)
MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | cut -d'%' -f1)

if [[ $CPU_USAGE -gt 90 ]]; then
    log "ALERTA: Alto uso de CPU: ${CPU_USAGE}%"
    send_alert "Alto uso de CPU: ${CPU_USAGE}%"
fi

if [[ $MEM_USAGE -gt 90 ]]; then
    log "ALERTA: Alto uso de memória: ${MEM_USAGE}%"
    send_alert "Alto uso de memória: ${MEM_USAGE}%"
fi

if [[ $DISK_USAGE -gt 90 ]]; then
    log "ALERTA: Alto uso de disco: ${DISK_USAGE}%"
    send_alert "Alto uso de disco: ${DISK_USAGE}%"
fi

log "Health check passou - CPU: ${CPU_USAGE}%, MEM: ${MEM_USAGE}%, DISK: ${DISK_USAGE}%"
EOF
    
    chmod +x "$SCRIPT_DIR/health-check.sh"
    log_success "Script de health check criado"
}

# Função principal
main() {
    echo "🕐 Configuração de Cron Jobs - DOUTORIZZE"
    echo "========================================"
    echo
    echo "Selecione o tipo de configuração:"
    echo "1) Configuração completa (recomendado)"
    echo "2) Apenas backup diário"
    echo "3) Apenas health check"
    echo "4) Remover todos os cron jobs"
    echo "5) Listar cron jobs atuais"
    echo -n "Opção [1-5]: "
    read SETUP_TYPE
    
    case $SETUP_TYPE in
        1)
            log_info "Configuração completa selecionada"
            
            # Remover jobs antigos
            remove_old_cron_jobs
            
            # Criar scripts auxiliares
            create_cleanup_script
            create_health_check_script
            
            # Configurar logrotate
            setup_logrotate
            
            # Adicionar cron jobs
            add_cron_job "0 2 * * *" "cd $BACKEND_DIR && $SCRIPT_DIR/backup.sh" "DOUTORIZZE Daily Backup"
            add_cron_job "*/5 * * * *" "$SCRIPT_DIR/health-check.sh" "DOUTORIZZE Health Check"
            add_cron_job "0 3 * * 0" "$SCRIPT_DIR/cleanup.sh" "DOUTORIZZE Weekly Cleanup"
            add_cron_job "0 1 1 * *" "cd $BACKEND_DIR && $SCRIPT_DIR/backup.sh && echo 'Monthly backup completed'" "DOUTORIZZE Monthly Backup"
            
            log_success "Configuração completa concluída!"
            ;;
        2)
            add_cron_job "0 2 * * *" "cd $BACKEND_DIR && $SCRIPT_DIR/backup.sh" "DOUTORIZZE Daily Backup"
            log_success "Backup diário configurado!"
            ;;
        3)
            create_health_check_script
            add_cron_job "*/5 * * * *" "$SCRIPT_DIR/health-check.sh" "DOUTORIZZE Health Check"
            log_success "Health check configurado!"
            ;;
        4)
            log_warning "Removendo todos os cron jobs do DOUTORIZZE..."
            crontab -l 2>/dev/null | grep -v -i 'doutorizze' | crontab - 2>/dev/null || true
            log_success "Cron jobs removidos!"
            ;;
        5)
            log_info "Cron jobs atuais:"
            crontab -l 2>/dev/null | grep -i 'doutorizze' || echo "Nenhum cron job do DOUTORIZZE encontrado"
            ;;
        *)
            log_error "Opção inválida"
            exit 1
            ;;
    esac
    
    echo
    log_info "📋 Cron jobs configurados:"
    crontab -l 2>/dev/null | grep -i 'doutorizze' || echo "Nenhum cron job encontrado"
    
    echo
    log_info "📁 Arquivos criados:"
    echo "   - $SCRIPT_DIR/backup.sh (backup automático)"
    echo "   - $SCRIPT_DIR/cleanup.sh (limpeza semanal)"
    echo "   - $SCRIPT_DIR/health-check.sh (monitoramento)"
    echo "   - /etc/logrotate.d/doutorizze (rotação de logs)"
    
    echo
    log_info "📊 Logs disponíveis:"
    echo "   - /var/log/doutorizze_backup.log"
    echo "   - /var/log/doutorizze_health.log"
    echo "   - /var/log/doutorizze_cleanup.log"
    
    echo
    log_success "✅ Configuração de cron jobs concluída!"
}

# Executar função principal
main "$@"