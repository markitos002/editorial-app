#!/bin/bash
# scripts/test-supabase-debian.sh - Probar conexión a Supabase desde Debian

echo "🔗 Probando conexión a Supabase desde Debian..."
echo ""

# Configuración de tu proyecto Supabase
SUPABASE_HOST="db.ybnpusbnqlizaiqvztph.supabase.co"
SUPABASE_PORT="5432"
SUPABASE_DB="postgres"
SUPABASE_USER="postgres"
SUPABASE_PASSWORD="VqX2KgTvTZLrOWlq"

echo "📡 Configuración:"
echo "   Host: $SUPABASE_HOST"
echo "   Puerto: $SUPABASE_PORT"
echo "   Base de datos: $SUPABASE_DB"
echo "   Usuario: $SUPABASE_USER"
echo ""

# Verificar si psql está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ psql no está instalado"
    echo "🔧 Instalar con: sudo apt update && sudo apt install postgresql-client"
    exit 1
fi

echo "✅ psql encontrado"
echo ""

# Probar conexión
echo "🧪 Probando conexión..."
PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -c "\q" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Conexión exitosa!"
    echo ""
    
    # Mostrar información de la base de datos
    echo "📊 Información de la base de datos:"
    PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -c "SELECT version();" 2>/dev/null | head -3
    
    echo ""
    echo "📋 Tablas existentes:"
    TABLES=$(PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -t -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;" 2>/dev/null)
    
    if [ -z "$TABLES" ]; then
        echo "   ⚠️  No hay tablas en la base de datos"
        echo "   💡 Necesitas migrar los datos desde tu PostgreSQL local"
        echo ""
        echo "🔄 Para migrar, ejecuta desde tu Debian:"
        echo "   1. pg_dump editorial_app > backup.sql"
        echo "   2. PGPASSWORD='$SUPABASE_PASSWORD' psql -h '$SUPABASE_HOST' -U '$SUPABASE_USER' -d '$SUPABASE_DB' < backup.sql"
    else
        echo "$TABLES" | while read -r table; do
            [ -n "$table" ] && echo "   📁 $table"
        done
    fi
    
else
    echo "❌ Error de conexión"
    echo ""
    echo "🔧 Verificar:"
    echo "   1. Conexión a internet desde Debian"
    echo "   2. Password correcto en Supabase"
    echo "   3. Proyecto activo en Supabase"
    echo ""
    echo "💡 Comandos para verificar:"
    echo "   ping $SUPABASE_HOST"
    echo "   telnet $SUPABASE_HOST $SUPABASE_PORT"
fi

echo ""
echo "🌐 URL del proyecto: https://supabase.com/dashboard/project/ybnpusbnqlizaiqvztph"
