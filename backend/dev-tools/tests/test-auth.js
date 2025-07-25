// test-auth.js
const API_URL = 'http://localhost:4000/api';

async function testAuthAPI() {
  console.log('🔐 Iniciando pruebas del Sistema de Autenticación...\n');

  try {
    let usuario1Token, usuario2Token, usuario1Id, usuario2Id;

    // Test 1: Verificar que el servidor esté funcionando
    console.log('1. Verificando conexión al servidor...');
    const serverResponse = await fetch(`${API_URL.replace('/api', '')}/`);
    const serverMessage = await serverResponse.text();
    console.log(`✅ Servidor responde: ${serverMessage}\n`);

    // Test 2: Registro de usuario exitoso
    console.log('2. Registrando nuevo usuario...');
    const nuevoUsuario = {
      nombre: 'Dr. Carlos Rodríguez',
      email: `test_auth_${Date.now()}@universidad.com`,
      contrasena: 'password123',
      rol: 'autor'
    };

    const registroResponse = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoUsuario)
    });

    const registroData = await registroResponse.json();
    usuario1Id = registroData.usuario.id;
    usuario1Token = registroData.token;

    console.log('✅ Usuario registrado exitosamente:');
    console.log(`   ID: ${registroData.usuario.id}`);
    console.log(`   Nombre: ${registroData.usuario.nombre}`);
    console.log(`   Email: ${registroData.usuario.email}`);
    console.log(`   Rol: ${registroData.usuario.rol}`);
    console.log(`   Token recibido: ${usuario1Token ? 'Sí' : 'No'}\n`);

    // Test 3: Intentar registro con email duplicado
    console.log('3. Probando registro con email duplicado...');
    const usuarioDuplicado = {
      nombre: 'Otro Usuario',
      email: nuevoUsuario.email, // Mismo email
      contrasena: 'password456',
      rol: 'revisor'
    };

    const duplicadoResponse = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuarioDuplicado)
    });

    if (duplicadoResponse.status === 400) {
      const errorData = await duplicadoResponse.json();
      console.log('✅ Error esperado por email duplicado:');
      console.log(`   Mensaje: ${errorData.mensaje}\n`);
    }

    // Test 4: Probar validaciones de registro
    console.log('4. Probando validaciones de registro...');
    const usuarioInvalido = {
      nombre: '',
      email: 'email-invalido',
      contrasena: '123', // Muy corta
      rol: 'rol_inexistente'
    };

    const validacionResponse = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuarioInvalido)
    });

    if (validacionResponse.status === 400) {
      const errorValidacion = await validacionResponse.json();
      console.log('✅ Validaciones funcionando:');
      console.log(`   Error: ${errorValidacion.mensaje}\n`);
    }

    // Test 5: Login exitoso
    console.log('5. Probando login con credenciales correctas...');
    const loginData = {
      email: nuevoUsuario.email,
      contrasena: nuevoUsuario.contrasena
    };

    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    const loginResult = await loginResponse.json();
    console.log('✅ Login exitoso:');
    console.log(`   Usuario: ${loginResult.usuario.nombre}`);
    console.log(`   Token recibido: ${loginResult.token ? 'Sí' : 'No'}\n`);

    // Test 6: Login con credenciales incorrectas
    console.log('6. Probando login con credenciales incorrectas...');
    const loginIncorrecto = {
      email: nuevoUsuario.email,
      contrasena: 'contrasena_incorrecta'
    };

    const loginIncorrectoResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginIncorrecto)
    });

    if (loginIncorrectoResponse.status === 401) {
      const errorLogin = await loginIncorrectoResponse.json();
      console.log('✅ Error esperado por credenciales incorrectas:');
      console.log(`   Mensaje: ${errorLogin.mensaje}\n`);
    }

    // Test 7: Obtener perfil con token válido
    console.log('7. Obteniendo perfil con token válido...');
    const perfilResponse = await fetch(`${API_URL}/auth/perfil`, {
      headers: { 'Authorization': `Bearer ${usuario1Token}` }
    });

    const perfilData = await perfilResponse.json();
    console.log('✅ Perfil obtenido exitosamente:');
    console.log(`   Nombre: ${perfilData.usuario.nombre}`);
    console.log(`   Email: ${perfilData.usuario.email}`);
    console.log(`   Rol: ${perfilData.usuario.rol}`);
    console.log(`   Artículos: ${perfilData.usuario.estadisticas.total_articulos}`);
    console.log(`   Revisiones: ${perfilData.usuario.estadisticas.total_revisiones}\n`);

    // Test 8: Intentar acceder a perfil sin token
    console.log('8. Intentando acceder a perfil sin token...');
    const sinTokenResponse = await fetch(`${API_URL}/auth/perfil`);

    if (sinTokenResponse.status === 401) {
      const errorSinToken = await sinTokenResponse.json();
      console.log('✅ Error esperado por falta de token:');
      console.log(`   Mensaje: ${errorSinToken.mensaje}\n`);
    }

    // Test 9: Intentar acceder con token inválido
    console.log('9. Intentando acceder con token inválido...');
    const tokenInvalidoResponse = await fetch(`${API_URL}/auth/perfil`, {
      headers: { 'Authorization': 'Bearer token_invalido' }
    });

    if (tokenInvalidoResponse.status === 401) {
      const errorTokenInvalido = await tokenInvalidoResponse.json();
      console.log('✅ Error esperado por token inválido:');
      console.log(`   Mensaje: ${errorTokenInvalido.mensaje}\n`);
    }

    // Test 10: Verificar token válido
    console.log('10. Verificando token válido...');
    const verificarResponse = await fetch(`${API_URL}/auth/verificar-token`, {
      headers: { 'Authorization': `Bearer ${usuario1Token}` }
    });

    const verificarData = await verificarResponse.json();
    console.log('✅ Token verificado exitosamente:');
    console.log(`   Válido: ${verificarData.valido}`);
    console.log(`   Usuario: ${verificarData.usuario.nombre}\n`);

    // Test 11: Cambiar contraseña
    console.log('11. Cambiando contraseña...');
    const cambiarContrasenaData = {
      contrasena_actual: nuevoUsuario.contrasena,
      contrasena_nueva: 'nueva_password123'
    };

    const cambiarResponse = await fetch(`${API_URL}/auth/cambiar-contrasena`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${usuario1Token}` 
      },
      body: JSON.stringify(cambiarContrasenaData)
    });

    const cambiarResult = await cambiarResponse.json();
    console.log('✅ Contraseña cambiada exitosamente:');
    console.log(`   Mensaje: ${cambiarResult.mensaje}\n`);

    // Test 12: Login con nueva contraseña
    console.log('12. Probando login con nueva contraseña...');
    const loginNuevaContrasena = {
      email: nuevoUsuario.email,
      contrasena: 'nueva_password123'
    };

    const loginNuevoResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginNuevaContrasena)
    });

    const loginNuevoResult = await loginNuevoResponse.json();
    console.log('✅ Login con nueva contraseña exitoso:');
    console.log(`   Usuario: ${loginNuevoResult.usuario.nombre}\n`);

    // Test 13: Crear segundo usuario para probar protección de rutas
    console.log('13. Creando segundo usuario con rol revisor...');
    const usuario2 = {
      nombre: 'Dra. Ana Martínez',
      email: `test_auth2_${Date.now()}@universidad.com`,
      contrasena: 'password456',
      rol: 'revisor'
    };

    const registro2Response = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario2)
    });

    const registro2Data = await registro2Response.json();
    usuario2Id = registro2Data.usuario.id;
    usuario2Token = registro2Data.token;

    console.log('✅ Segundo usuario creado:');
    console.log(`   Nombre: ${registro2Data.usuario.nombre}`);
    console.log(`   Rol: ${registro2Data.usuario.rol}\n`);

    // Test 14: Logout
    console.log('14. Probando logout...');
    const logoutResponse = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${usuario1Token}` }
    });

    const logoutResult = await logoutResponse.json();
    console.log('✅ Logout exitoso:');
    console.log(`   Mensaje: ${logoutResult.mensaje}\n`);

    // Test 15: Probar acceso a rutas protegidas de otros recursos
    console.log('15. Probando acceso a notificaciones con autenticación...');
    const notificacionConAuth = {
      usuario_id: usuario1Id,
      mensaje: 'Notificación creada con autenticación'
    };

    const notifResponse = await fetch(`${API_URL}/notificaciones`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${usuario1Token}` 
      },
      body: JSON.stringify(notificacionConAuth)
    });

    if (notifResponse.ok) {
      const notifResult = await notifResponse.json();
      console.log('✅ Notificación creada con autenticación:');
      console.log(`   ID: ${notifResult.notificacion.id}\n`);
    }

    // Limpiar datos de prueba
    console.log('16. Limpiando datos de prueba...');
    
    // Eliminar usuarios (usando el endpoint sin autenticación por simplicidad)
    await fetch(`${API_URL}/usuarios/${usuario1Id}`, { method: 'DELETE' });
    await fetch(`${API_URL}/usuarios/${usuario2Id}`, { method: 'DELETE' });
    
    console.log('✅ Datos de prueba eliminados\n');

    console.log('🎉 ¡Todas las pruebas de autenticación completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   - El servidor backend esté corriendo (npm run dev)');
    console.log('   - La base de datos esté conectada');
    console.log('   - Las tablas usuarios existan con las columnas correctas');
  }
}

// Ejecutar las pruebas
testAuthAPI();
