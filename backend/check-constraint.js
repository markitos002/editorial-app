const pool = require('./db/index.js');

async function checkConstraint() {
  try {
    // Verificar la restricción de estado (método actualizado para PostgreSQL)
    const result = await pool.query(`
      SELECT 
        conname as constraint_name,
        pg_get_constraintdef(oid) as constraint_definition
      FROM pg_constraint 
      WHERE conname LIKE '%estado%' 
        AND conrelid = 'articulos'::regclass;
    `);
    
    console.log('=== RESTRICCIONES DE ESTADO ===');
    if (result.rows.length > 0) {
      result.rows.forEach(row => {
        console.log(`Constraint: ${row.constraint_name}`);
        console.log(`Definition: ${row.constraint_definition}`);
      });
    } else {
      console.log('No se encontraron restricciones de estado');
    }
    
    // También verificar la estructura de la tabla
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'articulos' AND column_name = 'estado';
    `);
    
    console.log('\n=== INFORMACIÓN DE COLUMNA ESTADO ===');
    console.log('Información de columna estado:', tableInfo.rows[0]);
    
    // Verificar todos los constraints de la tabla articulos
    const allConstraints = await pool.query(`
      SELECT 
        conname as constraint_name,
        pg_get_constraintdef(oid) as constraint_definition
      FROM pg_constraint 
      WHERE conrelid = 'articulos'::regclass;
    `);
    
    console.log('\n=== TODOS LOS CONSTRAINTS DE ARTICULOS ===');
    allConstraints.rows.forEach(row => {
      console.log(`${row.constraint_name}: ${row.constraint_definition}`);
    });
    
    await pool.end();
  } catch(e) {
    console.error('Error:', e.message);
    await pool.end();
  }
}

checkConstraint();
