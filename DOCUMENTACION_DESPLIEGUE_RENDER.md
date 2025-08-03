# 🌐 Guía de Despliegue en Render

## 🎯 Resumen

Esta guía documenta el proceso de despliegue de Editorial App en Render como alternativa de hosting público al despliegue privado con Tailscale.

---

## 🔄 Comparación: Tailscale vs Render

| Aspecto | Tailscale (Privado) | Render (Público) |
|---------|-------------------|------------------|
| **Acceso** | VPN privada | Internet público |
| **Costo** | $0 (hardware propio) | Free tier disponible |
| **Escalabilidad** | Manual | Automática |
| **SSL/HTTPS** | Manual | Automático |
| **Base de Datos** | PostgreSQL local | PostgreSQL gestionado |
| **Tiempo de setup** | ~2 horas | ~30 minutos |
| **Mantenimiento** | Manual | Mínimo |

---

## 🚀 Proceso de Despliegue Paso a Paso

### **Paso 1: Preparación del Repositorio**

1. **Confirmar archivos de configuración**:
   ```
   ✅ render.yaml (configuración de servicios)
   ✅ .env.production (variables de entorno)
   ✅ scripts/init-db-render.sh (inicialización de BD)
   ✅ scripts/health-check-render.js (health checks)
   ```

2. **Commit y push de cambios**:
   ```bash
   git add .
   git commit -m "feat: Add Render deployment configuration"
   git push origin main
   ```

### **Paso 2: Configuración en Render**

1. **Crear cuenta en Render**: https://render.com
2. **Conectar repositorio GitHub**: `markitos002/editorial-app`
3. **Crear servicios usando render.yaml**:
   - Seleccionar "Blueprint" en lugar de crear servicios individuales
   - Render detectará automáticamente el archivo `render.yaml`

### **Paso 3: Configuración de Variables de Entorno**

#### **Backend Service**:
```env
NODE_ENV=production
PORT=10000
JWT_SECRET=[auto-generated]
JWT_EXPIRES_IN=24h
DATABASE_URL=[auto-linked from database]
```

#### **Frontend Static Site**:
```env
VITE_API_URL=https://editorial-app-backend.onrender.com/api
VITE_APP_NAME=Editorial App
VITE_ENVIRONMENT=production
```

### **Paso 4: Configuración de Base de Datos**

1. **PostgreSQL Database**:
   - Nombre: `editorial-app-db`
   - Usuario: `editorialuser`
   - Región: Oregon
   - Plan: Starter (gratis)

2. **Inicialización automática**:
   - Render ejecutará `scripts/init-db-render.sh`
   - Se crearán todas las tablas necesarias
   - Se insertarán usuarios de prueba

### **Paso 5: Despliegue y Verificación**

1. **Deploy automático**:
   - Backend: https://editorial-app-backend.onrender.com
   - Frontend: https://editorial-app-frontend.onrender.com

2. **Health checks**:
   - Backend: `/health` y `/api/health/db`
   - Frontend: Carga de página principal

---

## 🔧 Configuraciones Específicas

### **CORS para Render**

El backend está configurado para permitir:
- Dominios `.onrender.com`
- IPs de Tailscale (100.x.x.x)
- Localhost para desarrollo

### **Detección Automática de API**

El frontend detecta automáticamente el entorno:
- **Render**: Usa `VITE_API_URL` o construye URL automáticamente
- **Tailscale**: Usa IP hardcodeada `100.115.107.89:4000`
- **Local**: Usa `localhost:4000`

### **Base de Datos Híbrida**

La configuración de BD soporta:
- **Render**: `DATABASE_URL` con SSL
- **Local**: Variables individuales sin SSL

---

## 🛠️ Monitoreo y Debugging

### **Logs en Render**

1. **Backend logs**:
   ```bash
   # Acceder desde Render dashboard
   Services → editorial-app-backend → Logs
   ```

2. **Frontend logs**:
   ```bash
   # Build logs disponibles en dashboard
   Services → editorial-app-frontend → Events
   ```

### **Health Checks**

```bash
# Verificar estado del backend
curl https://editorial-app-backend.onrender.com/health

# Verificar conexión a BD
curl https://editorial-app-backend.onrender.com/api/health/db

# Verificar frontend
curl https://editorial-app-frontend.onrender.com
```

### **Debugging Local**

Para probar cambios antes del deploy:
```bash
# Simular entorno de Render
VITE_API_URL=https://editorial-app-backend.onrender.com/api npm run dev

# Probar build local
npm run build:production
npm run preview:production
```

---

## 🔄 Flujo de Trabajo Híbrido

### **Desarrollo**
1. Desarrollo local (Windows)
2. Test con Tailscale (acceso remoto privado)
3. Test con Render (acceso público)
4. Deploy a producción

### **Testing**
- **Local**: `http://localhost:5173`
- **Tailscale**: `http://100.115.107.89:5173`
- **Render**: `https://editorial-app-frontend.onrender.com`

---

## 🎯 Ventajas del Enfoque Híbrido

### **Desarrollo y Testing**
- ✅ **Render**: Testing público con stakeholders
- ✅ **Tailscale**: Testing privado y desarrollo
- ✅ **Local**: Desarrollo rápido sin latencia

### **Escalabilidad**
- ✅ **Render**: Auto-escalado para tráfico público
- ✅ **Tailscale**: Control total para casos específicos
- ✅ **Migración fácil** entre entornos

### **Costo-Beneficio**
- ✅ **Render free tier**: Hasta 750 horas/mes
- ✅ **Tailscale**: Hardware propio sin costo recurrente
- ✅ **Flexibilidad** para elegir según necesidad

---

## 🚨 Limitaciones y Consideraciones

### **Render Free Tier**
- ⚠️ **Sleep después de 15 min** de inactividad
- ⚠️ **500 GB bandwidth** mensual
- ⚠️ **PostgreSQL**: 1GB almacenamiento, 1 mes retención
- ⚠️ **Cold starts**: ~30 segundos para despertar

### **Recomendaciones**
1. **Usar Render para demos y testing público**
2. **Usar Tailscale para desarrollo y uso interno**
3. **Considerar upgrade a plan pago** si se necesita 24/7
4. **Monitorear usage** para evitar límites

---

## 📊 URLs de Acceso

### **Producción**
- **Frontend Render**: https://editorial-app-frontend.onrender.com
- **Backend Render**: https://editorial-app-backend.onrender.com
- **API Health**: https://editorial-app-backend.onrender.com/health

### **Desarrollo/Interno**
- **Frontend Tailscale**: http://100.115.107.89:5173
- **Backend Tailscale**: http://100.115.107.89:4000
- **Local**: http://localhost:5173

---

## 🔮 Próximos Pasos

1. **Monitorear performance** en Render vs Tailscale
2. **Evaluar costos** después del período de prueba
3. **Implementar CI/CD** más robusto
4. **Considerar CDN** para assets estáticos
5. **Backup strategy** para base de datos de Render

---

**Fecha de creación**: 2 de agosto, 2025  
**Autor**: Equipo Editorial App  
**Status**: 🚧 En Testing
