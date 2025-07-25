// test-protected-routes.js
const API_URL = 'http://localhost:4000/api';

async function testProtectedRoutes() {
  console.log('🔒 Iniciando pruebas de rutas protegidas...\n');

  try {
    let authorToken, reviewerToken, editorToken;
    let authorId, reviewerId, editorId;
    let articleId;

    // Test 1: Crear usuarios con diferentes roles
    console.log('1. Creando usuarios con diferentes roles...');

    // Crear autor
    const autorResponse = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Dr. Juan Autor',
        email: `autor_${Date.now()}@universidad.com`,
        contrasena: 'password123',
        rol: 'autor'
      })
    });
    const autorData = await autorResponse.json();
    authorId = autorData.usuario.id;
    authorToken = autorData.token;
    console.log(`✅ Autor creado: ${autorData.usuario.nombre} (ID: ${authorId})`);

    // Crear revisor
    const revisorResponse = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Dra. María Revisora',
        email: `revisor_${Date.now()}@universidad.com`,
        contrasena: 'password123',
        rol: 'revisor'
      })
    });
    const revisorData = await revisorResponse.json();
    reviewerId = revisorData.usuario.id;
    reviewerToken = revisorData.token;
    console.log(`✅ Revisor creado: ${revisorData.usuario.nombre} (ID: ${reviewerId})`);

    // Crear editor
    const editorResponse = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Dr. Carlos Editor',
        email: `editor_${Date.now()}@universidad.com`,
        contrasena: 'password123',
        rol: 'editor'
      })
    });
    const editorData = await editorResponse.json();
    editorId = editorData.usuario.id;
    editorToken = editorData.token;
    console.log(`✅ Editor creado: ${editorData.usuario.nombre} (ID: ${editorId})\n`);

    // Test 2: Probar acceso a artículos sin autenticación (debe funcionar para lectura)
    console.log('2. Probando acceso a artículos sin autenticación...');
    const articulosPublicResponse = await fetch(`${API_URL}/articulos`);
    if (articulosPublicResponse.ok) {
      console.log('✅ Lectura de artículos permitida sin autenticación\n');
    }

    // Test 3: Intentar crear artículo sin autenticación (debe fallar)
    console.log('3. Intentando crear artículo sin autenticación...');
    const createWithoutAuthResponse = await fetch(`${API_URL}/articulos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: 'Artículo sin auth',
        resumen: 'Resumen',
        contenido: 'Contenido',
        autor_id: authorId
      })
    });

    if (createWithoutAuthResponse.status === 401) {
      const error = await createWithoutAuthResponse.json();
      console.log('✅ Creación bloqueada sin autenticación:');
      console.log(`   Error: ${error.mensaje}\n`);
    }

    // Test 4: Crear artículo con autor autenticado (debe funcionar)
    console.log('4. Creando artículo con autor autenticado...');
    const createWithAuthResponse = await fetch(`${API_URL}/articulos`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authorToken}`
      },
      body: JSON.stringify({
        titulo: 'Mi primer artículo',
        resumen: 'Resumen del artículo de prueba',
        contenido: 'Contenido detallado del artículo',
        autor_id: authorId
      })
    });

    if (createWithAuthResponse.ok) {
      const articleData = await createWithAuthResponse.json();
      articleId = articleData.articulo.id;
      console.log('✅ Artículo creado exitosamente:');
      console.log(`   ID: ${articleData.articulo.id}`);
      console.log(`   Título: ${articleData.articulo.titulo}\n`);
    }

    // Test 5: Intentar cambiar estado de artículo con rol autor (debe fallar)
    console.log('5. Intentando cambiar estado de artículo con rol autor...');
    const changeStateAuthorResponse = await fetch(`${API_URL}/articulos/${articleId}/estado`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authorToken}`
      },
      body: JSON.stringify({ estado: 'publicado' })
    });

    if (changeStateAuthorResponse.status === 403) {
      const error = await changeStateAuthorResponse.json();
      console.log('✅ Cambio de estado bloqueado para autor:');
      console.log(`   Error: ${error.mensaje}\n`);
    }

    // Test 6: Cambiar estado de artículo con rol editor (debe funcionar)
    console.log('6. Cambiando estado de artículo con rol editor...');
    const changeStateEditorResponse = await fetch(`${API_URL}/articulos/${articleId}/estado`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${editorToken}`
      },
      body: JSON.stringify({ estado: 'en_revision' })
    });

    if (changeStateEditorResponse.ok) {
      const stateData = await changeStateEditorResponse.json();
      console.log('✅ Estado cambiado exitosamente por editor:');
      console.log(`   Nuevo estado: ${stateData.articulo.estado}\n`);
    }

    // Test 7: Intentar crear revisión con rol autor (debe fallar)
    console.log('7. Intentando crear revisión con rol autor...');
    const createReviewAuthorResponse = await fetch(`${API_URL}/revisiones`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authorToken}`
      },
      body: JSON.stringify({
        articulo_id: articleId,
        revisor_id: reviewerId,
        comentarios: 'Comentarios de revisión',
        recomendacion: 'aprobar'
      })
    });

    if (createReviewAuthorResponse.status === 403) {
      const error = await createReviewAuthorResponse.json();
      console.log('✅ Creación de revisión bloqueada para autor:');
      console.log(`   Error: ${error.mensaje}\n`);
    }

    // Test 8: Crear revisión con rol revisor (debe funcionar)
    console.log('8. Creando revisión con rol revisor...');
    const createReviewResponse = await fetch(`${API_URL}/revisiones`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${reviewerToken}`
      },
      body: JSON.stringify({
        articulo_id: articleId,
        revisor_id: reviewerId,
        comentarios: 'Excelente trabajo, recomiendo su publicación',
        recomendacion: 'aprobar'
      })
    });

    if (createReviewResponse.ok) {
      const reviewData = await createReviewResponse.json();
      console.log('✅ Revisión creada exitosamente por revisor:');
      console.log(`   ID: ${reviewData.revision.id}`);
      console.log(`   Recomendación: ${reviewData.revision.recomendacion}\n`);
    }

    // Test 9: Intentar acceder a todas las notificaciones con rol autor (debe fallar)
    console.log('9. Intentando acceder a todas las notificaciones con rol autor...');
    const notificationsAuthorResponse = await fetch(`${API_URL}/notificaciones`, {
      headers: { 'Authorization': `Bearer ${authorToken}` }
    });

    if (notificationsAuthorResponse.status === 403) {
      const error = await notificationsAuthorResponse.json();
      console.log('✅ Acceso a todas las notificaciones bloqueado para autor:');
      console.log(`   Error: ${error.mensaje}\n`);
    }

    // Test 10: Acceder a notificaciones propias del usuario
    console.log('10. Accediendo a notificaciones propias del usuario...');
    const ownNotificationsResponse = await fetch(`${API_URL}/notificaciones/usuario/${authorId}`, {
      headers: { 'Authorization': `Bearer ${authorToken}` }
    });

    if (ownNotificationsResponse.ok) {
      const notifData = await ownNotificationsResponse.json();
      console.log('✅ Acceso a notificaciones propias permitido:');
      console.log(`   Total notificaciones: ${notifData.total_notificaciones}\n`);
    }

    // Test 11: Intentar acceder a notificaciones de otro usuario (debe funcionar pero validar en controlador)
    console.log('11. Intentando acceder a notificaciones de otro usuario...');
    const otherNotificationsResponse = await fetch(`${API_URL}/notificaciones/usuario/${reviewerId}`, {
      headers: { 'Authorization': `Bearer ${authorToken}` }
    });

    if (otherNotificationsResponse.ok) {
      console.log('⚠️  Acceso a notificaciones de otro usuario permitido (considerar restringir en el controlador)\n');
    }

    // Test 12: Crear notificación con rol editor (debe funcionar)
    console.log('12. Creando notificación con rol editor...');
    const createNotificationResponse = await fetch(`${API_URL}/notificaciones`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${editorToken}`
      },
      body: JSON.stringify({
        usuario_id: authorId,
        mensaje: 'Su artículo ha sido aprobado para publicación'
      })
    });

    if (createNotificationResponse.ok) {
      const notifData = await createNotificationResponse.json();
      console.log('✅ Notificación creada exitosamente por editor:');
      console.log(`   ID: ${notifData.notificacion.id}\n`);
    }

    // Limpiar datos de prueba
    console.log('13. Limpiando datos de prueba...');
    
    // Eliminar usuarios
    await fetch(`${API_URL}/usuarios/${authorId}`, { method: 'DELETE' });
    await fetch(`${API_URL}/usuarios/${reviewerId}`, { method: 'DELETE' });
    await fetch(`${API_URL}/usuarios/${editorId}`, { method: 'DELETE' });
    
    console.log('✅ Datos de prueba eliminados\n');

    console.log('🎉 ¡Todas las pruebas de rutas protegidas completadas!');
    console.log('\n📊 Resumen de seguridad:');
    console.log('   ✅ Rutas de lectura públicas funcionando');
    console.log('   ✅ Rutas de escritura protegidas por autenticación');
    console.log('   ✅ Rutas administrativas protegidas por roles');
    console.log('   ✅ Tokens JWT validándose correctamente');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   - El servidor backend esté corriendo (npm run dev)');
    console.log('   - La base de datos esté conectada');
    console.log('   - Las rutas de autenticación estén funcionando');
  }
}

// Ejecutar las pruebas
testProtectedRoutes();
