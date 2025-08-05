import { ChakraProvider, Spinner, Center, Box, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ArticulosPage from './pages/ArticulosPage';
import BusquedaPage from './pages/BusquedaPage';
import NotificacionesPage from './pages/NotificacionesPage';
import AsignacionesPage from './pages/AsignacionesPage';
import RevisionPage from './pages/RevisionPage';
import RevisionDetallePage from './pages/RevisionDetallePage';
import GestionUsuariosPage from './pages/GestionUsuariosPage';
import NuevoArticuloPageSafe from './pages/NuevoArticuloPageSafe';
import TestPage from './pages/TestPage';
import TestLayoutPage from './pages/TestLayoutPage';
import TestMinimal from './pages/TestMinimal';
import ConfiguracionPage from './pages/ConfiguracionPage';
import FormularioRevision from './components/FormularioRevision';

// Componente para manejar la redirección inicial
const HomeRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
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
  
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

// Componente para rutas públicas (login, register)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
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
  
  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

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
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        
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
          path="/busqueda" 
          element={
            <ProtectedRoute>
              <BusquedaPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/notificaciones" 
          element={
            <ProtectedRoute>
              <NotificacionesPage />
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
            <ProtectedRoute requiredRoles={['autor']}>
              <NuevoArticuloPageSafe />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta de prueba aislada - SIN Layout, SIN ProtectedRoute */}
        <Route path="/test" element={<TestPage />} />
        
        {/* Ruta de prueba con Layout - CON Layout, SIN ProtectedRoute */}
        <Route path="/test-layout" element={<TestLayoutPage />} />
        
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
            <ProtectedRoute requiredRoles={['admin']}>
              <GestionUsuariosPage />
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
            <ProtectedRoute>
              <ConfiguracionPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirección inteligente por defecto */}
        <Route path="/" element={<HomeRedirect />} />
        
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
    <>
      <ColorModeScript initialColorMode="light" />
      <ChakraProvider>
        {/* ThemeProvider temporalmente removido para debugging */}
        <Router>
          <Routes>
            {/* Rutas de prueba FUERA del AuthProvider */}
            <Route path="/test" element={<TestPage />} />
            <Route path="/test-layout" element={<TestLayoutPage />} />
            <Route path="/minimal" element={<TestMinimal />} />
            
            {/* Resto de la aplicación CON AuthProvider */}
            <Route path="/*" element={
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            } />
          </Routes>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
