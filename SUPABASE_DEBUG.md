🔧 VERIFICACIÓN CREDENCIALES SUPABASE
====================================

🚨 ERROR 500 - Posibles causas:

1️⃣ Password incorrecta de Supabase
2️⃣ Configuración SSL
3️⃣ Variables de entorno mal configuradas

🔍 PASOS PARA VERIFICAR:

1️⃣ Verificar password en Supabase:
   👉 Ve a: https://supabase.com/dashboard/project/ybnpusbnqlizaiqvztph
   👉 Settings → Database
   👉 Busca "Connection string" → "URI"
   👉 Copia la password exacta de ahí

2️⃣ Verificar que la password actual sea correcta:
   🔑 Actual en Render: VqX2KgTvTZLrOWlq
   ❓ ¿Es esta la password correcta de tu proyecto?

3️⃣ Endpoints de diagnóstico creados:
   🔍 https://editorial-app-backend.onrender.com/api/debug/db-status
   🔍 https://editorial-app-backend.onrender.com/api/debug/env-check

📋 SOLUCIONES:

Si password es incorrecta:
1. Ir a Supabase Dashboard → Settings → Database
2. Copiar password correcta
3. Actualizar variable DB_PASSWORD en Render
4. Redeploy automático

Si persiste el error:
1. Reset password en Supabase
2. Usar nueva password
3. Actualizar todas las configuraciones

🚀 DESPUÉS DEL FIX:
1. git add . && git commit -m "Fix: SSL y debug endpoints"
2. git push
3. Esperar redeploy automático
4. Probar endpoints de diagnóstico
