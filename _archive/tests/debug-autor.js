const pool = require('./db/index.js');

async function debugAutores() {
  try {
    console.log('🔍 Verificando relación artículos-usuarios...');
    
    const resultado = await pool.query(`
      SELECT 
        a.id,
        a.titulo,
        a.usuario_id,
        u.nombre as autor_nombre,
        u.id as usuario_real_id
      FROM articulos a 
      LEFT JOIN usuarios u ON a.usuario_id = u.id 
      ORDER BY a.id
    `);
    
    console.log('📊 Datos encontrados:');
    resultado.rows.forEach(row => {
      console.log(`ID: ${row.id}, Título: "${row.titulo}"`);
      console.log(`  usuario_id en artículo: ${row.usuario_id}`);
      console.log(`  usuario_real_id: ${row.usuario_real_id}`);
      console.log(`  nombre autor: ${row.autor_nombre || 'NULL'}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

debugAutores();
