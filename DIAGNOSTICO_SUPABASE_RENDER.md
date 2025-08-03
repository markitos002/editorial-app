🔍 DIAGNÓSTICO COMPLETO SUPABASE + RENDER
==========================================

📋 CHECKLIST DE VERIFICACIÓN:

1️⃣ CONFIGURACIÓN ACTUAL EN RENDER:
   Ve a Render Dashboard → editorial-app-backend → Environment
   
   ¿Cuál es el valor actual de DATABASE_URL?
   □ Contiene: db.ybnpusbnqlizaiqvztph.supabase.co:5432
   □ Contiene: pooler.supabase.com:6543
   □ Contiene: ?sslmode=require al final
   
2️⃣ SUPABASE CONNECTION POOLER:
   Ve a Supabase Dashboard → Settings → Database
   
   ¿Qué opciones de conexión ves?
   □ Solo "Direct Connection"
   □ También "Connection Pooler" / "Session Pooler"
   □ También "Transaction Pooler"

3️⃣ ENDPOINTS DE DIAGNÓSTICO:
   Probar en navegador/Postman:
   
   ✅ Backend funcionando:
   https://editorial-app-backend.onrender.com/health
   Resultado esperado: {"status":"healthy"}
   
   ❌ Database connection:
   https://editorial-app-backend.onrender.com/api/debug/db-status
   Resultado actual: {"status":"error","code":"ENETUNREACH"}
   
   ✅ Variables de entorno:
   https://editorial-app-backend.onrender.com/api/debug/env-check
   Resultado: Todas las variables presentes

4️⃣ ALTERNATIVAS PARA PROBAR:

   OPCIÓN A - Connection Pooler (si está disponible):
   DATABASE_URL=postgresql://postgres:[password]@[pooler-host]:6543/postgres
   
   OPCIÓN B - Supabase con puerto alternativo:
   DATABASE_URL=postgresql://postgres:[password]@db.ybnpusbnqlizaiqvztph.supabase.co:6543/postgres
   
   OPCIÓN C - Verificar password:
   ¿Estás 100% seguro de que VqX2KgTvTZLrOWlq es la password correcta?

🚀 PRUEBAS PASO A PASO:

Paso 1: Confirmar configuración actual
Paso 2: Verificar opciones en Supabase Dashboard  
Paso 3: Probar Connection Pooler si está disponible
Paso 4: Probar puerto alternativo
Paso 5: Verificar/resetear password si es necesario
