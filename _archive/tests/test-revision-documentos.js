// test-revision-documentos.js - Script para probar las APIs de revisión de documentos
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

// Función para hacer login y obtener token
async function obtenerToken(email = 'test-revisor@editorial.com', contrasena = 'test123') {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: email,
      contrasena: contrasena
    });
    
    if (response.data.token) {
      console.log(`✅ Login exitoso como ${response.data.usuario.rol}: ${response.data.usuario.nombre}`);
      return {
        token: response.data.token,
        usuario: response.data.usuario
      };
    } else {
      console.log('❌ Error en login: No se recibió token');
      return null;
    }
  } catch (error) {
    console.log('❌ Error en login:', error.response?.data?.mensaje || error.message);
    return null;
  }
}

// Función principal de testing
async function probarRevisionDocumentos() {
  console.log('🧪 Probando sistema de revisión de documentos...\n');
  
  // Obtener token de revisor
  const authData = await obtenerToken();
  if (!authData) {
    console.log('❌ No se pudo obtener token de revisor, terminando prueba');
    return;
  }

  const headers = {
    'Authorization': `Bearer ${authData.token}`,
    'Content-Type': 'application/json'
  };

  // Test 1: Obtener revisiones asignadas
  try {
    console.log('📋 Probando obtener revisiones asignadas...');
    const response = await axios.get(`${API_URL}/revision-documentos/mis-revisiones`, { headers });
    
    if (response.data.success) {
      console.log(`✅ Revisiones asignadas obtenidas: ${response.data.data.length} revisiones`);
      response.data.data.forEach((revision, index) => {
        console.log(`   ${index + 1}. "${revision.titulo}" - Estado: ${revision.revision_estado}`);
        console.log(`      - Autor: ${revision.autor_nombre}`);
        console.log(`      - Archivo: ${revision.archivo_nombre || 'Sin archivo'}`);
        console.log(`      - Asignado: ${new Date(revision.fecha_asignacion).toLocaleDateString()}`);
      });
      
      // Guardar primera revisión para pruebas siguientes
      if (response.data.data.length > 0) {
        global.revisionPrueba = response.data.data[0];
        console.log(`\n🔖 Usando revisión ID ${global.revisionPrueba.revision_id} para pruebas siguientes`);
      }
    } else {
      console.log('❌ Error:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ Error al obtener revisiones:', error.response?.data?.mensaje || error.message);
  }

  console.log('');

  // Test 2: Obtener detalles de una revisión específica
  if (global.revisionPrueba) {
    try {
      console.log(`📄 Probando obtener detalles de revisión ${global.revisionPrueba.revision_id}...`);
      const response = await axios.get(
        `${API_URL}/revision-documentos/revision/${global.revisionPrueba.revision_id}`, 
        { headers }
      );
      
      if (response.data.success) {
        const revision = response.data.data;
        console.log('✅ Detalles de revisión obtenidos:');
        console.log(`   - Artículo: "${revision.titulo}"`);
        console.log(`   - Autor: ${revision.autor_nombre} (${revision.autor_email})`);
        console.log(`   - Estado: ${revision.estado}`);
        console.log(`   - Archivo: ${revision.archivo_nombre} (${(revision.archivo_size / 1024).toFixed(1)} KB)`);
        console.log(`   - Observaciones actuales: ${revision.observaciones || 'Ninguna'}`);
        console.log(`   - Calificación actual: ${revision.calificacion || 'Sin calificar'}`);
      } else {
        console.log('❌ Error:', response.data.mensaje);
      }
    } catch (error) {
      console.log('❌ Error al obtener detalles:', error.response?.data?.mensaje || error.message);
    }
  }

  console.log('');

  // Test 3: Guardar progreso de revisión
  if (global.revisionPrueba) {
    try {
      console.log(`💾 Probando guardar progreso de revisión...`);
      const response = await axios.put(
        `${API_URL}/revision-documentos/revision/${global.revisionPrueba.revision_id}/progreso`,
        {
          observaciones: 'Revisión parcial: El artículo presenta una estructura adecuada. Necesita mejorar la metodología en la sección 3.',
          calificacion: 4
        },
        { headers }
      );
      
      if (response.data.success) {
        console.log('✅ Progreso guardado exitosamente');
      } else {
        console.log('❌ Error:', response.data.mensaje);
      }
    } catch (error) {
      console.log('❌ Error al guardar progreso:', error.response?.data?.mensaje || error.message);
    }
  }

  console.log('');

  // Test 4: Obtener historial de comentarios
  if (global.revisionPrueba) {
    try {
      console.log(`💬 Probando obtener historial de comentarios...`);
      const response = await axios.get(
        `${API_URL}/revision-documentos/revision/${global.revisionPrueba.revision_id}/comentarios`,
        { headers }
      );
      
      if (response.data.success) {
        console.log('✅ Historial de comentarios obtenido:');
        console.log(`   - Comentarios públicos: ${response.data.data.comentarios_publicos || 'Ninguno'}`);
        console.log(`   - Última actualización: ${new Date(response.data.data.ultima_actualizacion).toLocaleString()}`);
      } else {
        console.log('❌ Error:', response.data.mensaje);
      }
    } catch (error) {
      console.log('❌ Error al obtener historial:', error.response?.data?.mensaje || error.message);
    }
  }

  console.log('');

  // Test 5: Probar descarga de documento (solo verificar endpoint)
  if (global.revisionPrueba && global.revisionPrueba.archivo_nombre) {
    try {
      console.log(`📥 Probando endpoint de descarga de documento...`);
      // Solo hacemos HEAD request para verificar que el endpoint responde
      const response = await axios.head(
        `${API_URL}/revision-documentos/revision/${global.revisionPrueba.revision_id}/documento`,
        { headers }
      );
      
      console.log('✅ Endpoint de descarga disponible');
    } catch (error) {
      if (error.response?.status === 405) {
        console.log('⚠️  Endpoint de descarga disponible (método HEAD no soportado)');
      } else {
        console.log('❌ Error en endpoint de descarga:', error.response?.data?.mensaje || error.message);
      }
    }
  }

  console.log('\n🎉 Pruebas de revisión de documentos completadas');
}

// Ejecutar las pruebas
probarRevisionDocumentos().catch(console.error);
