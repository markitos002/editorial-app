// services/comentariosService.js - Servicio para gestión de comentarios
import api from './api';

export const comentariosService = {
  // Obtener todos los comentarios de una revisión
  async obtenerComentarios(revisionId) {
    try {
      const response = await api.get(`/comentarios/revision/${revisionId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      throw error;
    }
  },

  // Crear un nuevo comentario
  async crearComentario(revisionId, datosComentario) {
    try {
      const response = await api.post(`/comentarios/revision/${revisionId}`, datosComentario);
      return response.data;
    } catch (error) {
      console.error('Error al crear comentario:', error);
      throw error;
    }
  },

  // Actualizar un comentario existente
  async actualizarComentario(comentarioId, datosActualizacion) {
    try {
      const response = await api.put(`/comentarios/${comentarioId}`, datosActualizacion);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar comentario:', error);
      throw error;
    }
  },

  // Eliminar un comentario (soft delete)
  async eliminarComentario(comentarioId) {
    try {
      const response = await api.delete(`/comentarios/${comentarioId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      throw error;
    }
  },

  // Cambiar estado de un comentario (activo/resuelto)
  async toggleEstado(comentarioId) {
    try {
      const response = await api.patch(`/comentarios/${comentarioId}/toggle-estado`);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar estado del comentario:', error);
      throw error;
    }
  },

  // Obtener estadísticas de comentarios de una revisión
  async obtenerEstadisticas(revisionId) {
    try {
      const response = await api.get(`/comentarios/revision/${revisionId}/estadisticas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de comentarios:', error);
      throw error;
    }
  },

  // Marcar comentario como leído (función adicional para futuras mejoras)
  async marcarComoLeido(comentarioId) {
    try {
      const response = await api.patch(`/comentarios/${comentarioId}/marcar-leido`);
      return response.data;
    } catch (error) {
      console.error('Error al marcar comentario como leído:', error);
      throw error;
    }
  },

  // Obtener comentarios por autor (función adicional para estadísticas)
  async obtenerComentariosPorAutor(autorId) {
    try {
      const response = await api.get(`/comentarios/autor/${autorId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener comentarios por autor:', error);
      throw error;
    }
  },

  // Buscar comentarios por contenido (función adicional para búsquedas)
  async buscarComentarios(termino, filtros = {}) {
    try {
      const params = new URLSearchParams({
        q: termino,
        ...filtros
      });
      
      const response = await api.get(`/comentarios/buscar?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar comentarios:', error);
      throw error;
    }
  }
};
