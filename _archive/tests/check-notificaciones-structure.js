// check-notificaciones-structure.js - Verificar estructura real de la tabla
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '192.168.18.5',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Chajoma24',
  database: process.env.DB_NAME || 'revista_db',
  port: process.env.DB_PORT || 5432,
});

async function checkTableStructure() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verificando estructura real de la tabla notificaciones...\n');
    
    // Obtener estructura de la tabla
    const structureQuery = `
      SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'notificaciones' 
      ORDER BY ordinal_position;
    `;
    
    const result = await client.query(structureQuery);
    
    console.log('📋 Estructura actual de la tabla:');
    console.table(result.rows);
    
    // Obtener una muestra de los datos
    console.log('\n📊 Muestra de datos existentes:');
    const sampleQuery = 'SELECT * FROM notificaciones LIMIT 3';
    const sampleResult = await client.query(sampleQuery);
    
    if (sampleResult.rows.length > 0) {
      console.table(sampleResult.rows);
    } else {
      console.log('❌ No hay datos en la tabla');
    }
    
    // Contar registros
    const countResult = await client.query('SELECT COUNT(*) as total FROM notificaciones');
    console.log(`\n📈 Total de registros: ${countResult.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkTableStructure();
