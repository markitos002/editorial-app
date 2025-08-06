// check-revision-table.js - Verificar estructura de tabla revisiones
const pool = require('./db');

async function checkRevisionTable() {
  try {
    console.log('🔍 Verificando estructura de tabla revisiones...');

    // Mostrar la estructura actual
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'revisiones' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Estructura actual de la tabla revisiones:');
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    // Verificar datos existentes
    const count = await pool.query('SELECT COUNT(*) as count FROM revisiones');
    console.log(`\n📊 Datos existentes: ${count.rows[0].count} revisiones`);

    // Mostrar algunas revisiones de ejemplo
    const sample = await pool.query('SELECT * FROM revisiones LIMIT 3');
    console.log('\n📄 Ejemplo de datos:');
    sample.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ID: ${row.id}, Estado: ${row.estado}, Artículo: ${row.articulo_id}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pool.end();
  }
}

checkRevisionTable();
