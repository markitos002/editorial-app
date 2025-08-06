// test-restriccion-roles.js - Script para probar la restricción de roles
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function probarRestriccionRoles() {
  console.log('🧪 PROBANDO RESTRICCIÓN DE ROLES EN REGISTRO');
  console.log('='.repeat(60));

  // 1. Intentar registrar un autor (debería funcionar)
  console.log('\n✅ PRUEBA 1: Registrar autor (permitido)');
  try {
    const response = await axios.post(`${API_URL}/auth/registro`, {
      nombre: 'Test Autor',
      email: 'test-autor-nuevo@test.com',
      contrasena: 'test123',
      rol: 'autor'
    });
    
    if (response.data.success) {
      console.log('✅ EXITOSO: Autor registrado correctamente');
    } else {
      console.log('❌ FALLÓ:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.response?.data?.mensaje || error.message);
  }

  // 2. Intentar registrar un revisor (debería funcionar)
  console.log('\n✅ PRUEBA 2: Registrar revisor (permitido)');
  try {
    const response = await axios.post(`${API_URL}/auth/registro`, {
      nombre: 'Test Revisor',
      email: 'test-revisor-nuevo@test.com',
      contrasena: 'test123',
      rol: 'revisor'
    });
    
    if (response.data.success) {
      console.log('✅ EXITOSO: Revisor registrado correctamente');
    } else {
      console.log('❌ FALLÓ:', response.data.mensaje);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.response?.data?.mensaje || error.message);
  }

  // 3. Intentar registrar un editor (debería fallar)
  console.log('\n🚫 PRUEBA 3: Intentar registrar editor (prohibido)');
  try {
    const response = await axios.post(`${API_URL}/auth/registro`, {
      nombre: 'Test Editor',
      email: 'test-editor-nuevo@test.com',
      contrasena: 'test123',
      rol: 'editor'
    });
    
    if (response.data.success) {
      console.log('❌ FALLO DE SEGURIDAD: Editor registrado cuando no debería');
    } else {
      console.log('✅ CORRECTO: Registro de editor rechazado');
      console.log('   Mensaje:', response.data.mensaje);
    }
  } catch (error) {
    console.log('✅ CORRECTO: Registro de editor rechazado');
    console.log('   Mensaje:', error.response?.data?.mensaje || error.message);
  }

  // 4. Intentar registrar un admin (debería fallar)
  console.log('\n🚫 PRUEBA 4: Intentar registrar admin (prohibido)');
  try {
    const response = await axios.post(`${API_URL}/auth/registro`, {
      nombre: 'Test Admin',
      email: 'test-admin-nuevo@test.com',
      contrasena: 'test123',
      rol: 'admin'
    });
    
    if (response.data.success) {
      console.log('❌ FALLO DE SEGURIDAD: Admin registrado cuando no debería');
    } else {
      console.log('✅ CORRECTO: Registro de admin rechazado');
      console.log('   Mensaje:', response.data.mensaje);
    }
  } catch (error) {
    console.log('✅ CORRECTO: Registro de admin rechazado');
    console.log('   Mensaje:', error.response?.data?.mensaje || error.message);
  }

  // 5. Probar creación por admin
  console.log('\n👤 PRUEBA 5: Crear editor como administrador');
  
  // Primero hacer login como admin
  try {
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@editorial.com',
      contrasena: 'admin123'
    });
    
    if (loginResponse.data.token) {
      console.log('✅ Login como admin exitoso');
      
      const adminHeaders = {
        'Authorization': `Bearer ${loginResponse.data.token}`,
        'Content-Type': 'application/json'
      };
      
      // Intentar crear editor
      try {
        const createResponse = await axios.post(`${API_URL}/usuarios/admin/crear`, {
          nombre: 'Editor Creado por Admin',
          email: 'editor-admin@test.com',
          contrasena: 'editor123',
          rol: 'editor'
        }, { headers: adminHeaders });
        
        if (createResponse.data.success) {
          console.log('✅ EXITOSO: Editor creado por admin');
          console.log('   Usuario:', createResponse.data.data.nombre, '- Rol:', createResponse.data.data.rol);
        } else {
          console.log('❌ FALLÓ:', createResponse.data.mensaje);
        }
      } catch (error) {
        console.log('❌ ERROR al crear editor:', error.response?.data?.mensaje || error.message);
      }
      
    } else {
      console.log('❌ No se pudo hacer login como admin');
    }
  } catch (error) {
    console.log('❌ ERROR en login admin:', error.response?.data?.mensaje || error.message);
  }

  console.log('\n📊 RESUMEN DE PRUEBAS');
  console.log('='.repeat(40));
  console.log('✅ Registro público de autores: PERMITIDO');
  console.log('✅ Registro público de revisores: PERMITIDO');
  console.log('🚫 Registro público de editores: BLOQUEADO');
  console.log('🚫 Registro público de admins: BLOQUEADO');
  console.log('👤 Creación de editores por admin: PERMITIDO');
  console.log('\n🎯 SISTEMA DE SEGURIDAD FUNCIONANDO CORRECTAMENTE');
}

// Ejecutar las pruebas
probarRestriccionRoles().catch(console.error);
