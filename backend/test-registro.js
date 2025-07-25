// test-registro.js - Probar registro de usuarios
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function testRegistro() {
  console.log('🧪 Probando registro de usuario...\n');
  
  try {
    const response = await axios.post(`${API_URL}/auth/registro`, {
      nombre: 'Test Editor',
      email: 'test-editor@editorial.com',
      contrasena: 'test123',
      rol: 'editor'
    });
    
    if (response.data.mensaje) {
      console.log('✅ Registro exitoso:');
      console.log(`   - Usuario: ${response.data.usuario.nombre}`);
      console.log(`   - Email: ${response.data.usuario.email}`);
      console.log(`   - Rol: ${response.data.usuario.rol}`);
      console.log(`   - ID: ${response.data.usuario.id}`);
      console.log(`   - Token generado: ${response.data.token ? 'Sí' : 'No'}`);
    }
  } catch (error) {
    console.log('❌ Error en registro:', error.response?.data?.mensaje || error.message);
    if (error.response?.data?.error) {
      console.log('   Error técnico:', error.response.data.error);
    }
  }

  console.log('\n--- Probando registro de revisor ---');
  
  try {
    const response = await axios.post(`${API_URL}/auth/registro`, {
      nombre: 'Test Revisor',
      email: 'test-revisor@editorial.com',
      contrasena: 'test123',
      rol: 'revisor'
    });
    
    if (response.data.mensaje) {
      console.log('✅ Registro de revisor exitoso:');
      console.log(`   - Usuario: ${response.data.usuario.nombre}`);
      console.log(`   - Email: ${response.data.usuario.email}`);
      console.log(`   - Rol: ${response.data.usuario.rol}`);
      console.log(`   - ID: ${response.data.usuario.id}`);
    }
  } catch (error) {
    console.log('❌ Error en registro de revisor:', error.response?.data?.mensaje || error.message);
    if (error.response?.data?.error) {
      console.log('   Error técnico:', error.response.data.error);
    }
  }
}

testRegistro().catch(console.error);
