// test-admin-crear-editor.js - Script específico para probar creación de editor por admin
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function probarCreacionPorAdmin() {
  console.log('🧪 PROBANDO CREACIÓN DE EDITOR POR ADMINISTRADOR');
  console.log('='.repeat(60));

  try {
    // 1. Login como admin
    console.log('\n👤 PASO 1: Haciendo login como administrador...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@editorial.com',
      contrasena: 'admin123'
    });
    
    if (!loginResponse.data.token) {
      console.log('❌ ERROR: No se pudo hacer login como admin');
      return;
    }
    
    console.log('✅ Login exitoso como:', loginResponse.data.usuario.nombre);
    console.log('   Rol:', loginResponse.data.usuario.rol);
    
    const adminHeaders = {
      'Authorization': `Bearer ${loginResponse.data.token}`,
      'Content-Type': 'application/json'
    };
    
    // 2. Intentar crear editor
    console.log('\n📝 PASO 2: Creando editor...');
    const editorData = {
      nombre: 'Editor de Prueba',
      email: `editor-${Date.now()}@test.com`,
      contrasena: 'editor123',
      rol: 'editor'
    };
    
    console.log('Datos a enviar:', { ...editorData, contrasena: '***' });
    
    const createResponse = await axios.post(`${API_URL}/usuarios/admin/crear`, editorData, { 
      headers: adminHeaders 
    });
    
    if (createResponse.data.success) {
      console.log('✅ EXITOSO: Editor creado correctamente');
      console.log('   ID:', createResponse.data.data.id);
      console.log('   Nombre:', createResponse.data.data.nombre);
      console.log('   Email:', createResponse.data.data.email);
      console.log('   Rol:', createResponse.data.data.rol);
    } else {
      console.log('❌ ERROR:', createResponse.data.mensaje);
    }
    
    // 3. Verificar que el editor fue creado
    console.log('\n🔍 PASO 3: Verificando que el editor existe...');
    const loginEditorResponse = await axios.post(`${API_URL}/auth/login`, {
      email: editorData.email,
      contrasena: editorData.contrasena
    });
    
    if (loginEditorResponse.data.token) {
      console.log('✅ VERIFICADO: El editor puede hacer login');
      console.log('   Usuario:', loginEditorResponse.data.usuario.nombre);
      console.log('   Rol:', loginEditorResponse.data.usuario.rol);
    } else {
      console.log('❌ ERROR: El editor no puede hacer login');
    }
    
  } catch (error) {
    console.log('❌ ERROR GENERAL:', error.response?.data?.mensaje || error.message);
    console.log('Status:', error.response?.status);
    console.log('URL:', error.config?.url);
    console.log('Method:', error.config?.method);
    
    if (error.response?.data) {
      console.log('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Ejecutar la prueba
probarCreacionPorAdmin().catch(console.error);
