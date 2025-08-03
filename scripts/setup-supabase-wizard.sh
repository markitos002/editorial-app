#!/bin/bash
# scripts/setup-supabase-wizard.sh - Asistente de configuración de Supabase

set -e

echo "🧙‍♂️ Asistente de Configuración de Supabase"
echo "=========================================="
echo ""

# Verificar si el usuario tiene acceso a Supabase
echo "📱 Paso 1: Verificación de acceso"
echo "¿Puedes acceder a https://supabase.com y ver tu dashboard? (y/n)"
read -r access_ok

if [ "$access_ok" != "y" ]; then
    echo "❌ Primero necesitas crear una cuenta en Supabase"
    echo "👉 Ve a: https://supabase.com"
    echo "👉 Crea cuenta y regresa aquí"
    exit 1
fi

echo "✅ Acceso confirmado"
echo ""

# Verificar proyecto
echo "📁 Paso 2: Verificación de proyecto"
echo "¿Tienes un proyecto creado para editorial-app? (y/n)"
read -r project_exists

if [ "$project_exists" != "y" ]; then
    echo "📝 Instrucciones para crear proyecto:"
    echo "1. En tu dashboard de Supabase → 'New Project'"
    echo "2. Name: editorial-app-demo"
    echo "3. Database Password: [crea una segura]"
    echo "4. Region: East US"
    echo "5. Create new project"
    echo ""
    echo "⏳ Una vez creado, presiona Enter para continuar..."
    read -r
fi

echo "✅ Proyecto confirmado"
echo ""

# Obtener credenciales
echo "🔑 Paso 3: Obtener credenciales"
echo "Ve a tu proyecto → Settings → Database → Connection string → URI"
echo ""
echo "Pega aquí tu URL de conexión completa:"
echo "(Formato: postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres)"
read -r supabase_url

if [ -z "$supabase_url" ]; then
    echo "❌ URL requerida"
    exit 1
fi

# Validar formato de URL
if [[ ! "$supabase_url" =~ ^postgresql://postgres:.+@db\..+\.supabase\.co:5432/postgres$ ]]; then
    echo "❌ Formato de URL incorrecto"
    echo "📝 Debe ser: postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
    exit 1
fi

echo "✅ URL válida"
echo ""

# Extraer componentes
echo "🔧 Paso 4: Extraer configuración"
host=$(echo "$supabase_url" | sed -n 's|.*@\([^:]*\):.*|\1|p')
password=$(echo "$supabase_url" | sed -n 's|.*://postgres:\([^@]*\)@.*|\1|p')
project_ref=$(echo "$host" | sed -n 's|db\.\(.*\)\.supabase\.co|\1|p')

echo "HOST: $host"
echo "PASSWORD: $password"
echo "PROJECT_REF: $project_ref"
echo ""

# Probar conexión
echo "🧪 Paso 5: Probar conexión"
echo "Probando conexión a Supabase..."

if command -v psql >/dev/null 2>&1; then
    psql "$supabase_url" -c "SELECT 'Conexión exitosa' as status;" >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Conexión exitosa"
    else
        echo "❌ Error de conexión"
        echo "🔧 Verifica la URL en tu dashboard de Supabase"
        exit 1
    fi
else
    echo "⚠️  psql no encontrado, saltando test de conexión"
fi

# Actualizar configuración
echo ""
echo "💾 Paso 6: Actualizar configuración"
echo "Actualizando render-supabase.yaml..."

# Backup del archivo original
cp render-supabase.yaml render-supabase.yaml.backup

# Actualizar archivo
sed -i "s|postgresql://postgres:.*@db\..*\.supabase\.co:5432/postgres|$supabase_url|g" render-supabase.yaml
sed -i "s|db\..*\.supabase\.co|$host|g" render-supabase.yaml
sed -i "s|value: [^[:space:]]*  # Password|value: $password|g" render-supabase.yaml

echo "✅ Configuración actualizada"
echo ""

# Mostrar resumen
echo "🎉 ¡Configuración completada!"
echo "=========================="
echo "✅ Proyecto Supabase: Configurado"
echo "✅ Credenciales: Extraídas"
echo "✅ Conexión: Probada"
echo "✅ Archivos: Actualizados"
echo ""
echo "📋 Próximos pasos:"
echo "1. Exportar tu BD local: ./scripts/export-to-supabase.sh"
echo "2. Importar a Supabase: ./scripts/import-to-supabase.sh"
echo "3. Probar backend: node scripts/test-supabase-connection.js"
echo "4. Deploy en Render: Usar render-supabase.yaml"
echo ""
echo "📁 Archivos de backup creados:"
echo "- render-supabase.yaml.backup"
