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
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Avatar,
  Flex,
  Spacer
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleColor, getRoleDisplayName, formatDateShort, getInitials } from '../utils/helpers';

const DashboardPage = () => {
  const { user, logout, isAdmin, isEditor, isReviewer } = useAuth();
  const navigate = useNavigate();
  
  // Colores para modo claro/oscuro
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Header */}
      <Box bg={cardBg} shadow="sm" py={4} px={4}>
        <Container maxW="container.xl">
          <Flex align="center">
            <HStack spacing={4}>
              <Heading size="lg" color="blue.500">
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
          {/* Bienvenida */}
          <Card bg={cardBg}>
            <CardBody>
              <VStack spacing={4} align="start">
                <Heading size="lg">
                  ¡Bienvenido, {user?.nombre}! 👋
                </Heading>
                <Text color="gray.600">
                  Email: {user?.email}
                </Text>
                <Text color="gray.600">
                  Rol: {getRoleDisplayName(user?.rol)}
                </Text>
                {user?.creado_en && (
                  <Text color="gray.500" fontSize="sm">
                    Miembro desde: {formatDateShort(user.creado_en)}
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Estadísticas rápidas */}
          <Card bg={cardBg}>
            <CardBody>
              <Heading size="md" mb={6}>Resumen de Actividad</Heading>
              <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
                <GridItem>
                  <Stat>
                    <StatLabel>Artículos Enviados</StatLabel>
                    <StatNumber>0</StatNumber>
                    <StatHelpText>Total de artículos</StatHelpText>
                  </Stat>
                </GridItem>
                
                {isReviewer() && (
                  <GridItem>
                    <Stat>
                      <StatLabel>Revisiones Realizadas</StatLabel>
                      <StatNumber>0</StatNumber>
                      <StatHelpText>Total de revisiones</StatHelpText>
                    </Stat>
                  </GridItem>
                )}
                
                <GridItem>
                  <Stat>
                    <StatLabel>Notificaciones</StatLabel>
                    <StatNumber>0</StatNumber>
                    <StatHelpText>Sin leer</StatHelpText>
                  </Stat>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>

          {/* Acciones rápidas */}
          <Card bg={cardBg}>
            <CardBody>
              <Heading size="md" mb={6}>Acciones Rápidas</Heading>
              <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                <GridItem>
                  <Button 
                    colorScheme="blue" 
                    size="lg" 
                    w="100%"
                    onClick={() => navigate('/articulos')}
                  >
                    📝 Nuevo Artículo
                  </Button>
                </GridItem>
                
                <GridItem>
                  <Button 
                    colorScheme="green" 
                    variant="outline" 
                    size="lg" 
                    w="100%"
                    onClick={() => navigate('/articulos')}
                  >
                    📋 Mis Artículos
                  </Button>
                </GridItem>
                
                {isReviewer() && (
                  <GridItem>
                    <Button 
                      colorScheme="orange" 
                      variant="outline" 
                      size="lg" 
                      w="100%"
                      isDisabled
                    >
                      🔍 Revisar Artículos
                    </Button>
                    <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
                      Próximamente
                    </Text>
                  </GridItem>
                )}
                
                {isEditor() && (
                  <GridItem>
                    <Button 
                      colorScheme="purple" 
                      variant="outline" 
                      size="lg" 
                      w="100%"
                      isDisabled
                    >
                      ⚙️ Panel de Gestión
                    </Button>
                    <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
                      Próximamente
                    </Text>
                  </GridItem>
                )}
              </Grid>
            </CardBody>
          </Card>

          {/* Estado del sistema */}
          <Card bg={cardBg}>
            <CardBody>
              <Heading size="md" mb={4}>Estado del Sistema</Heading>
              <VStack spacing={3} align="start">
                <HStack>
                  <Badge colorScheme="green" variant="solid">
                    ✓ Autenticación
                  </Badge>
                  <Text fontSize="sm">Sistema de login funcionando</Text>
                </HStack>
                
                <HStack>
                  <Badge colorScheme="green" variant="solid">
                    ✓ API Backend
                  </Badge>
                  <Text fontSize="sm">Conexión con servidor establecida</Text>
                </HStack>
                
                <HStack>
                  <Badge colorScheme="green" variant="solid">
                    ✓ Gestión de Artículos
                  </Badge>
                  <Text fontSize="sm">Crear y gestionar artículos funcionando</Text>
                </HStack>
                
                <HStack>
                  <Badge colorScheme="yellow" variant="solid">
                    🚧 Sistema de Revisiones
                  </Badge>
                  <Text fontSize="sm">En desarrollo - Próximamente</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default DashboardPage;
