#!/bin/bash
# scripts/update-supabase-config.sh - Actualizar configuración con datos correctos

echo "🔧 Actualizando configuración de Supabase..."

# Solicitar datos correctos al usuario
echo "📝 Ingresa los datos correctos de tu proyecto Supabase:"
echo ""
read -p "🏠 HOST (ej: db.abcdefghijklmnop.supabase.co): " SUPABASE_HOST
read -p "🔑 PASSWORD: " SUPABASE_PASSWORD
read -p "📁 PROJECT REF (ej: abcdefghijklmnop): " PROJECT_REF

# Validar que no estén vacíos
if [ -z "$SUPABASE_HOST" ] || [ -z "$SUPABASE_PASSWORD" ] || [ -z "$PROJECT_REF" ]; then
  echo "❌ Todos los campos son obligatorios"
  exit 1
fi

echo ""
echo "🔄 Actualizando archivos de configuración..."

# Actualizar render-supabase.yaml
sed -i "s|db\..*\.supabase\.co|$SUPABASE_HOST|g" render-supabase.yaml
sed -i "s|value: VqX2KgTvTZLrOWlq|value: $SUPABASE_PASSWORD|g" render-supabase.yaml
sed -i "s|postgresql://postgres:.*@|postgresql://postgres:$SUPABASE_PASSWORD@|g" render-supabase.yaml

# Actualizar script de importación
sed -i "s|SUPABASE_HOST=\".*\"|SUPABASE_HOST=\"$SUPABASE_HOST\"|g" scripts/import-to-supabase.sh
sed -i "s|SUPABASE_PASSWORD=\".*\"|SUPABASE_PASSWORD=\"$SUPABASE_PASSWORD\"|g" scripts/import-to-supabase.sh

# Actualizar script de test
sed -i "s|host: 'db\..*\.supabase\.co'|host: '$SUPABASE_HOST'|g" scripts/test-supabase-connection.js
sed -i "s|password: '.*'|password: '$SUPABASE_PASSWORD'|g" scripts/test-supabase-connection.js

echo "✅ Configuración actualizada"
echo ""
echo "🧪 Ahora puedes probar la conexión:"
echo "   ./scripts/import-to-supabase.sh"
