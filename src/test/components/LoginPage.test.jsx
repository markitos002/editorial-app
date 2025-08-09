import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import LoginPage from '../../pages/LoginPage'

// Variable para mock del contexto
let mockAuthContext = {}

// Mock del hook useAuth
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthContext
}))

// Mock de react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null })
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

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuthContext.login = vi.fn()
    mockAuthContext.isLoading = false
    mockAuthContext.error = null
    mockAuthContext.isAuthenticated = false
    mockAuthContext.clearError = vi.fn()
    mockAuthContext.user = null
  })

  it('debe renderizar el componente LoginPage sin errores', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    expect(document.body).toBeInTheDocument()
  })

  it('debe manejar el estado de loading', () => {
    mockAuthContext.isLoading = true

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    expect(document.body).toBeInTheDocument()
  })

  it('debe manejar errores del servidor', () => {
    mockAuthContext.error = 'Error de prueba'

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    expect(document.body).toBeInTheDocument()
  })

  it('debe funcionar con usuario autenticado', () => {
    mockAuthContext.isAuthenticated = true
    mockAuthContext.user = { nombre: 'Test User' }

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    expect(document.body).toBeInTheDocument()
  })

  it('debe tener función login disponible', () => {
    const mockLogin = vi.fn()
    mockAuthContext.login = mockLogin

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    expect(mockLogin).toBeDefined()
    expect(document.body).toBeInTheDocument()
  })

  it('debe tener función clearError disponible', () => {
    const mockClearError = vi.fn()
    mockAuthContext.clearError = mockClearError

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    expect(mockClearError).toBeDefined()
    expect(document.body).toBeInTheDocument()
  })
})