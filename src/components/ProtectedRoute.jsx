// components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requiredRoles = null, 
  redirectTo = '/login' 
}) => {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    hasRole 
  } = useAuth();
  const location = useLocation();

  // Mostrar spinner mientras verifica autenticación
  if (isLoading) {
    return (
      <Center h="100vh">
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" />
          <Box mt={4}>Verificando autenticación...</Box>
        </Box>
      </Center>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si se especificaron roles requeridos, verificar
  if (requiredRoles && !hasRole(requiredRoles)) {
    // Redirigir a página de acceso denegado o dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Si todo está bien, mostrar el componente
  return children;
};

export default ProtectedRoute;
