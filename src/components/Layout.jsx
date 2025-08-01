// components/Layout.jsx
import {
  Box,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import AppNavigation from './AppNavigation';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // Si no hay usuario autenticado, no mostramos el layout
  if (!user) {
    return <Box>{children}</Box>;
  }

  return (
    <Flex minH="100vh" bg={bgColor}>
      {/* Navegación lateral */}
      <AppNavigation />
      
      {/* Contenido principal */}
      <Box
        flex="1"
        ml={{ base: 0, md: '250px' }}
        w={{ base: '100%', md: 'calc(100% - 250px)' }}
      >
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
