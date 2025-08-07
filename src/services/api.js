// services/api.js
import axios from 'axios';

// Configuración hardcodeada para Tailscale - TEMPORAL para testing
const TAILSCALE_IP = '100.115.107.89';

// Función para detectar la IP base del servidor
function getServerBaseURL() {
  const currentURL = window.location;
  const hostname = currentURL.hostname;
  
  console.log('🔍 Current hostname:', hostname);
  
  // Si estamos en Render (.onrender.com), usar variable de entorno
  if (hostname.includes('.onrender.com')) {
    const renderApiUrl = import.meta.env.VITE_API_URL || 
                        `${window.location.protocol}//${window.location.hostname.replace('editorial-app-frontend', 'editorial-app-backend')}/api`;
    console.log('🌐 Using Render API URL:', renderApiUrl);
    return renderApiUrl;
  }
  
  // Si estamos accediendo por Tailscale IP
  if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.includes('.onrender.com')) {
    console.log('🚀 Using Tailscale IP for remote access');
    return `http://${TAILSCALE_IP}:4000/api`;
  }
  
  // Solo usar localhost si accedemos directamente desde localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000/api';
  }
  
  // Fallback a Tailscale IP
  return `http://${TAILSCALE_IP}:4000/api`;
}

// Configuración base de la API - Prioridad a Tailscale para acceso remoto
let API_BASE_URL;

// En orden de prioridad:
// 1. Variable de entorno VITE_API_URL
// 2. Detección automática con preferencia a Tailscale
// 3. Fallback a Tailscale IP
if (import.meta.env.VITE_API_URL) {
  API_BASE_URL = import.meta.env.VITE_API_URL;
  console.log('🔧 Using VITE_API_URL:', API_BASE_URL);
} else {
  API_BASE_URL = getServerBaseURL();
  console.log('🔧 Auto-detected API URL:', API_BASE_URL);
}

// DEBUG: Ver configuración completa
console.log('🔧 API Configuration Debug:');
console.log('- Environment:', import.meta.env.MODE);
console.log('- Current location:', window.location.href);
console.log('- Hostname:', window.location.hostname);
console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('- Final API_BASE_URL:', API_BASE_URL);

// Verificación adicional para evitar URLs externas no deseadas
if (API_BASE_URL.includes('editorial-app.com')) {
  console.warn('⚠️ WARNING: Detectada URL externa, usando detección automática');
  API_BASE_URL = getServerBaseURL();
}

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
    console.log('🔑 Request interceptor - Token check:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null,
      url: config.url,
      method: config.method?.toUpperCase()
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request headers');
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses (manejar errores globalmente)
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', {
      status: response.status,
      url: response.config?.url,
      method: response.config?.method?.toUpperCase()
    });
    return response;
  },
  (error) => {
    console.error('❌ Response interceptor error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data
    });
    
    // Si el token ha expirado o es inválido, limpiar localStorage
    if (error.response?.status === 401) {
      console.warn('🚪 401 Unauthorized - Clearing auth data and redirecting to login');
      localStorage.removeItem('editorial_token');
      localStorage.removeItem('editorial_user');
      
      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== '/login') {
        console.log('🔄 Redirecting to login...');
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

  // Crear nuevo artículo con archivo
  crearConArchivo: async (formData) => {
    console.log('📤 crearConArchivo called with FormData');
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
    
    try {
      const response = await api.post('/articulos/con-archivo-db', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ crearConArchivo success:', response.status);
      return response.data;
    } catch (error) {
      console.error('❌ crearConArchivo error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      });
      throw error;
    }
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
