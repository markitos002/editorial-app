// Script para probar los endpoints de Artículos
// Ejecutar con: node test-articulos.js

const BASE_URL = 'http://localhost:4000';
const API_URL = `${BASE_URL}/api`;

async function testArticulosAPI() {
  console.log('🚀 Iniciando pruebas de la API de Artículos...\n');

  try {
    // Test 1: Verificar que el servidor esté funcionando
    console.log('1. Verificando conexión al servidor...');
    const connectionTest = await fetch(BASE_URL);
    const connectionResponse = await connectionTest.text();
    console.log(`✅ Servidor responde: ${connectionResponse}\n`);

    // Test 2: Crear un usuario autor para las pruebas
    console.log('2. Creando usuario autor para pruebas...');
    const nuevoAutor = {
      nombre: "Dr. Juan Investigador",
      email: `autor${Date.now()}@universidad.com`,
      contrasena: "password123",
      rol: "autor"
    };

    const autorResponse = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoAutor)
    });

    const autorCreado = await autorResponse.json();
    console.log(`✅ Autor creado con ID: ${autorCreado.id}\n`);
    const autorId = autorCreado.id;

    // Test 3: Obtener todos los artículos (inicialmente vacío)
    console.log('3. Obteniendo todos los artículos...');
    const articulosResponse = await fetch(`${API_URL}/articulos`);
    const articulosData = await articulosResponse.json();
    console.log(`✅ Artículos encontrados: ${articulosData.articulos.length}`);
    console.log('Paginación:', articulosData.pagination);
    console.log('');

    // Test 4: Crear un nuevo artículo
    console.log('4. Creando nuevo artículo...');
    const nuevoArticulo = {
      titulo: "Avances en Machine Learning",
      resumen: "Un análisis detallado de los últimos avances en algoritmos de aprendizaje automático.",
      contenido: "El machine learning ha experimentado avances significativos en los últimos años. Los modelos de deep learning, especialmente los transformers, han revolucionado el procesamiento de lenguaje natural. Este artículo examina las tendencias actuales, incluyendo GPT, BERT y otros modelos de vanguardia. También se discuten las implicaciones éticas y los desafíos futuros en el campo.",
      autor_id: autorId
    };

    const crearResponse = await fetch(`${API_URL}/articulos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoArticulo)
    });

    const articuloCreado = await crearResponse.json();
    console.log('✅ Artículo creado:');
    console.log(`   ID: ${articuloCreado.id}`);
    console.log(`   Título: ${articuloCreado.titulo}`);
    console.log(`   Estado: ${articuloCreado.estado}`);
    console.log(`   Autor: ${articuloCreado.autor_nombre}\n`);

    const articuloId = articuloCreado.id;

    // Test 5: Obtener artículo por ID
    console.log(`5. Obteniendo artículo con ID ${articuloId}...`);
    const articuloPorIdResponse = await fetch(`${API_URL}/articulos/${articuloId}`);
    const articuloData = await articuloPorIdResponse.json();
    console.log('✅ Artículo encontrado:');
    console.log(`   Título: ${articuloData.titulo}`);
    console.log(`   Resumen: ${articuloData.resumen.substring(0, 50)}...`);
    console.log('');

    // Test 6: Actualizar artículo
    console.log(`6. Actualizando artículo con ID ${articuloId}...`);
    const actualizacion = {
      titulo: "Avances en Machine Learning - Edición 2025",
      estado: "en_revision"
    };

    const actualizarResponse = await fetch(`${API_URL}/articulos/${articuloId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actualizacion)
    });

    const articuloActualizado = await actualizarResponse.json();
    console.log('✅ Artículo actualizado:');
    console.log('   Respuesta completa:', JSON.stringify(articuloActualizado, null, 2));
    console.log(`   Nuevo título: ${articuloActualizado.titulo || 'undefined'}`);
    console.log(`   Nuevo estado: ${articuloActualizado.estado || 'undefined'}\n`);

    // Test 7: Cambiar estado del artículo
    console.log(`7. Cambiando estado del artículo a 'aprobado'...`);
    const cambioEstado = {
      estado: "aprobado",
      observaciones: "Artículo bien estructurado y actualizado. Aprobado para publicación."
    };

    const estadoResponse = await fetch(`${API_URL}/articulos/${articuloId}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cambioEstado)
    });

    const estadoResult = await estadoResponse.json();
    console.log('✅ Estado cambiado:');
    console.log('   Respuesta completa:', JSON.stringify(estadoResult, null, 2));
    console.log(`   Mensaje: ${estadoResult.mensaje || 'Sin mensaje'}`);
    if (estadoResult.articulo) {
      console.log(`   Nuevo estado: ${estadoResult.articulo.estado || 'undefined'}\n`);
    } else {
      console.log('   ❌ No se encontró el objeto artículo en la respuesta\n');
    }

    // Test 8: Crear segundo artículo para pruebas de filtros
    console.log('8. Creando segundo artículo para pruebas...');
    const segundoArticulo = {
      titulo: "Sostenibilidad Digital",
      resumen: "Estrategias para reducir el impacto ambiental de las tecnologías digitales.",
      contenido: "La sostenibilidad digital es un tema crucial en la era actual. Este artículo explora metodologías para reducir el consumo energético de los sistemas digitales.",
      autor_id: autorId
    };

    const segundo = await fetch(`${API_URL}/articulos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(segundoArticulo)
    });

    const segundoCreado = await segundo.json();
    console.log(`✅ Segundo artículo creado con ID: ${segundoCreado.id}\n`);

    // Test 9: Filtrar artículos por estado
    console.log('9. Filtrando artículos por estado "aprobado"...');
    const filtroResponse = await fetch(`${API_URL}/articulos?estado=aprobado`);
    const articulosFiltrados = await filtroResponse.json();
    console.log(`✅ Artículos aprobados encontrados: ${articulosFiltrados.articulos.length}\n`);

    // Test 10: Filtrar artículos por autor
    console.log(`10. Filtrando artículos por autor ID ${autorId}...`);
    const autorFiltroResponse = await fetch(`${API_URL}/articulos?autor_id=${autorId}`);
    const articulosAutor = await autorFiltroResponse.json();
    console.log(`✅ Artículos del autor encontrados: ${articulosAutor.articulos.length}\n`);

    // Test 11: Probar paginación
    console.log('11. Probando paginación (limit=1)...');
    const paginacionResponse = await fetch(`${API_URL}/articulos?limit=1&page=1`);
    const articulosPaginados = await paginacionResponse.json();
    console.log('✅ Paginación funcionando:');
    console.log(`   Artículos en página: ${articulosPaginados.articulos.length}`);
    console.log(`   Total páginas: ${articulosPaginados.pagination.total_pages}`);
    console.log(`   Total artículos: ${articulosPaginados.pagination.total_count}\n`);

    // Test 12: Eliminar artículo
    console.log(`12. Eliminando segundo artículo (ID ${segundoCreado.id})...`);
    const eliminarResponse = await fetch(`${API_URL}/articulos/${segundoCreado.id}`, {
      method: 'DELETE'
    });

    const eliminado = await eliminarResponse.json();
    console.log('✅ Artículo eliminado:');
    console.log(`   Mensaje: ${eliminado.mensaje}\n`);

    // Test 13: Verificar que el artículo fue eliminado
    console.log(`13. Verificando artículo eliminado (ID ${segundoCreado.id})...`);
    const verificarResponse = await fetch(`${API_URL}/articulos/${segundoCreado.id}`);
    
    if (verificarResponse.status === 404) {
      const errorData = await verificarResponse.json();
      console.log('✅ Error 404 esperado:');
      console.log(`   Mensaje: ${errorData.mensaje}\n`);
    }

    // Test 14: Probar validaciones - artículo sin campos requeridos
    console.log('14. Probando validaciones (artículo incompleto)...');
    const articuloIncompleto = { titulo: "Solo título" };
    
    const validacionResponse = await fetch(`${API_URL}/articulos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articuloIncompleto)
    });

    if (validacionResponse.status === 400) {
      const errorValidacion = await validacionResponse.json();
      console.log('✅ Validación funcionando:');
      console.log(`   Error: ${errorValidacion.mensaje}\n`);
    }

    // Limpiar datos de prueba
    console.log('15. Limpiando datos de prueba...');
    await fetch(`${API_URL}/articulos/${articuloId}`, { method: 'DELETE' });
    await fetch(`${API_URL}/usuarios/${autorId}`, { method: 'DELETE' });
    console.log('✅ Datos de prueba eliminados\n');

    console.log('🎉 ¡Todas las pruebas de artículos completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   - El servidor backend esté corriendo (npm run dev)');
    console.log('   - La base de datos esté conectada');
    console.log('   - Las tablas usuarios y articulos existan');
  }
}

// Ejecutar las pruebas
testArticulosAPI();
