// context/AuthContext.jsx - Versión simplificada
import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

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
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

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

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('editorial_token');
    const userData = localStorage.getItem('editorial_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ 
          type: AUTH_ACTIONS.VERIFY_TOKEN_SUCCESS, 
          payload: { usuario: user } 
        });
      } catch (error) {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    }
  }, []);

  const login = async (credentials) => {
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
  };

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
      const errorMessage = error.response?.data?.mensaje || 'Error en el registro';
      dispatch({ 
        type: AUTH_ACTIONS.REGISTER_ERROR, 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const hasRole = (requiredRoles) => {
    if (!state.user) return false;
    if (typeof requiredRoles === 'string') {
      return state.user.rol === requiredRoles;
    }
    return requiredRoles.includes(state.user.rol);
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
