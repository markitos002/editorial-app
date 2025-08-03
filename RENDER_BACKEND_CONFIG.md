🔧 CONFIGURACIÓN BACKEND SERVICE - Render
==========================================

1️⃣ New → Web Service
2️⃣ Connect GitHub Repository: markitos002/editorial-app
3️⃣ Configuración del servicio:

📝 Service Details:
   • Name: editorial-app-backend
   • Region: Oregon (US West)
   • Branch: main
   • Root Directory: backend
   • Runtime: Node

🏗️ Build & Deploy:
   • Build Command: npm install
   • Start Command: npm start

🌍 Environment Variables (COPIAR EXACTAMENTE):
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://postgres:VqX2KgTvTZLrOWlq@db.ybnpusbnqlizaiqvztph.supabase.co:5432/postgres?sslmode=require
DB_HOST=db.ybnpusbnqlizaiqvztph.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=VqX2KgTvTZLrOWlq
JWT_SECRET=$%^Tdasd9529841#$&*9dascaseASDeqQQasdcEasdc$##@33
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
UPLOAD_MAX_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
UPLOAD_FOLDER=uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

⚡ ACTUALIZACIÓN IPv6 → IPv4 Fix:
   • Connection string con sslmode=require
   • Pool configurado con timeouts explícitos
   • Conexiones reducidas para estabilidad

💰 Plan: Free

✅ Deploy automático: Habilitado
