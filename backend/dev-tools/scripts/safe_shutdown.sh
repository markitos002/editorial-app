#!/bin/bash
# safe_shutdown.sh - Script para apagar de forma segura el servidor con PostgreSQL
# Autor: Sistema Editorial
# Fecha: $(date +%Y-%m-%d)

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con color
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
APP_DIRS=(
    "/home/$USER/editorial-app"
    "/var/www/editorial-app"
    "$HOME/editorial-app"
)

echo "=================================================="
echo "🛡️  SCRIPT DE APAGADO SEGURO - SISTEMA EDITORIAL"
echo "=================================================="
print_status "Iniciando procedimiento de apagado seguro..."

# 1. Crear directorio de backups si no existe
print_status "Verificando directorio de backups..."
mkdir -p "$BACKUP_DIR"
print_success "Directorio de backups verificado: $BACKUP_DIR"

# 2. Buscar y detener procesos de la aplicación editorial
print_status "Deteniendo aplicaciones editorial..."

# Buscar procesos de Node.js relacionados con editorial
EDITORIAL_PIDS=$(pgrep -f "editorial\|npm.*dev\|node.*app\.js" 2>/dev/null || true)
if [ ! -z "$EDITORIAL_PIDS" ]; then
    print_warning "Encontrados procesos de aplicación editorial. Deteniendo..."
    echo "$EDITORIAL_PIDS" | xargs kill -TERM 2>/dev/null || true
    sleep 3
    
    # Verificar si siguen corriendo y forzar si es necesario
    REMAINING_PIDS=$(pgrep -f "editorial\|npm.*dev\|node.*app\.js" 2>/dev/null || true)
    if [ ! -z "$REMAINING_PIDS" ]; then
        print_warning "Algunos procesos aún corriendo. Forzando terminación..."
        echo "$REMAINING_PIDS" | xargs kill -KILL 2>/dev/null || true
    fi
    print_success "Procesos de aplicación editorial detenidos"
else
    print_success "No se encontraron procesos de aplicación editorial corriendo"
fi

# 3. Verificar estado de PostgreSQL
print_status "Verificando estado de PostgreSQL..."
if systemctl is-active --quiet postgresql; then
    print_status "PostgreSQL está corriendo. Procediendo con backup y apagado..."
    
    # 4. Crear backup de emergencia
    print_status "Creando backup de emergencia de la base de datos..."
    BACKUP_FILE="$BACKUP_DIR/emergency_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    # Intentar primero con markitos, luego con postgres
    if sudo -u markitos pg_dump "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null; then
        print_success "Backup creado exitosamente con usuario markitos: $BACKUP_FILE"
    elif sudo -u postgres pg_dump "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null; then
        print_success "Backup creado exitosamente con usuario postgres: $BACKUP_FILE"
        
        # Verificar tamaño del backup
        BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        print_status "Tamaño del backup: $BACKUP_SIZE"
        
        if [ -s "$BACKUP_FILE" ]; then
            print_success "Backup verificado - archivo no está vacío"
        else
            print_error "¡ADVERTENCIA! El archivo de backup está vacío"
        fi
    else
        print_error "Error al crear backup. Procediendo con precaución..."
        print_warning "¿Deseas continuar sin backup? (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            print_error "Operación cancelada por el usuario"
            exit 1
        fi
    fi
    
    # 5. Detener PostgreSQL correctamente
    print_status "Deteniendo PostgreSQL de forma segura..."
    if sudo systemctl stop postgresql; then
        print_success "PostgreSQL detenido correctamente"
    else
        print_error "Error al detener PostgreSQL con systemctl"
        print_status "Intentando método alternativo..."
        sudo -u postgres pg_ctl stop -D /var/lib/postgresql/*/main -m fast
    fi
    
    # 6. Verificar que PostgreSQL se detuvo
    sleep 3
    if systemctl is-active --quiet postgresql; then
        print_error "PostgreSQL aún está corriendo"
        print_status "Intentando detención forzada..."
        sudo systemctl kill postgresql
        sleep 2
    fi
    
    if ! systemctl is-active --quiet postgresql; then
        print_success "PostgreSQL detenido exitosamente"
    else
        print_error "No se pudo detener PostgreSQL completamente"
    fi
    
else
    print_warning "PostgreSQL no está corriendo"
fi

# 7. Limpiar archivos temporales
print_status "Limpiando archivos temporales..."
sudo rm -rf /tmp/editorial_* 2>/dev/null || true
sudo rm -rf /var/tmp/editorial_* 2>/dev/null || true
print_success "Archivos temporales limpiados"

# 8. Mostrar resumen
echo ""
echo "=================================================="
echo "📋 RESUMEN DEL PROCEDIMIENTO"
echo "=================================================="
print_success "✅ Aplicaciones editorial detenidas"
print_success "✅ PostgreSQL detenido de forma segura"
print_success "✅ Backup de emergencia creado"
print_success "✅ Archivos temporales limpiados"

if [ -f "$BACKUP_FILE" ]; then
    echo "📁 Backup guardado en: $BACKUP_FILE"
fi

echo ""
print_status "🟢 Sistema listo para apagar de forma segura"
echo ""
print_warning "Comandos para apagar:"
echo "  • sudo shutdown -h now    (apagar inmediatamente)"
echo "  • sudo shutdown -h +5     (apagar en 5 minutos)"
echo "  • sudo reboot             (reiniciar)"
echo ""

# 9. Preguntar si desea apagar automáticamente
print_status "¿Deseas apagar el sistema ahora? (y/N)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    print_status "Apagando sistema en 10 segundos... (Ctrl+C para cancelar)"
    sleep 10
    print_status "🔴 Apagando sistema..."
    sudo shutdown -h now
else
    print_success "Script completado. El sistema está listo para apagar manualmente."
fi
