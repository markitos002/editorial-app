// services/busquedaAPI.js - Servicio para APIs de búsqueda y filtros
import api from './api';
import { cleanApiResponse, logPotentialProblems } from '../utils/dataValidator';

export const busquedaAPI = {
  // Búsqueda global en todos los tipos de contenido
  async busquedaGlobal({ termino, tipo = 'todos', limite = 50, usuario_id = null }) {
    try {
      const params = {
        q: termino,
        tipo,
        limite
      };
      
      if (usuario_id) {
        params.usuario_id = usuario_id;
      }
      
      const response = await api.get('/busqueda/global', { params });
      
      // Limpiar y validar la respuesta
      const cleanedResponse = cleanApiResponse(response);
      logPotentialProblems(cleanedResponse.data, 'busquedaGlobal');
      
      return cleanedResponse.data;
    } catch (error) {
      console.error('Error en búsqueda global:', error);
      
      // Mejorar el manejo de errores
      if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.mensaje || 'Parámetros de búsqueda inválidos');
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('Error de conexión. Verifica que el servidor esté funcionando.');
      } else {
        throw new Error('Error al realizar la búsqueda. Inténtalo de nuevo.');
      }
    }
  },

  // Búsqueda avanzada de artículos con filtros
  async busquedaArticulos(filtros) {
    try {
      const params = {
        q: filtros.termino || '',
        page: filtros.page || 1,
        limit: filtros.limit || 20,
        ordenar_por: filtros.ordenar_por || 'fecha_creacion',
        orden: filtros.orden || 'DESC'
      };

      // Agregar filtros opcionales
      if (filtros.estado) params.estado = filtros.estado;
      if (filtros.autor_usuario_id) params.usuario_id = filtros.autor_usuario_id;
      if (filtros.fecha_desde) params.fecha_desde = filtros.fecha_desde;
      if (filtros.fecha_hasta) params.fecha_hasta = filtros.fecha_hasta;
      if (filtros.revisor_id) params.revisor_id = filtros.revisor_id;

      const response = await api.get('/busqueda/articulos', { params });
      
      // Limpiar y validar la respuesta
      const cleanedResponse = cleanApiResponse(response);
      logPotentialProblems(cleanedResponse.data, 'busquedaArticulos');
      
      return cleanedResponse.data;
    } catch (error) {
      console.error('Error en búsqueda de artículos:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.mensaje || 'Parámetros de búsqueda inválidos');
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('Error de conexión. Verifica que el servidor esté funcionando.');
      } else {
        throw new Error('Error al buscar artículos. Inténtalo de nuevo.');
      }
    }
  },

  // Obtener sugerencias de autocompletado
  async obtenerSugerencias({ termino, tipo = 'articulos', limite = 10 }) {
    try {
      const params = {
        q: termino,
        tipo,
        limite
      };
      
      const response = await api.get('/busqueda/sugerencias', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
      throw error;
    }
  },

  // Obtener opciones para filtros dinámicos
  async obtenerOpcionesFiltros() {
    try {
      const response = await api.get('/busqueda/opciones-filtros');
      return response.data;
    } catch (error) {
      console.error('Error al obtener opciones de filtros:', error);
      throw error;
    }
  }
};

export default busquedaAPI;
