// utils/helpers.js

/**
 * Formatea una fecha a formato local español
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formatea una fecha a formato corto
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
};

/**
 * Obtiene el color del rol
 */
export const getRoleColor = (role) => {
  switch (role) {
    case 'admin': return 'red';
    case 'editor': return 'blue';
    case 'revisor': return 'green';
    case 'autor': return 'orange';
    default: return 'gray';
  }
};

/**
 * Obtiene el nombre del rol en español
 */
export const getRoleDisplayName = (role) => {
  switch (role) {
    case 'admin': return 'Administrador';
    case 'editor': return 'Editor';
    case 'revisor': return 'Revisor';
    case 'autor': return 'Autor';
    default: return role;
  }
};

/**
 * Obtiene el color del estado de artículo
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'borrador': return 'gray';
    case 'enviado': return 'blue';
    case 'en_revision': return 'yellow';
    case 'aceptado': return 'green';
    case 'rechazado': return 'red';
    case 'publicado': return 'purple';
    default: return 'gray';
  }
};

/**
 * Obtiene el nombre del estado en español
 */
export const getStatusDisplayName = (status) => {
  switch (status) {
    case 'borrador': return 'Borrador';
    case 'enviado': return 'Enviado';
    case 'en_revision': return 'En Revisión';
    case 'aceptado': return 'Aceptado';
    case 'rechazado': return 'Rechazado';
    case 'publicado': return 'Publicado';
    default: return status;
  }
};

/**
 * Valida si un email es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si una contraseña es segura
 */
export const isValidPassword = (password) => {
  // Al menos 6 caracteres, una mayúscula, una minúscula y un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

/**
 * Trunca texto si es muy largo
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Capitaliza la primera letra de una cadena
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Genera un ID único simple
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function para limitar llamadas
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Formatea números con separadores de miles
 */
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  return num.toLocaleString('es-ES');
};

/**
 * Obtiene las iniciales de un nombre
 */
export const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
