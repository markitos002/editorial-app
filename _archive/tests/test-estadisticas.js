// test-estadisticas.js - Script para probar las APIs de estadísticas
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

// Función para hacer login y obtener token
async function obtenerToken() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@editorial.com',
      contrasena: 'admin123'
    });
    
    console.log('📋 Respuesta completa del login:', response.data);
    
    if (response.data.token) {
      console.log('✅ Login exitoso como admin');
      return response.data.token;
    } else {
      console.log('❌ Error en login: No se recibió token');
      console.log('   Respuesta:', response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ Error en login:', error.response?.data?.mensaje || error.message);
    return null;
  }
}

// Función para probar las estadísticas
async function probarEstadisticas() {
  console.log('🧪 Probando APIs de estadísticas...\n');
  
  // Obtener token de admin
  const token = await obtenerToken();
  if (!token) {
    console.log('❌ No se pudo obtener token, terminando prueba');
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Test 1: Estadísticas generales (admin)
  try {
    console.log('📊 Probando estadísticas generales...');
    const response = await axios.get(`${API_URL}/estadisticas/generales`, { headers });
    
    if (response.data.success) {
      console.log('✅ Estadísticas generales obtenidas:');
      console.log(`   - Total usuarios: ${response.data.data.totalUsuarios}`);
      console.log(`   - Total artículos: ${response.data.data.totalArticulos}`);
      console.log(`   - Artículos pendientes: ${response.data.data.articulosPendientes}`);
      console.log(`   - Revisiones completas: ${response.data.data.revisionesCompletas}`);
      console.log(`   - Usuarios activos: ${response.data.data.usuariosActivos}`);
    } else {
      console.log('❌ Error:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ Error en estadísticas generales:', error.response?.data?.mensaje || error.message);
  }

  console.log('');

  // Test 2: Estadísticas de editor
  try {
    console.log('📝 Probando estadísticas de editor...');
    const response = await axios.get(`${API_URL}/estadisticas/editor`, { headers });
    
    if (response.data.success) {
      console.log('✅ Estadísticas de editor obtenidas:');
      console.log(`   - Artículos en revisión: ${response.data.data.articulosEnRevision}`);
      console.log(`   - Artículos aprobados: ${response.data.data.articulosAprobados}`);
      console.log(`   - Artículos rechazados: ${response.data.data.articulosRechazados}`);
      console.log(`   - Revisores pendientes: ${response.data.data.revisoresPendientes}`);
      console.log(`   - Artículos listos: ${response.data.data.articulosListos}`);
    } else {
      console.log('❌ Error:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ Error en estadísticas de editor:', error.response?.data?.mensaje || error.message);
  }

  console.log('');

  // Test 3: Actividad reciente
  try {
    console.log('🕒 Probando actividad reciente...');
    const response = await axios.get(`${API_URL}/estadisticas/actividad-reciente`, { headers });
    
    if (response.data.success) {
      console.log('✅ Actividad reciente obtenida:');
      response.data.data.forEach((actividad, index) => {
        console.log(`   ${index + 1}. ${actividad.tipo}: ${actividad.titulo || actividad.nombre} (${new Date(actividad.fecha).toLocaleDateString()})`);
      });
    } else {
      console.log('❌ Error:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ Error en actividad reciente:', error.response?.data?.mensaje || error.message);
  }

  console.log('\n🎉 Pruebas de estadísticas completadas');
}

// Ejecutar las pruebas
probarEstadisticas().catch(console.error);
