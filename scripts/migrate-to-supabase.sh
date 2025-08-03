#!/bin/bash
# scripts/migrate-to-supabase.sh - Migración automática a Supabase

set -e

echo "🚀 Iniciando migración de PostgreSQL local a Supabase..."

# Verificar dependencias
command -v pg_dump >/dev/null 2>&1 || { echo "❌ pg_dump no encontrado. Instala PostgreSQL client."; exit 1; }

# Variables (configura estas antes de ejecutar)
LOCAL_DB="editorialdata"
LOCAL_USER="markitos"
LOCAL_HOST="localhost"
BACKUP_FILE="backup-supabase-$(date +%Y%m%d_%H%M%S).sql"

# Solicitar credenciales de Supabase
echo "📝 Configuración de Supabase:"
read -p "Supabase Database URL: " SUPABASE_URL
read -p "Supabase Project REF: " SUPABASE_REF
read -s -p "Supabase Database Password: " SUPABASE_PASSWORD
echo

# 1. Crear backup de BD local
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

# 2. Limpiar dump para Supabase
echo "🧹 Limpiando dump para compatibilidad con Supabase..."
sed -i.bak \
  -e '/^CREATE EXTENSION/d' \
  -e '/^COMMENT ON EXTENSION/d' \
  -e '/^DROP EXTENSION/d' \
  -e 's/CREATE SCHEMA public;//g' \
  -e 's/DROP SCHEMA public;//g' \
  $BACKUP_FILE

# 3. Importar a Supabase
echo "📤 Importando a Supabase..."
FULL_SUPABASE_URL="postgresql://postgres:${SUPABASE_PASSWORD}@db.${SUPABASE_REF}.supabase.co:5432/postgres"

psql "$FULL_SUPABASE_URL" -f $BACKUP_FILE

if [ $? -eq 0 ]; then
  echo "✅ Importación completada"
else
  echo "❌ Error en importación"
  exit 1
fi

# 4. Verificar migración
echo "🔍 Verificando migración..."
psql "$FULL_SUPABASE_URL" -c "
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
FROM revisiones;
"

# 5. Generar archivo de configuración
echo "📝 Generando configuración para Render..."
cat > .env.supabase << EOF
# Configuración para Render + Supabase
DATABASE_URL=postgresql://postgres:${SUPABASE_PASSWORD}@db.${SUPABASE_REF}.supabase.co:5432/postgres
DB_HOST=db.${SUPABASE_REF}.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=${SUPABASE_PASSWORD}
JWT_SECRET=\$%^Tdasd9529841#\$&*9dascaseASDeqQQasdcEasdc\$##@33
JWT_EXPIRES_IN=24h
NODE_ENV=production
PORT=10000
EOF

echo "✅ Migración completada!"
echo "📋 Próximos pasos:"
echo "   1. Copia las variables de .env.supabase a Render"
echo "   2. Actualiza render.yaml con la nueva configuración"
echo "   3. Haz commit y push para deployar"
echo ""
echo "🔗 URL de tu proyecto Supabase:"
echo "   https://app.supabase.com/project/${SUPABASE_REF}"
