#!/bin/bash
# setup_postgresql_auth.sh - Configurar autenticación PostgreSQL para el usuario markitos
# Ejecutar este script si hay problemas de autenticación

echo "🔐 CONFIGURANDO AUTENTICACIÓN POSTGRESQL"
echo "========================================"

# Verificar si el usuario markitos existe en PostgreSQL
echo "🔍 Verificando usuario PostgreSQL..."
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='markitos'" | grep -q 1; then
    echo "✅ Usuario 'markitos' existe en PostgreSQL"
else
    echo "⚠️  Usuario 'markitos' no existe. Creando..."
    sudo -u postgres createuser -d -r -s markitos
    echo "✅ Usuario 'markitos' creado con permisos de superusuario"
fi

# Verificar si la base de datos editorialdata existe
echo "🔍 Verificando base de datos..."
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw editorialdata; then
    echo "✅ Base de datos 'editorialdata' existe"
else
    echo "⚠️  Base de datos 'editorialdata' no existe. Creando..."
    sudo -u postgres createdb -O markitos editorialdata
    echo "✅ Base de datos 'editorialdata' creada"
fi

# Verificar conexión
echo "🔍 Probando conexión..."
if sudo -u markitos psql -d editorialdata -c "SELECT 'Conexión exitosa' as test;" >/dev/null 2>&1; then
    echo "✅ Conexión exitosa como usuario 'markitos'"
else
    echo "❌ Error de conexión. Revisando configuración de autenticación..."
    
    # Mostrar información sobre pg_hba.conf
    echo ""
    echo "📋 INFORMACIÓN DE CONFIGURACIÓN:"
    echo "================================"
    
    PG_HBA_FILE=$(sudo -u postgres psql -tAc "SHOW hba_file;")
    echo "📁 Archivo pg_hba.conf: $PG_HBA_FILE"
    
    echo ""
    echo "📋 Configuración actual de autenticación:"
    sudo cat "$PG_HBA_FILE" | grep -v "^#" | grep -v "^$"
    
    echo ""
    echo "⚠️  POSIBLE SOLUCIÓN:"
    echo "Si ves 'peer' authentication, es normal en sistemas locales."
    echo "Los scripts deberían funcionar correctamente."
    echo ""
    echo "Si persisten los problemas, puedes:"
    echo "1. Verificar que el usuario del sistema 'markitos' existe:"
    echo "   whoami"
    echo "2. Asegurarte de que coincide con el usuario de PostgreSQL"
    echo "3. O editar los scripts para usar 'sudo -u postgres' en su lugar"
fi

# Mostrar información del sistema
echo ""
echo "📊 INFORMACIÓN DEL SISTEMA:"
echo "==========================="
echo "👤 Usuario actual: $(whoami)"
echo "🏠 Directorio home: $HOME"
echo "🐘 PostgreSQL version: $(sudo -u postgres psql --version)"

# Probar comandos de backup
echo ""
echo "🧪 PROBANDO COMANDOS DE BACKUP:"
echo "==============================="

echo "Comando 1: sudo -u markitos pg_dump editorialdata"
if sudo -u markitos pg_dump editorialdata --schema-only >/dev/null 2>&1; then
    echo "✅ Funciona correctamente"
else
    echo "❌ Error con este comando"
fi

echo "Comando 2: sudo -u postgres pg_dump editorialdata"
if sudo -u postgres pg_dump editorialdata --schema-only >/dev/null 2>&1; then
    echo "✅ Funciona correctamente (alternativo)"
else
    echo "❌ Error con este comando también"
fi

echo ""
echo "✅ DIAGNÓSTICO COMPLETADO"
echo ""
echo "💡 Si el Comando 1 falló pero el Comando 2 funcionó:"
echo "   Los scripts usarán 'sudo -u postgres' automáticamente"
echo ""
echo "💡 Si ambos funcionaron:"
echo "   Los scripts deberían funcionar correctamente"
