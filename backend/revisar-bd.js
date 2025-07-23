// Script para revisar todas las tablas en la base de datos
const { Pool } = require('pg');

const config = {
  user: 'markitos',
  host: '192.168.18.5',
  database: 'editorialdata',
  password: 'AjedreZ22',
  port: 5432,
};

async function revisarEstructuraCompleta() {
  const pool = new Pool(config);
  
  try {
    const client = await pool.connect();
    
    console.log('📋 REVISIÓN COMPLETA DE LA BASE DE DATOS\n');
    
    // 1. Ver todas las tablas
    const tablas = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('🗃️  TABLAS EXISTENTES:');
    tablas.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });
    
    // 2. Para cada tabla, mostrar su estructura
    for (const tabla of tablas.rows) {
      console.log(`\n📊 ESTRUCTURA DE: ${tabla.table_name.toUpperCase()}`);
      
      const estructura = await client.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position
      `, [tabla.table_name]);
      
      console.table(estructura.rows);
      
      // Contar registros
      const count = await client.query(`SELECT COUNT(*) as total FROM ${tabla.table_name}`);
      console.log(`   📈 Total de registros: ${count.rows[0].total}`);
    }
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

revisarEstructuraCompleta();
