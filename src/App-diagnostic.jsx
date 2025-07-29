// App.jsx - Versión de diagnóstico gradual
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Tema personalizado (copiado de App.jsx original)
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});

// Paso 4: Agregando AuthProvider + Tema personalizado
function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>🚀 Editorial App - Step by Step Test</h1>
            <p>✅ Step 1: Basic React component working</p>
            <p>✅ Step 2: ChakraProvider added</p>
            <p>✅ Step 3: BrowserRouter added</p>
            <p>✅ Step 4: AuthProvider + Custom Theme added</p>
            <p>Environment: {import.meta.env.MODE}</p>
            <p>API URL: {import.meta.env.VITE_API_URL}</p>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
