// utils/SafeRender.jsx - Componente para debugging de errores React #31
import React from 'react';

// Función para validar si un valor es seguro para renderizar
export const isSafeToRender = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return true;
  if (typeof value === 'number') return true;
  if (typeof value === 'boolean') return true;
  if (React.isValidElement(value)) return true;
  return false;
};

// Función para convertir valores de manera ultra-segura
export const toSafeRender = (value, fallback = '') => {
  if (isSafeToRender(value)) return value;
  
  // Log para debugging
  console.warn('🚨 Unsafe render value detected:', {
    value,
    type: typeof value,
    constructor: value?.constructor?.name,
    keys: typeof value === 'object' ? Object.keys(value || {}) : 'N/A'
  });
  
  // Convertir de manera segura
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '[Object]';
    }
  }
  
  try {
    return String(value);
  } catch (e) {
    return fallback;
  }
};

// Componente wrapper para debugging
export const SafeRender = ({ children, fallback = null, label = 'Unknown' }) => {
  try {
    // Validar recursivamente todos los children
    const validateChildren = (child) => {
      if (React.isValidElement(child)) {
        return child;
      }
      
      if (!isSafeToRender(child)) {
        console.error(`🚨 React Error #31 prevented in ${label}:`, {
          child,
          type: typeof child,
          constructor: child?.constructor?.name
        });
        return toSafeRender(child);
      }
      
      return child;
    };

    if (Array.isArray(children)) {
      return children.map((child, index) => (
        <React.Fragment key={index}>
          {validateChildren(child)}
        </React.Fragment>
      ));
    }

    return validateChildren(children);
  } catch (error) {
    console.error(`🚨 SafeRender error in ${label}:`, error);
    return fallback;
  }
};

export default SafeRender;
