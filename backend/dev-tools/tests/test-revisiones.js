// test-revisiones.js
const API_URL = 'http://localhost:4000/api';

async function testRevisionesAPI() {
  console.log('🚀 Iniciando pruebas de la API de Revisiones...\n');

  try {
    let autorId, revisorId, editorId, articuloId, revisionId;

    // Test 1: Verificar que el servidor esté funcionando
    console.log('1. Verificando conexión al servidor...');
    const serverResponse = await fetch(`${API_URL.replace('/api', '')}/`);
    const serverMessage = await serverResponse.text();
    console.log(`✅ Servidor responde: ${serverMessage}\n`);

    // Test 2: Crear usuarios de prueba (autor, revisor, editor)
    console.log('2. Creando usuarios de prueba...');
    
    // Crear autor
    const autor = {
      nombre: 'Dr. María Autora',
      email: `autor_${Date.now()}@universidad.com`,
      contrasena: 'password123',
      rol: 'autor'
    };
    
    const autorResponse = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(autor)
    });
    const autorCreado = await autorResponse.json();
    autorId = autorCreado.id;
    console.log(`✅ Autor creado con ID: ${autorId}`);

    // Crear revisor
    const revisor = {
      nombre: 'Dr. Carlos Revisor',
      email: `revisor_${Date.now()}@universidad.com`,
      contrasena: 'password123',
      rol: 'revisor'
    };
    
    const revisorResponse = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(revisor)
    });
    const revisorCreado = await revisorResponse.json();
    revisorId = revisorCreado.id;
    console.log(`✅ Revisor creado con ID: ${revisorId}`);

    // Crear editor
    const editor = {
      nombre: 'Dra. Ana Editora',
      email: `editor_${Date.now()}@editorial.com`,
      contrasena: 'password123',
      rol: 'editor'
    };
    
    const editorResponse = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editor)
    });
    const editorCreado = await editorResponse.json();
    editorId = editorCreado.id;
    console.log(`✅ Editor creado con ID: ${editorId}\n`);

    // Test 3: Crear artículo para las revisiones
    console.log('3. Creando artículo para revisar...');
    const articulo = {
      titulo: 'Inteligencia Artificial en Medicina',
      resumen: 'Un estudio comprehensivo sobre las aplicaciones de IA en el diagnóstico médico y tratamiento de enfermedades complejas.',
      contenido: 'La inteligencia artificial está revolucionando el campo de la medicina. Este artículo explora las diversas aplicaciones de IA en diagnóstico médico, desde la interpretación de imágenes radiológicas hasta el análisis de datos genómicos. Se presentan casos de estudio y se discuten los desafíos éticos y técnicos.',
      autor_id: autorId
    };

    const articuloResponse = await fetch(`${API_URL}/articulos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articulo)
    });

    const articuloCreado = await articuloResponse.json();
    articuloId = articuloCreado.id;
    console.log(`✅ Artículo creado con ID: ${articuloId}`);
    console.log(`   Título: ${articuloCreado.titulo}\n`);

    // Test 4: Obtener todas las revisiones (debería estar vacío inicialmente)
    console.log('4. Obteniendo todas las revisiones...');
    const revisionesResponse = await fetch(`${API_URL}/revisiones`);
    const revisionesData = await revisionesResponse.json();
    console.log(`✅ Revisiones encontradas: ${revisionesData.revisiones.length}`);
    console.log(`Paginación: ${JSON.stringify(revisionesData.pagination)}\n`);

    // Test 5: Crear primera revisión
    console.log(`5. Creando revisión del revisor...`);
    const revision1 = {
      articulo_id: articuloId,
      revisor_id: revisorId,
      observaciones: 'El artículo está bien estructurado y presenta información valiosa. Sin embargo, sugiero ampliar la sección de metodología y agregar más referencias a estudios recientes sobre ética en IA médica.',
      recomendacion: 'revisar'
    };

    const revision1Response = await fetch(`${API_URL}/revisiones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(revision1)
    });

    const revision1Creada = await revision1Response.json();
    revisionId = revision1Creada.revision.id;
    console.log(`✅ Revisión creada con ID: ${revisionId}`);
    console.log(`   Revisor: ${revision1Creada.revision.revisor_nombre}`);
    console.log(`   Recomendación: ${revision1Creada.revision.recomendacion}\n`);

    // Test 6: Crear segunda revisión (del editor)
    console.log(`6. Creando revisión del editor...`);
    const revision2 = {
      articulo_id: articuloId,
      revisor_id: editorId,
      observaciones: 'Excelente trabajo. El artículo cumple con los estándares de calidad de la revista. Las referencias son actuales y la metodología es sólida. Recomiendo su publicación.',
      recomendacion: 'aceptar'
    };

    const revision2Response = await fetch(`${API_URL}/revisiones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(revision2)
    });

    const revision2Creada = await revision2Response.json();
    console.log(`✅ Segunda revisión creada con ID: ${revision2Creada.revision.id}`);
    console.log(`   Editor: ${revision2Creada.revision.revisor_nombre}`);
    console.log(`   Recomendación: ${revision2Creada.revision.recomendacion}\n`);

    // Test 7: Obtener revisión específica por ID
    console.log(`7. Obteniendo revisión con ID ${revisionId}...`);
    const revisionPorIdResponse = await fetch(`${API_URL}/revisiones/${revisionId}`);
    const revisionData = await revisionPorIdResponse.json();
    console.log('✅ Revisión encontrada:');
    console.log(`   Artículo: ${revisionData.articulo_titulo}`);
    console.log(`   Revisor: ${revisionData.revisor_nombre}`);
    console.log(`   Observaciones: ${revisionData.observaciones.substring(0, 80)}...\n`);

    // Test 8: Actualizar revisión
    console.log(`8. Actualizando revisión con ID ${revisionId}...`);
    const actualizacion = {
      observaciones: 'REVISIÓN ACTUALIZADA: El artículo presenta información valiosa y está bien estructurado. He revisado las referencias y son apropiadas. Sugiero pequeños ajustes en la conclusión para mayor claridad.',
      recomendacion: 'aceptar'
    };

    const actualizarResponse = await fetch(`${API_URL}/revisiones/${revisionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actualizacion)
    });

    const revisionActualizada = await actualizarResponse.json();
    console.log('✅ Revisión actualizada:');
    console.log(`   Nueva recomendación: ${revisionActualizada.revision.recomendacion}`);
    console.log(`   Observaciones: ${revisionActualizada.revision.observaciones.substring(0, 50)}...\n`);

    // Test 9: Obtener revisiones de un artículo específico
    console.log(`9. Obteniendo revisiones del artículo ${articuloId}...`);
    const revisionesArticuloResponse = await fetch(`${API_URL}/revisiones/articulo/${articuloId}`);
    const revisionesArticulo = await revisionesArticuloResponse.json();
    console.log(`✅ Revisiones del artículo encontradas: ${revisionesArticulo.total_revisiones}`);
    revisionesArticulo.revisiones.forEach((rev, index) => {
      console.log(`   ${index + 1}. ${rev.revisor_nombre} - ${rev.recomendacion}`);
    });
    console.log('');

    // Test 10: Filtrar revisiones por recomendación
    console.log('10. Filtrando revisiones por recomendación "aceptar"...');
    const filtroResponse = await fetch(`${API_URL}/revisiones?recomendacion=aceptar`);
    const revisionesFiltradas = await filtroResponse.json();
    console.log(`✅ Revisiones con recomendación "aceptar": ${revisionesFiltradas.revisiones.length}\n`);

    // Test 11: Filtrar revisiones por revisor
    console.log(`11. Filtrando revisiones por revisor ID ${revisorId}...`);
    const revisorFiltroResponse = await fetch(`${API_URL}/revisiones?revisor_id=${revisorId}`);
    const revisionesRevisor = await revisorFiltroResponse.json();
    console.log(`✅ Revisiones del revisor encontradas: ${revisionesRevisor.revisiones.length}\n`);

    // Test 12: Probar paginación
    console.log('12. Probando paginación (limit=1)...');
    const paginacionResponse = await fetch(`${API_URL}/revisiones?limit=1&page=1`);
    const revisionesPaginadas = await paginacionResponse.json();
    console.log('✅ Paginación funcionando:');
    console.log(`   Revisiones en página: ${revisionesPaginadas.revisiones.length}`);
    console.log(`   Total páginas: ${revisionesPaginadas.pagination.total_pages}`);
    console.log(`   Total revisiones: ${revisionesPaginadas.pagination.total_count}\n`);

    // Test 13: Probar validaciones - revisión sin campos requeridos
    console.log('13. Probando validaciones (revisión incompleta)...');
    const revisionIncompleta = { articulo_id: articuloId };
    
    const validacionResponse = await fetch(`${API_URL}/revisiones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(revisionIncompleta)
    });

    if (validacionResponse.status === 400) {
      const errorValidacion = await validacionResponse.json();
      console.log('✅ Validación funcionando:');
      console.log(`   Error: ${errorValidacion.mensaje}\n`);
    }

    // Test 14: Probar validación de revisor duplicado
    console.log('14. Probando validación de revisor duplicado...');
    const revisionDuplicada = {
      articulo_id: articuloId,
      revisor_id: revisorId,
      observaciones: 'Intento de revisión duplicada',
      recomendacion: 'revisar'
    };

    const duplicadaResponse = await fetch(`${API_URL}/revisiones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(revisionDuplicada)
    });

    if (duplicadaResponse.status === 400) {
      const errorDuplicada = await duplicadaResponse.json();
      console.log('✅ Validación de duplicado funcionando:');
      console.log(`   Error: ${errorDuplicada.mensaje}\n`);
    }

    // Test 15: Eliminar una revisión
    console.log(`15. Eliminando revisión con ID ${revisionId}...`);
    const eliminarResponse = await fetch(`${API_URL}/revisiones/${revisionId}`, {
      method: 'DELETE'
    });

    const eliminarResult = await eliminarResponse.json();
    console.log('✅ Revisión eliminada:');
    console.log(`   Mensaje: ${eliminarResult.mensaje}\n`);

    // Test 16: Verificar que la revisión fue eliminada
    console.log(`16. Verificando revisión eliminada (ID ${revisionId})...`);
    const verificarResponse = await fetch(`${API_URL}/revisiones/${revisionId}`);
    
    if (verificarResponse.status === 404) {
      const errorResponse = await verificarResponse.json();
      console.log('✅ Error 404 esperado:');
      console.log(`   Mensaje: ${errorResponse.mensaje}\n`);
    }

    // Limpiar datos de prueba
    console.log('17. Limpiando datos de prueba...');
    
    // Eliminar revisiones restantes
    const revisionesRestantes = await fetch(`${API_URL}/revisiones/articulo/${articuloId}`);
    const revisionesRestantesData = await revisionesRestantes.json();
    
    for (const revision of revisionesRestantesData.revisiones) {
      await fetch(`${API_URL}/revisiones/${revision.id}`, { method: 'DELETE' });
    }
    
    // Eliminar artículo
    await fetch(`${API_URL}/articulos/${articuloId}`, { method: 'DELETE' });
    
    // Eliminar usuarios
    await fetch(`${API_URL}/usuarios/${autorId}`, { method: 'DELETE' });
    await fetch(`${API_URL}/usuarios/${revisorId}`, { method: 'DELETE' });
    await fetch(`${API_URL}/usuarios/${editorId}`, { method: 'DELETE' });
    
    console.log('✅ Datos de prueba eliminados\n');

    console.log('🎉 ¡Todas las pruebas de revisiones completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   - El servidor backend esté corriendo (npm run dev)');
    console.log('   - La base de datos esté conectada');
    console.log('   - Las tablas usuarios, articulos y revisiones existan');
  }
}

// Ejecutar las pruebas
testRevisionesAPI();
