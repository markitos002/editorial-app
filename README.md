# 📚 Editorial App - Sistema de Gestión Científica

## 🚀 Estado del Proyecto - Agosto 2025

**✅ PRODUCCIÓN LISTA** - Aplicación completamente funcional desplegada en Render

### 🌐 URLs de Despliegue
- **Frontend:** https://editorial-app-frontend.onrender.com
- **Backend:** https://editorial-app-backend.onrender.com

---

## 📋 Funcionalidades Implementadas

### ✅ **Autenticación y Autorización**
- Sistema de login/registro completo
- Roles: Admin, Editor, Revisor, Autor
- Protección de rutas por rol
- Gestión de tokens JWT

### ✅ **Gestión de Artículos**
- CRUD completo de artículos científicos
- Estados: Borrador, Enviado, En Revisión, Publicado, Rechazado
- Upload de documentos
- Historial de cambios

### ✅ **Sistema de Revisiones**
- Asignación de revisores por editores
- Formularios de revisión completos
- Seguimiento de progreso
- Comentarios y observaciones

### ✅ **Búsqueda Avanzada**
- Búsqueda global y por categorías
- Filtros múltiples (autor, estado, fecha)
- Autocompletado y sugerencias
- Resultados paginados

### ✅ **Sistema de Notificaciones**
- Notificaciones en tiempo real
- Gestión de estado (leída/no leída)
- Notificaciones por usuario y globales

### ✅ **Dashboards Especializados**
- Panel administrativo con estadísticas
- Dashboard de editor con métricas
- Panel de revisor con asignaciones
- Dashboard de autor con sus artículos

### ✅ **SPA Routing Completo** 🆕
- Navegación sin errores 404
- Refresh de página funcional
- URLs directas operativas
- Redirecciones automáticas

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19.1.0** - UI Library
- **Chakra UI 2.10.9** - Component Library
- **React Router** - SPA Routing
- **Vite 7.0.5** - Build Tool
- **Axios** - HTTP Client

### Backend
- **Node.js + Express** - REST API
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Multer** - Upload de archivos
- **CORS** - Cross-origin requests

### Deployment
- **Render** - Hosting (Frontend + Backend)
- **GitHub** - Control de versiones
- **Git Actions** - CI/CD automático

---

## 🏃‍♂️ Inicio Rápido

### Desarrollo Local

```bash
# Clonar repositorio
git clone https://github.com/markitos002/editorial-app.git
cd editorial-app

# Frontend
npm install
npm run dev  # Puerto 5173

# Backend (en otra terminal)
cd backend
npm install
npm run dev  # Puerto 4000
```

### Variables de Entorno
```env
# Backend (.env)
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=4000

# Frontend (.env)
VITE_API_URL=http://localhost:4000/api
```

---

## 📁 Estructura del Proyecto

```
editorial-app/
├── public/
│   ├── _redirects          # SPA routing configuration
│   └── 404.html            # Fallback for SPA routes
├── src/
│   ├── components/         # Componentes reutilizables
│   ├── pages/              # Páginas principales
│   ├── context/            # Context providers
│   ├── services/           # API services
│   ├── utils/              # Utilidades y helpers
│   └── hooks/              # Custom hooks
├── backend/
│   ├── controllers/        # Lógica de negocio
│   ├── routes/             # Rutas de API
│   ├── middlewares/        # Middlewares
│   └── db/                 # Configuración de BD
└── docs/                   # Documentación técnica
```

---

## 🔐 Usuarios de Prueba

```javascript
// Admin
Email: admin@editorial.com
Password: admin123

// Editor  
Email: editor@editorial.com
Password: editor123

// Revisor
Email: revisor@editorial.com  
Password: revisor123

// Autor
Email: autor@editorial.com
Password: autor123
```

---

## 📚 Documentación Detallada

- [📋 Sesión 3 Agosto 2025](./DOCUMENTACION_SESION_03_AGOSTO_2025.md) - SPA Routing Fix
- [📋 Sesión 25 Julio 2025](./DOCUMENTACION_SESION_25_JULIO_2025.md) - Estadísticas y Dashboards
- [📋 Sesión 23 Julio 2025](./DOCUMENTACION_SESION_23_JULIO_2025.md) - Sistema de Revisiones
- [🔧 Guía de Deployment](./DOCUMENTACION_DESPLIEGUE_RENDER.md) - Configuración Render
- [🛡️ Sistema de Roles](./DOCUMENTACION_RESTRICCION_ROLES.md) - Permisos y Seguridad
- [📝 Directrices para Autores](./DIRECTRICES_AUTORES.md) - **NUEVO** - Lista de comprobación y requisitos

---

## 🎯 Próximos Desarrollos

### 🔄 En Progreso
- [ ] Componente "Nuevo Artículo" completamente funcional
- [ ] Panel de configuración de usuario
- [ ] Sistema de notificaciones push

### 📋 Planeado
- [ ] PWA (Progressive Web App)
- [ ] Exportación de reportes (PDF, Excel)
- [ ] Sistema de comentarios en artículos
- [ ] Internacionalización (i18n)
- [ ] Testing E2E completo

---

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Add nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

## 📄 Licencia

Proyecto académico - Universidad XYZ

---

**✨ ¡Aplicación completamente operativa y lista para producción!** ✨
