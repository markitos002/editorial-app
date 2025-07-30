# 🚀 Guía de Deployment en Debian con Tailscale

## 📋 Requisitos Previos
- ✅ Portátil Debian con Git instalado
- ✅ Tailscale configurado
- ✅ Base de datos MySQL/PostgreSQL en Debian
- ✅ Acceso a internet para instalar dependencias

## 🏗️ Arquitectura del Deploy
```
[Internet] → [Tailscale] → [Debian Server]
                              ├── Frontend (Puerto 3000)
                              ├── Backend (Puerto 4000) 
                              └── Database (Puerto 3306/5432)
```

---

## 📦 PASO 1: Instalar Dependencias en Debian

### 1.1 Actualizar el sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Instalar Node.js (versión 18+)
```bash
# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version  # Debe ser v20.x.x
npm --version   # Debe ser 10.x.x
```

### 1.3 Instalar PM2 (para gestión de procesos)
```bash
sudo npm install -g pm2
```

### 1.4 Verificar base de datos
```bash
# Para MySQL
sudo systemctl status mysql

# Para PostgreSQL  
sudo systemctl status postgresql
```

---

## 📥 PASO 2: Clonar el Proyecto

### 2.1 Navegar al directorio deseado
```bash
cd /home/$(whoami)/
mkdir -p projects
cd projects
```

### 2.2 Clonar el repositorio

**Opción A: SSH (Recomendado para deployment):**
```bash
git clone git@github.com:markitos002/editorial-app.git
cd editorial-app
```

**Opción B: HTTPS (Alternativa):**
```bash
git clone https://github.com/markitos002/editorial-app.git
cd editorial-app
```

### 2.3 Verificar que todo está actualizado
```bash
git status
git log --oneline -5  # Ver últimos commits
```

---

## ⚙️ PASO 3: Configurar Variables de Entorno

### 3.1 Configurar Backend
```bash
cd backend
cp .env.example .env  # Si existe, o crear nuevo
```

**Contenido del archivo `.env` del backend:**
```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306  # o 5432 para PostgreSQL
DB_NAME=editorial_app
DB_USER=tu_usuario_db
DB_PASSWORD=tu_password_db

# JWT
JWT_SECRET=tu_secret_key_muy_seguro_aqui

# Puerto del servidor
PORT=4000

# Entorno
NODE_ENV=production

# CORS (permitir frontend)
FRONTEND_URL=http://localhost:3000
```

### 3.2 Configurar Frontend
```bash
cd ../  # Volver al root
```

**Crear `.env.production` para el frontend:**
```env
VITE_API_URL=http://localhost:4000/api
VITE_APP_ENV=production
```

---

## 📦 PASO 4: Instalar Dependencias

### 4.1 Instalar dependencias del Backend
```bash
cd backend
npm install --production
```

### 4.2 Instalar dependencias del Frontend
```bash
cd ../
npm install
```

---

## 🗄️ PASO 5: Configurar Base de Datos

### 5.1 Crear base de datos (PostgreSQL)
```bash
sudo -u postgres psql
```
```sql
CREATE DATABASE editorial_app;
CREATE USER editorial_user WITH ENCRYPTED PASSWORD 'password_seguro';
GRANT ALL PRIVILEGES ON DATABASE editorial_app TO editorial_user;
ALTER USER editorial_user CREATEDB;
\q
```

### 5.2 Ejecutar migraciones/setup (si tienes scripts)
```bash
cd backend
# Si tienes scripts de setup
node setup-database.js  # o el script que tengas
```

---

## 🚀 PASO 6: Build y Deploy

### 6.1 Construir el Frontend
```bash
cd ../  # Root del proyecto
npm run build
```

### 6.2 Probar que todo funciona localmente
```bash
# Terminal 1: Backend
cd backend
node app.js

# Terminal 2: Frontend preview
cd ../
npm run preview
```

### 6.3 Configurar PM2 para producción

**Crear `ecosystem.config.js` en el root:**
```javascript
module.exports = {
  apps: [
    {
      name: 'editorial-backend',
      script: './backend/app.js',
      cwd: '/home/$(whoami)/projects/editorial-app',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'editorial-frontend',
      script: 'npx',
      args: 'vite preview --host 0.0.0.0 --port 3000',
      cwd: '/home/$(whoami)/projects/editorial-app',
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M'
    }
  ]
};
```

---

## 🌐 PASO 7: Configurar Tailscale para Acceso Externo

### 7.1 Verificar IP de Tailscale
```bash
tailscale ip -4
# Anota esta IP, será algo como 100.x.x.x
```

### 7.2 Configurar Frontend para acceso externo

**Modificar `vite.config.js`:**
```javascript
export default defineConfig({
  // ... configuración existente
  preview: {
    host: '0.0.0.0',  // Permite acceso desde cualquier IP
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
});
```

### 7.3 Configurar Backend para CORS con Tailscale

**En `backend/app.js`, asegúrate de tener:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://100.x.x.x:3000'  // Tu IP de Tailscale
  ],
  credentials: true
}));
```

---

## 🚀 PASO 8: Lanzar en Producción

### 8.1 Iniciar con PM2
```bash
# Desde el root del proyecto
pm2 start ecosystem.config.js

# Verificar que están corriendo
pm2 status
pm2 logs
```

### 8.2 Configurar PM2 para auto-inicio
```bash
pm2 startup
pm2 save
```

---

## 🔧 PASO 9: Acceso y Verificación

### 9.1 URLs de acceso
- **Local**: http://localhost:3000
- **Tailscale**: http://TU_IP_TAILSCALE:3000
- **Backend**: http://TU_IP_TAILSCALE:4000/health

### 9.2 Comandos útiles de PM2
```bash
pm2 status          # Ver estado
pm2 logs            # Ver logs en tiempo real
pm2 restart all     # Reiniciar todo
pm2 stop all        # Parar todo
pm2 delete all      # Eliminar procesos
```

---

## 🛠️ Troubleshooting

### Problema: Frontend no carga
```bash
pm2 logs editorial-frontend
# Verificar que el build existe
ls -la dist/
```

### Problema: Backend no conecta a DB
```bash
pm2 logs editorial-backend
# Verificar variables de entorno
cat backend/.env
```

### Problema: CORS errors
- Asegurar que la IP de Tailscale está en CORS origins
- Verificar que FRONTEND_URL en backend apunta correctamente

---

## 🎯 Comandos de Deployment Rápido

**Script para rebuild y redeploy:**
```bash
#!/bin/bash
# deploy.sh
git pull origin main
npm run build
pm2 restart all
pm2 logs --lines 50
```

---

¿Todo listo? ¡Comencemos con el primer paso en tu Debian! 🚀
