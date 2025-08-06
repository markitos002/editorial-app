// test-supabase-connection.js - Script para probar la conexión a Supabase
require('dotenv').config();
const { Pool } = require('pg');

async function testSupabaseConnection() {
  console.log('🔧 Probando conexión a Supabase...');
  
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });

  try {
    console.log('📡 Conectando...');
    const client = await pool.connect();
    console.log('✅ Conexión exitosa');
    
    // Verificar si existe la tabla articulos
    console.log('\n📊 Verificando tabla articulos...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'articulos'
      );
    `);
    
    console.log('Tabla articulos existe:', tableCheck.rows[0].exists);
    
    // Verificar si existe la tabla usuarios
    console.log('\n👥 Verificando tabla usuarios...');
    const userTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      );
    `);
    
    console.log('Tabla usuarios existe:', userTableCheck.rows[0].exists);
    
    if (!userTableCheck.rows[0].exists) {
      console.log('⚠️ La tabla usuarios no existe, esto puede causar problemas en el JOIN');
    }
    
    if (tableCheck.rows[0].exists) {
      // Obtener estructura de la tabla
      console.log('\n🏗️ Estructura de la tabla articulos:');
      const structure = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'articulos' 
        ORDER BY ordinal_position;
      `);
      
      structure.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
      // Contar artículos
      console.log('\n📈 Contando artículos...');
      const count = await client.query('SELECT COUNT(*) FROM articulos;');
      console.log('Total artículos:', count.rows[0].count);
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

testSupabaseConnection();
