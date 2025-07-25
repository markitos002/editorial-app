// simple-test-connection.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'editorial_app',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

async function testConnection() {
    try {
        console.log('🔧 Conectando a PostgreSQL...');
        const client = await pool.connect();
        console.log('✅ Conexión exitosa!');
        
        const result = await client.query('SELECT NOW()');
        console.log('⏰ Tiempo del servidor:', result.rows[0].now);
        
        // Verificar si existe la tabla usuarios
        const tablesResult = await client.query("SELECT tablename FROM pg_tables WHERE schemaname='public'");
        console.log('📋 Tablas disponibles:', tablesResult.rows.map(row => row.tablename));
        
        client.release();
        await pool.end();
        
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        process.exit(1);
    }
}

testConnection();
