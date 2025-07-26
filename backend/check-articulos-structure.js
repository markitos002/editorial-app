// check-articulos-structure.js - Verificar estructura de la tabla artículos
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '192.168.18.5',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Chajoma24',
  database: process.env.DB_NAME || 'revista_db',
  port: process.env.DB_PORT || 5432,
});

async function checkArticulosStructure() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verificando estructura de la tabla artículos...\n');
    
    const structureQuery = `
      SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'articulos' 
      ORDER BY ordinal_position;
    `;
    
    const result = await client.query(structureQuery);
    console.log('📋 Estructura de la tabla artículos:');
    console.table(result.rows);
    
    // Obtener muestra de datos
    console.log('\n📊 Muestra de datos:');
    const sampleQuery = 'SELECT * FROM articulos LIMIT 2';
    const sampleResult = await client.query(sampleQuery);
    
    if (sampleResult.rows.length > 0) {
      console.table(sampleResult.rows);
    } else {
      console.log('❌ No hay datos en la tabla');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkArticulosStructure();
