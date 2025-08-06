// tests/unit/DashboardPage.test.jsx - Tests unitarios para DashboardPage
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../../src/pages/DashboardPage';

// Mock del AuthContext
const mockLogout = jest.fn();
const mockUser = {
  id: 1,
  nombre: 'Test User',
  email: 'test@example.com',
  rol: 'autor'
};

const mockAuthContext = {
  user: mockUser,
  logout: mockLogout,
  isAdmin: jest.fn(() => false),
  isEditor: jest.fn(() => false),
  isReviewer: jest.fn(() => false),
  isAuthor: jest.fn(() => true)
};

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => mockAuthContext
}));

// Mock de los dashboards específicos por rol
jest.mock('../../src/components/dashboards/AdminDashboard', () => {
  return function AdminDashboard() {
    return <div data-testid="admin-dashboard">Admin Dashboard</div>;
  };
});

jest.mock('../../src/components/dashboards/EditorDashboard', () => {
  return function EditorDashboard() {
    return <div data-testid="editor-dashboard">Editor Dashboard</div>;
  };
});

jest.mock('../../src/components/dashboards/ReviewerDashboard', () => {
  return function ReviewerDashboard() {
    return <div data-testid="reviewer-dashboard">Reviewer Dashboard</div>;
  };
});

jest.mock('../../src/components/dashboards/AuthorDashboard', () => {
  return function AuthorDashboard() {
    return <div data-testid="author-dashboard">Author Dashboard</div>;
  };
});

// Mock de helpers
jest.mock('../../src/utils/helpers', () => ({
  getRoleColor: jest.fn(() => 'blue'),
  getRoleDisplayName: jest.fn(() => 'Autor'),
  formatDateShort: jest.fn(() => '28/07/2025'),
  getInitials: jest.fn(() => 'TU')
}));

// Wrapper con providers necesarios
const TestWrapper = ({ children }) => (
  <ChakraProvider>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </ChakraProvider>
);

describe('DashboardPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render dashboard header with user info', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText(/¡bienvenido.*test user/i)).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText(/email:.*test@example\.com/i)).toBeInTheDocument();
  });

  test('should render logout button', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    expect(logoutButton).toBeInTheDocument();
  });

  test('should call logout function when logout button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  test('should render author dashboard for author role', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByTestId('author-dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-dashboard')).not.toBeInTheDocument();
    expect(screen.queryByTestId('editor-dashboard')).not.toBeInTheDocument();
    expect(screen.queryByTestId('reviewer-dashboard')).not.toBeInTheDocument();
  });

  test('should render admin dashboard for admin role', () => {
    // Cambiar el mock para simular un admin
    mockAuthContext.isAdmin.mockReturnValue(true);
    mockAuthContext.isAuthor.mockReturnValue(false);

    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('author-dashboard')).not.toBeInTheDocument();
  });

  test('should render editor dashboard for editor role', () => {
    // Cambiar el mock para simular un editor
    mockAuthContext.isAdmin.mockReturnValue(false);
    mockAuthContext.isEditor.mockReturnValue(true);
    mockAuthContext.isAuthor.mockReturnValue(false);

    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByTestId('editor-dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-dashboard')).not.toBeInTheDocument();
    expect(screen.queryByTestId('author-dashboard')).not.toBeInTheDocument();
  });

  test('should render reviewer dashboard for reviewer role', () => {
    // Cambiar el mock para simular un revisor
    mockAuthContext.isAdmin.mockReturnValue(false);
    mockAuthContext.isEditor.mockReturnValue(false);
    mockAuthContext.isReviewer.mockReturnValue(true);
    mockAuthContext.isAuthor.mockReturnValue(false);

    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByTestId('reviewer-dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-dashboard')).not.toBeInTheDocument();
    expect(screen.queryByTestId('author-dashboard')).not.toBeInTheDocument();
  });
});
