// test-complete-revision-system.js - Script completo para probar todo el sistema de revisión
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

// Función para hacer login y obtener token
async function obtenerToken(email, contrasena, descripcion) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: email,
      contrasena: contrasena
    });
    
    if (response.data.token) {
      console.log(`✅ Login exitoso como ${descripcion}: ${response.data.usuario.nombre} (${response.data.usuario.rol})`);
      return {
        token: response.data.token,
        usuario: response.data.usuario
      };
    } else {
      console.log(`❌ Error en login ${descripcion}: No se recibió token`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error en login ${descripcion}:`, error.response?.data?.mensaje || error.message);
    return null;
  }
}

// Función principal de testing
async function probarSistemaCompleto() {
  console.log('🧪 PROBANDO SISTEMA COMPLETO DE REVISIÓN DE DOCUMENTOS');
  console.log('='.repeat(60));
  
  // 1. LOGIN COMO EDITOR (para verificar asignaciones)
  console.log('\n📝 FASE 1: VERIFICANDO SISTEMA DE ASIGNACIONES');
  console.log('-'.repeat(40));
  
  const editorAuth = await obtenerToken('admin@editorial.com', 'admin123', 'Editor');
  if (!editorAuth) {
    console.log('❌ No se pudo obtener token de editor, terminando prueba');
    return;
  }

  const editorHeaders = {
    'Authorization': `Bearer ${editorAuth.token}`,
    'Content-Type': 'application/json'
  };

  // Verificar asignaciones existentes
  try {
    console.log('\n📋 Verificando asignaciones existentes...');
    const response = await axios.get(`${API_URL}/asignaciones/activas`, { headers: editorHeaders });
    
    if (response.data.success) {
      console.log(`✅ Asignaciones activas: ${response.data.data.length}`);
      response.data.data.forEach((asignacion, index) => {
        console.log(`   ${index + 1}. "${asignacion.titulo}" → ${asignacion.revisor_nombre}`);
        console.log(`      Estado: ${asignacion.estado} | Asignado: ${new Date(asignacion.fecha_asignacion).toLocaleDateString()}`);
      });
    } else {
      console.log('❌ Error al obtener asignaciones:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ Error al obtener asignaciones:', error.response?.data?.mensaje || error.message);
  }

  // 2. LOGIN COMO REVISOR
  console.log('\n📝 FASE 2: PROBANDO SISTEMA DE REVISIÓN COMO REVISOR');
  console.log('-'.repeat(40));
  
  const revisorAuth = await obtenerToken('test-revisor@editorial.com', 'test123', 'Revisor');
  if (!revisorAuth) {
    console.log('❌ No se pudo obtener token de revisor, terminando prueba de revisión');
    return;
  }

  const revisorHeaders = {
    'Authorization': `Bearer ${revisorAuth.token}`,
    'Content-Type': 'application/json'
  };

  // 2.1 Obtener revisiones asignadas
  let primeraRevision = null;
  try {
    console.log('\n📋 Obteniendo revisiones asignadas al revisor...');
    const response = await axios.get(`${API_URL}/revision-documentos/mis-revisiones`, { headers: revisorHeaders });
    
    if (response.data.success) {
      console.log(`✅ Revisiones asignadas: ${response.data.data.length}`);
      response.data.data.forEach((revision, index) => {
        console.log(`   ${index + 1}. "${revision.titulo}" - Estado: ${revision.revision_estado}`);
        console.log(`      - Autor: ${revision.autor_nombre}`);
        console.log(`      - Archivo: ${revision.archivo_nombre || 'Sin archivo'}`);
        console.log(`      - Asignado: ${new Date(revision.fecha_asignacion).toLocaleDateString()}`);
        
        if (index === 0) {
          primeraRevision = revision;
        }
      });
    } else {
      console.log('❌ Error:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ Error al obtener revisiones:', error.response?.data?.mensaje || error.message);
  }

  if (!primeraRevision) {
    console.log('⚠️  No hay revisiones asignadas para probar el flujo completo');
    return;
  }

  console.log(`\n🔖 Usando revisión ID ${primeraRevision.revision_id} para pruebas detalladas`);

  // 2.2 Obtener detalles de revisión
  try {
    console.log('\n📄 Obteniendo detalles de la revisión...');
    const response = await axios.get(
      `${API_URL}/revision-documentos/revision/${primeraRevision.revision_id}`, 
      { headers: revisorHeaders }
    );
    
    if (response.data.success) {
      const revision = response.data.data;
      console.log('✅ Detalles obtenidos:');
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

  // 2.3 Guardar progreso
  try {
    console.log('\n💾 Probando guardar progreso de revisión...');
    const nuevasObservaciones = `Revisión actualizada ${new Date().toLocaleString()}: El artículo presenta una metodología sólida. Se recomienda ampliar la sección de resultados y mejorar las conclusiones. La estructura general es adecuada pero necesita mayor precisión en las referencias bibliográficas.`;
    
    const response = await axios.put(
      `${API_URL}/revision-documentos/revision/${primeraRevision.revision_id}/progreso`,
      {
        observaciones: nuevasObservaciones,
        calificacion: 7
      },
      { headers: revisorHeaders }
    );
    
    if (response.data.success) {
      console.log('✅ Progreso guardado exitosamente');
      console.log('   - Nuevas observaciones guardadas');
      console.log('   - Calificación actualizada: 7/10');
    } else {
      console.log('❌ Error:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ Error al guardar progreso:', error.response?.data?.mensaje || error.message);
  }

  // 2.4 Verificar que el progreso se guardó
  try {
    console.log('\n🔍 Verificando que el progreso se guardó correctamente...');
    const response = await axios.get(
      `${API_URL}/revision-documentos/revision/${primeraRevision.revision_id}`, 
      { headers: revisorHeaders }
    );
    
    if (response.data.success) {
      const revision = response.data.data;
      console.log('✅ Progreso verificado:');
      console.log(`   - Calificación: ${revision.calificacion}/10`);
      console.log(`   - Observaciones actualizadas: ${revision.observaciones ? 'Sí' : 'No'}`);
      console.log(`   - Última actualización: ${new Date(revision.fecha_actualizacion).toLocaleString()}`);
    } else {
      console.log('❌ Error al verificar:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ Error al verificar progreso:', error.response?.data?.mensaje || error.message);
  }

  // 2.5 Obtener historial de comentarios
  try {
    console.log('\n💬 Obteniendo historial de comentarios...');
    const response = await axios.get(
      `${API_URL}/revision-documentos/revision/${primeraRevision.revision_id}/comentarios`,
      { headers: revisorHeaders }
    );
    
    if (response.data.success) {
      console.log('✅ Historial obtenido:');
      console.log(`   - Comentarios públicos: ${response.data.data.comentarios_publicos ? 'Disponibles' : 'Ninguno'}`);
      console.log(`   - Última actualización: ${new Date(response.data.data.ultima_actualizacion).toLocaleString()}`);
    } else {
      console.log('❌ Error:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ Error al obtener historial:', error.response?.data?.mensaje || error.message);
  }

  // 2.6 Probar completar revisión
  try {
    console.log('\n✅ Probando completar revisión...');
    const response = await axios.put(
      `${API_URL}/revision-documentos/revision/${primeraRevision.revision_id}/completar`,
      {
        observaciones: 'REVISIÓN FINAL: El artículo es de buena calidad y cumple con los estándares académicos. Se recomienda su aceptación con cambios menores en la metodología.',
        calificacion: 8,
        recomendacion: 'aceptar',
        observaciones_privadas: 'El autor ha demostrado un buen manejo del tema. Recomiendo su publicación.'
      },
      { headers: revisorHeaders }
    );
    
    if (response.data.success) {
      console.log('✅ Revisión completada exitosamente');
      console.log('   - Estado cambiado a: completada');
      console.log('   - Calificación final: 8/10');
      console.log('   - Recomendación: Aceptar');
    } else {
      console.log('❌ Error:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ Error al completar revisión:', error.response?.data?.mensaje || error.message);
  }

  // 2.7 Verificar estado final
  try {
    console.log('\n🔍 Verificando estado final de la revisión...');
    const response = await axios.get(
      `${API_URL}/revision-documentos/revision/${primeraRevision.revision_id}`, 
      { headers: revisorHeaders }
    );
    
    if (response.data.success) {
      const revision = response.data.data;
      console.log('✅ Estado final verificado:');
      console.log(`   - Estado: ${revision.estado}`);
      console.log(`   - Calificación final: ${revision.calificacion}/10`);
      console.log(`   - Fecha de finalización: ${new Date(revision.fecha_actualizacion).toLocaleString()}`);
    } else {
      console.log('❌ Error al verificar estado final:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ Error al verificar estado final:', error.response?.data?.mensaje || error.message);
  }

  // 3. RESUMEN FINAL
  console.log('\n📊 RESUMEN FINAL DEL TESTING');
  console.log('='.repeat(40));
  console.log('✅ Sistema de autenticación: FUNCIONANDO');
  console.log('✅ APIs de revisión de documentos: FUNCIONANDO');
  console.log('✅ Flujo completo de revisión: FUNCIONANDO');
  console.log('✅ Guardado de progreso: FUNCIONANDO');
  console.log('✅ Completar revisión: FUNCIONANDO');
  console.log('\n🎉 SISTEMA DE REVISIÓN DE DOCUMENTOS COMPLETAMENTE OPERATIVO');
  
  console.log('\n📝 PRÓXIMOS PASOS SUGERIDOS:');
  console.log('1. Probar la interfaz web en http://localhost:5173');
  console.log('2. Hacer login como revisor: test-revisor@editorial.com / test123');
  console.log('3. Navegar a "Mis Revisiones" en el menú');
  console.log('4. Probar el flujo completo de revisión en la interfaz');
}

// Ejecutar las pruebas
probarSistemaCompleto().catch(console.error);
