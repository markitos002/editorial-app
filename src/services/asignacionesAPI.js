// src/services/asignacionesAPI.js - Servicio para APIs de asignación de revisores
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Configurar interceptor para incluir token automáticamente
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const asignacionesAPI = {
  // Obtener revisores disponibles
  obtenerRevisoresDisponibles: async () => {
    try {
      const response = await axios.get(`${API_URL}/asignaciones/revisores-disponibles`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener revisores disponibles:', error);
      throw error;
    }
  },

  // Obtener artículos sin asignar
  obtenerArticulosSinAsignar: async () => {
    try {
      const response = await axios.get(`${API_URL}/asignaciones/articulos-sin-asignar`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener artículos sin asignar:', error);
      throw error;
    }
  },

  // Obtener asignaciones existentes
  obtenerAsignaciones: async () => {
    try {
      const response = await axios.get(`${API_URL}/asignaciones/asignaciones`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener asignaciones:', error);
      throw error;
    }
  },

  // Asignar revisor a artículo
  asignarRevisor: async (articuloId, revisorId, observaciones = '') => {
    try {
      const response = await axios.post(`${API_URL}/asignaciones/asignar`, {
        articulo_id: articuloId,
        revisor_id: revisorId,
        observaciones: observaciones
      });
      return response.data;
    } catch (error) {
      console.error('Error al asignar revisor:', error);
      throw error;
    }
  },

  // Cancelar asignación
  cancelarAsignacion: async (revisionId, motivo = '') => {
    try {
      const response = await axios.put(`${API_URL}/asignaciones/cancelar/${revisionId}`, {
        motivo: motivo
      });
      return response.data;
    } catch (error) {
      console.error('Error al cancelar asignación:', error);
      throw error;
    }
  }
};
