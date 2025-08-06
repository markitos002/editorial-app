const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';

async function debugAPIResponse() {
  try {
    // Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@editorial.com',
      contrasena: 'admin123'
    });
    
    const token = loginResponse.data.token;
    
    const api = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Test búsqueda artículos sin parámetros
    console.log('🔍 Probando búsqueda de artículos sin parámetros...');
    const response1 = await api.get('/busqueda/articulos');
    
    console.log('📊 Primera respuesta (sin parámetros):');
    if (response1.data.articulos && response1.data.articulos.length > 0) {
      const articulo = response1.data.articulos[0];
      console.log('Keys disponibles:', Object.keys(articulo));
      console.log('autor:', articulo.autor);
      console.log('autor_email:', articulo.autor_email);
      console.log('autor_usuario_nombre:', articulo.autor_usuario_nombre);
      console.log('autor_usuario_email:', articulo.autor_usuario_email);
    }
    
    // Test búsqueda artículos con parámetros
    console.log('\n🔍 Probando búsqueda de artículos con término...');
    const response2 = await api.get('/busqueda/articulos', {
      params: { q: 'ejemplo' }
    });
    
    console.log('� Segunda respuesta (con término):');
    if (response2.data.articulos && response2.data.articulos.length > 0) {
      const articulo = response2.data.articulos[0];
      console.log('Keys disponibles:', Object.keys(articulo));
      console.log('autor:', articulo.autor);
      console.log('autor_email:', articulo.autor_email);
      console.log('autor_usuario_nombre:', articulo.autor_usuario_nombre);
      console.log('autor_usuario_email:', articulo.autor_usuario_email);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

debugAPIResponse();
