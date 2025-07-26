// revisionAPI.js - Servicios para el sistema de revisión de documentos
import api from './api';

export const revisionAPI = {
  // Obtener todas las revisiones asignadas al revisor actual
  obtenerMisRevisiones: async () => {
    try {
      const response = await api.get('/revision-documentos/mis-revisiones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener revisiones:', error);
      throw error;
    }
  },

  // Obtener detalles de una revisión específica
  obtenerDetalleRevision: async (revisionId) => {
    try {
      const response = await api.get(`/revision-documentos/revision/${revisionId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalles de revisión:', error);
      throw error;
    }
  },

  // Guardar progreso de revisión
  guardarProgreso: async (revisionId, datos) => {
    try {
      const response = await api.put(`/revision-documentos/revision/${revisionId}/progreso`, datos);
      return response.data;
    } catch (error) {
      console.error('Error al guardar progreso:', error);
      throw error;
    }
  },

  // Completar revisión
  completarRevision: async (revisionId, datos) => {
    try {
      const response = await api.put(`/revision-documentos/revision/${revisionId}/completar`, datos);
      return response.data;
    } catch (error) {
      console.error('Error al completar revisión:', error);
      throw error;
    }
  },

  // Obtener historial de comentarios
  obtenerComentarios: async (revisionId) => {
    try {
      const response = await api.get(`/revision-documentos/revision/${revisionId}/comentarios`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      throw error;
    }
  },

  // Descargar documento
  descargarDocumento: async (revisionId) => {
    try {
      const response = await api.get(`/revision-documentos/revision/${revisionId}/documento`, {
        responseType: 'blob'
      });
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Obtener nombre del archivo del header
      const contentDisposition = response.headers['content-disposition'];
      let filename = `documento_${revisionId}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="([^"]+)"/);
        if (match) {
          filename = match[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, mensaje: 'Documento descargado' };
    } catch (error) {
      console.error('Error al descargar documento:', error);
      throw error;
    }
  }
};
