// tests/unit/LoginPage.test.jsx - Tests unitarios para LoginPage
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../src/pages/LoginPage';

// Mock del AuthContext
const mockLogin = jest.fn();
const mockClearError = jest.fn();

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    clearError: mockClearError
  })
}));

// Mock de react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null })
}));

// Wrapper con providers necesarios
const TestWrapper = ({ children }) => (
  <ChakraProvider>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </ChakraProvider>
);

describe('LoginPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render login form elements', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    // Verificar que los elementos principales estén presentes
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('should update input values when typing', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('should call login function when form is submitted', async () => {
    const user = userEvent.setup();
    
    // Mock login function to return a success response
    mockLogin.mockResolvedValue({ success: true });
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Verificar que login fue llamado con el objeto formData
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      contrasena: 'password123'
    });
  });

  test('should display link to register page', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const registerLink = screen.getByText(/regístrate aquí/i);
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });

  test('should call clearError on component mount', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    expect(mockClearError).toHaveBeenCalled();
  });
});
