# 🗄️ Guía: Migración de PostgreSQL Local a Supabase

## 🎯 Objetivo
Migrar la base de datos de tu Debian a Supabase para permitir acceso público via Render.

## 📋 Paso a Paso

### **1. Crear Proyecto en Supabase**

1. Ve a: https://supabase.com
2. Crear cuenta (gratis)
3. "New Project":
   - **Name**: editorial-app-demo
   - **Database Password**: [genera uno seguro]
   - **Region**: US East (más cerca de Render)

### **2. Obtener Credenciales de Conexión**

En tu dashboard de Supabase:
```
Settings → Database → Connection string → URI
```

Ejemplo:
```
postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
```

### **3. Backup de tu BD Actual**

```bash
# En tu Debian, exportar datos actuales
cd ~/editorial-app
pg_dump -h localhost -U markitos -d editorialdata --no-owner --no-privileges > backup-editorialdata.sql

# Limpiar el dump para Supabase
sed -i '/^CREATE EXTENSION/d' backup-editorialdata.sql
sed -i '/^COMMENT ON EXTENSION/d' backup-editorialdata.sql
```

### **4. Importar a Supabase**

#### Opción A: Via Dashboard
1. Supabase Dashboard → SQL Editor
2. Copiar contenido de `backup-editorialdata.sql`
3. Ejecutar

#### Opción B: Via CLI
```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Conectar a tu proyecto
supabase link --project-ref [TU-REF-ID]

# Importar
psql "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" < backup-editorialdata.sql
```

### **5. Verificar Migración**

```sql
-- En Supabase SQL Editor, verificar tablas:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar datos usuarios
SELECT id, email, rol FROM usuarios LIMIT 5;

-- Verificar artículos
SELECT id, titulo, estado FROM articulos LIMIT 5;
```

### **6. Configurar Variables de Entorno para Render**

```env
# .env.production.supabase
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
DB_HOST=db.[REF].supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[TU-PASSWORD]
JWT_SECRET=$%^Tdasd9529841#$&*9dascaseASDeqQQasdcEasdc$##@33
JWT_EXPIRES_IN=24h
NODE_ENV=production
PORT=10000
```

## 🔒 **Configuración de Seguridad en Supabase**

### **Row Level Security (RLS)**
```sql
-- Habilitar RLS en tablas principales
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE articulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE revisiones ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir todo por ahora para demo)
CREATE POLICY "Allow all operations" ON usuarios FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON articulos FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON revisiones FOR ALL USING (true);
```

### **Configurar Auth (Opcional)**
Si quieres usar Supabase Auth en lugar de JWT propio:
```javascript
// Instalar cliente Supabase
npm install @supabase/supabase-js

// Configurar cliente
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://[REF].supabase.co'
const supabaseKey = '[ANON-KEY]'
const supabase = createClient(supabaseUrl, supabaseKey)
```

## 📊 **Límites del Plan Gratuito**

**Supabase Free Tier:**
- ✅ 500MB storage
- ✅ 100MB file uploads
- ✅ 50,000 monthly active users
- ✅ 500MB bandwidth
- ✅ Ideal para demos

**Render Free Tier:**
- ✅ 512MB RAM
- ✅ 100GB bandwidth/mes
- ✅ Ideal para demos

## ⚡ **Proceso Rápido (30 minutos)**

1. **Crear Supabase** (5 min)
2. **Backup + Import** (10 min)
3. **Actualizar variables** (5 min)
4. **Deploy en Render** (10 min)

¿Procedemos con este plan?
