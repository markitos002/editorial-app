// test-notificaciones-simple.js - Test básico para verificar rutas
require('dotenv').config();
const axios = require('axios');

const API_BASE = 'http://localhost:4000/api';

async function testBasico() {
  try {
    console.log('🔔 Test básico de notificaciones\n');
    
    // Login
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@editorial.com',
      contrasena: 'admin123'
    });
    
    const token = loginResponse.data.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    console.log('✅ Login exitoso');
    
    // Test endpoint usuario/me
    console.log('\n📋 Testing /usuario/me...');
    const response = await axios.get(`${API_BASE}/notificaciones/usuario/me`, { headers });
    
    console.log('✅ Respuesta exitosa');
    console.log('Estructura de respuesta:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testBasico();
