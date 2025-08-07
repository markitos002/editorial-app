# 📚 Editorial App - Sistema de Gestión Editorial

[![Status](https://img.shields.io/badge/Status-Activo-brightgreen)]()
[![Version](https://img.shields.io/badge/Version-2.0-blue)]()
[![Deploy](https://img.shields.io/badge/Deploy-Supabase%20Ready-purple)]()

Sistema completo de gestión editorial con funcionalidades de upload de archivos, revisión por pares y administración de usuarios.

## 🚀 Características Principales

- ✅ **Sistema de Upload Completado**: Archivos almacenados en PostgreSQL (compatible con Supabase)
- ✅ **Autenticación JWT**: Login seguro con roles (autor, editor, admin)
- ✅ **Gestión de Artículos**: CRUD completo con estados de revisión
- ✅ **Sistema de Comentarios**: Feedback estructurado
- ✅ **Dashboard Administrativo**: Métricas y gestión
- ✅ **Responsive UI**: Chakra UI + React 19

## 🏗️ Arquitectura

### Frontend
- **React 19.1.0** + **Vite 7.0.5**
- **Chakra UI 2.10.9** para componentes
- **Framer Motion** para animaciones
- **React Router 7.7.0** para navegación

### Backend
- **Node.js** + **Express 5.1.0**
- **PostgreSQL** (Supabase compatible)
- **JWT** para autenticación
- **Multer** para upload de archivos
- **CORS** configurado para deployment

## 📦 Instalación Rápida

```bash
# Clonar e instalar
git clone https://github.com/markitos002/editorial-app.git
cd editorial-app && npm install
cd backend && npm install

# Configurar entorno
cp .env.example .env
cd backend && cp .env.example .env

# Ejecutar
npm run dev          # Frontend (puerto 5173)
cd backend && npm start  # Backend (puerto 4000)
```

## ⚙️ Configuración Esencial

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:4000/api
```

### Backend (backend/.env)
```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=tu-jwt-secret-muy-seguro
PORT=4000
```

## 📁 Estructura Limpia

```
editorial-app/
├── src/              # Frontend React
├── backend/          # API Express
│   ├── controllers/  # Lógica de negocio
│   ├── routes/      # Rutas API
│   └── middlewares/ # Auth, upload, etc.
├── public/          # Archivos estáticos
└── _archive/        # Tests, docs viejas (archivado)
```

## 🔑 Roles y Funcionalidades

| Rol | Funcionalidades |
|-----|----------------|
| 👤 **Autor** | Crear artículos, subir archivos, ver revisiones |
| ✏️ **Editor** | Revisar artículos, gestionar estados, comentarios |
| 🛡️ **Admin** | Gestión total, dashboard, configuración |

## 🌐 Deploy Options

### 🎯 Recomendado: Supabase + Render
- Base de datos PostgreSQL en Supabase
- Frontend/Backend en Render
- Sistema de archivos en PostgreSQL BLOB

### 🏠 Actual: Debian + Tailscale  
- Sistema funcionando en servidor propio
- Acceso privado VPN
- Control total de datos

## 📊 Estado Actual

- ✅ Sistema completamente funcional
- ✅ Upload de archivos implementado
- ✅ Compatible con Supabase/cloud deployment
- ✅ UI optimizada y responsive
- ✅ Tests archivados para mejor performance

## 📋 Scripts

```bash
# Frontend
npm run dev         # Desarrollo
npm run build       # Producción

# Backend  
npm start           # Servidor
npm run dev         # Con nodemon
```

## 🤝 Contribución

1. Fork del repositorio
2. Crear feature branch
3. Commit cambios
4. Push y crear PR

---

**Proyecto optimizado** - Archivos innecesarios movidos a `_archive/` para mejor performance  
**Última actualización**: 6 de agosto de 2025
