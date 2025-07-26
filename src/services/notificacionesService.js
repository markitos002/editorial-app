// services/notificacionesService.js - Servicio para gestión de notificaciones
import api from './api';

const notificacionesService = {
  // Obtener notificaciones del usuario actual
  async obtenerNotificaciones(filtros = {}) {
    try {
      const { data } = await api.get('/notificaciones/usuario/me', {
        params: filtros
      });
      return data;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      throw error;
    }
  },

  // Obtener notificaciones de un usuario específico (admin)
  async obtenerNotificacionesPorUsuario(usuario_id, filtros = {}) {
    try {
      const { data } = await api.get(`/notificaciones/usuario/${usuario_id}`, {
        params: filtros
      });
      return data;
    } catch (error) {
      console.error('Error al obtener notificaciones del usuario:', error);
      throw error;
    }
  },

  // Obtener todas las notificaciones (admin/editor)
  async obtenerTodasLasNotificaciones(filtros = {}) {
    try {
      const { data } = await api.get('/notificaciones', {
        params: filtros
      });
      return data;
    } catch (error) {
      console.error('Error al obtener todas las notificaciones:', error);
      throw error;
    }
  },

  // Crear nueva notificación (admin/editor)
  async crearNotificacion(notificacionData) {
    try {
      const { data } = await api.post('/notificaciones', notificacionData);
      return data;
    } catch (error) {
      console.error('Error al crear notificación:', error);
      throw error;
    }
  },

  // Marcar notificación como leída
  async marcarComoLeida(notificacionId) {
    try {
      const { data } = await api.patch(`/notificaciones/${notificacionId}/marcar-leida`);
      return data;
    } catch (error) {
      console.error('Error al marcar como leída:', error);
      throw error;
    }
  },

  // Marcar notificación como no leída
  async marcarComoNoLeida(notificacionId) {
    try {
      const { data } = await api.patch(`/notificaciones/${notificacionId}/marcar-no-leida`);
      return data;
    } catch (error) {
      console.error('Error al marcar como no leída:', error);
      throw error;
    }
  },

  // Marcar todas las notificaciones como leídas
  async marcarTodasComoLeidas(usuario_id) {
    try {
      const { data } = await api.patch(`/notificaciones/usuario/${usuario_id}/marcar-todas-leidas`);
      return data;
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
      throw error;
    }
  },

  // Eliminar notificación
  async eliminarNotificacion(notificacionId) {
    try {
      const { data } = await api.delete(`/notificaciones/${notificacionId}`);
      return data;
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      throw error;
    }
  },

  // Obtener una notificación específica
  async obtenerNotificacionPorId(notificacionId) {
    try {
      const { data } = await api.get(`/notificaciones/${notificacionId}`);
      return data;
    } catch (error) {
      console.error('Error al obtener notificación:', error);
      throw error;
    }
  }
};

export default notificacionesService;
