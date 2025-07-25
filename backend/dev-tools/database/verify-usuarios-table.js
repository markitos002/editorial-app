// verify-usuarios-table.js
const pool = require('./db/index.js');

async function verificarTablaUsuarios() {
  try {
    console.log('🔍 Verificando estructura de la tabla usuarios...\n');

    // Verificar estructura actual
    const estructura = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'usuarios'
      ORDER BY ordinal_position;
    `);

    console.log('📋 Estructura actual de la tabla usuarios:');
    console.table(estructura.rows);

    // Verificar si existen las columnas necesarias para autenticación
    const columnasNecesarias = ['ultimo_acceso', 'activo'];
    const columnasExistentes = estructura.rows.map(row => row.column_name);
    
    const columnasFaltantes = columnasNecesarias.filter(col => !columnasExistentes.includes(col));

    if (columnasFaltantes.length > 0) {
      console.log(`\n⚠️  Faltan las siguientes columnas: ${columnasFaltantes.join(', ')}`);
      console.log('🔧 Agregando columnas faltantes...\n');

      // Agregar columna ultimo_acceso si no existe
      if (columnasFaltantes.includes('ultimo_acceso')) {
        await pool.query(`
          ALTER TABLE usuarios 
          ADD COLUMN ultimo_acceso TIMESTAMP DEFAULT NULL;
        `);
        console.log('✅ Columna ultimo_acceso agregada');
      }

      // Agregar columna activo si no existe
      if (columnasFaltantes.includes('activo')) {
        await pool.query(`
          ALTER TABLE usuarios 
          ADD COLUMN activo BOOLEAN DEFAULT true;
        `);
        console.log('✅ Columna activo agregada');
      }

      console.log('\n🎉 Tabla usuarios actualizada para autenticación');
    } else {
      console.log('\n✅ La tabla usuarios ya tiene todas las columnas necesarias');
    }

    // Mostrar estructura final
    const estructuraFinal = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'usuarios'
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Estructura final de la tabla usuarios:');
    console.table(estructuraFinal.rows);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verificarTablaUsuarios();
