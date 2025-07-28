// pages/NotificacionesPage.jsx - Página de notificaciones
import {
  Box,
  Container,
  Heading,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import CentroNotificaciones from '../components/notificaciones/CentroNotificaciones';

const NotificacionesPage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="7xl" py={8}>
        <Box textAlign="center" mb={8}>
          <Heading size="xl" color="blue.600" mb={2}>
            📬 Centro de Notificaciones
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Mantente al día con todas las actualizaciones del sistema editorial
          </Text>
        </Box>
        
        <CentroNotificaciones />
      </Container>
    </Box>
  );
};

export default NotificacionesPage;
