#!/bin/bash
# install_scripts.sh - Instalar y configurar scripts del sistema editorial
# Ejecutar este script después de copiar los archivos al portátil Debian

echo "🔧 INSTALANDO SCRIPTS DEL SISTEMA EDITORIAL"
echo "============================================"

# Hacer ejecutables todos los scripts
chmod +x safe_shutdown.sh
chmod +x safe_startup.sh
chmod +x auto_backup.sh
chmod +x editorial_system.sh
chmod +x setup_postgresql_auth.sh

echo "✅ Scripts hechos ejecutables"

# Crear directorio de backups
mkdir -p /home/$USER/backups
echo "✅ Directorio de backups creado: /home/$USER/backups"

# Verificar dependencias
echo ""
echo "🔍 Verificando dependencias del sistema..."

# Verificar PostgreSQL
if command -v psql >/dev/null 2>&1; then
    echo "✅ PostgreSQL encontrado"
else
    echo "❌ PostgreSQL no encontrado. Instala con: sudo apt install postgresql"
fi

# Verificar systemctl
if command -v systemctl >/dev/null 2>&1; then
    echo "✅ systemctl disponible"
else
    echo "❌ systemctl no disponible"
fi

# Verificar que el usuario actual puede usar sudo
if sudo -n true 2>/dev/null; then
    echo "✅ Permisos sudo confirmados"
else
    echo "⚠️  Es posible que necesites permisos sudo para algunas operaciones"
fi

echo ""
echo "📋 SCRIPTS INSTALADOS:"
echo "----------------------"
echo "• safe_shutdown.sh          - Apagar sistema de forma segura"
echo "• safe_startup.sh           - Verificar y arrancar servicios"
echo "• auto_backup.sh            - Crear backups automáticos"
echo "• editorial_system.sh       - Menú principal (recomendado)"
echo "• setup_postgresql_auth.sh  - Configurar autenticación PostgreSQL"
echo ""
echo "🚀 PARA EMPEZAR:"
echo "----------------"
echo "Ejecuta: ./editorial_system.sh"
echo ""
echo "⚡ COMANDOS RÁPIDOS:"
echo "--------------------"
echo "• ./safe_startup.sh                    - Verificar sistema"
echo "• ./auto_backup.sh                     - Backup manual"
echo "• ./auto_backup.sh install             - Configurar backup automático"
echo "• ./safe_shutdown.sh                   - Apagar seguro"
echo "• ./setup_postgresql_auth.sh           - Solucionar problemas de autenticación"
echo ""
echo "✅ INSTALACIÓN COMPLETADA"
