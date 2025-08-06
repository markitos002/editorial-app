📋 ORDEN DE DEPLOYMENT - Render + Supabase
==========================================

🎯 PASO A PASO PARA DEPLOYMENT EXITOSO:

1️⃣ BACKEND PRIMERO:
   ✅ Crear Web Service para backend
   ✅ Configurar variables de entorno (ver RENDER_BACKEND_CONFIG.md)
   ✅ Esperar que el deploy termine exitosamente
   ✅ Verificar: https://editorial-app-backend.onrender.com/health

2️⃣ FRONTEND DESPUÉS:
   ✅ Crear Static Site para frontend
   ✅ Usar URL exacta del backend en VITE_API_URL
   ✅ Esperar que el deploy termine exitosamente
   ✅ Verificar: https://editorial-app-frontend.onrender.com

🔍 VERIFICACIÓN POST-DEPLOYMENT:

Backend Checks:
   • Health endpoint: /health
   • Database connection: Check logs
   • API endpoints: /api/auth/test

Frontend Checks:
   • Página carga correctamente
   • Puede conectar con backend
   • Login funciona

🚨 TROUBLESHOOTING COMÚN:

❌ Error "Connection timeout":
   → Verificar variables de Supabase
   → Check database connection en logs

❌ Frontend no conecta con backend:
   → Verificar VITE_API_URL
   → Comprobar CORS en backend

❌ "502 Bad Gateway":
   → Backend no está funcionando
   → Revisar logs del backend service

🎉 DEMO LISTO:
   Una vez que ambos servicios estén funcionando:
   • URL pública para el comité
   • Sin necesidad de VPN/Tailscale
   • Acceso global 24/7
