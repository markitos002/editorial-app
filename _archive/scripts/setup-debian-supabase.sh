#!/bin/bash
# scripts/setup-debian-supabase.sh - Configurar Supabase desde Debian

echo "🐧 Configuración Supabase para Debian"
echo "====================================="
echo ""

echo "📋 Pasos a seguir desde tu portátil Debian:"
echo ""

echo "1️⃣ Sincronizar archivos del proyecto:"
echo "   cd ~/editorial-app"
echo "   git pull origin main"
echo ""

echo "2️⃣ Hacer scripts ejecutables:"
echo "   chmod +x scripts/test-supabase-debian.sh"
echo "   chmod +x scripts/migrate-to-supabase.sh"
echo ""

echo "3️⃣ Instalar cliente PostgreSQL (si no está instalado):"
echo "   sudo apt update"
echo "   sudo apt install postgresql-client"
echo ""

echo "4️⃣ Probar conexión a Supabase:"
echo "   ./scripts/test-supabase-debian.sh"
echo ""

echo "5️⃣ Si la conexión funciona, migrar datos:"
echo "   ./scripts/migrate-to-supabase.sh"
echo ""

echo "🔧 Configuración de tu proyecto Supabase:"
echo "   🌐 URL: https://supabase.com/dashboard/project/ybnpusbnqlizaiqvztph"
echo "   🏠 Host: db.ybnpusbnqlizaiqvztph.supabase.co"
echo "   🔑 Usuario: postgres"
echo "   🗃️ Base de datos: postgres"
echo ""

echo "⚠️  IMPORTANTE:"
echo "   • La password está en render-supabase.yaml"
echo "   • Asegúrate de que PostgreSQL local esté ejecutándose"
echo "   • Verifica conexión a internet desde Debian"
echo ""

echo "🎯 Después de migrar:"
echo "   1. Probar backend con Supabase"
echo "   2. Hacer deploy en Render"
echo "   3. Demo listo para el comité ✨"
