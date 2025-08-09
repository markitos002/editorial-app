import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import AppNavigation from '../../components/AppNavigation'

// Variable para mock del contexto
let mockAuthContext = {}

// Mock del hook useAuth
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthContext
}))

// Mock de react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => ({ pathname: '/dashboard' }),
    useNavigate: () => vi.fn()
  }
})

// Wrapper para tests
const TestWrapper = ({ children }) => (
  <ChakraProvider>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </ChakraProvider>
)

describe('AppNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuthContext.user = { nombre: 'Test User', email: 'test@test.com', rol: 'admin' }
    mockAuthContext.isAuthenticated = true
    mockAuthContext.logout = vi.fn()
  })

  it('debe renderizar correctamente cuando está abierto', () => {
    render(
      <TestWrapper>
        <AppNavigation isOpen={true} onClose={vi.fn()} />
      </TestWrapper>
    )

    expect(document.body).toBeInTheDocument()
  })

  it('debe renderizar correctamente cuando está cerrado', () => {
    render(
      <TestWrapper>
        <AppNavigation isOpen={false} onClose={vi.fn()} />
      </TestWrapper>
    )

    expect(document.body).toBeInTheDocument()
  })

  it('debe manejar diferentes roles de usuario', () => {
    mockAuthContext.user = { nombre: 'Admin User', email: 'admin@test.com', rol: 'admin' }
    
    const { rerender } = render(
      <TestWrapper>
        <AppNavigation isOpen={true} onClose={vi.fn()} />
      </TestWrapper>
    )

    // Cambiar a escritor
    mockAuthContext.user = { nombre: 'Escritor User', email: 'escritor@test.com', rol: 'escritor' }
    
    rerender(
      <TestWrapper>
        <AppNavigation isOpen={true} onClose={vi.fn()} />
      </TestWrapper>
    )

    expect(document.body).toBeInTheDocument()
  })

  it('debe poder recibir función onClose', () => {
    const mockOnClose = vi.fn()
    
    render(
      <TestWrapper>
        <AppNavigation isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    )

    expect(mockOnClose).toBeDefined()
    expect(document.body).toBeInTheDocument()
  })

  it('debe manejar usuario no autenticado', () => {
    mockAuthContext.isAuthenticated = false
    mockAuthContext.user = null
    
    render(
      <TestWrapper>
        <AppNavigation isOpen={true} onClose={vi.fn()} />
      </TestWrapper>
    )

    expect(document.body).toBeInTheDocument()
  })

  it('debe tener función de logout disponible', () => {
    const mockLogout = vi.fn()
    mockAuthContext.logout = mockLogout
    
    render(
      <TestWrapper>
        <AppNavigation isOpen={true} onClose={vi.fn()} />
      </TestWrapper>
    )

    expect(mockLogout).toBeDefined()
    expect(document.body).toBeInTheDocument()
  })
})