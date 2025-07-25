#!/bin/bash
# auto_backup.sh - Script para crear backups automáticos de la base de datos editorial
# Autor: Sistema Editorial
# Fecha: $(date +%Y-%m-%d)

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} ✅ $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} ⚠️  $1"
}

print_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} ❌ $1"
}

# Configuración
DB_NAME="editorialdata"
DB_USER="markitos"
BACKUP_DIR="/home/$USER/backups"
MAX_BACKUPS=10  # Mantener solo los últimos 10 backups

# Crear directorio de backups
mkdir -p "$BACKUP_DIR"

echo "=================================================="
echo "🗄️  SISTEMA DE BACKUP AUTOMÁTICO - BASE DE DATOS"
echo "=================================================="

# Verificar si PostgreSQL está corriendo
if ! systemctl is-active --quiet postgresql; then
    print_error "PostgreSQL no está corriendo. No se puede crear backup."
    exit 1
fi

# Crear backup
BACKUP_FILE="$BACKUP_DIR/editorialdata_backup_$(date +%Y%m%d_%H%M%S).sql"
print_status "Creando backup de la base de datos '$DB_NAME'..."

# Intentar primero con el usuario markitos, si falla usar postgres
if sudo -u markitos pg_dump "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null; then
    print_success "Backup creado con usuario markitos"
elif sudo -u postgres pg_dump "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null; then
    print_success "Backup creado con usuario postgres"
elif sudo -u postgres pg_dump "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null; then
    print_success "Backup creado con usuario postgres"
    print_success "Backup creado: $BACKUP_FILE"
    
    # Verificar tamaño del backup
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    print_status "Tamaño del backup: $BACKUP_SIZE"
    
    # Verificar que el backup no está vacío
    if [ -s "$BACKUP_FILE" ]; then
        print_success "Backup verificado correctamente"
        
        # Comprimir el backup para ahorrar espacio
        print_status "Comprimiendo backup..."
        gzip "$BACKUP_FILE"
        COMPRESSED_FILE="${BACKUP_FILE}.gz"
        COMPRESSED_SIZE=$(du -h "$COMPRESSED_FILE" | cut -f1)
        print_success "Backup comprimido: ${COMPRESSED_FILE} ($COMPRESSED_SIZE)"
        
        # Limpiar backups antiguos
        print_status "Limpiando backups antiguos (manteniendo últimos $MAX_BACKUPS)..."
        cd "$BACKUP_DIR"
        ls -t editorialdata_backup_*.sql.gz 2>/dev/null | tail -n +$((MAX_BACKUPS + 1)) | xargs rm -f
        
        REMAINING_BACKUPS=$(ls editorialdata_backup_*.sql.gz 2>/dev/null | wc -l)
        print_success "Backups actuales: $REMAINING_BACKUPS"
        
    else
        print_error "El backup está vacío. Eliminando archivo inválido."
        rm -f "$BACKUP_FILE"
        exit 1
    fi
    
else
    print_error "Error al crear backup con ambos métodos (markitos y postgres)"
    exit 1
fi

# Mostrar estadísticas de backups
echo ""
echo "📊 ESTADÍSTICAS DE BACKUPS:"
echo "----------------------------"
ls -lah "$BACKUP_DIR"/editorialdata_backup_*.sql.gz 2>/dev/null | tail -5 || print_warning "No hay backups anteriores"

echo ""
print_success "🟢 Backup completado exitosamente"

# Si se ejecuta con parámetro 'install', configurar cron job
if [ "$1" = "install" ]; then
    echo ""
    print_status "🕐 Configurando backup automático diario..."
    
    # Crear entrada en crontab
    CRON_ENTRY="0 2 * * * $(readlink -f "$0") >/dev/null 2>&1"
    
    # Verificar si ya existe la entrada
    if crontab -l 2>/dev/null | grep -F "$(readlink -f "$0")" >/dev/null; then
        print_warning "El backup automático ya está configurado"
    else
        # Agregar al crontab
        (crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -
        print_success "Backup automático configurado para ejecutarse diariamente a las 2:00 AM"
    fi
    
    print_status "Para ver los trabajos programados: crontab -l"
    print_status "Para desinstalar: crontab -e (y eliminar la línea manualmente)"
fi
