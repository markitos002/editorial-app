#!/bin/bash
# scripts/test-connection-manual.sh - Test manual de conexión a Supabase

echo "🧪 Test manual de conexión a Supabase"
echo ""
echo "📝 Ingresa tu URL de conexión completa de Supabase:"
echo "   (Formato: postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres)"
echo ""
read -p "🔗 URL de conexión: " SUPABASE_URL

if [ -z "$SUPABASE_URL" ]; then
  echo "❌ URL requerida"
  exit 1
fi

echo ""
echo "🔗 Probando conexión..."

# Test básico
psql "$SUPABASE_URL" -c "SELECT 'Conexión exitosa' as status, version();"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ ¡Conexión exitosa!"
  echo ""
  echo "🔄 Ahora actualiza la configuración con estos datos:"
  
  # Extraer componentes de la URL
  HOST=$(echo "$SUPABASE_URL" | sed -n 's|.*@\([^:]*\):.*|\1|p')
  PASSWORD=$(echo "$SUPABASE_URL" | sed -n 's|.*://postgres:\([^@]*\)@.*|\1|p')
  
  echo "   HOST: $HOST"
  echo "   PASSWORD: $PASSWORD"
  
  echo ""
  echo "🔧 Ejecuta para actualizar automáticamente:"
  echo "   echo '$HOST' | ./scripts/update-supabase-config.sh"
  
else
  echo "❌ Error de conexión"
  echo "🔧 Verifica la URL en tu dashboard de Supabase"
fi
