// components/Layout.jsx
import {
  Box,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import AppNavigation from './AppNavigation';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // Si no hay usuario autenticado, no mostramos el layout
  if (!user) {
    return <Box>{children}</Box>;
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header/Banner superior */}
      <Header />
      
      <Flex pt="140px"> {/* Padding top para compensar el header fijo */}
        {/* Navegación lateral */}
        <AppNavigation />
        
        {/* Contenido principal */}
        <Box
          flex="1"
          ml={{ base: 0, md: '250px' }}
          w={{ base: '100%', md: 'calc(100% - 250px)' }}
          p={4}
        >
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;
