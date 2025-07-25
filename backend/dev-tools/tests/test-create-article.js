// test-create-article.js
const pool = require('./db');

async function testCreateArticle() {
  try {
    console.log('Probando crear artículo...');
    
    // Simulando los datos que llegan del frontend
    const titulo = 'Artículo de prueba';
    const resumen = 'Este es un resumen de prueba';
    const contenido = 'Contenido completo del artículo de prueba';
    const palabras_clave = ['prueba', 'enfermería', 'cuidados'];
    const area_tematica = 'cuidados-enfermeria';
    const autor_id = 1; // Asumiendo que existe un usuario con ID 1
    
    const query = `
      INSERT INTO articulos (titulo, resumen, contenido, palabras_clave, area_tematica, autor_id, estado) 
      VALUES ($1, $2, $3, $4, $5, $6, 'enviado') 
      RETURNING *
    `;
    
    const resultado = await pool.query(query, [
      titulo, 
      resumen, 
      contenido, 
      palabras_clave, 
      area_tematica,
      autor_id
    ]);
    
    console.log('✅ Artículo creado exitosamente:');
    console.log('ID:', resultado.rows[0].id);
    console.log('Título:', resultado.rows[0].titulo);
    console.log('Palabras clave:', resultado.rows[0].palabras_clave);
    console.log('Área temática:', resultado.rows[0].area_tematica);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testCreateArticle();
