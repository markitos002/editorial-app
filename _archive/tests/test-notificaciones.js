// test-notificaciones.js - Script de prueba para el sistema de notificaciones
const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';
let token = '';
let userId = '';

// Helper para hacer peticiones autenticadas
const api = axios.create({
  baseURL: BASE_URL
});

// Interceptor para añadir token automáticamente
api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function login() {
  try {
    console.log('🔐 Iniciando sesión como admin...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@editorial.com',
      contrasena: 'admin123'
    });
    
    token = response.data.token;
    userId = response.data.usuario.id;
    console.log('✅ Login exitoso');
    console.log(`📋 Usuario ID: ${userId}`);
    
  } catch (error) {
    console.error('❌ Error al hacer login:', error.response?.data || error.message);
    process.exit(1);
  }
}

async function probarCrearNotificacion() {
  try {
    console.log('\n📝 Probando crear notificación...');
    
    const response = await api.post('/notificaciones', {
      usuario_id: userId,
      titulo: 'Notificación de prueba',
      mensaje: 'Esta es una notificación de prueba del sistema',
      tipo: 'info'
    });
    
    console.log('✅ Notificación creada exitosamente:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data.notificacion.id;
    
  } catch (error) {
    console.error('❌ Error al crear notificación:', error.response?.data || error.message);
  }
}

async function probarObtenerNotificacionesPorUsuario() {
  try {
    console.log('\n📋 Probando obtener notificaciones del usuario...');
    
    const response = await api.get(`/notificaciones/usuario/${userId}`);
    
    console.log('✅ Notificaciones del usuario obtenidas:');
    console.log(`📊 Total: ${response.data.total_notificaciones}`);
    console.log(`🔔 No leídas: ${response.data.notificaciones_no_leidas}`);
    console.log('\n📝 Lista de notificaciones:');
    response.data.notificaciones.forEach((notif, index) => {
      console.log(`${index + 1}. [${notif.leida ? '✅' : '🔔'}] ${notif.titulo}: ${notif.mensaje}`);
      console.log(`   📅 ${new Date(notif.fecha_creacion).toLocaleString('es-ES')}`);
    });
    
  } catch (error) {
    console.error('❌ Error al obtener notificaciones:', error.response?.data || error.message);
  }
}

async function probarMarcarComoLeida(notificacionId) {
  try {
    console.log(`\n✅ Probando marcar notificación ${notificacionId} como leída...`);
    
    const response = await api.patch(`/notificaciones/${notificacionId}/marcar-leida`);
    
    console.log('✅ Notificación marcada como leída:');
    console.log(`📝 ${response.data.notificacion.titulo}: ${response.data.notificacion.mensaje}`);
    console.log(`📊 Estado: ${response.data.notificacion.leida ? 'Leída' : 'No leída'}`);
    
  } catch (error) {
    console.error('❌ Error al marcar como leída:', error.response?.data || error.message);
  }
}

async function probarMarcarTodasComoLeidas() {
  try {
    console.log('\n✅ Probando marcar todas las notificaciones como leídas...');
    
    const response = await api.patch(`/notificaciones/usuario/${userId}/marcar-todas-leidas`);
    
    console.log('✅ Resultado:');
    console.log(`📊 ${response.data.mensaje}`);
    console.log(`🔢 Notificaciones actualizadas: ${response.data.notificaciones_actualizadas}`);
    
  } catch (error) {
    console.error('❌ Error al marcar todas como leídas:', error.response?.data || error.message);
  }
}

async function probarCrearNotificacionesEjemplo() {
  try {
    console.log('\n🧪 Creando notificaciones de ejemplo...');
    
    const notificacionesEjemplo = [
      {
        usuario_id: userId,
        titulo: 'Nueva asignación disponible',
        mensaje: 'Se te ha asignado revisar el artículo "Cuidados paliativos en UCI"',
        tipo: 'info'
      },
      {
        usuario_id: userId,
        titulo: 'Comentario recibido',
        mensaje: 'El autor ha respondido a tus observaciones',
        tipo: 'info'
      },
      {
        usuario_id: userId,
        titulo: 'Revisión completada',
        mensaje: 'Tu artículo ha sido aprobado para publicación',
        tipo: 'success'
      }
    ];
    
    for (const notif of notificacionesEjemplo) {
      await api.post('/notificaciones', notif);
      console.log(`✅ Creada: ${notif.mensaje.substring(0, 50)}...`);
    }
    
    console.log('✅ Todas las notificaciones de ejemplo creadas');
    
  } catch (error) {
    console.error('❌ Error al crear notificaciones de ejemplo:', error.response?.data || error.message);
  }
}

async function probarObtenerTodasLasNotificaciones() {
  try {
    console.log('\n📋 Probando obtener todas las notificaciones (admin)...');
    
    const response = await api.get('/notificaciones');
    
    console.log('✅ Todas las notificaciones obtenidas:');
    console.log(`📊 Total encontradas: ${response.data.notificaciones.length}`);
    console.log('\n📝 Lista completa:');
    response.data.notificaciones.forEach((notif, index) => {
      console.log(`${index + 1}. [${notif.leida ? '✅' : '🔔'}] Usuario: ${notif.usuario_nombre}`);
      console.log(`   💬 ${notif.titulo}: ${notif.mensaje}`);
      console.log(`   📅 ${new Date(notif.fecha_creacion).toLocaleString('es-ES')}\n`);
    });
    
  } catch (error) {
    console.error('❌ Error al obtener todas las notificaciones:', error.response?.data || error.message);
  }
}

async function ejecutarPruebas() {
  try {
    console.log('🔔 === PRUEBAS DEL SISTEMA DE NOTIFICACIONES ===\n');
    
    // 1. Login
    await login();
    
    // 2. Crear notificaciones de ejemplo
    await probarCrearNotificacionesEjemplo();
    
    // 3. Obtener notificaciones del usuario
    await probarObtenerNotificacionesPorUsuario();
    
    // 4. Crear una notificación específica
    const notifId = await probarCrearNotificacion();
    
    // 5. Marcar como leída
    if (notifId) {
      await probarMarcarComoLeida(notifId);
    }
    
    // 6. Obtener todas las notificaciones (admin)
    await probarObtenerTodasLasNotificaciones();
    
    // 7. Marcar todas como leídas
    await probarMarcarTodasComoLeidas();
    
    // 8. Verificar cambios
    await probarObtenerNotificacionesPorUsuario();
    
    console.log('\n✅ === TODAS LAS PRUEBAS COMPLETADAS ===');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  }
}

// Ejecutar las pruebas
ejecutarPruebas();
