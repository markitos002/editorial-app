🌐 CONFIGURACIÓN FRONTEND SERVICE - Render
==========================================

1️⃣ New → Static Site
2️⃣ Connect GitHub Repository: markitos002/editorial-app
3️⃣ Configuración del servicio:

📝 Service Details:
   • Name: editorial-app-frontend
   • Region: Oregon (US West)
   • Branch: main
   • Root Directory: (vacío - dejar en blanco)

🏗️ Build & Deploy:
   • Build Command: npm install && npm run build
   • Publish Directory: dist

🌍 Environment Variables (COPIAR EXACTAMENTE):
NODE_ENV=production
VITE_API_URL=https://editorial-app-backend.onrender.com/api
VITE_API_TIMEOUT=10000

💰 Plan: Free

✅ Deploy automático: Habilitado

⚠️ IMPORTANTE:
   • El frontend debe deployarse DESPUÉS del backend
   • Usa la URL exacta del backend que Render te asigne
   • Si la URL del backend es diferente, actualiza VITE_API_URL
