// services/notificacionesAPI.js - API para notificaciones
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: `${API_BASE}/notificaciones`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
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

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const notificacionesAPI = {
  // Obtener notificaciones del usuario actual
  obtenerNotificaciones: async (params = {}) => {
    try {
      const response = await api.get('/usuario/me', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener notificaciones',
        status: error.response?.status
      };
    }
  },

  // Obtener resumen de notificaciones (usando endpoint general con filtros)
  obtenerResumen: async () => {
    try {
      const response = await api.get('/usuario/me', { params: { limit: 1 } });
      const data = response.data;
      
      // Calcular resumen basado en los datos disponibles
      const resumen = {
        total: data.total_notificaciones || 0,
        noLeidas: data.notificaciones_no_leidas || 0,
        porTipo: {
          asignaciones: 0,
          comentarios: 0,
          estados: 0,
          sistema: 0
        }
      };
      
      return { success: true, data: resumen };
    } catch (error) {
      console.error('Error al obtener resumen:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener resumen',
        status: error.response?.status
      };
    }
  },

  // Marcar notificación como leída
  marcarComoLeida: async (id) => {
    try {
      const response = await api.patch(`/${id}/marcar-leida`);
      return response.data;
    } catch (error) {
      console.error('Error al marcar como leída:', error);
      throw {
        message: error.response?.data?.message || 'Error al marcar como leída',
        status: error.response?.status
      };
    }
  },

  // Marcar todas las notificaciones como leídas
  marcarTodasComoLeidas: async () => {
    try {
      const response = await api.patch('/usuario/me/marcar-todas-leidas');
      return response.data;
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
      throw {
        message: error.response?.data?.message || 'Error al marcar todas como leídas',
        status: error.response?.status
      };
    }
  },

  // Crear nueva notificación (uso interno)
  crearNotificacion: async (datos) => {
    try {
      const response = await api.post('/', datos);
      return response.data;
    } catch (error) {
      console.error('Error al crear notificación:', error);
      throw {
        message: error.response?.data?.message || 'Error al crear notificación',
        status: error.response?.status
      };
    }
  }
};

export default notificacionesAPI;
