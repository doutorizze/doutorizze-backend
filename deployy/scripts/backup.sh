#!/bin/bash

# DOUTORIZZE - Script de Backup Automatizado
# Este script cria backups automáticos do banco de dados MySQL

set -e

# Configurações
BACKUP_DIR="/var/backups/doutorizze"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="doutorizze_backup_$DATE.sql"
COMPRESSED_FILE="doutorizze_backup_$DATE.sql.gz"
RETENTION_DAYS=30
LOG_FILE="/var/log/doutorizze_backup.log"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Função para log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log_info() {
    log "[INFO] $1"
}

log_success() {
    log "[SUCCESS] $1"
}

log_error() {
    log "[ERROR] $1"
}

log_warning() {
    log "[WARNING] $1"
}

# Carregar variáveis de ambiente
if [[ -f ".env" ]]; then
    source .env
else
    log_error "Arquivo .env não encontrado"
    exit 1
fi

# Verificar variáveis obrigatórias
if [[ -z "$DB_HOST" || -z "$DB_USER" || -z "$DB_PASSWORD" || -z "$DB_NAME" ]]; then
    log_error "Variáveis de banco de dados não configuradas no .env"
    exit 1
fi

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Função para enviar notificação (opcional)
send_notification() {
    local status=$1
    local message=$2
    
    # Webhook para Slack/Discord (opcional)
    if [[ -n "$WEBHOOK_URL" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🗄️ Backup DOUTORIZZE - $status: $message\"}" \
            $WEBHOOK_URL 2>/dev/null || true
    fi
    
    # Email (opcional)
    if command -v mail &> /dev/null && [[ -n "$ADMIN_EMAIL" ]]; then
        echo "$message" | mail -s "Backup DOUTORIZZE - $status" $ADMIN_EMAIL || true
    fi
}

# Função para verificar espaço em disco
check_disk_space() {
    local required_space_mb=1000  # 1GB mínimo
    local available_space_mb=$(df $BACKUP_DIR | awk 'NR==2 {print int($4/1024)}')
    
    if [[ $available_space_mb -lt $required_space_mb ]]; then
        log_error "Espaço insuficiente em disco. Disponível: ${available_space_mb}MB, Necessário: ${required_space_mb}MB"
        send_notification "ERRO" "Espaço insuficiente em disco para backup"
        exit 1
    fi
    
    log_info "Espaço em disco verificado: ${available_space_mb}MB disponível"
}

# Função para testar conexão com banco
test_database_connection() {
    log_info "Testando conexão com banco de dados..."
    
    if mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASSWORD -e "USE $DB_NAME; SELECT 1;" &>/dev/null; then
        log_success "Conexão com banco de dados estabelecida"
    else
        log_error "Falha na conexão com banco de dados"
        send_notification "ERRO" "Falha na conexão com banco de dados"
        exit 1
    fi
}

# Função para criar backup
create_backup() {
    log_info "Iniciando backup do banco de dados..."
    
    # Criar backup com mysqldump
    if mysqldump \
        --host=$DB_HOST \
        --port=$DB_PORT \
        --user=$DB_USER \
        --password=$DB_PASSWORD \
        --single-transaction \
        --routines \
        --triggers \
        --events \
        --add-drop-database \
        --databases $DB_NAME > "$BACKUP_DIR/$BACKUP_FILE"; then
        
        log_success "Backup criado: $BACKUP_FILE"
        
        # Comprimir backup
        log_info "Comprimindo backup..."
        if gzip "$BACKUP_DIR/$BACKUP_FILE"; then
            log_success "Backup comprimido: $COMPRESSED_FILE"
            
            # Verificar integridade do arquivo comprimido
            if gzip -t "$BACKUP_DIR/$COMPRESSED_FILE"; then
                log_success "Integridade do backup verificada"
            else
                log_error "Backup corrompido após compressão"
                send_notification "ERRO" "Backup corrompido após compressão"
                exit 1
            fi
        else
            log_error "Falha na compressão do backup"
            send_notification "ERRO" "Falha na compressão do backup"
            exit 1
        fi
    else
        log_error "Falha na criação do backup"
        send_notification "ERRO" "Falha na criação do backup"
        exit 1
    fi
}

# Função para limpar backups antigos
cleanup_old_backups() {
    log_info "Limpando backups antigos (mais de $RETENTION_DAYS dias)..."
    
    local deleted_count=0
    
    # Encontrar e deletar backups antigos
    while IFS= read -r -d '' file; do
        rm "$file"
        deleted_count=$((deleted_count + 1))
        log_info "Backup antigo removido: $(basename "$file")"
    done < <(find $BACKUP_DIR -name "doutorizze_backup_*.sql.gz" -mtime +$RETENTION_DAYS -print0)
    
    if [[ $deleted_count -gt 0 ]]; then
        log_success "$deleted_count backup(s) antigo(s) removido(s)"
    else
        log_info "Nenhum backup antigo para remover"
    fi
}

# Função para obter estatísticas do backup
get_backup_stats() {
    local file_path="$BACKUP_DIR/$COMPRESSED_FILE"
    local file_size_mb=$(du -m "$file_path" | cut -f1)
    local total_backups=$(ls -1 $BACKUP_DIR/doutorizze_backup_*.sql.gz 2>/dev/null | wc -l)
    
    log_info "Estatísticas do backup:"
    log_info "  - Tamanho: ${file_size_mb}MB"
    log_info "  - Total de backups: $total_backups"
    log_info "  - Localização: $file_path"
    
    # Enviar notificação de sucesso
    send_notification "SUCESSO" "Backup criado com sucesso. Tamanho: ${file_size_mb}MB, Total: $total_backups backups"
}

# Função para upload para cloud (opcional)
upload_to_cloud() {
    if [[ -n "$AWS_S3_BUCKET" && command -v aws &> /dev/null ]]; then
        log_info "Enviando backup para AWS S3..."
        
        if aws s3 cp "$BACKUP_DIR/$COMPRESSED_FILE" "s3://$AWS_S3_BUCKET/backups/" --storage-class STANDARD_IA; then
            log_success "Backup enviado para S3 com sucesso"
        else
            log_warning "Falha no upload para S3"
        fi
    fi
    
    if [[ -n "$GOOGLE_CLOUD_BUCKET" && command -v gsutil &> /dev/null ]]; then
        log_info "Enviando backup para Google Cloud Storage..."
        
        if gsutil cp "$BACKUP_DIR/$COMPRESSED_FILE" "gs://$GOOGLE_CLOUD_BUCKET/backups/"; then
            log_success "Backup enviado para Google Cloud com sucesso"
        else
            log_warning "Falha no upload para Google Cloud"
        fi
    fi
}

# Função para verificar saúde do sistema
check_system_health() {
    log_info "Verificando saúde do sistema..."
    
    # Verificar uso de CPU
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    log_info "Uso de CPU: ${cpu_usage}%"
    
    # Verificar uso de memória
    local mem_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    log_info "Uso de memória: ${mem_usage}%"
    
    # Verificar uso de disco
    local disk_usage=$(df $BACKUP_DIR | awk 'NR==2 {print $5}' | cut -d'%' -f1)
    log_info "Uso de disco: ${disk_usage}%"
    
    # Alertas
    if [[ $(echo "$cpu_usage > 80" | bc -l) -eq 1 ]]; then
        log_warning "Alto uso de CPU: ${cpu_usage}%"
    fi
    
    if [[ $(echo "$mem_usage > 80" | bc -l) -eq 1 ]]; then
        log_warning "Alto uso de memória: ${mem_usage}%"
    fi
    
    if [[ $disk_usage -gt 80 ]]; then
        log_warning "Alto uso de disco: ${disk_usage}%"
    fi
}

# Função principal
main() {
    log_info "=== Iniciando backup do DOUTORIZZE ==="
    
    # Verificações pré-backup
    check_disk_space
    test_database_connection
    check_system_health
    
    # Criar backup
    create_backup
    
    # Pós-backup
    get_backup_stats
    cleanup_old_backups
    upload_to_cloud
    
    log_success "=== Backup concluído com sucesso ==="
}

# Função para restaurar backup
restore_backup() {
    local backup_file=$1
    
    if [[ -z "$backup_file" ]]; then
        echo "Uso: $0 restore <arquivo_backup.sql.gz>"
        exit 1
    fi
    
    if [[ ! -f "$backup_file" ]]; then
        log_error "Arquivo de backup não encontrado: $backup_file"
        exit 1
    fi
    
    log_warning "ATENÇÃO: Esta operação irá sobrescrever o banco de dados atual!"
    echo -n "Tem certeza que deseja continuar? (digite 'CONFIRMAR'): "
    read confirmation
    
    if [[ "$confirmation" != "CONFIRMAR" ]]; then
        log_info "Operação cancelada"
        exit 0
    fi
    
    log_info "Restaurando backup: $backup_file"
    
    # Descomprimir e restaurar
    if zcat "$backup_file" | mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASSWORD; then
        log_success "Backup restaurado com sucesso"
        send_notification "SUCESSO" "Backup restaurado: $(basename $backup_file)"
    else
        log_error "Falha na restauração do backup"
        send_notification "ERRO" "Falha na restauração do backup"
        exit 1
    fi
}

# Função para listar backups
list_backups() {
    log_info "Backups disponíveis em $BACKUP_DIR:"
    
    if ls -1 $BACKUP_DIR/doutorizze_backup_*.sql.gz 2>/dev/null; then
        echo
        echo "Para restaurar um backup, use:"
        echo "$0 restore /caminho/para/backup.sql.gz"
    else
        log_info "Nenhum backup encontrado"
    fi
}

# Verificar argumentos da linha de comando
case "${1:-backup}" in
    "backup")
        main
        ;;
    "restore")
        restore_backup "$2"
        ;;
    "list")
        list_backups
        ;;
    "test")
        test_database_connection
        ;;
    *)
        echo "Uso: $0 [backup|restore|list|test]"
        echo "  backup  - Criar backup (padrão)"
        echo "  restore - Restaurar backup"
        echo "  list    - Listar backups"
        echo "  test    - Testar conexão"
        exit 1
        ;;
esac