// test-simple-revisiones.js
const API_URL = 'http://localhost:4000/api';

async function testSimple() {
  console.log('🔍 Test simple de revisiones...\n');

  try {
    // Test 1: Crear usuario
    console.log('1. Creando usuario...');
    const usuario = {
      nombre: 'Dr. Test',
      email: `test_${Date.now()}@test.com`,
      contrasena: 'password123',
      rol: 'revisor'
    };
    
    const usuarioResponse = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    
    console.log('Status:', usuarioResponse.status);
    const usuarioCreado = await usuarioResponse.json();
    console.log('Respuesta usuario:', JSON.stringify(usuarioCreado, null, 2));

    // Test 2: Obtener revisiones
    console.log('\n2. Obteniendo revisiones...');
    const revisionesResponse = await fetch(`${API_URL}/revisiones`);
    console.log('Status revisiones:', revisionesResponse.status);
    const revisionesData = await revisionesResponse.json();
    console.log('Respuesta revisiones:', JSON.stringify(revisionesData, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSimple();
