// add-missing-columns.js - Agregar columnas faltantes
const pool = require('./db');

async function addMissingColumns() {
  try {
    console.log('🔄 Agregando columnas faltantes...');

    // Intentar agregar comentarios_privados
    try {
      await pool.query('ALTER TABLE revisiones ADD COLUMN comentarios_privados TEXT');
      console.log('✅ Campo comentarios_privados agregado');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  Campo comentarios_privados ya existe');
      } else {
        console.log('❌ Error al agregar comentarios_privados:', error.message);
      }
    }

    // Intentar agregar justificacion
    try {
      await pool.query('ALTER TABLE revisiones ADD COLUMN justificacion TEXT');
      console.log('✅ Campo justificacion agregado');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  Campo justificacion ya existe');
      } else {
        console.log('❌ Error al agregar justificacion:', error.message);
      }
    }

    // Verificar estructura final
    console.log('\n📋 Verificando estructura final...');
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'revisiones' 
      ORDER BY ordinal_position
    `);
    
    const columnNames = columns.rows.map(col => col.column_name);
    console.log('Columnas disponibles:', columnNames.join(', '));

    // Verificar campos específicos
    const requiredFields = ['comentarios_privados', 'justificacion', 'fecha_actualizacion'];
    requiredFields.forEach(field => {
      const exists = columnNames.includes(field);
      console.log(`   - ${field}: ${exists ? '✅' : '❌'}`);
    });

  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    pool.end();
  }
}

addMissingColumns();
