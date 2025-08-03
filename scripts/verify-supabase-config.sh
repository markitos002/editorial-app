#!/bin/bash
# scripts/verify-supabase-config.sh - Verificar configuración de Supabase

echo "🔍 Verificando configuración de Supabase..."

echo "📋 Configuración actual en render-supabase.yaml:"
echo "   Host: db.editorialdata.supabase.co"
echo "   User: postgres"
echo "   Database: postgres"
echo "   Password: VqX2KgTvTZLrOWlq"

echo ""
echo "🔧 Para obtener la configuración correcta:"
echo "1. Ve a: https://app.supabase.com"
echo "2. Busca tu proyecto 'editorial-app-demo' (o como lo hayas nombrado)"
echo "3. Settings → Database"
echo "4. Connection string → URI"

echo ""
echo "📝 La URL debería verse así:"
echo "   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

echo ""
echo "🎯 Pasos para corregir:"
echo "1. Copia tu URL de conexión real de Supabase"
echo "2. Extrae estas partes:"
echo "   - HOST: db.[TU-PROJECT-REF].supabase.co"
echo "   - PASSWORD: [TU-PASSWORD-REAL]"
echo "3. Actualiza render-supabase.yaml con los valores correctos"

echo ""
echo "⚠️  Nota: 'editorialdata' no es un PROJECT-REF válido"
echo "   Los PROJECT-REF son strings como: abcdefghijklmnop"
