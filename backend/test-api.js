// Script para probar los endpoints de la API
// Ejecutar con: node test-api.js

const BASE_URL = 'http://localhost:4000';
const API_URL = `${BASE_URL}/api`;

async function testAPI() {
  console.log('🚀 Iniciando pruebas de la API...\n');

  try {
    // Test 1: Verificar que el servidor esté funcionando
    console.log('1. Probando conexión al servidor...');
    const connectionTest = await fetch(BASE_URL);
    const connectionResponse = await connectionTest.text();
    console.log(`✅ Servidor responde: ${connectionResponse}\n`);

    // Test 2: Obtener todos los usuarios
    console.log('2. Obteniendo todos los usuarios...');
    const usuarios = await fetch(`${API_URL}/usuarios`);
    const usuariosData = await usuarios.json();
    console.log(`✅ Usuarios encontrados: ${usuariosData.length}`);
    console.log(usuariosData);
    console.log('');

    // Test 3: Crear un nuevo usuario
    console.log('3. Creando un nuevo usuario...');
    const nuevoUsuario = {
      nombre: "Usuario de Prueba",
      email: `test${Date.now()}@example.com`,
      contrasena: "password123",
      rol: "editor"
    };

    const crearResponse = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoUsuario)
    });

    if (!crearResponse.ok) {
      const errorData = await crearResponse.text();
      throw new Error(`Error al crear usuario: ${crearResponse.status} - ${errorData}`);
    }

    const usuarioCreado = await crearResponse.json();
    console.log('✅ Usuario creado:');
    console.log(usuarioCreado);
    console.log('');

    const userId = usuarioCreado.id;
    
    if (!userId) {
      throw new Error('El usuario creado no tiene ID. Verifica la estructura de la tabla usuarios.');
    }
    
    console.log(`🔍 ID del usuario creado: ${userId}`);

    // Test 4: Obtener usuario por ID
    console.log(`4. Obteniendo usuario con ID ${userId}...`);
    const usuarioPorId = await fetch(`${API_URL}/usuarios/${userId}`);
    const usuarioData = await usuarioPorId.json();
    console.log('✅ Usuario encontrado:');
    console.log(usuarioData);
    console.log('');

    // Test 5: Actualizar usuario
    console.log(`5. Actualizando usuario con ID ${userId}...`);
    const usuarioActualizado = {
      ...nuevoUsuario,
      nombre: "Usuario Actualizado",
      rol: "admin"
    };

    const actualizarResponse = await fetch(`${API_URL}/usuarios/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuarioActualizado)
    });

    const usuarioUpdated = await actualizarResponse.json();
    console.log('✅ Usuario actualizado:');
    console.log(usuarioUpdated);
    console.log('');

    // Test 6: Eliminar usuario
    console.log(`6. Eliminando usuario con ID ${userId}...`);
    const eliminarResponse = await fetch(`${API_URL}/usuarios/${userId}`, {
      method: 'DELETE'
    });

    const eliminacionResult = await eliminarResponse.json();
    console.log('✅ Usuario eliminado:');
    console.log(eliminacionResult);
    console.log('');

    // Test 7: Intentar obtener usuario eliminado
    console.log(`7. Intentando obtener usuario eliminado (ID ${userId})...`);
    const usuarioEliminado = await fetch(`${API_URL}/usuarios/${userId}`);
    
    if (usuarioEliminado.status === 404) {
      const errorResponse = await usuarioEliminado.json();
      console.log('✅ Error 404 esperado:');
      console.log(errorResponse);
    } else {
      console.log('❌ Se esperaba un error 404');
    }

    console.log('\n🎉 Todas las pruebas completadas!');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    console.log('\n💡 Asegúrate de que el servidor esté corriendo en el puerto 4000');
    console.log('   Ejecuta: npm run dev (en la carpeta backend)');
  }
}

// Ejecutar las pruebas
testAPI();
