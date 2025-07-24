// services/api.js
import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para requests (agregar token automáticamente)
api.interceptors.request.use(
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

// Interceptor para responses (manejar errores globalmente)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token ha expirado o es inválido, limpiar localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem('editorial_token');
      localStorage.removeItem('editorial_user');
      
      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Servicios de Autenticación
export const authAPI = {
  // Registro de usuario
  register: async (userData) => {
    const response = await api.post('/auth/registro', userData);
    return response.data;
  },

  // Login de usuario
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Obtener perfil del usuario autenticado
  getProfile: async () => {
    const response = await api.get('/auth/perfil');
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/cambiar-contrasena', passwordData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Verificar token
  verifyToken: async () => {
    const response = await api.get('/auth/verificar-token');
    return response.data;
  }
};

// Servicios de Usuarios
export const usersAPI = {
  // Obtener todos los usuarios (con filtros)
  getUsers: async (params = {}) => {
    const response = await api.get('/usuarios', { params });
    return response.data;
  },

  // Obtener usuario por ID
  getUserById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Crear usuario
  createUser: async (userData) => {
    const response = await api.post('/usuarios', userData);
    return response.data;
  },

  // Actualizar usuario
  updateUser: async (id, userData) => {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  // Eliminar usuario
  deleteUser: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  }
};

// Servicios de Artículos (Editorial)
export const articulosAPI = {
  // Obtener mis artículos (autor)
  getMisArticulos: async () => {
    const response = await api.get('/articulos/mis-articulos');
    return response.data;
  },

  // Obtener todos los artículos (para revisores/editores)
  getTodos: async (params = {}) => {
    const response = await api.get('/articulos', { params });
    return response.data;
  },

  // Obtener artículo por ID
  getById: async (id) => {
    const response = await api.get(`/articulos/${id}`);
    return response.data;
  },

  // Crear nuevo artículo
  crear: async (articleData) => {
    const response = await api.post('/articulos', articleData);
    return response.data;
  },

  // Actualizar artículo
  actualizar: async (id, articleData) => {
    const response = await api.put(`/articulos/${id}`, articleData);
    return response.data;
  },

  // Cambiar estado del artículo
  cambiarEstado: async (id, estado) => {
    const response = await api.patch(`/articulos/${id}/estado`, { estado });
    return response.data;
  },

  // Eliminar artículo
  eliminar: async (id) => {
    const response = await api.delete(`/articulos/${id}`);
    return response.data;
  }
};

// Servicios de Artículos (compatibilidad)
export const articlesAPI = {
  // Obtener todos los artículos (con filtros)
  getArticles: async (params = {}) => {
    const response = await api.get('/articulos', { params });
    return response.data;
  },

  // Obtener artículo por ID
  getArticleById: async (id) => {
    const response = await api.get(`/articulos/${id}`);
    return response.data;
  },

  // Crear artículo
  createArticle: async (articleData) => {
    const response = await api.post('/articulos', articleData);
    return response.data;
  },

  // Actualizar artículo
  updateArticle: async (id, articleData) => {
    const response = await api.put(`/articulos/${id}`, articleData);
    return response.data;
  },

  // Cambiar estado del artículo
  changeArticleStatus: async (id, estado) => {
    const response = await api.patch(`/articulos/${id}/estado`, { estado });
    return response.data;
  },

  // Eliminar artículo
  deleteArticle: async (id) => {
    const response = await api.delete(`/articulos/${id}`);
    return response.data;
  }
};

// Servicios de Revisiones
export const reviewsAPI = {
  // Obtener todas las revisiones (con filtros)
  getReviews: async (params = {}) => {
    const response = await api.get('/revisiones', { params });
    return response.data;
  },

  // Obtener revisión por ID
  getReviewById: async (id) => {
    const response = await api.get(`/revisiones/${id}`);
    return response.data;
  },

  // Obtener revisiones de un artículo
  getReviewsByArticle: async (articleId) => {
    const response = await api.get(`/revisiones/articulo/${articleId}`);
    return response.data;
  },

  // Crear revisión
  createReview: async (reviewData) => {
    const response = await api.post('/revisiones', reviewData);
    return response.data;
  },

  // Actualizar revisión
  updateReview: async (id, reviewData) => {
    const response = await api.put(`/revisiones/${id}`, reviewData);
    return response.data;
  },

  // Eliminar revisión
  deleteReview: async (id) => {
    const response = await api.delete(`/revisiones/${id}`);
    return response.data;
  }
};

// Servicios de Notificaciones
export const notificationsAPI = {
  // Obtener todas las notificaciones (solo admins/editores)
  getAllNotifications: async (params = {}) => {
    const response = await api.get('/notificaciones', { params });
    return response.data;
  },

  // Obtener notificaciones del usuario autenticado
  getUserNotifications: async (userId, params = {}) => {
    const response = await api.get(`/notificaciones/usuario/${userId}`, { params });
    return response.data;
  },

  // Obtener notificación por ID
  getNotificationById: async (id) => {
    const response = await api.get(`/notificaciones/${id}`);
    return response.data;
  },

  // Crear notificación (solo admins/editores)
  createNotification: async (notificationData) => {
    const response = await api.post('/notificaciones', notificationData);
    return response.data;
  },

  // Marcar como leída
  markAsRead: async (id) => {
    const response = await api.patch(`/notificaciones/${id}/marcar-leida`);
    return response.data;
  },

  // Marcar como no leída
  markAsUnread: async (id) => {
    const response = await api.patch(`/notificaciones/${id}/marcar-no-leida`);
    return response.data;
  },

  // Marcar todas como leídas
  markAllAsRead: async (userId) => {
    const response = await api.patch(`/notificaciones/usuario/${userId}/marcar-todas-leidas`);
    return response.data;
  },

  // Eliminar notificación
  deleteNotification: async (id) => {
    const response = await api.delete(`/notificaciones/${id}`);
    return response.data;
  }
};

// Exportar la instancia de API para uso directo si es necesario
export default api;
