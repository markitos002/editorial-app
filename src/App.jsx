import { ChakraProvider, extendTheme, Spinner, Center, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ArticulosPage from './pages/ArticulosPage';
import AsignacionesPage from './pages/AsignacionesPage';
import RevisionPage from './pages/RevisionPage';
import RevisionDetallePage from './pages/RevisionDetallePage';
import FormularioRevision from './components/FormularioRevision';

// Tema personalizado para Chakra UI
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
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
});

// Componente para mostrar loading mientras se verifica la autenticación
const AppContent = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" />
          <Box mt={4}>Cargando...</Box>
        </Box>
      </Center>
    );
  }

  return (
    <Layout>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rutas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas futuras - placeholder */}
        <Route 
          path="/articulos" 
          element={
            <ProtectedRoute>
              <ArticulosPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/articles" 
          element={
            <ProtectedRoute>
              <ArticulosPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/articles/new" 
          element={
            <ProtectedRoute>
              <Box p={8}>
                <h2>Nuevo Artículo - Próximamente</h2>
              </Box>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/reviews" 
          element={
            <ProtectedRoute requiredRoles={['admin', 'editor', 'revisor']}>
              <RevisionPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/revision" 
          element={
            <ProtectedRoute requiredRoles={['revisor']}>
              <RevisionPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/revision/:revisionId/detalle" 
          element={
            <ProtectedRoute requiredRoles={['revisor', 'admin', 'editor']}>
              <RevisionDetallePage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/revision/:revisionId" 
          element={
            <ProtectedRoute requiredRoles={['revisor']}>
              <FormularioRevision />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/asignaciones" 
          element={
            <ProtectedRoute requiredRoles={['admin', 'editor']}>
              <AsignacionesPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/users" 
          element={
            <ProtectedRoute requiredRoles={['admin', 'editor']}>
              <Box p={8}>
                <h2>Gestión de Usuarios - Próximamente</h2>
              </Box>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <Box p={8}>
                <h2>Notificaciones - Próximamente</h2>
              </Box>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <Box p={8}>
                <h2>Configuración - Próximamente</h2>
              </Box>
            </ProtectedRoute>
          } 
        />
        
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 */}
        <Route 
          path="*" 
          element={
            <Box p={8} textAlign="center">
              <h2>Página no encontrada</h2>
              <p>La página que buscas no existe.</p>
            </Box>
          } 
        />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
