// test-asignaciones.js - Script para probar las APIs de asignación de revisores
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

// Función para hacer login y obtener token
async function obtenerToken(email = 'admin@editorial.com', contrasena = 'admin123') {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: email,
      contrasena: contrasena
    });
    
    if (response.data.token) {
      console.log(`✅ Login exitoso como ${response.data.usuario.rol}`);
      return response.data.token;
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
async function probarAsignaciones() {
  console.log('🧪 Probando sistema de asignación de revisores...\n');
  
  // Obtener token de admin/editor
  const token = await obtenerToken();
  if (!token) {
    console.log('❌ No se pudo obtener token, terminando prueba');
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Test 1: Obtener revisores disponibles
  try {
    console.log('👥 Probando obtener revisores disponibles...');
    const response = await axios.get(`${API_URL}/asignaciones/revisores-disponibles`, { headers });
    
    if (response.data.success) {
      console.log('✅ Revisores disponibles obtenidos:');
      response.data.data.forEach((revisor, index) => {
        console.log(`   ${index + 1}. ${revisor.nombre} (${revisor.email})`);
        console.log(`      - Pendientes: ${revisor.revisiones_pendientes}, Completadas: ${revisor.revisiones_completadas}`);
      });
      console.log(`   Total: ${response.data.data.length} revisores`);
    } else {
      console.log('❌ Error:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ Error al obtener revisores:', error.response?.data?.mensaje || error.message);
  }

  console.log('');

  // Test 2: Obtener artículos sin asignar
  try {
    console.log('📄 Probando obtener artículos sin asignar...');
    const response = await axios.get(`${API_URL}/asignaciones/articulos-sin-asignar`, { headers });
    
    if (response.data.success) {
      console.log('✅ Artículos sin asignar obtenidos:');
      response.data.data.forEach((articulo, index) => {
        console.log(`   ${index + 1}. "${articulo.titulo}" por ${articulo.autor_nombre}`);
        console.log(`      - Estado: ${articulo.estado}, Revisores: ${articulo.revisores_asignados}`);
        console.log(`      - Fecha: ${new Date(articulo.fecha_creacion).toLocaleDateString()}`);
      });
      console.log(`   Total: ${response.data.data.length} artículos`);
    } else {
      console.log('❌ Error:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ Error al obtener artículos:', error.response?.data?.mensaje || error.message);
  }

  console.log('');

  // Test 3: Obtener asignaciones existentes
  try {
    console.log('📋 Probando obtener asignaciones existentes...');
    const response = await axios.get(`${API_URL}/asignaciones/asignaciones`, { headers });
    
    if (response.data.success) {
      console.log('✅ Asignaciones existentes obtenidas:');
      response.data.data.forEach((asignacion, index) => {
        console.log(`   ${index + 1}. "${asignacion.articulo_titulo}"`);
        console.log(`      - Revisor: ${asignacion.revisor_nombre} (${asignacion.revisor_email})`);
        console.log(`      - Estado: ${asignacion.revision_estado}`);
        console.log(`      - Asignado: ${new Date(asignacion.fecha_asignacion).toLocaleDateString()}`);
        if (asignacion.fecha_completado) {
          console.log(`      - Completado: ${new Date(asignacion.fecha_completado).toLocaleDateString()}`);
        }
      });
      console.log(`   Total: ${response.data.data.length} asignaciones`);
    } else {
      console.log('❌ Error:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ Error al obtener asignaciones:', error.response?.data?.mensaje || error.message);
  }

  console.log('');

  // Test 4: Intentar crear una nueva asignación (si hay datos disponibles)
  try {
    console.log('🔄 Probando crear nueva asignación...');
    
    // Primero obtener datos para la asignación
    const [revisorRes, articuloRes] = await Promise.all([
      axios.get(`${API_URL}/asignaciones/revisores-disponibles`, { headers }),
      axios.get(`${API_URL}/asignaciones/articulos-sin-asignar`, { headers })
    ]);

    if (revisorRes.data.success && articuloRes.data.success && 
        revisorRes.data.data.length > 0 && articuloRes.data.data.length > 0) {
      
      const revisor = revisorRes.data.data[0];
      const articulo = articuloRes.data.data[0];
      
      console.log(`   Intentando asignar "${articulo.titulo}" a ${revisor.nombre}...`);
      
      const response = await axios.post(`${API_URL}/asignaciones/asignar`, {
        articulo_id: articulo.id,
        revisor_id: revisor.id,
        observaciones: 'Asignación de prueba automática'
      }, { headers });
      
      if (response.data.success) {
        console.log('✅ Asignación creada exitosamente:');
        console.log(`   - Revisión ID: ${response.data.data.revision_id}`);
        console.log(`   - Artículo: ${response.data.data.articulo.titulo}`);
        console.log(`   - Revisor: ${response.data.data.revisor.nombre}`);
        console.log(`   - Fecha: ${new Date(response.data.data.fecha_asignacion).toLocaleString()}`);
      } else {
        console.log('❌ Error al crear asignación:', response.data.mensaje);
      }
    } else {
      console.log('⚠️  No hay datos suficientes para crear asignación de prueba');
      console.log(`   Revisores: ${revisorRes.data.data?.length || 0}, Artículos: ${articuloRes.data.data?.length || 0}`);
    }
  } catch (error) {
    console.log('❌ Error al crear asignación:', error.response?.data?.mensaje || error.message);
  }

  console.log('\n🎉 Pruebas de asignaciones completadas');
}

// Ejecutar las pruebas
probarAsignaciones().catch(console.error);
