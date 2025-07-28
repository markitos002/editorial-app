// services/authAPI.js - API de autenticación
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const authAPI = {
  // Iniciar sesión
  login: async (email, contrasena) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email,
        contrasena
      });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.mensaje || 'Error al iniciar sesión',
        status: error.response?.status
      };
    }
  },

  // Registrar usuario
  registro: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/registro`, userData);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.mensaje || 'Error al registrar usuario',
        status: error.response?.status
      };
    }
  },

  // Verificar token
  verifyToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${API_BASE}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.mensaje || 'Token inválido',
        status: error.response?.status
      };
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${API_BASE}/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return { success: true };
    } catch (error) {
      // Aún así limpiamos el localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      throw {
        message: error.response?.data?.mensaje || 'Error al cerrar sesión',
        status: error.response?.status
      };
    }
  }
};

export default authAPI;
