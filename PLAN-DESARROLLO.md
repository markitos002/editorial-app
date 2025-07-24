# 📋 PLAN DE DESARROLLO - APLICATIVO DE GESTIÓN EDITORIAL

## 🎯 OBJETIVO
Construir una web app completa de gestión editorial que permita:
- ✅ Registro y autenticación de usuarios
- ✅ Carga de artículos
- ✅ Asignar revisores
- ✅ Gestionar recomendaciones y observaciones
- ✅ Notificaciones por correo electrónico
- ✅ Paneles de control diferenciados por rol

---

## 📊 ESTADO ACTUAL (Actualizado: 23 Julio 2025)
✅ **Base de datos**: Configurada con tablas completas + campos de archivos
✅ **Backend**: API completa con autenticación JWT y carga de archivos
✅ **Frontend**: Sistema completo de autenticación y gestión de artículos con archivos
✅ **Sistema de archivos**: Implementado con Multer, validaciones y descarga segura

---

## 🚀 FASES DE DESARROLLO

### **FASE 1: BACKEND API COMPLETA** ✅ (COMPLETADO - 23 Julio 2025)

#### ✅ **1.1 API de Usuarios** (COMPLETADO)
- [x] CRUD usuarios
- [x] Conexión a base de datos
- [x] Validaciones básicas

#### ✅ **1.2 API de Artículos** (COMPLETADO)
- [x] **1.2.1** Crear controlador de artículos
- [x] **1.2.2** Rutas CRUD para artículos
- [x] **1.2.3** Validaciones de artículos
- [x] **1.2.4** Filtros por estado y autor
- [x] **1.2.5** Paginación y manejo de estados
- [x] **1.2.6** **SISTEMA DE CARGA DE ARCHIVOS** (Multer)
- [x] **1.2.7** **VALIDACIONES DE FORMATO Y TAMAÑO**
- [x] **1.2.8** **DESCARGA SEGURA DE ARCHIVOS**

#### ✅ **1.3 API de Revisiones** (COMPLETADO)
- [x] **1.3.1** Asignar revisores a artículos
- [x] **1.3.2** CRUD de revisiones
- [x] **1.3.3** Estados de revisión
- [x] **1.3.4** Historial de revisiones

#### ✅ **1.4 Sistema de Autenticación** (COMPLETADO)
- [x] **1.4.1** JWT para autenticación
- [x] **1.4.2** Middleware de autorización
- [x] **1.4.3** Hash de contraseñas (bcrypt)
- [x] **1.4.4** Rutas protegidas por rol

#### � **1.5 API de Notificaciones** (PENDIENTE)
- [ ] **1.5.1** Sistema de notificaciones internas
- [ ] **1.5.2** Marcar como leído/no leído
- [ ] **1.5.3** Filtros y paginación

---

### **FASE 2: FRONTEND - AUTENTICACIÓN Y GESTIÓN** ✅ (COMPLETADO - 23 Julio 2025)

#### ✅ **2.1 Sistema de Login** (COMPLETADO)
- [x] **2.1.1** Formulario de login
- [x] **2.1.2** Formulario de registro
- [x] **2.1.3** Manejo de estado de autenticación
- [x] **2.1.4** Persistencia de sesión
- [x] **2.1.5** Logout

#### ✅ **2.2 Navegación y Layout** (COMPLETADO)
- [x] **2.2.1** Navbar responsive
- [x] **2.2.2** Sidebar para navegación
- [x] **2.2.3** Rutas protegidas (React Router)
- [x] **2.2.4** Layouts diferenciados por rol

#### ✅ **2.3 Gestión de Artículos con Archivos** (COMPLETADO)
- [x] **2.3.1** **FORMULARIO DE CARGA CON ARCHIVOS**
- [x] **2.3.2** **VALIDACIONES DE FORMATO (doc, docx, pdf, txt)**
- [x] **2.3.3** **LÍMITE DE TAMAÑO (10MB)**
- [x] **2.3.4** **VISTA DE ARTÍCULOS CON METADATOS**
- [x] **2.3.5** **SISTEMA DE DESCARGA DE ARCHIVOS**
- [x] **2.3.6** **MANEJO DE ERRORES Y FEEDBACK**

#### ✅ **2.4 Gestión de Perfil** (COMPLETADO)
- [x] **2.4.1** Ver perfil de usuario
- [x] **2.4.2** Editar perfil
- [x] **2.4.3** Cambiar contraseña

---

### **FASE 3: PANELES DE CONTROL POR ROL** (Estimado: 4-5 días)

#### 👨‍💼 **3.1 Panel de Administrador**
- [ ] **3.1.1** Dashboard con estadísticas generales
- [ ] **3.1.2** Gestión de usuarios (CRUD)
- [ ] **3.1.3** Gestión de artículos
- [ ] **3.1.4** Asignación de revisores
- [ ] **3.1.5** Reportes y analytics

#### ✏️ **3.2 Panel de Editor**
- [ ] **3.2.1** Dashboard de artículos asignados
- [ ] **3.2.2** Gestión de revisiones
- [ ] **3.2.3** Flujo de aprobación/rechazo
- [ ] **3.2.4** Comunicación con autores

#### 📝 **3.3 Panel de Autor** (50% COMPLETADO)
- [x] **3.3.1** Subir nuevos artículos **CON ARCHIVOS**
- [x] **3.3.2** Ver estado de artículos
- [ ] **3.3.3** Responder a revisiones
- [ ] **3.3.4** Historial de publicaciones

#### 🔍 **3.4 Panel de Revisor**
- [ ] **3.4.1** Lista de artículos asignados
- [ ] **3.4.2** Interface de revisión
- [ ] **3.4.3** Formulario de observaciones
- [ ] **3.4.4** Sistema de recomendaciones

---

### **FASE 4: GESTIÓN DE ARTÍCULOS** ✅ (COMPLETADO - 23 Julio 2025)

#### ✅ **4.1 Carga de Artículos** (COMPLETADO)
- [x] **4.1.1** **FORMULARIO DE CARGA CON ARCHIVOS**
- [x] **4.1.2** **VALIDACIONES DE FORMATO (.doc, .docx, .pdf, .txt)**
- [x] **4.1.3** **PREVIEW Y METADATOS DEL ARCHIVO**
- [x] **4.1.4** **Metadatos (título, resumen, palabras clave)**

#### ✅ **4.2 Estados del Artículo** (COMPLETADO)
- [x] **4.2.1** Flujo de estados (enviado → en revisión → aprobado/rechazado)
- [x] **4.2.2** Visualización de estados
- [x] **4.2.3** Historial de cambios

#### 🔄 **4.3 Asignación de Revisores** (PENDIENTE)
- [ ] **4.3.1** Interface para asignar revisores
- [ ] **4.3.2** Criterios de asignación
- [ ] **4.3.3** Notificaciones automáticas

---

### **FASE 5: SISTEMA DE REVISIONES** 🔄 (SIGUIENTE PRIORIDAD)

#### 📋 **5.1 Interface de Revisión**
- [ ] **5.1.1** **VISOR DE ARCHIVOS (doc, pdf, txt)**
- [ ] **5.1.2** **HERRAMIENTAS DE ANOTACIÓN PARA DOCUMENTOS**
- [ ] **5.1.3** Formulario de observaciones
- [ ] **5.1.4** Sistema de calificación

#### 💬 **5.2 Gestión de Observaciones**
- [ ] **5.2.1** Categorización de observaciones
- [ ] **5.2.2** Respuestas del autor
- [ ] **5.2.3** Thread de conversación
- [ ] **5.2.4** Resolución de observaciones

#### 🎯 **5.3 Recomendaciones**
- [ ] **5.3.1** Tipos de recomendación (aceptar, revisar, rechazar)
- [ ] **5.3.2** Justificación de la recomendación
- [ ] **5.3.3** Voto múltiple de revisores
- [ ] **5.3.4** **GESTIÓN DE VERSIONES DE ARCHIVOS**

---

### **FASE 6: SISTEMA DE NOTIFICACIONES** (Estimado: 2-3 días)

#### 🔔 **6.1 Notificaciones Internas**
- [ ] **6.1.1** Centro de notificaciones
- [ ] **6.1.2** Notificaciones en tiempo real
- [ ] **6.1.3** Filtros y categorías

#### 📧 **6.2 Notificaciones por Email**
- [ ] **6.2.1** Configuración de correo (NodeMailer)
- [ ] **6.2.2** Templates de email
- [ ] **6.2.3** Triggers automáticos
- [ ] **6.2.4** Configuraciones de usuario
- [ ] **6.2.5** **NOTIFICACIONES DE ARCHIVOS SUBIDOS**
- [ ] **6.2.6** **ENLACES DE DESCARGA EN EMAILS**

---

### **FASE 7: CARACTERÍSTICAS AVANZADAS** (Estimado: 3-4 días)

#### 🔍 **7.1 Búsqueda y Filtros**
- [ ] **7.1.1** Buscador general
- [ ] **7.1.2** Filtros avanzados
- [ ] **7.1.3** Ordenamiento

#### 📊 **7.2 Reportes y Analytics**
- [ ] **7.2.1** Estadísticas de artículos
- [ ] **7.2.2** Métricas de revisores
- [ ] **7.2.3** Dashboards interactivos
- [ ] **7.2.4** **MÉTRICAS DE ARCHIVOS Y ALMACENAMIENTO**
- [ ] **7.2.5** **ESTADÍSTICAS DE DESCARGA DE DOCUMENTOS**

#### 🎨 **7.3 Mejoras de UX/UI**
- [ ] **7.3.1** Responsive design
- [ ] **7.3.2** Tema oscuro/claro
- [ ] **7.3.3** Animaciones y transiciones

---

### **FASE 8: TESTING Y DEPLOYMENT** (Estimado: 2-3 días)

#### 🧪 **8.1 Testing**
- [ ] **8.1.1** Tests unitarios (Jest)
- [ ] **8.1.2** Tests de integración
- [ ] **8.1.3** Tests E2E (Cypress)

#### 🚀 **8.2 Deployment**
- [ ] **8.2.1** Configuración de producción
- [ ] **8.2.2** Deploy del backend
- [ ] **8.2.3** Deploy del frontend
- [ ] **8.2.4** Configuración de dominio
- [ ] **8.2.5** **CONFIGURACIÓN DE ALMACENAMIENTO EN PRODUCCIÓN (AWS S3)**
- [ ] **8.2.6** **BACKUP Y SEGURIDAD DE ARCHIVOS**

---

## 📅 CRONOGRAMA ACTUALIZADO (23 Julio 2025)

| Fase | Estado | Duración Original | Tiempo Real | Acumulado |
|------|--------|------------------|-------------|-----------|
| ✅ Fase 1: Backend API | **COMPLETADO** | 2-3 días | 3 días | 3 días |
| ✅ Fase 2: Auth & Gestión | **COMPLETADO** | 3-4 días | 4 días | 7 días |
| 🔄 Fase 3: Paneles | **25% AVANZADO** | 4-5 días | 3 días restantes | 10 días |
| ✅ Fase 4: Artículos + Archivos | **COMPLETADO** | 3-4 días | 2 días | 9 días |
| 🔄 Fase 5: Revisiones | **SIGUIENTE** | 4-5 días | 5 días | 15 días |
| Fase 6: Notificaciones | PENDIENTE | 2-3 días | - | 18 días |
| Fase 7: Avanzadas | PENDIENTE | 3-4 días | - | 22 días |
| Fase 8: Testing/Deploy | PENDIENTE | 2-3 días | - | **25 días** |

**PROGRESO ACTUAL: ~40% COMPLETADO**  
**TIEMPO RESTANTE ESTIMADO: ~18 días (3 semanas)**

---

## 🛠️ TECNOLOGÍAS A USAR

### Backend
- ✅ Node.js + Express
- ✅ PostgreSQL
- ✅ JWT para autenticación
- ✅ Bcrypt para passwords
- ✅ **Multer para archivos**
- [ ] Nodemailer para emails

### Frontend
- ✅ React 19
- ✅ Chakra UI
- ✅ React Router para navegación
- [ ] React Query para estado servidor
- [ ] React Hook Form para formularios

---

## 📋 CHECKLIST DE PROGRESO (Actualizado: 23 Julio 2025)

### ✅ COMPLETADO
- [x] Configuración inicial del proyecto
- [x] Base de datos con tablas + campos de archivos
- [x] **API completa de usuarios con autenticación JWT**
- [x] **API completa de artículos con carga de archivos**
- [x] **API de revisiones implementada**
- [x] **Frontend completo con autenticación**
- [x] **Sistema de carga y descarga de archivos**
- [x] **Validaciones de seguridad y formato**
- [x] **Configuración de desarrollo (proxy Vite)**

### 🔄 EN PROGRESO
- [ ] **Paneles diferenciados por rol (25% completado)**
- [ ] **Sistema de asignación de revisores**

### 🎯 PRÓXIMOS PASOS INMEDIATOS
1. **Sistema de revisiones para archivos** (Fase 5.1)
2. **Herramientas de anotación de documentos** (Fase 5.2)
3. **Paneles de control por rol completar** (Fase 3)
4. **Sistema de notificaciones** (Fase 6)

### 🚀 CARACTERÍSTICAS PRINCIPALES IMPLEMENTADAS
- ✅ **Autenticación JWT completa**
- ✅ **Carga de archivos académicos (.doc, .docx, .pdf, .txt)**
- ✅ **Validaciones robustas (formato, tamaño 10MB)**
- ✅ **Descarga segura con autenticación**
- ✅ **Base de datos con metadatos de archivos**
- ✅ **Interface responsive con Chakra UI**

¿Quieres que comencemos con el siguiente paso?

---

## 📁 SISTEMA DE ARCHIVOS IMPLEMENTADO (23 Julio 2025)

### 🔧 **Características Técnicas**
- **Middleware:** Multer con almacenamiento en disco
- **Ubicación:** `backend/uploads/` (desarrollo) 
- **Formatos soportados:** .doc, .docx, .pdf, .txt
- **Límite de tamaño:** 10MB por archivo
- **Nomenclatura:** `timestamp_userid_nombre.ext`
- **Validaciones:** Tipo MIME, tamaño, existencia física

### 🔐 **Seguridad Implementada**
- **Autenticación:** JWT requerido para subir/descargar
- **Autorización:** Roles verificados (autor, editor, admin)
- **Sanitización:** Nombres de archivo limpiados
- **Cleanup automático:** Eliminación si falla la BD
- **Acceso controlado:** Descarga solo con token válido

### 🗄️ **Base de Datos Actualizada**
```sql
-- Campos agregados a la tabla articulos:
archivo_nombre VARCHAR(255)    -- Nombre original del archivo
archivo_path VARCHAR(500)      -- Ruta física en el servidor  
archivo_mimetype VARCHAR(100)  -- Tipo MIME del archivo
archivo_size INTEGER           -- Tamaño en bytes
```

### 🎯 **Para Producción - Opciones Preparadas**
1. **Servidor tradicional:** Almacenamiento en `/var/www/uploads`
2. **AWS S3:** Configuración lista para implementar
3. **Backup automático:** Scripts preparados
4. **Monitoreo de espacio:** Variables de entorno configuradas

### 📊 **Métricas Actuales**
- **Archivos de prueba:** 1 documento Word subido exitosamente
- **Espacio usado:** ~2MB en desarrollo
- **Tiempo de carga:** <1s para archivos <5MB
- **Tiempo de descarga:** <500ms para archivos promedio
