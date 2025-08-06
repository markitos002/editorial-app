# 📋 Guía Paso a Paso: Configurar Supabase Correctamente

## 🎯 Objetivo
Obtener las credenciales correctas de Supabase y configurar la conexión.

---

## 🚀 Paso 1: Acceder a Supabase

### **1.1 Ir al Dashboard**
1. **Abrir**: https://supabase.com
2. **Hacer clic en**: "Sign in" (si ya tienes cuenta) o "Start your project" (nueva cuenta)
3. **Autenticarse** con GitHub/Google/Email

### **1.2 Verificar o Crear Proyecto**
- **Si tienes proyecto**: Debería aparecer en el dashboard
- **Si NO tienes proyecto**: 
  1. Clic en "New Project"
  2. **Name**: `editorial-app-demo`
  3. **Database Password**: Crear una segura (anótala)
  4. **Region**: `East US` (más cerca de Render)
  5. Clic "Create new project"

---

## 🔑 Paso 2: Obtener Credenciales

### **2.1 Navegar a Database Settings**
1. **En tu proyecto** → **Settings** (ícono de engranaje)
2. **Database** (en el menú lateral)

### **2.2 Copiar Connection String**
1. **Buscar sección**: "Connection string"
2. **Seleccionar**: "URI" (no "Connection pooling")
3. **Copiar la URL completa** que se ve así:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### **2.3 Identificar Componentes**
De la URL anterior, extraer:
- **HOST**: `db.[PROJECT-REF].supabase.co`
- **PASSWORD**: `[YOUR-PASSWORD]`
- **PROJECT-REF**: String como `abcdefghijklmnopqr`

---

## 📝 Paso 3: Actualizar Configuración

### **3.1 Archivo render-supabase.yaml**
Reemplazar estas líneas con tus datos reales:
```yaml
# Antes (ejemplo):
DATABASE_URL: postgresql://postgres:VqX2KgTvTZLrOWlq@db.editorialdata.supabase.co:5432/postgres
DB_HOST: db.editorialdata.supabase.co
DB_PASSWORD: VqX2KgTvTZLrOWlq

# Después (con tus datos):
DATABASE_URL: postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres
DB_HOST: db.[TU-PROJECT-REF].supabase.co
DB_PASSWORD: [TU-PASSWORD]
```

---

## 🧪 Paso 4: Probar Conexión

### **4.1 Test desde Windows (PowerShell)**
```powershell
# Instalar psql si no lo tienes
# Descargar desde: https://www.postgresql.org/download/windows/

# Probar conexión
psql "postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres" -c "SELECT version();"
```

### **4.2 Test desde Dashboard de Supabase**
1. **En tu proyecto** → **SQL Editor**
2. **Nueva query** → Escribir: `SELECT version();`
3. **Ejecutar** → Debería mostrar la versión de PostgreSQL

---

## ❓ Troubleshooting Común

### **Error: "This project does not exist"**
- ✅ Verificar que el PROJECT-REF sea correcto
- ✅ Verificar que el proyecto esté "Active" (no pausado)
- ✅ Verificar que la password sea correcta

### **Error: "Connection timed out"**
- ✅ Verificar conexión a internet
- ✅ Verificar que no haya firewall bloqueando puerto 5432

### **Error: "Authentication failed"**
- ✅ Verificar password correcta
- ✅ Intentar resetear password en Supabase

---

## 🎯 Checklist de Verificación

- [ ] Tengo cuenta en Supabase
- [ ] Mi proyecto está "Active" 
- [ ] Copié la URL de conexión correcta
- [ ] Identifiqué HOST y PASSWORD correctos
- [ ] Actualicé render-supabase.yaml
- [ ] Probé la conexión exitosamente

---

## 🔄 Próximo Paso

Una vez que tengas la conexión funcionando:
1. **Exportar** tu BD local
2. **Importar** a Supabase
3. **Probar** backend con Supabase
4. **Deployar** en Render
