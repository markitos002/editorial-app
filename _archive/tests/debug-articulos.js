// backend/debug-articulos.js - Script para examinar estructura de artículos
const pool = require('./db/index.js');

async function debugArticulos() {
  try {
    console.log('🔍 Analizando estructura de artículos...\n');
    
    // Obtener un artículo de ejemplo
    const result = await pool.query(`
      SELECT 
        a.*,
        u.nombre as autor,
        u.email as autor_email,
        COUNT(DISTINCT c.id) as total_comentarios
      FROM articulos a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      LEFT JOIN revisiones r ON a.id = r.articulo_id
      LEFT JOIN comentarios c ON r.id = c.revision_id
      WHERE a.id IS NOT NULL
      GROUP BY a.id, u.nombre, u.email
      LIMIT 1
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ No se encontraron artículos');
      return;
    }
    
    const articulo = result.rows[0];
    console.log('📋 Artículo encontrado:');
    console.log('==========================================');
    
    // Analizar cada campo
    Object.entries(articulo).forEach(([key, value]) => {
      const tipo = typeof value;
      let analisis = '';
      
      if (value === null) {
        analisis = 'NULL';
      } else if (tipo === 'object') {
        analisis = `OBJECT: ${JSON.stringify(value)}`;
      } else if (tipo === 'string' && value.startsWith('[') || value.startsWith('{')) {
        analisis = `POSSIBLE JSON: ${value}`;
      } else {
        analisis = `${tipo.toUpperCase()}: ${value}`;
      }
      
      console.log(`${key.padEnd(20)} | ${analisis}`);
    });
    
    console.log('\n🔍 Analizando palabras_clave específicamente:');
    console.log('==========================================');
    const palabrasClave = articulo.palabras_clave;
    console.log(`Valor raw: ${palabrasClave}`);
    console.log(`Tipo: ${typeof palabrasClave}`);
    
    if (typeof palabrasClave === 'string') {
      try {
        const parsed = JSON.parse(palabrasClave);
        console.log(`Parsed JSON: ${JSON.stringify(parsed)}`);
        console.log(`Es array: ${Array.isArray(parsed)}`);
      } catch (e) {
        console.log(`No es JSON válido: ${e.message}`);
      }
    }
    
    console.log('\n✅ Análisis completado');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

debugArticulos();
