// services/estadisticasAPI.js - Servicio para obtener estadísticas de dashboards
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Configurar interceptor para incluir token automáticamente
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('editorial_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const estadisticasAPI = {
  // Obtener estadísticas generales (admin)
  async getEstadisticasGenerales() {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/generales`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas generales:', error);
      throw error;
    }
  },

  // Obtener estadísticas de editor
  async getEstadisticasEditor() {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/editor`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de editor:', error);
      throw error;
    }
  },

  // Obtener estadísticas de revisor
  async getEstadisticasRevisor() {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/revisor`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de revisor:', error);
      throw error;
    }
  },

  // Obtener estadísticas de autor
  async getEstadisticasAutor() {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/autor`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de autor:', error);
      throw error;
    }
  },

  // Obtener actividad reciente (admin)
  async getActividadReciente() {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/actividad-reciente`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener actividad reciente:', error);
      throw error;
    }
  }
};

export default estadisticasAPI;
