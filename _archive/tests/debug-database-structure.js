// debug-database-structure.js - Script para verificar estructura de la base de datos
const db = require('./db');

async function verificarEstructuraDB() {
  try {
    console.log('🔍 Verificando estructura de la base de datos...\n');

    // Verificar tablas existentes
    const tablasResult = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Tablas existentes:');
    tablasResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    console.log('');

    // Verificar estructura de tabla usuarios
    if (tablasResult.rows.some(row => row.table_name === 'usuarios')) {
      console.log('👥 Estructura tabla USUARIOS:');
      const usuariosColumns = await db.query(`
        SELECT column_name, data_type, is_nullable, column_default 
        FROM information_schema.columns 
        WHERE table_name = 'usuarios' 
        ORDER BY ordinal_position
      `);
      usuariosColumns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
      // Verificar datos de usuarios
      const usuariosData = await db.query('SELECT id, nombre, email, rol FROM usuarios LIMIT 5');
      console.log('  Datos de ejemplo:');
      usuariosData.rows.forEach(user => {
        console.log(`    ${user.id}: ${user.nombre} (${user.rol}) - ${user.email}`);
      });
      console.log('');
    }

    // Verificar estructura de tabla artículos
    if (tablasResult.rows.some(row => row.table_name === 'articulos')) {
      console.log('📄 Estructura tabla ARTICULOS:');
      const articulosColumns = await db.query(`
        SELECT column_name, data_type, is_nullable, column_default 
        FROM information_schema.columns 
        WHERE table_name = 'articulos' 
        ORDER BY ordinal_position
      `);
      articulosColumns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
      // Verificar estados de artículos
      const estadosResult = await db.query(`
        SELECT estado, COUNT(*) as total 
        FROM articulos 
        GROUP BY estado 
        ORDER BY total DESC
      `);
      console.log('  Estados existentes:');
      estadosResult.rows.forEach(estado => {
        console.log(`    ${estado.estado}: ${estado.total} artículos`);
      });
      console.log('');
    }

    // Verificar estructura de tabla revisiones
    if (tablasResult.rows.some(row => row.table_name === 'revisiones')) {
      console.log('🔍 Estructura tabla REVISIONES:');
      const revisionesColumns = await db.query(`
        SELECT column_name, data_type, is_nullable, column_default 
        FROM information_schema.columns 
        WHERE table_name = 'revisiones' 
        ORDER BY ordinal_position
      `);
      revisionesColumns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
      // Verificar estados de revisiones
      const estadosRevResult = await db.query(`
        SELECT estado, COUNT(*) as total 
        FROM revisiones 
        GROUP BY estado 
        ORDER BY total DESC
      `);
      console.log('  Estados de revisiones:');
      estadosRevResult.rows.forEach(estado => {
        console.log(`    ${estado.estado}: ${estado.total} revisiones`);
      });
      console.log('');
    }

    // Probar consultas específicas que están fallando
    console.log('🧪 Probando consultas específicas...\n');
    
    // Test 1: Total usuarios por rol
    try {
      const rolesResult = await db.query(`
        SELECT rol, COUNT(*) as total 
        FROM usuarios 
        GROUP BY rol
      `);
      console.log('✅ Usuarios por rol:');
      rolesResult.rows.forEach(rol => {
        console.log(`    ${rol.rol}: ${rol.total}`);
      });
    } catch (error) {
      console.log('❌ Error en consulta de roles:', error.message);
    }

    // Test 2: Estados de artículos
    try {
      const estadosArtResult = await db.query(`
        SELECT estado, COUNT(*) as total 
        FROM articulos 
        WHERE estado IN ('enviado', 'en_revision', 'borrador', 'aprobado', 'publicado', 'rechazado')
        GROUP BY estado
      `);
      console.log('✅ Estados de artículos:');
      estadosArtResult.rows.forEach(estado => {
        console.log(`    ${estado.estado}: ${estado.total}`);
      });
    } catch (error) {
      console.log('❌ Error en consulta de estados de artículos:', error.message);
    }

    // Test 3: Verificar tabla revisiones
    try {
      const totalRevisiones = await db.query('SELECT COUNT(*) as total FROM revisiones');
      console.log(`✅ Total revisiones: ${totalRevisiones.rows[0].total}`);
    } catch (error) {
      console.log('❌ Error en consulta de revisiones:', error.message);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    process.exit(0);
  }
}

verificarEstructuraDB();
