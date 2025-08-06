// tests/unit/AuthContext.test.jsx - Tests unitarios para AuthContext
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';

// Componente de prueba para usar el contexto
const TestComponent = () => {
  const { user, login, logout, isLoading } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user">{user ? user.nombre : 'No User'}</div>
      <button 
        data-testid="login-btn" 
        onClick={() => login('test@example.com', 'password')}
      >
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

// Mock de authAPI
jest.mock('../../src/services/authAPI', () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    verifyToken: jest.fn()
  }
}));

describe('AuthContext', () => {
  let mockAuthAPI;
  
  beforeEach(() => {
    mockAuthAPI = require('../../src/services/authAPI').default;
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should provide initial state correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
    expect(screen.getByTestId('user')).toHaveTextContent('No User');
  });

  test('should handle successful login', async () => {
    const mockUser = {
      id: 1,
      nombre: 'Test User',
      email: 'test@example.com',
      rol: 'autor'
    };

    const mockResponse = {
      success: true,
      data: {
        token: 'fake-token',
        user: mockUser
      }
    };

    mockAuthAPI.login.mockResolvedValue(mockResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('login-btn');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
  });

  test('should handle login failure', async () => {
    const mockError = {
      message: 'Invalid credentials'
    };

    mockAuthAPI.login.mockRejectedValue(mockError);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('login-btn');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('No User');
    });

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  test('should handle logout correctly', async () => {
    const mockUser = {
      id: 1,
      nombre: 'Test User',
      email: 'test@example.com',
      rol: 'autor'
    };

    // Simular usuario logueado
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByTestId('logout-btn');
    await userEvent.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('No User');
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });

  test('should verify token on mount', async () => {
    const mockUser = {
      id: 1,
      nombre: 'Test User',
      email: 'test@example.com',
      rol: 'autor'
    };

    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    mockAuthAPI.verifyToken.mockResolvedValue({
      success: true,
      data: { user: mockUser }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    });

    expect(mockAuthAPI.verifyToken).toHaveBeenCalled();
  });
});
