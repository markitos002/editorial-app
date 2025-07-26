// pages/DashboardPage.jsx
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  useColorModeValue,
  Avatar,
  Flex,
  Spacer
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { getRoleColor, getRoleDisplayName, formatDateShort, getInitials } from '../utils/helpers';

// Importar los dashboards específicos por rol
import AdminDashboard from '../components/dashboards/AdminDashboard';
import EditorDashboard from '../components/dashboards/EditorDashboard';
import ReviewerDashboard from '../components/dashboards/ReviewerDashboard';
import AuthorDashboard from '../components/dashboards/AuthorDashboard';

const DashboardPage = () => {
  const { user, logout, isAdmin, isEditor, isReviewer, isAuthor } = useAuth();
  
  // Colores para modo claro/oscuro
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleLogout = async () => {
    await logout();
  };

  // Función para renderizar el dashboard específico según el rol
  const renderRoleSpecificDashboard = () => {
    if (isAdmin()) {
      return <AdminDashboard />;
    }
    if (isEditor()) {
      return <EditorDashboard />;
    }
    if (isReviewer()) {
      return <ReviewerDashboard />;
    }
    if (isAuthor()) {
      return <AuthorDashboard />;
    }
    
    // Dashboard por defecto si no se reconoce el rol
    return (
      <Card bg={cardBg}>
        <CardBody>
          <VStack spacing={4}>
            <Heading size="md">¡Bienvenido al Sistema Editorial!</Heading>
            <Text>Tu rol actual no tiene un dashboard específico configurado.</Text>
            <Text>Contacta al administrador para obtener los permisos necesarios.</Text>
          </VStack>
        </CardBody>
      </Card>
    );
  };

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Header */}
      <Box bg={cardBg} shadow="sm" py={4} px={4}>
        <Container maxW="container.xl">
          <Flex align="center">
            <HStack spacing={4}>
              <Heading size="lg" color="purple.600">
                Revista Manos al Cuidado
              </Heading>
            </HStack>
            
            <Spacer />
            
            <HStack spacing={4}>
              <VStack spacing={0} align="end">
                <Text fontWeight="medium">{user?.nombre}</Text>
                <Badge colorScheme={getRoleColor(user?.rol)} variant="subtle">
                  {getRoleDisplayName(user?.rol)}
                </Badge>
              </VStack>
              <Avatar 
                name={user?.nombre} 
                src={user?.avatar} 
                size="sm"
              >
                {getInitials(user?.nombre)}
              </Avatar>
              <Button 
                variant="outline" 
                colorScheme="red" 
                size="sm"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Contenido principal */}
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Bienvenida personalizada */}
          <Card bg={cardBg}>
            <CardBody>
              <VStack spacing={4} align="start">
                <Heading size="lg">
                  ¡Bienvenido, {user?.nombre}! 👋
                </Heading>
                <HStack spacing={4}>
                  <Text color="gray.600">
                    Email: {user?.email}
                  </Text>
                  <Badge colorScheme={getRoleColor(user?.rol)} variant="subtle">
                    {getRoleDisplayName(user?.rol)}
                  </Badge>
                </HStack>
                {user?.creado_en && (
                  <Text color="gray.500" fontSize="sm">
                    Miembro desde: {formatDateShort(user.creado_en)}
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Dashboard específico por rol */}
          {renderRoleSpecificDashboard()}
        </VStack>
      </Container>
    </Box>
  );
};

export default DashboardPage;
