// migrate-columns.js
const pool = require('./db');

async function migrateColumns() {
  try {
    console.log('Agregando columnas faltantes a la tabla articulos...');
    
    // Agregar columna palabras_clave (array de texto)
    await pool.query(`
      ALTER TABLE articulos 
      ADD COLUMN IF NOT EXISTS palabras_clave TEXT[] DEFAULT '{}'
    `);
    
    // Agregar columna area_tematica
    await pool.query(`
      ALTER TABLE articulos 
      ADD COLUMN IF NOT EXISTS area_tematica VARCHAR(100) DEFAULT 'cuidados-enfermeria'
    `);
    
    console.log('✅ Columnas agregadas exitosamente');
    
    // Verificar las columnas
    const result = await pool.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'articulos' 
      ORDER BY ordinal_position
    `);
    
    console.log('\nEstructura actualizada de la tabla articulos:');
    result.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (default: ${col.column_default || 'none'})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

migrateColumns();
