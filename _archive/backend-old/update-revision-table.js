// update-revision-table.js - Script para actualizar la tabla de revisiones
const pool = require('./db');
const fs = require('fs');
const path = require('path');

async function updateRevisionTable() {
  try {
    console.log('🔄 Actualizando tabla de revisiones...');

    // Leer el script SQL
    const sqlScript = fs.readFileSync(path.join(__dirname, 'add-revision-columns.sql'), 'utf8');
    
    // Ejecutar el script
    const result = await pool.query(sqlScript);
    
    console.log('✅ Tabla de revisiones actualizada exitosamente');
    
    // Mostrar la estructura actual
    console.log('\n📋 Estructura actual de la tabla revisiones:');
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'revisiones' 
      ORDER BY ordinal_position
    `);
    
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

  } catch (error) {
    console.error('❌ Error al actualizar tabla:', error.message);
  } finally {
    pool.end();
  }
}

updateRevisionTable();
