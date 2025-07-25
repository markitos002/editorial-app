// test-login.js - Probar login de usuarios
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function testLogin() {
  console.log('🧪 Probando login de usuarios...\n');
  
  // Test 1: Login con admin (usuario existente)
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@editorial.com',
      contrasena: 'admin123'
    });
    
    if (response.data.mensaje) {
      console.log('✅ Login admin exitoso:');
      console.log(`   - Usuario: ${response.data.usuario.nombre}`);
      console.log(`   - Email: ${response.data.usuario.email}`);
      console.log(`   - Rol: ${response.data.usuario.rol}`);
      console.log(`   - Token generado: ${response.data.token ? 'Sí' : 'No'}`);
    }
  } catch (error) {
    console.log('❌ Error en login admin:', error.response?.data?.mensaje || error.message);
  }

  console.log('\n--- Probando login con editor recién creado ---');
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'test-editor@editorial.com',
      contrasena: 'test123'
    });
    
    if (response.data.mensaje) {
      console.log('✅ Login editor exitoso:');
      console.log(`   - Usuario: ${response.data.usuario.nombre}`);
      console.log(`   - Email: ${response.data.usuario.email}`);
      console.log(`   - Rol: ${response.data.usuario.rol}`);
      console.log(`   - Token generado: ${response.data.token ? 'Sí' : 'No'}`);
    }
  } catch (error) {
    console.log('❌ Error en login editor:', error.response?.data?.mensaje || error.message);
  }
}

testLogin().catch(console.error);
