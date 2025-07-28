// test-metricas-archivos.js - Pruebas para las métricas de archivos y almacenamiento
const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:4000/api';

// Token de admin para las pruebas
let adminToken = '';

// Función para hacer login y obtener token
async function login() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@editorial.com',
      contrasena: 'admin123'
    });
    adminToken = response.data.token;
    console.log('✅ Login exitoso como admin');
    return true;
  } catch (error) {
    console.error('❌ Error en login:', error.response?.data?.mensaje || error.message);
    return false;
  }
}

// Función para probar métricas de archivos
async function testMetricasArchivos() {
  try {
    console.log('\n🔍 Probando métricas de archivos...');
    
    const response = await axios.get(`${BASE_URL}/estadisticas/metricas-archivos`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    console.log('📊 Métricas de archivos obtenidas:');
    console.log('- Total de archivos:', response.data.data.totalArchivos);
    console.log('- Espacio total (MB):', response.data.data.espacioTotalMB);
    console.log('- Tamaño promedio (MB):', response.data.data.tamanoPromedio.mb);
    console.log('- Distribución por tipos:', response.data.data.distribucionTipos.length, 'tipos');
    console.log('- Archivos grandes (top 5):', response.data.data.archivosGrandes.length, 'archivos');
    console.log('- Actividad reciente:', response.data.data.actividadReciente.length, 'días');

    // Mostrar detalles de distribución por tipos
    if (response.data.data.distribucionTipos.length > 0) {
      console.log('\n📋 Distribución por tipos de archivo:');
      response.data.data.distribucionTipos.forEach(tipo => {
        console.log(`  - ${tipo.tipo}: ${tipo.cantidad} archivos (${tipo.espacioMB} MB)`);
      });
    }

    // Mostrar archivos más grandes
    if (response.data.data.archivosGrandes.length > 0) {
      console.log('\n📁 Archivos más grandes:');
      response.data.data.archivosGrandes.forEach((archivo, index) => {
        console.log(`  ${index + 1}. ${archivo.titulo} - ${archivo.tamanoMB} MB`);
      });
    }

    return true;
  } catch (error) {
    console.error('❌ Error al obtener métricas de archivos:', error.response?.data?.mensaje || error.message);
    return false;
  }
}

// Función para probar estadísticas de descarga
async function testEstadisticasDescargas() {
  try {
    console.log('\n📥 Probando estadísticas de descarga...');
    
    const response = await axios.get(`${BASE_URL}/estadisticas/estadisticas-descargas`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    console.log('📊 Estadísticas de descarga:');
    console.log('- Archivos disponibles:', response.data.data.archivosDisponibles);
    console.log('- Archivos publicados:', response.data.data.archivosPublicados);
    console.log('- Total descargas:', response.data.data.totalDescargas);
    console.log('- Nota:', response.data.data.nota);

    return true;
  } catch (error) {
    console.error('❌ Error al obtener estadísticas de descarga:', error.response?.data?.mensaje || error.message);
    return false;
  }
}

// Función principal
async function runTests() {
  console.log('🚀 Iniciando pruebas de métricas de archivos...\n');

  // Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ No se pudo hacer login. Abortando pruebas.');
    return;
  }

  // Pruebas
  const tests = [
    { name: 'Métricas de archivos', fn: testMetricasArchivos },
    { name: 'Estadísticas de descarga', fn: testEstadisticasDescargas }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        console.log(`✅ ${test.name}: PASÓ`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: FALLÓ`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR -`, error.message);
      failed++;
    }
  }

  console.log(`\n📋 Resumen de pruebas:`);
  console.log(`✅ Pasaron: ${passed}`);
  console.log(`❌ Fallaron: ${failed}`);
  console.log(`📊 Total: ${passed + failed}`);
}

// Ejecutar pruebas
runTests().catch(console.error);
