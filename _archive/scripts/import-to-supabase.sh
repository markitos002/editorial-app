#!/bin/bash
# scripts/import-to-supabase.sh - Importar backup a Supabase

set -e

echo "🌐 Importando datos a Supabase..."

# Variables de Supabase (basadas en tu render-supabase.yaml)
SUPABASE_HOST="db.editorialdata.supabase.co"
SUPABASE_USER="postgres"
SUPABASE_PASSWORD="VqX2KgTvTZLrOWlq"
SUPABASE_DB="postgres"
SUPABASE_PORT="5432"

# URL de conexión completa
SUPABASE_URL="postgresql://${SUPABASE_USER}:${SUPABASE_PASSWORD}@${SUPABASE_HOST}:${SUPABASE_PORT}/${SUPABASE_DB}"

# Buscar el archivo de backup más reciente
BACKUP_FILE=$(ls -t backup-supabase-*.sql 2>/dev/null | head -1)

if [ -z "$BACKUP_FILE" ]; then
  echo "❌ No se encontró archivo de backup. Ejecuta primero export-to-supabase.sh"
  exit 1
fi

echo "📁 Usando archivo: $BACKUP_FILE"

# Verificar conexión a Supabase
echo "🔗 Verificando conexión a Supabase..."
psql "$SUPABASE_URL" -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Conexión exitosa"
else
  echo "❌ Error de conexión a Supabase"
  echo "🔧 Verifica las credenciales en render-supabase.yaml"
  exit 1
fi

# Importar datos
echo "📤 Importando datos a Supabase..."
psql "$SUPABASE_URL" -f "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Importación completada"
else
  echo "❌ Error durante la importación"
  exit 1
fi

# Verificar migración
echo "🔍 Verificando datos importados..."
psql "$SUPABASE_URL" -c "
SELECT 
  'usuarios' as tabla, COUNT(*) as registros 
FROM usuarios
UNION ALL
SELECT 
  'articulos' as tabla, COUNT(*) as registros 
FROM articulos
UNION ALL
SELECT 
  'revisiones' as tabla, COUNT(*) as registros 
FROM revisiones
UNION ALL
SELECT 
  'notificaciones' as tabla, COUNT(*) as registros 
FROM notificaciones;
"

echo ""
echo "🎉 ¡Migración completada!"
echo "🔗 Dashboard Supabase: https://app.supabase.com/project/editorialdata"
echo "🧪 Próximo paso: Probar backend con Supabase"
