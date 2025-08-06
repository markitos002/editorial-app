// tests/mocks/authAPI.mock.js - Mock del authAPI para testing
const mockAuthAPI = {
  // Mock de login
  login: jest.fn(),
  
  // Mock de registro  
  register: jest.fn(),
  
  // Mock de logout
  logout: jest.fn(),
  
  // Mock de verificar token
  verifyToken: jest.fn(),
  
  // Mock de obtener perfil
  getProfile: jest.fn(),
  
  // Mock de actualizar perfil
  updateProfile: jest.fn(),
  
  // Helpers para testing
  __setLoginResponse: (response) => {
    mockAuthAPI.login.mockResolvedValue(response);
  },
  
  __setRegisterResponse: (response) => {
    mockAuthAPI.register.mockResolvedValue(response);
  },
  
  __setVerifyTokenResponse: (response) => {
    mockAuthAPI.verifyToken.mockResolvedValue(response);
  },
  
  __reset: () => {
    Object.keys(mockAuthAPI).forEach(key => {
      if (typeof mockAuthAPI[key] === 'function' && key !== '__reset' && !key.startsWith('__set')) {
        mockAuthAPI[key].mockReset();
      }
    });
  }
};

export default mockAuthAPI;
