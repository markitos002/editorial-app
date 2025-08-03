// test-api-data.js - Prueba de datos de la API para debugging
import axios from 'axios';

async function testApiData() {
  try {
    console.log('🔍 Probando datos de la API...\n');
    
    // Primero obtener un token (simulado - esto normalmente requiere login)
    console.log('📡 Haciendo request a búsqueda de artículos...');
    
    const response = await axios.get('https://editorial-app-backend.onrender.com/api/test', {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ Respuesta recibida:');
    console.log('Status:', response.status);
    console.log('Data keys:', Object.keys(response.data));
    
    if (response.data.articulos) {
      console.log('\n📝 Analizando artículos:');
      response.data.articulos.forEach((articulo, index) => {
        console.log(`\n--- Artículo ${index + 1} ---`);
        Object.entries(articulo).forEach(([key, value]) => {
          const tipo = typeof value;
          let info = `${key}: ${tipo}`;
          
          if (tipo === 'object' && value !== null) {
            info += ` [OBJECT] ${JSON.stringify(value)}`;
          } else if (tipo === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
            info += ` [POSSIBLE_JSON] ${value}`;
          } else {
            info += ` = ${value}`;
          }
          
          console.log(`  ${info}`);
        });
      });
    } else {
      console.log('❌ No se encontraron artículos en la respuesta');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.status, error.response?.statusText);
    console.error('Message:', error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

testApiData();
