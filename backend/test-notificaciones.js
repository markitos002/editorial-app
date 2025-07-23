// test-notificaciones.js
const API_URL = 'http://localhost:4000/api';

async function testNotificacionesAPI() {
  console.log('🚀 Iniciando pruebas de la API de Notificaciones...\n');

  try {
    let usuario1Id, usuario2Id, notificacion1Id, notificacion2Id;

    // Test 1: Verificar que el servidor esté funcionando
    console.log('1. Verificando conexión al servidor...');
    const serverResponse = await fetch(`${API_URL.replace('/api', '')}/`);
    const serverMessage = await serverResponse.text();
    console.log(`✅ Servidor responde: ${serverMessage}\n`);

    // Test 2: Crear usuarios de prueba
    console.log('2. Creando usuarios de prueba...');
    
    // Crear primer usuario
    const usuario1 = {
      nombre: 'Dr. Juan Pérez',
      email: `usuario1_${Date.now()}@universidad.com`,
      contrasena: 'password123',
      rol: 'autor'
    };
    
    const usuario1Response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario1)
    });
    const usuario1Creado = await usuario1Response.json();
    usuario1Id = usuario1Creado.id;
    console.log(`✅ Usuario 1 creado con ID: ${usuario1Id}`);

    // Crear segundo usuario
    const usuario2 = {
      nombre: 'Dra. María García',
      email: `usuario2_${Date.now()}@universidad.com`,
      contrasena: 'password123',
      rol: 'revisor'
    };
    
    const usuario2Response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario2)
    });
    const usuario2Creado = await usuario2Response.json();
    usuario2Id = usuario2Creado.id;
    console.log(`✅ Usuario 2 creado con ID: ${usuario2Id}\n`);

    // Test 3: Obtener todas las notificaciones (debería estar vacío inicialmente)
    console.log('3. Obteniendo todas las notificaciones...');
    const notificacionesResponse = await fetch(`${API_URL}/notificaciones`);
    const notificacionesData = await notificacionesResponse.json();
    console.log(`✅ Notificaciones encontradas: ${notificacionesData.notificaciones.length}`);
    console.log(`Paginación: ${JSON.stringify(notificacionesData.pagination)}\n`);

    // Test 4: Crear primera notificación
    console.log(`4. Creando notificación para usuario ${usuario1Id}...`);
    const notificacion1 = {
      usuario_id: usuario1Id,
      mensaje: 'Su artículo "Inteligencia Artificial en Medicina" ha sido enviado y está en proceso de revisión.'
    };

    const notificacion1Response = await fetch(`${API_URL}/notificaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificacion1)
    });

    const notificacion1Creada = await notificacion1Response.json();
    notificacion1Id = notificacion1Creada.notificacion.id;
    console.log(`✅ Notificación creada con ID: ${notificacion1Id}`);
    console.log(`   Usuario: ${notificacion1Creada.notificacion.usuario_nombre}`);
    console.log(`   Mensaje: ${notificacion1Creada.notificacion.mensaje}`);
    console.log(`   Leído: ${notificacion1Creada.notificacion.leido}\n`);

    // Test 5: Crear segunda notificación
    console.log(`5. Creando notificación para usuario ${usuario2Id}...`);
    const notificacion2 = {
      usuario_id: usuario2Id,
      mensaje: 'Se le ha asignado un nuevo artículo para revisar: "Avances en Machine Learning".'
    };

    const notificacion2Response = await fetch(`${API_URL}/notificaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificacion2)
    });

    const notificacion2Creada = await notificacion2Response.json();
    notificacion2Id = notificacion2Creada.notificacion.id;
    console.log(`✅ Segunda notificación creada con ID: ${notificacion2Id}`);
    console.log(`   Usuario: ${notificacion2Creada.notificacion.usuario_nombre}`);
    console.log(`   Mensaje: ${notificacion2Creada.notificacion.mensaje}\n`);

    // Test 6: Obtener notificación específica por ID
    console.log(`6. Obteniendo notificación con ID ${notificacion1Id}...`);
    const notificacionPorIdResponse = await fetch(`${API_URL}/notificaciones/${notificacion1Id}`);
    const notificacionData = await notificacionPorIdResponse.json();
    console.log('✅ Notificación encontrada:');
    console.log(`   Usuario: ${notificacionData.usuario_nombre}`);
    console.log(`   Mensaje: ${notificacionData.mensaje.substring(0, 50)}...\n`);

    // Test 7: Marcar notificación como leída
    console.log(`7. Marcando notificación ${notificacion1Id} como leída...`);
    const marcarLeidaResponse = await fetch(`${API_URL}/notificaciones/${notificacion1Id}/marcar-leida`, {
      method: 'PATCH'
    });

    const notificacionLeida = await marcarLeidaResponse.json();
    console.log('✅ Notificación marcada como leída:');
    console.log(`   Estado leído: ${notificacionLeida.notificacion.leido}`);
    console.log(`   Mensaje: ${notificacionLeida.mensaje}\n`);

    // Test 8: Marcar notificación como no leída
    console.log(`8. Marcando notificación ${notificacion1Id} como no leída...`);
    const marcarNoLeidaResponse = await fetch(`${API_URL}/notificaciones/${notificacion1Id}/marcar-no-leida`, {
      method: 'PATCH'
    });

    const notificacionNoLeida = await marcarNoLeidaResponse.json();
    console.log('✅ Notificación marcada como no leída:');
    console.log(`   Estado leído: ${notificacionNoLeida.notificacion.leido}`);
    console.log(`   Mensaje: ${notificacionNoLeida.mensaje}\n`);

    // Test 9: Obtener notificaciones de un usuario específico
    console.log(`9. Obteniendo notificaciones del usuario ${usuario1Id}...`);
    const notificacionesUsuarioResponse = await fetch(`${API_URL}/notificaciones/usuario/${usuario1Id}`);
    const notificacionesUsuario = await notificacionesUsuarioResponse.json();
    console.log(`✅ Notificaciones del usuario encontradas: ${notificacionesUsuario.notificaciones.length}`);
    console.log(`   Total: ${notificacionesUsuario.total_notificaciones}`);
    console.log(`   No leídas: ${notificacionesUsuario.notificaciones_no_leidas}\n`);

    // Test 10: Crear tercera notificación para usuario 1
    console.log(`10. Creando tercera notificación para usuario ${usuario1Id}...`);
    const notificacion3 = {
      usuario_id: usuario1Id,
      mensaje: 'Su artículo ha sido revisado. Por favor, revise los comentarios y observaciones.'
    };

    const notificacion3Response = await fetch(`${API_URL}/notificaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificacion3)
    });

    const notificacion3Creada = await notificacion3Response.json();
    console.log(`✅ Tercera notificación creada con ID: ${notificacion3Creada.notificacion.id}\n`);

    // Test 11: Marcar todas las notificaciones del usuario como leídas
    console.log(`11. Marcando todas las notificaciones del usuario ${usuario1Id} como leídas...`);
    const marcarTodasResponse = await fetch(`${API_URL}/notificaciones/usuario/${usuario1Id}/marcar-todas-leidas`, {
      method: 'PATCH'
    });

    const todasLeidasResult = await marcarTodasResponse.json();
    console.log('✅ Notificaciones marcadas como leídas:');
    console.log(`   Mensaje: ${todasLeidasResult.mensaje}`);
    console.log(`   Actualizadas: ${todasLeidasResult.notificaciones_actualizadas}\n`);

    // Test 12: Filtrar notificaciones por usuario
    console.log(`12. Filtrando notificaciones por usuario ID ${usuario2Id}...`);
    const filtroUsuarioResponse = await fetch(`${API_URL}/notificaciones?usuario_id=${usuario2Id}`);
    const notificacionesUsuario2 = await filtroUsuarioResponse.json();
    console.log(`✅ Notificaciones del usuario ${usuario2Id}: ${notificacionesUsuario2.notificaciones.length}\n`);

    // Test 13: Filtrar notificaciones no leídas
    console.log('13. Filtrando notificaciones no leídas...');
    const filtroNoLeidasResponse = await fetch(`${API_URL}/notificaciones?leido=false`);
    const notificacionesNoLeidas = await filtroNoLeidasResponse.json();
    console.log(`✅ Notificaciones no leídas: ${notificacionesNoLeidas.notificaciones.length}\n`);

    // Test 14: Probar paginación
    console.log('14. Probando paginación (limit=1)...');
    const paginacionResponse = await fetch(`${API_URL}/notificaciones?limit=1&page=1`);
    const notificacionesPaginadas = await paginacionResponse.json();
    console.log('✅ Paginación funcionando:');
    console.log(`   Notificaciones en página: ${notificacionesPaginadas.notificaciones.length}`);
    console.log(`   Total páginas: ${notificacionesPaginadas.pagination.total_pages}`);
    console.log(`   Total notificaciones: ${notificacionesPaginadas.pagination.total_count}\n`);

    // Test 15: Probar validaciones - notificación sin campos requeridos
    console.log('15. Probando validaciones (notificación incompleta)...');
    const notificacionIncompleta = { usuario_id: usuario1Id };
    
    const validacionResponse = await fetch(`${API_URL}/notificaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificacionIncompleta)
    });

    if (validacionResponse.status === 400) {
      const errorValidacion = await validacionResponse.json();
      console.log('✅ Validación funcionando:');
      console.log(`   Error: ${errorValidacion.mensaje}\n`);
    }

    // Test 16: Eliminar una notificación
    console.log(`16. Eliminando notificación con ID ${notificacion2Id}...`);
    const eliminarResponse = await fetch(`${API_URL}/notificaciones/${notificacion2Id}`, {
      method: 'DELETE'
    });

    const eliminarResult = await eliminarResponse.json();
    console.log('✅ Notificación eliminada:');
    console.log(`   Mensaje: ${eliminarResult.mensaje}\n`);

    // Test 17: Verificar que la notificación fue eliminada
    console.log(`17. Verificando notificación eliminada (ID ${notificacion2Id})...`);
    const verificarResponse = await fetch(`${API_URL}/notificaciones/${notificacion2Id}`);
    
    if (verificarResponse.status === 404) {
      const errorResponse = await verificarResponse.json();
      console.log('✅ Error 404 esperado:');
      console.log(`   Mensaje: ${errorResponse.mensaje}\n`);
    }

    // Test 18: Obtener notificaciones solo no leídas de un usuario
    console.log(`18. Obteniendo solo notificaciones no leídas del usuario ${usuario2Id}...`);
    const soloNoLeidasResponse = await fetch(`${API_URL}/notificaciones/usuario/${usuario2Id}?solo_no_leidas=true`);
    const soloNoLeidasData = await soloNoLeidasResponse.json();
    console.log(`✅ Notificaciones no leídas del usuario: ${soloNoLeidasData.notificaciones.length}\n`);

    // Limpiar datos de prueba
    console.log('19. Limpiando datos de prueba...');
    
    // Eliminar todas las notificaciones restantes
    const todasNotificacionesResponse = await fetch(`${API_URL}/notificaciones`);
    const todasNotificaciones = await todasNotificacionesResponse.json();
    
    for (const notificacion of todasNotificaciones.notificaciones) {
      await fetch(`${API_URL}/notificaciones/${notificacion.id}`, { method: 'DELETE' });
    }
    
    // Eliminar usuarios
    await fetch(`${API_URL}/usuarios/${usuario1Id}`, { method: 'DELETE' });
    await fetch(`${API_URL}/usuarios/${usuario2Id}`, { method: 'DELETE' });
    
    console.log('✅ Datos de prueba eliminados\n');

    console.log('🎉 ¡Todas las pruebas de notificaciones completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   - El servidor backend esté corriendo (npm run dev)');
    console.log('   - La base de datos esté conectada');
    console.log('   - Las tablas usuarios y notificaciones existan');
  }
}

// Ejecutar las pruebas
testNotificacionesAPI();
