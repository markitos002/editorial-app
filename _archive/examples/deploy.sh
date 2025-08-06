#!/bin/bash

# 🚀 Script de Deployment Automático para Editorial App
# Uso: ./deploy.sh [staging|production]

set -e  # Salir si cualquier comando falla

ENV=${1:-production}
PROJECT_DIR="$PWD"

echo "🚀 Iniciando deployment en modo: $ENV"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    log_error "PM2 no está instalado. Instálalo con: npm install -g pm2"
    exit 1
fi

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null; then
    log_error "Node.js no está instalado"
    exit 1
fi

log_info "Actualizando código desde Git..."
git pull origin main

log_info "Instalando dependencias del backend..."
cd backend
npm install --production

log_info "Instalando dependencias del frontend..."
cd ../
npm install

log_info "Construyendo el frontend..."
npm run build

log_info "Creando directorio de logs..."
mkdir -p logs

# Verificar si los procesos ya están corriendo
if pm2 list | grep -q "editorial-app"; then
    log_info "Reiniciando aplicaciones existentes..."
    pm2 restart ecosystem.config.js --env $ENV
else
    log_info "Iniciando aplicaciones por primera vez..."
    pm2 start ecosystem.config.js --env $ENV
fi

log_info "Guardando configuración PM2..."
pm2 save

log_info "Estado de las aplicaciones:"
pm2 status

log_info "Logs recientes:"
pm2 logs --lines 20

log_info "✅ Deployment completado!"
log_info "Frontend: http://localhost:3000"
log_info "Backend: http://localhost:4000"

# Mostrar IP de Tailscale si está disponible
if command -v tailscale &> /dev/null; then
    TAILSCALE_IP=$(tailscale ip -4 2>/dev/null)
    if [ ! -z "$TAILSCALE_IP" ]; then
        log_info "Acceso via Tailscale: http://$TAILSCALE_IP:3000"
    fi
fi

echo ""
echo "🛠️  Comandos útiles:"
echo "  pm2 status          - Ver estado"
echo "  pm2 logs            - Ver logs en tiempo real"
echo "  pm2 restart all     - Reiniciar todo"
echo "  pm2 stop all        - Parar todo"
echo "  pm2 monit           - Monitor interactivo"
