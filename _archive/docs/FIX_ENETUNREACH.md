🔧 FIX ERROR ENETUNREACH - IPv6 → IPv4
====================================

🚨 PROBLEMA IDENTIFICADO:
   Error: connect ENETUNREACH (IPv6 connection issue)
   Causa: Node.js intenta conectar por IPv6 en Render

✅ SOLUCIÓN IMPLEMENTADA:
   • Configuración directa con variables individuales
   • Timeouts configurados para estabilidad
   • Pool de conexiones optimizado
   • SSL obligatorio configurado

🚀 PASOS PARA APLICAR:

1️⃣ Commit y push:
   git add .
   git commit -m "🔧 Fix: IPv6 → IPv4 + pool optimizado para Supabase"
   git push

2️⃣ Esperar redeploy automático (2-3 minutos)

3️⃣ Probar endpoints de diagnóstico:
   https://editorial-app-backend.onrender.com/api/debug/db-status
   https://editorial-app-backend.onrender.com/api/debug/env-check

✅ RESULTADO ESPERADO:
   {"status":"success","message":"Database connection working"}

🔍 SI PERSISTE EL ERROR:
   1. Verificar password en Supabase Dashboard
   2. Reset password si es necesario
   3. Actualizar variables en Render
   4. Probar conexión desde terminal local
