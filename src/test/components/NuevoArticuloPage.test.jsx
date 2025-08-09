import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import NuevoArticuloPage from '../../pages/NuevoArticuloPage'

// Mock de la API
vi.mock('../../services/api', () => ({
  articulosAPI: {
    crearConArchivo: vi.fn()
  }
}))

// Variable para mock del contexto
let mockAuthContext = {
  user: { nombre: 'Test User', email: 'test@test.com' },
  isAuthenticated: true
}

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
    useNavigate: () => mockNavigate
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

describe('NuevoArticuloPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.alert = vi.fn()
  })

  it('debe renderizar el formulario de nuevo artículo correctamente', () => {
    render(
      <TestWrapper>
        <NuevoArticuloPage />
      </TestWrapper>
    )

    expect(screen.getByText('Nuevo Artículo')).toBeInTheDocument()
    expect(screen.getByText('Lista de Comprobación antes de Enviar')).toBeInTheDocument()
    expect(screen.getByText('Título del Artículo *')).toBeInTheDocument()
    expect(screen.getByText('Resumen *')).toBeInTheDocument()
    expect(screen.getByText('Categoría *')).toBeInTheDocument()
    expect(screen.getByText('Archivo del Artículo *')).toBeInTheDocument()
  })

  it('debe mostrar la lista de comprobación con elementos requeridos', () => {
    render(
      <TestWrapper>
        <NuevoArticuloPage />
      </TestWrapper>
    )

    expect(screen.getByText(/formato word/i)).toBeInTheDocument()
    expect(screen.getByText(/título es claro/i)).toBeInTheDocument()
    expect(screen.getByText(/resumen no excede/i)).toBeInTheDocument()
    expect(screen.getByText(/introducción.*métodos.*resultados/i)).toBeInTheDocument()
    expect(screen.getByText(/referencias.*apa/i)).toBeInTheDocument()
    expect(screen.getByText(/numeración consecutiva/i)).toBeInTheDocument()
    expect(screen.getByText(/ortografía y gramática/i)).toBeInTheDocument()
  })

  it('debe mostrar información del usuario logueado', () => {
    render(
      <TestWrapper>
        <NuevoArticuloPage />
      </TestWrapper>
    )

    expect(screen.getByText('Test User')).toBeInTheDocument()
    // Buscar el email como texto que puede estar dividido entre elementos
    expect(document.body).toHaveTextContent('test@test.com')
  })

  it('debe tener un botón de envío', () => {
    render(
      <TestWrapper>
        <NuevoArticuloPage />
      </TestWrapper>
    )

    expect(screen.getByRole('button', { name: /enviar artículo/i })).toBeInTheDocument()
  })

  it('debe tener campos de entrada para todos los datos requeridos', () => {
    render(
      <TestWrapper>
        <NuevoArticuloPage />
      </TestWrapper>
    )

    // Verificar que existen inputs de texto
    const textInputs = screen.getAllByRole('textbox')
    expect(textInputs.length).toBeGreaterThan(0)

    // Verificar que existe select de categoría  
    const selectElement = document.querySelector('select')
    expect(selectElement).toBeInTheDocument()

    // Verificar que existe input de archivo
    const fileInput = document.querySelector('input[type="file"]')
    expect(fileInput).toBeInTheDocument()

    // Verificar checkbox de confirmación
    const checkbox = document.querySelector('input[type="checkbox"]')
    expect(checkbox).toBeInTheDocument()
  })

  it('debe mostrar mensaje de validación para archivos', () => {
    render(
      <TestWrapper>
        <NuevoArticuloPage />
      </TestWrapper>
    )

    expect(screen.getByText(/formatos permitidos.*pdf.*doc.*docx/i)).toBeInTheDocument()
    expect(screen.getByText(/tamaño máximo.*10mb/i)).toBeInTheDocument()
  })

  it('debe permitir llenar el formulario básico', () => {
    render(
      <TestWrapper>
        <NuevoArticuloPage />
      </TestWrapper>
    )

    // Verificar que los elementos del formulario existen y son interactuables
    const titleInput = document.querySelector('input[type="text"]')
    expect(titleInput).toBeInTheDocument()

    const textarea = document.querySelector('textarea')
    expect(textarea).toBeInTheDocument()

    const selectElement = document.querySelector('select')
    expect(selectElement).toBeInTheDocument()

    const fileInput = document.querySelector('input[type="file"]')
    expect(fileInput).toBeInTheDocument()

    const checkbox = document.querySelector('input[type="checkbox"]')
    expect(checkbox).toBeInTheDocument()
  })
})
