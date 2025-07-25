#!/bin/bash
# editorial_system.sh - Script maestro para gestión del sistema editorial
# Autor: Sistema Editorial
# Fecha: $(date +%Y-%m-%d)

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${PURPLE}=================================================="
    echo -e "🎯 GESTOR DEL SISTEMA EDITORIAL"
    echo -e "==================================================${NC}"
}

print_menu() {
    echo ""
    echo -e "${CYAN}Selecciona una opción:${NC}"
    echo ""
    echo -e "${GREEN}🚀 ARRANQUE Y VERIFICACIÓN:${NC}"
    echo "  1) Verificar sistema y arrancar servicios"
    echo "  2) Solo verificar estado (sin modificar)"
    echo ""
    echo -e "${YELLOW}🗄️  BACKUPS:${NC}"
    echo "  3) Crear backup manual"
    echo "  4) Configurar backups automáticos"
    echo "  5) Ver backups existentes"
    echo ""
    echo -e "${BLUE}🔧 MANTENIMIENTO:${NC}"
    echo "  6) Reiniciar PostgreSQL"
    echo "  7) Ver logs de PostgreSQL"
    echo "  8) Limpiar archivos temporales"
    echo ""
    echo -e "${RED}🛑 APAGADO:${NC}"
    echo "  9) Apagar sistema de forma segura"
    echo ""
    echo "  0) Salir"
    echo ""
}

# Función para pausar
pause() {
    echo ""
    read -p "Presiona Enter para continuar..."
}

# Función para ejecutar scripts
run_script() {
    local script_name="$1"
    local script_path="$(dirname "$0")/$script_name"
    
    if [ -f "$script_path" ]; then
        echo -e "${BLUE}Ejecutando: $script_name${NC}"
        bash "$script_path" "$2"
    else
        echo -e "${RED}❌ Script no encontrado: $script_path${NC}"
        echo "Asegúrate de que todos los scripts estén en el mismo directorio."
    fi
}

# Función principal
main() {
    while true; do
        clear
        print_header
        print_menu
        
        read -p "Opción: " option
        
        case $option in
            1)
                clear
                echo -e "${GREEN}🚀 INICIANDO VERIFICACIÓN Y ARRANQUE...${NC}"
                run_script "safe_startup.sh"
                pause
                ;;
            2)
                clear
                echo -e "${BLUE}🔍 VERIFICANDO ESTADO DEL SISTEMA...${NC}"
                systemctl status postgresql --no-pager || true
                echo ""
                ps aux | grep postgres | grep -v grep || echo "No hay procesos PostgreSQL visibles"
                echo ""
                sudo -u markitos psql -d editorialdata -c "SELECT 'Base de datos OK' as status;" 2>/dev/null || echo "❌ No se puede conectar a la base de datos"
                pause
                ;;
            3)
                clear
                echo -e "${YELLOW}🗄️  CREANDO BACKUP MANUAL...${NC}"
                run_script "auto_backup.sh"
                pause
                ;;
            4)
                clear
                echo -e "${YELLOW}⏰ CONFIGURANDO BACKUPS AUTOMÁTICOS...${NC}"
                run_script "auto_backup.sh" "install"
                pause
                ;;
            5)
                clear
                echo -e "${CYAN}📁 BACKUPS EXISTENTES:${NC}"
                echo ""
                BACKUP_DIR="/home/$USER/backups"
                if [ -d "$BACKUP_DIR" ]; then
                    ls -lah "$BACKUP_DIR"/editorialdata_backup_*.sql.gz 2>/dev/null || echo "No hay backups disponibles"
                    echo ""
                    echo "📍 Directorio de backups: $BACKUP_DIR"
                else
                    echo "❌ Directorio de backups no existe: $BACKUP_DIR"
                fi
                pause
                ;;
            6)
                clear
                echo -e "${BLUE}🔄 REINICIANDO POSTGRESQL...${NC}"
                sudo systemctl restart postgresql
                sleep 3
                systemctl status postgresql --no-pager
                pause
                ;;
            7)
                clear
                echo -e "${BLUE}📋 LOGS DE POSTGRESQL (últimas 20 líneas):${NC}"
                echo ""
                sudo journalctl -u postgresql -n 20 --no-pager
                pause
                ;;
            8)
                clear
                echo -e "${BLUE}🧹 LIMPIANDO ARCHIVOS TEMPORALES...${NC}"
                sudo rm -rf /tmp/editorial_* 2>/dev/null || true
                sudo rm -rf /var/tmp/editorial_* 2>/dev/null || true
                echo "✅ Archivos temporales limpiados"
                pause
                ;;
            9)
                clear
                echo -e "${RED}🛑 INICIANDO APAGADO SEGURO...${NC}"
                run_script "safe_shutdown.sh"
                # Si llegamos aquí, el usuario canceló el apagado
                pause
                ;;
            0)
                echo -e "${GREEN}👋 ¡Hasta luego!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Opción inválida. Intenta de nuevo.${NC}"
                sleep 2
                ;;
        esac
    done
}

# Verificar que se ejecuta como usuario normal (no root)
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}❌ No ejecutes este script como root.${NC}"
    echo "Ejecuta: bash $0"
    exit 1
fi

# Ejecutar función principal
main
