const pool = require('./db/index.js');

async function debugQuery() {
  try {
    console.log('🔍 Probando la query exacta del controlador...');
    
    const query = `
      SELECT 
        a.*,
        u.nombre as autor,
        u.email as autor_email,
        COUNT(DISTINCT c.id) as total_comentarios,
        COUNT(DISTINCT CASE WHEN c.estado = 'activo' THEN c.id END) as comentarios_activos
      FROM articulos a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      LEFT JOIN revisiones r ON a.id = r.articulo_id
      LEFT JOIN comentarios c ON r.id = c.revision_id
      WHERE 1=1
      GROUP BY a.id, u.nombre, u.email
      ORDER BY a.fecha_creacion DESC
      LIMIT 5 OFFSET 0
    `;
    
    const resultado = await pool.query(query);
    
    console.log('📊 Resultado de la query:');
    resultado.rows.forEach((row, index) => {
      console.log(`\n${index + 1}. Artículo: ${row.titulo}`);
      console.log(`   autor: ${row.autor}`);
      console.log(`   autor_email: ${row.autor_email}`);
      console.log(`   Keys disponibles:`, Object.keys(row));
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

debugQuery();
