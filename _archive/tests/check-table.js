// check-table.js - Verificar estructura de tablas
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '192.168.18.5',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Chajoma24',
  database: process.env.DB_NAME || 'revista_db',
  port: process.env.DB_PORT || 5432,
});

async function checkTable(tableName) {
  const client = await pool.connect();
  
  try {
    console.log(`\n🔍 Verificando tabla: ${tableName}...`);
    
    // Verificar si existe
    const existsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = $1
      );
    `;
    const existsResult = await client.query(existsQuery, [tableName]);
    
    if (!existsResult.rows[0].exists) {
      console.log(`❌ La tabla "${tableName}" NO EXISTE`);
      return;
    }
    
    // Obtener estructura
    const structureQuery = `
      SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_default
      FROM information_schema.columns 
      WHERE table_name = $1 
      ORDER BY ordinal_position;
    `;
    
    const result = await client.query(structureQuery, [tableName]);
    console.log(`✅ Tabla "${tableName}" existe:`);
    console.table(result.rows);
    
  } catch (error) {
    console.error(`❌ Error verificando ${tableName}:`, error.message);
  } finally {
    client.release();
  }
}

async function checkTables() {
  console.log('🔍 === VERIFICACIÓN DE ESTRUCTURAS DE TABLAS ===');
  
  await checkTable('comentarios');
  await checkTable('asignaciones_revision');
  await checkTable('asignaciones');
  
  await pool.end();
}

checkTables();
