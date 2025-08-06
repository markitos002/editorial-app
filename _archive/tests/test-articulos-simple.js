require('dotenv').config();
const pool = require('./db');

async function testSimple() {
  console.log('🧪 Test simple de artículos...');
  
  try {
    // Test 1: Consulta simple
    console.log('\n1️⃣ Consulta básica...');
    const result1 = await pool.query('SELECT * FROM articulos LIMIT 1;');
    console.log('Artículos encontrados:', result1.rows.length);
    
    if (result1.rows.length > 0) {
      const articulo = result1.rows[0];
      console.log('Primer artículo:');
      console.log('- ID:', articulo.id);
      console.log('- Título:', articulo.titulo);
      console.log('- Usuario ID:', articulo.usuario_id);
      console.log('- Estado:', articulo.estado);
      console.log('- Archivo:', articulo.archivo_nombre);
    }
    
    // Test 2: Consulta con JOIN
    console.log('\n2️⃣ Consulta con JOIN...');
    const result2 = await pool.query(`
      SELECT 
        a.id,
        a.titulo,
        a.estado,
        u.nombre as autor_nombre
      FROM articulos a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      LIMIT 1;
    `);
    
    console.log('Con JOIN encontrados:', result2.rows.length);
    if (result2.rows.length > 0) {
      console.log('Resultado JOIN:', result2.rows[0]);
    }
    
    // Test 3: La query exacta del controlador
    console.log('\n3️⃣ Query del controlador...');
    const result3 = await pool.query(`
      SELECT 
        a.*,
        u.nombre as autor_nombre,
        u.email as autor_email,
        COUNT(*) OVER() as total_count
      FROM articulos a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      ORDER BY a.fecha_creacion DESC 
      LIMIT 10 OFFSET 0
    `);
    
    console.log('Query controlador encontrados:', result3.rows.length);
    if (result3.rows.length > 0) {
      console.log('Primer resultado controlador:');
      console.log('- ID:', result3.rows[0].id);
      console.log('- Título:', result3.rows[0].titulo);
      console.log('- Total count:', result3.rows[0].total_count);
      console.log('- Autor nombre:', result3.rows[0].autor_nombre);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testSimple();
