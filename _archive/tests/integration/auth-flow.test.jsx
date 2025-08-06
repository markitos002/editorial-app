// tests/integration/auth-flow.test.jsx - Test de integración para flujo de autenticación
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import LoginPage from '../../src/pages/LoginPage';

// Mock de servicios
jest.mock('../../src/services/authAPI', () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    verifyToken: jest.fn()
  }
}));

// Mock de Chakra UI toast
const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: () => mockToast
}));

// Componente de dashboard mock
const DashboardMock = () => (
  <div data-testid="dashboard">
    <h1>Dashboard</h1>
    <p>Contenido del dashboard</p>
  </div>
);

// Componente principal de la aplicación para testing
const TestApp = () => (
  <ChakraProvider>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardMock />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </ChakraProvider>
);

describe('Authentication Flow Integration', () => {
  let mockAuthAPI;

  beforeEach(() => {
    mockAuthAPI = require('../../src/services/authAPI').default;
    localStorage.clear();
    jest.clearAllMocks();
    mockToast.mockClear();
    
    // Mock de verificación de token para simular usuario no autenticado
    mockAuthAPI.verifyToken.mockResolvedValue({
      success: false,
      message: 'Token no válido'
    });
  });

  test('should complete full authentication flow successfully', async () => {
    const mockUser = {
      id: 1,
      nombre: 'Test User',
      email: 'test@example.com',
      rol: 'autor'
    };

    // Mock de login exitoso
    mockAuthAPI.login.mockResolvedValue({
      success: true,
      data: {
        token: 'valid-token',
        user: mockUser
      }
    });

    // Renderizar la aplicación iniciando en login
    window.history.replaceState({}, '', '/login');
    
    render(<TestApp />);

    // Verificar que estamos en la página de login
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();

    // Completar el formulario de login
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    // Verificar que el login fue exitoso
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Bienvenido',
          status: 'success'
        })
      );
    });

    // Verificar que los datos se guardaron en localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'valid-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));

    // Verificar redirección al dashboard
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });
  });

  test('should handle authentication failure correctly', async () => {
    // Mock de login fallido
    mockAuthAPI.login.mockRejectedValue({
      message: 'Credenciales incorrectas'
    });

    window.history.replaceState({}, '', '/login');
    
    render(<TestApp />);

    // Completar el formulario con credenciales incorrectas
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(submitButton);

    // Verificar que se muestra el error
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: 'Credenciales incorrectas',
          status: 'error'
        })
      );
    });

    // Verificar que seguimos en la página de login
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument();

    // Verificar que no se guardó nada en localStorage
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  test('should redirect unauthenticated users to login when accessing protected routes', async () => {
    // Intentar acceder directamente al dashboard sin autenticación
    window.history.replaceState({}, '', '/dashboard');
    
    render(<TestApp />);

    // Verificar que se redirige al login
    await waitFor(() => {
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument();
  });

  test('should maintain authentication state on page refresh', async () => {
    const mockUser = {
      id: 1,
      nombre: 'Test User',
      email: 'test@example.com',
      rol: 'autor'
    };

    // Simular usuario ya autenticado en localStorage
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    // Mock de verificación exitosa
    mockAuthAPI.verifyToken.mockResolvedValue({
      success: true,
      data: { user: mockUser }
    });

    // Acceder directamente al dashboard
    window.history.replaceState({}, '', '/dashboard');
    
    render(<TestApp />);

    // Verificar que puede acceder al dashboard sin login
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });

    expect(screen.queryByText('Iniciar Sesión')).not.toBeInTheDocument();
    expect(mockAuthAPI.verifyToken).toHaveBeenCalled();
  });

  test('should handle expired token correctly', async () => {
    // Simular token expirado en localStorage
    localStorage.setItem('token', 'expired-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test User' }));

    // Mock de verificación fallida (token expirado)
    mockAuthAPI.verifyToken.mockResolvedValue({
      success: false,
      message: 'Token expirado'
    });

    // Intentar acceder al dashboard con token expirado
    window.history.replaceState({}, '', '/dashboard');
    
    render(<TestApp />);

    // Verificar que se redirige al login y se limpia localStorage
    await waitFor(() => {
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });
});
