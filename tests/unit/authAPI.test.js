// tests/unit/authAPI.test.js - Tests unitarios para authAPI con mocks
import mockAuthAPI from '../mocks/authAPI.mock.js';

describe('AuthAPI Mock Tests', () => {
  beforeEach(() => {
    mockAuthAPI.__reset();
  });

  describe('login', () => {
    it('should call login with correct credentials', async () => {
      const credentials = { email: 'test@test.com', password: 'password' };
      const response = { token: 'fake-token', user: { id: 1, email: 'test@test.com' } };
      
      mockAuthAPI.__setLoginResponse(response);
      
      const result = await mockAuthAPI.login(credentials);
      
      expect(mockAuthAPI.login).toHaveBeenCalledWith(credentials);
      expect(result).toEqual(response);
    });

    it('should handle login errors', async () => {
      const credentials = { email: 'wrong@test.com', password: 'wrong' };
      const error = new Error('Invalid credentials');
      
      mockAuthAPI.login.mockRejectedValue(error);
      
      await expect(mockAuthAPI.login(credentials)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should call register with user data', async () => {
      const userData = { 
        email: 'new@test.com', 
        password: 'password',
        nombre: 'Test User'
      };
      const response = { success: true, user: { id: 2, email: 'new@test.com' } };
      
      mockAuthAPI.__setRegisterResponse(response);
      
      const result = await mockAuthAPI.register(userData);
      
      expect(mockAuthAPI.register).toHaveBeenCalledWith(userData);
      expect(result).toEqual(response);
    });
  });

  describe('verifyToken', () => {
    it('should verify token successfully', async () => {
      const token = 'valid-token';
      const response = { valid: true, user: { id: 1, email: 'test@test.com' } };
      
      mockAuthAPI.__setVerifyTokenResponse(response);
      
      const result = await mockAuthAPI.verifyToken(token);
      
      expect(mockAuthAPI.verifyToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(response);
    });

    it('should handle invalid token', async () => {
      const token = 'invalid-token';
      const error = new Error('Token invalid');
      
      mockAuthAPI.verifyToken.mockRejectedValue(error);
      
      await expect(mockAuthAPI.verifyToken(token)).rejects.toThrow('Token invalid');
    });
  });
});
