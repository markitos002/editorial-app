// utils/authHelper.js - Helper para debugging de autenticación
export const checkAuthStatus = () => {
  const token = localStorage.getItem('editorial_token');
  const user = localStorage.getItem('editorial_user');
  
  const status = {
    hasToken: !!token,
    tokenLength: token?.length,
    tokenValid: false,
    hasUser: !!user,
    userParsed: null
  };
  
  if (token) {
    try {
      // Verificar si el token tiene estructura JWT válida
      const tokenParts = token.split('.');
      status.tokenValid = tokenParts.length === 3;
      
      if (status.tokenValid) {
        // Decodificar payload (sin verificar firma)
        const payload = JSON.parse(atob(tokenParts[1]));
        status.tokenExpiry = payload.exp;
        status.tokenExpired = payload.exp < Date.now() / 1000;
        status.tokenUserId = payload.id || payload.userId;
      }
    } catch (e) {
      console.error('Error parsing token:', e);
    }
  }
  
  if (user) {
    try {
      status.userParsed = JSON.parse(user);
    } catch (e) {
      console.error('Error parsing user:', e);
    }
  }
  
  return status;
};

export const logAuthStatus = () => {
  const status = checkAuthStatus();
  console.log('🔐 Auth Status Check:', status);
  return status;
};

export const clearAuthData = () => {
  localStorage.removeItem('editorial_token');
  localStorage.removeItem('editorial_user');
  console.log('🗑️ Auth data cleared');
};

export const isTokenExpired = () => {
  const status = checkAuthStatus();
  return status.tokenExpired || false;
};
