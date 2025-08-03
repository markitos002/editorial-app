// utils/dataValidator.js - Validador y limpiador de datos del backend
import React from 'react';

export const cleanObjectForRender = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => cleanObjectForRender(item));
  }
  
  if (typeof obj === 'object') {
    const cleaned = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Limpiar campos problemáticos
      if (key === 'palabras_clave') {
        if (typeof value === 'string') {
          try {
            cleaned[key] = JSON.parse(value);
          } catch {
            cleaned[key] = [];
          }
        } else if (Array.isArray(value)) {
          cleaned[key] = value;
        } else {
          cleaned[key] = [];
        }
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Recursivamente limpiar objetos anidados
        cleaned[key] = cleanObjectForRender(value);
      } else {
        cleaned[key] = value;
      }
    }
    
    return cleaned;
  }
  
  return obj;
};

// Middleware para limpiar respuestas de API
export const cleanApiResponse = (response) => {
  if (!response || !response.data) return response;
  
  console.log('🧹 Cleaning API response:', response.data);
  
  const cleaned = {
    ...response,
    data: cleanObjectForRender(response.data)
  };
  
  console.log('✅ Cleaned API response:', cleaned.data);
  
  return cleaned;
};

// Log para debugging de objetos problemáticos
export const logPotentialProblems = (data, context = 'Unknown') => {
  const findProblematicValues = (obj, path = '') => {
    if (obj === null || obj === undefined) return [];
    
    const problems = [];
    
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        problems.push(...findProblematicValues(item, `${path}[${index}]`));
      });
    } else if (typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        // Detectar valores problemáticos
        if (typeof value === 'object' && value !== null && !Array.isArray(value) && !React.isValidElement(value)) {
          problems.push({
            path: currentPath,
            value,
            type: typeof value,
            constructor: value.constructor?.name
          });
        }
        
        problems.push(...findProblematicValues(value, currentPath));
      }
    }
    
    return problems;
  };
  
  const problems = findProblematicValues(data);
  
  if (problems.length > 0) {
    console.warn(`🚨 Potential React render problems in ${context}:`, problems);
  }
  
  return problems;
};
