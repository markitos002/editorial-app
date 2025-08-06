#!/bin/bash
# scripts/export-to-supabase.sh - Exportar BD local y preparar para Supabase

set -e

echo "🗄️ Exportando base de datos local para Supabase..."

# Variables de configuración
LOCAL_DB="editorialdata"
LOCAL_USER="markitos"
LOCAL_HOST="localhost"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup-supabase-${TIMESTAMP}.sql"

echo "📦 Creando backup de base de datos local..."
pg_dump -h $LOCAL_HOST -U $LOCAL_USER -d $LOCAL_DB \
  --no-owner --no-privileges --clean --if-exists \
  -f $BACKUP_FILE

if [ $? -eq 0 ]; then
  echo "✅ Backup creado: $BACKUP_FILE"
else
  echo "❌ Error creando backup"
  exit 1
fi

echo "🧹 Limpiando dump para compatibilidad con Supabase..."
# Crear versión limpia para Supabase
cp $BACKUP_FILE "${BACKUP_FILE}.original"

# Limpiar extensiones y schemas problemáticos
sed -i \
  -e '/^CREATE EXTENSION/d' \
  -e '/^COMMENT ON EXTENSION/d' \
  -e '/^DROP EXTENSION/d' \
  -e '/^CREATE SCHEMA public;/d' \
  -e '/^DROP SCHEMA public;/d' \
  -e '/^COMMENT ON SCHEMA public/d' \
  $BACKUP_FILE

echo "✅ Archivo limpio listo: $BACKUP_FILE"
echo "📝 Contenido del archivo:"
echo "   Líneas totales: $(wc -l < $BACKUP_FILE)"
echo "   Tablas encontradas:"
grep "CREATE TABLE" $BACKUP_FILE | sed 's/.*CREATE TABLE \([^ ]*\).*/  - \1/'

echo ""
echo "🚀 Próximo paso: Importar a Supabase"
echo "   1. Ve a: https://app.supabase.com/project/editorialdata"
echo "   2. Settings → Database → Connection string"
echo "   3. Ejecuta: psql 'TU_CONNECTION_STRING' -f $BACKUP_FILE"
echo ""
echo "📁 Archivos generados:"
echo "   - $BACKUP_FILE (para Supabase)"
echo "   - ${BACKUP_FILE}.original (backup completo)"
