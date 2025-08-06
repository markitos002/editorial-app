// test-env.js - Verificar variables de entorno
require('dotenv').config();

console.log('=== VARIABLES DE ENTORNO ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'undefined');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

// Probar conexión con Pool
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log('\n=== CONFIGURACIÓN DEL POOL ===');
console.log('Pool config:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? '***' : 'undefined',
  port: process.env.DB_PORT,
});

// Probar conexión
async function testConnection() {
  try {
    console.log('\n=== PROBANDO CONEXIÓN ===');
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    const result = await client.query('SELECT NOW()');
    console.log('Hora del servidor:', result.rows[0].now);
    client.release();
    pool.end();
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    console.log('Error completo:', error);
    pool.end();
  }
}

testConnection();
