// tests/unit/LoginPage.test.jsx - Tests unitarios para LoginPage
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../src/pages/LoginPage';
import { AuthProvider } from '../../src/contexts/AuthContext';

// Mock de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock de authAPI
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

// Wrapper con todos los providers necesarios
const AllProviders = ({ children }) => (
  <ChakraProvider>
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  </ChakraProvider>
);

describe('LoginPage', () => {
  let mockAuthAPI;

  beforeEach(() => {
    mockAuthAPI = require('../../src/services/authAPI').default;
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockToast.mockClear();
  });

  test('should render login form correctly', () => {
    render(
      <AllProviders>
        <LoginPage />
      </AllProviders>
    );

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('should show validation errors for empty fields', async () => {
    render(
      <AllProviders>
        <LoginPage />
      </AllProviders>
    );

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/contraseña es requerida/i)).toBeInTheDocument();
    });
  });

  test('should show validation error for invalid email', async () => {
    render(
      <AllProviders>
        <LoginPage />
      </AllProviders>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email no es válido/i)).toBeInTheDocument();
    });
  });

  test('should handle successful login', async () => {
    const mockUser = {
      id: 1,
      nombre: 'Test User',
      email: 'test@example.com',
      rol: 'autor'
    };

    mockAuthAPI.login.mockResolvedValue({
      success: true,
      data: {
        token: 'fake-token',
        user: mockUser
      }
    });

    render(
      <AllProviders>
        <LoginPage />
      </AllProviders>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Bienvenido',
        description: 'Has iniciado sesión correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('should handle login failure', async () => {
    mockAuthAPI.login.mockRejectedValue({
      message: 'Credenciales inválidas'
    });

    render(
      <AllProviders>
        <LoginPage />
      </AllProviders>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Credenciales inválidas',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('should show loading state during login', async () => {
    // Crear una promesa que no se resuelve inmediatamente
    let resolveLogin;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });

    mockAuthAPI.login.mockReturnValue(loginPromise);

    render(
      <AllProviders>
        <LoginPage />
      </AllProviders>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    // Verificar que el botón muestra estado de carga
    expect(screen.getByText(/iniciando sesión.../i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Resolver la promesa para limpiar el test
    resolveLogin({
      success: true,
      data: {
        token: 'fake-token',
        user: { id: 1, nombre: 'Test User', rol: 'autor' }
      }
    });
  });
});
