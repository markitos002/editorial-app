// context/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

// Estados de autenticación
const AuthContext = createContext();

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_ERROR: 'REGISTER_ERROR',
  VERIFY_TOKEN_START: 'VERIFY_TOKEN_START',
  VERIFY_TOKEN_SUCCESS: 'VERIFY_TOKEN_SUCCESS',
  VERIFY_TOKEN_ERROR: 'VERIFY_TOKEN_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_PROFILE: 'UPDATE_PROFILE'
};

// Estado inicial
const initialState = {
  user: null,
  token: localStorage.getItem('editorial_token'),
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Reducer para manejar los estados
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
    case AUTH_ACTIONS.VERIFY_TOKEN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      // Guardar en localStorage
      localStorage.setItem('editorial_token', action.payload.token);
      localStorage.setItem('editorial_user', JSON.stringify(action.payload.usuario));
      
      return {
        ...state,
        user: action.payload.usuario,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.VERIFY_TOKEN_SUCCESS:
      return {
        ...state,
        user: action.payload.usuario,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_ERROR:
    case AUTH_ACTIONS.REGISTER_ERROR:
    case AUTH_ACTIONS.VERIFY_TOKEN_ERROR:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      // Limpiar localStorage
      localStorage.removeItem('editorial_token');
      localStorage.removeItem('editorial_user');
      
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.UPDATE_PROFILE:
      // Actualizar localStorage
      localStorage.setItem('editorial_user', JSON.stringify(action.payload));
      
      return {
        ...state,
        user: action.payload
      };

    default:
      return state;
  }
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('editorial_token');
      const userData = localStorage.getItem('editorial_user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          // Verificar que el token sigue siendo válido
          await verifyTokenOnLoad();
        } catch (error) {
          // Si hay error parseando los datos, hacer logout
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.VERIFY_TOKEN_ERROR, payload: null });
      }
    };

    initializeAuth();
  }, [verifyTokenOnLoad]); // Incluir verifyTokenOnLoad en las dependencias

  // Función de login
  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await authAPI.login(credentials);
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_SUCCESS, 
        payload: response 
      });
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.mensaje || 'Error al iniciar sesión';
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_ERROR, 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Función de registro
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });
    
    try {
      const response = await authAPI.register(userData);
      dispatch({ 
        type: AUTH_ACTIONS.REGISTER_SUCCESS, 
        payload: response 
      });
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.mensaje || 'Error al registrar usuario';
      dispatch({ 
        type: AUTH_ACTIONS.REGISTER_ERROR, 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  // Función de logout
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Incluso si falla el logout en el servidor, limpiamos el estado local
      console.error('Error en logout:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, []);

  // Verificar token en carga inicial (sin dependencias)
  const verifyTokenOnLoad = useCallback(async () => {
    dispatch({ type: AUTH_ACTIONS.VERIFY_TOKEN_START });
    
    try {
      const response = await authAPI.verifyToken();
      dispatch({ 
        type: AUTH_ACTIONS.VERIFY_TOKEN_SUCCESS, 
        payload: response 
      });
      return true;
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.VERIFY_TOKEN_ERROR, 
        payload: 'Token inválido o expirado' 
      });
      return false;
    }
  }, []); // Sin dependencias para evitar recreación

  // Verificar token
  const verifyToken = async () => {
    dispatch({ type: AUTH_ACTIONS.VERIFY_TOKEN_START });
    
    try {
      const response = await authAPI.verifyToken();
      dispatch({ 
        type: AUTH_ACTIONS.VERIFY_TOKEN_SUCCESS, 
        payload: response 
      });
      return true;
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.VERIFY_TOKEN_ERROR, 
        payload: 'Token inválido o expirado' 
      });
      return false;
    }
  };

  // Actualizar perfil
  const updateProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      dispatch({ 
        type: AUTH_ACTIONS.UPDATE_PROFILE, 
        payload: response.usuario 
      });
      return response.usuario;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return null;
    }
  };

  // Cambiar contraseña
  const changePassword = async (passwordData) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.mensaje || 'Error al cambiar contraseña';
      return { success: false, error: errorMessage };
    }
  };

  // Limpiar errores
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  // Funciones utilitarias
  const hasRole = useCallback((requiredRoles) => {
    if (!state.user) return false;
    if (typeof requiredRoles === 'string') {
      return state.user.rol === requiredRoles;
    }
    return requiredRoles.includes(state.user.rol);
  }, [state.user]);

  const isAdmin = () => hasRole('admin');
  const isEditor = () => hasRole(['editor', 'admin']);
  const isReviewer = () => hasRole(['revisor', 'editor', 'admin']);
  const isAuthor = () => hasRole(['autor', 'revisor', 'editor', 'admin']);

  // Valor del contexto
  const value = {
    // Estado
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Acciones
    login,
    register,
    logout,
    verifyToken,
    updateProfile,
    changePassword,
    clearError,
    
    // Utilidades
    hasRole,
    isAdmin,
    isEditor,
    isReviewer,
    isAuthor
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
