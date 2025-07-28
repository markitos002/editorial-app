// test-conexion-remota.js - Probar conexión a la base de datos remota y backend local
import axios from 'axios';

// Probar conexión al backend local
const BACKEND_URL = 'http://localhost:4000/api';

async function probarBackendLocal() {
  try {
    console.log('🔍 Probando conexión al backend local...');
    console.log(`URL: ${BACKEND_URL}`);
    
    const response = await axios.get(`${BACKEND_URL}`, { timeout: 5000 });
    console.log('✅ Conexión exitosa al backend local');
    console.log('Respuesta:', response.data);
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ No se puede conectar al backend local');
      console.log('💡 El servidor backend no está corriendo en localhost:4000');
      console.log('💡 Ejecuta: cd backend && node app.js');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('⏰ Timeout de conexión');
    } else {
      console.log('❌ Error de conexión:', error.message);
    }
  }
}

// Probar solo la conectividad básica a la IP del Debian
async function probarConectividadDebian() {
  try {
    console.log('\n🔍 Probando conectividad básica al Debian (PostgreSQL)...');
    console.log('IP: 192.168.18.5:5432');
    
    // Ping básico usando axios (aunque falle, nos da info de conectividad)
    await axios.get('http://192.168.18.5:5432', { 
      timeout: 3000,
      validateStatus: () => true 
    });
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Puerto 5432 no responde en Debian');
      console.log('💡 Verifica que PostgreSQL esté corriendo en el portátil Debian');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'EHOSTUNREACH') {
      console.log('⏰ No se puede alcanzar el portátil Debian (192.168.18.5)');
      console.log('💡 Verifica la conectividad de red');
    } else {
      console.log('ℹ️ Error esperado (PostgreSQL no es HTTP):', error.message);
      console.log('✅ Esto indica que el puerto 5432 está disponible');
    }
  }
}

console.log('🚀 === PRUEBA DE CONEXIÓN ===');
console.log('Backend: Windows (local)');
console.log('Base de datos: Debian (192.168.18.5)');
console.log('==========================================');

await probarBackendLocal();
await probarConectividadDebian();

console.log('\n💡 Instrucciones:');
console.log('1. Si el backend no responde: cd backend && node app.js');
console.log('2. El backend se conectará automáticamente a la BD remota usando el .env');
