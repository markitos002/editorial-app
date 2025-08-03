#!/bin/bash
# scripts/check-supabase-setup.sh - Verificar configuración de Supabase

echo "🔍 Verificando configuración de Supabase..."
echo ""

echo "📋 Checklist de configuración:"
echo ""

echo "1️⃣ ¿Tienes cuenta en Supabase?"
echo "   👉 Ve a: https://supabase.com"
echo "   👉 Deberías ver tu dashboard con proyectos"
echo ""

echo "2️⃣ ¿Creaste un proyecto?"
echo "   👉 En el dashboard, debería aparecer un proyecto como 'editorial-app-demo'"
echo "   👉 El proyecto debe tener estado 'Active' (verde)"
echo ""

echo "3️⃣ ¿Tienes las credenciales correctas?"
echo "   👉 Ve a tu proyecto → Settings → Database"
echo "   👉 Busca 'Connection string' → URI"
echo ""

echo "4️⃣ Configuración actual en render-supabase.yaml:"
grep -A 5 -B 5 "supabase.co" render-supabase.yaml || echo "   ❌ No se encontró configuración de Supabase"

echo ""
echo "🔧 Si algo no está bien, sigue estos pasos:"
echo "   1. Verificar proyecto existe y está activo"
echo "   2. Copiar URL de conexión correcta"
echo "   3. Actualizar configuración"
echo "   4. Probar conexión"
