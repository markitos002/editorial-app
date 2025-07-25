#!/bin/bash
# safe_startup.sh - Script para verificar y arrancar de forma segura el sistema editorial
# Autor: Sistema Editorial
# Fecha: $(date +%Y-%m-%d)

set -e

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

echo "=================================================="
echo "🚀 SCRIPT DE ARRANQUE SEGURO - SISTEMA EDITORIAL"
echo "=================================================="
print_status "Iniciando verificación del sistema..."

# 1. Verificar PostgreSQL
print_status "Verificando estado de PostgreSQL..."
if systemctl is-active --quiet postgresql; then
    print_success "PostgreSQL está corriendo"
    
    # Verificar conexión a la base de datos
    print_status "Verificando conectividad a la base de datos..."
    if sudo -u markitos psql -d "$DB_NAME" -c "SELECT version();" >/dev/null 2>&1; then
        print_success "Conexión a base de datos '$DB_NAME' exitosa"
        
        # Verificar integridad básica
        print_status "Verificando integridad de la base de datos..."
        TABLE_COUNT=$(sudo -u markitos psql -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | xargs)
        print_success "Base de datos contiene $TABLE_COUNT tablas"
        
        # Mostrar algunas tablas principales
        print_status "Tablas principales encontradas:"
        sudo -u markitos psql -d "$DB_NAME" -c "\dt" 2>/dev/null | grep -E "(usuarios|articulos|revisiones)" || print_warning "Algunas tablas principales no encontradas"
        
    else
        print_error "No se puede conectar a la base de datos '$DB_NAME'"
        print_status "Intentando crear la base de datos..."
        sudo -u postgres createdb -O markitos "$DB_NAME" 2>/dev/null || print_warning "No se pudo crear la base de datos"
    fi
    
else
    print_warning "PostgreSQL no está corriendo. Intentando iniciar..."
    
    if sudo systemctl start postgresql; then
        print_success "PostgreSQL iniciado exitosamente"
        
        # Esperar un momento para que se establezca completamente
        sleep 3
        
        # Verificar nuevamente
        if systemctl is-active --quiet postgresql; then
            print_success "PostgreSQL confirmado corriendo"
        else
            print_error "PostgreSQL no se pudo iniciar correctamente"
        fi
        
    else
        print_error "No se pudo iniciar PostgreSQL"
        print_status "Verificando logs de PostgreSQL..."
        sudo journalctl -u postgresql -n 10 --no-pager
    fi
fi

# 2. Habilitar arranque automático
print_status "Verificando arranque automático de PostgreSQL..."
if systemctl is-enabled postgresql >/dev/null 2>&1; then
    print_success "PostgreSQL configurado para arranque automático"
else
    print_warning "PostgreSQL NO está configurado para arranque automático"
    print_status "Habilitando arranque automático..."
    sudo systemctl enable postgresql
    print_success "Arranque automático habilitado"
fi

# 3. Verificar recursos del sistema
print_status "Verificando recursos del sistema..."
echo "💾 Memoria:"
free -h
echo ""
echo "💽 Espacio en disco:"
df -h / /home 2>/dev/null || df -h /
echo ""
echo "⚡ Carga del sistema:"
uptime

# 4. Verificar puertos
print_status "Verificando puertos de PostgreSQL..."
if netstat -tlnp 2>/dev/null | grep :5432 >/dev/null; then
    print_success "Puerto 5432 (PostgreSQL) está disponible"
else
    print_warning "Puerto 5432 no está en uso"
fi

# 5. Mostrar información de versiones
print_status "Información del sistema:"
echo "🐧 SO: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo "🐘 PostgreSQL: $(sudo -u markitos psql -d "$DB_NAME" -t -c "SELECT version();" 2>/dev/null | head -1 | xargs || echo "No disponible")"
echo "📦 Kernel: $(uname -r)"

echo ""
echo "=================================================="
print_success "✅ Verificación del sistema completada"
echo "=================================================="

# 6. Mostrar comandos útiles
echo ""
print_status "🔧 Comandos útiles para la aplicación editorial:"
echo "  • cd ~/editorial-app && npm install    (instalar dependencias)"
echo "  • cd ~/editorial-app && npm run dev    (iniciar frontend)"
echo "  • cd ~/editorial-app/backend && npm start (iniciar backend)"
echo ""
print_status "🔧 Comandos de PostgreSQL:"
echo "  • sudo systemctl status postgresql     (estado del servicio)"
echo "  • sudo -u markitos psql                    (conectar como markitos)"
echo "  • sudo -u markitos psql -d $DB_NAME      (conectar a la DB editorial)"
echo ""

print_success "🟢 Sistema listo para usar"
