// db/index.js
const { Pool } = require('pg');
require('dotenv').config();

// Debug: verificar variables de entorno
console.log('🔧 Database Configuration Debug:');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD type:', typeof process.env.DB_PASSWORD);
console.log('DB_PASSWORD value:', process.env.DB_PASSWORD ? '***' : 'UNDEFINED');
console.log('DB_PORT:', process.env.DB_PORT);

let pool;

// Configuración para Render (usa DATABASE_URL) o local (usa variables individuales)
if (process.env.DATABASE_URL) {
  console.log('🚀 Using DATABASE_URL for Render deployment');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  console.log('🏠 Using individual DB variables for local development');
  // Asegurar que la password sea un string
  const dbConfig = {
    user: process.env.DB_USER || 'markitos',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'editorialdata',
    password: String(process.env.DB_PASSWORD || '123456'),
    port: parseInt(process.env.DB_PORT || '5432'),
  };

  console.log('✅ Final config types:', {
    user: typeof dbConfig.user,
    host: typeof dbConfig.host,
    database: typeof dbConfig.database,
    password: typeof dbConfig.password,
    port: typeof dbConfig.port
  });

  pool = new Pool(dbConfig);
}

module.exports = pool;