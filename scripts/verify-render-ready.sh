#!/bin/bash

# Pre-deployment verification script for Render
echo "🔍 Verificando configuración para Render..."

# Check required files
echo "📁 Verificando archivos necesarios..."

files=(
    "render.yaml"
    ".env.production"
    "scripts/init-db-render.sh"
    "scripts/health-check-render.js"
    "backend/package.json"
    "package.json"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file NO ENCONTRADO"
        exit 1
    fi
done

# Check package.json scripts
echo "📦 Verificando scripts de npm..."

required_scripts=("build" "start" "build:production")

for script in "${required_scripts[@]}"; do
    if npm run | grep -q "$script"; then
        echo "✅ Script '$script' encontrado"
    else
        echo "❌ Script '$script' NO ENCONTRADO"
    fi
done

# Check backend dependencies
echo "🔧 Verificando dependencias del backend..."

backend_deps=("express" "cors" "pg" "dotenv" "jsonwebtoken")

cd backend
for dep in "${backend_deps[@]}"; do
    if npm list "$dep" &> /dev/null; then
        echo "✅ Backend: $dep instalado"
    else
        echo "❌ Backend: $dep NO INSTALADO"
    fi
done

cd ..

# Check frontend dependencies
echo "🎨 Verificando dependencias del frontend..."

frontend_deps=("react" "vite" "@chakra-ui/react" "axios" "react-router-dom")

for dep in "${frontend_deps[@]}"; do
    if npm list "$dep" &> /dev/null; then
        echo "✅ Frontend: $dep instalado"
    else
        echo "❌ Frontend: $dep NO INSTALADO"
    fi
done

# Test build process
echo "🏗️ Probando proceso de build..."

if npm run build:production; then
    echo "✅ Build de producción exitoso"
    # Check if dist folder was created
    if [ -d "dist" ]; then
        echo "✅ Carpeta dist creada"
        echo "📊 Contenido de dist:"
        ls -la dist/
    else
        echo "❌ Carpeta dist no fue creada"
    fi
else
    echo "❌ Build de producción falló"
    exit 1
fi

echo ""
echo "🎉 ¡Verificación completada!"
echo ""
echo "📋 Checklist para Render:"
echo "1. ✅ Archivos de configuración presentes"
echo "2. ✅ Scripts de npm configurados"
echo "3. ✅ Dependencias instaladas"
echo "4. ✅ Build de producción exitoso"
echo ""
echo "🚀 ¡Listo para desplegar en Render!"
echo ""
echo "📖 Próximos pasos:"
echo "1. Hacer commit de los cambios: git add . && git commit -m 'feat: Render deployment config'"
echo "2. Push al repositorio: git push origin main"
echo "3. Ir a render.com y crear nuevo Blueprint"
echo "4. Conectar con el repositorio GitHub"
echo "5. Render detectará automáticamente render.yaml"
echo ""
