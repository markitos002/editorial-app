// components/dashboards/AdminDashboard.jsx
import {
  Box,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Alert,
  AlertIcon,
  Progress
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Estados para estadísticas (datos mock por ahora)
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalArticulos: 0,
    articulosPendientes: 0,
    revisionesCompletas: 0,
    usuariosActivos: 0
  });

  useEffect(() => {
    // Simular carga de estadísticas
    // TODO: Conectar con API real
    setStats({
      totalUsuarios: 12,
      totalArticulos: 45,
      articulosPendientes: 8,
      revisionesCompletas: 23,
      usuariosActivos: 5
    });
  }, []);

  return (
    <Box>
      {/* Estadísticas principales */}
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mb={8}>
        <GridItem>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Total Usuarios</StatLabel>
                <StatNumber color="blue.500">{stats.totalUsuarios}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  +2 este mes
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Total Artículos</StatLabel>
                <StatNumber color="green.500">{stats.totalArticulos}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  +5 esta semana
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Pendientes Revisión</StatLabel>
                <StatNumber color="orange.500">{stats.articulosPendientes}</StatNumber>
                <StatHelpText>Requieren atención</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Usuarios Activos</StatLabel>
                <StatNumber color="purple.500">{stats.usuariosActivos}</StatNumber>
                <StatHelpText>Últimas 24h</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Alertas del sistema */}
      <Card bg={cardBg} mb={8}>
        <CardHeader>
          <Heading size="md">🚨 Alertas del Sistema</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Alert status="warning">
              <AlertIcon />
              Hay {stats.articulosPendientes} artículos esperando revisión por más de 48 horas
            </Alert>
            <Alert status="info">
              <AlertIcon />
              Sistema de backup funcionando correctamente - Último backup: hace 2 horas
            </Alert>
          </VStack>
        </CardBody>
      </Card>

      {/* Panel de gestión rápida */}
      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6} mb={8}>
        <GridItem>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">👥 Gestión de Usuarios</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                <Button 
                  colorScheme="blue" 
                  w="100%" 
                  onClick={() => navigate('/admin/usuarios')}
                >
                  Ver Todos los Usuarios
                </Button>
                <Button 
                  colorScheme="green" 
                  variant="outline" 
                  w="100%"
                  onClick={() => navigate('/admin/usuarios/nuevo')}
                >
                  Crear Nuevo Usuario
                </Button>
                <Button 
                  colorScheme="orange" 
                  variant="outline" 
                  w="100%"
                  onClick={() => navigate('/admin/roles')}
                >
                  Gestionar Roles
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">📋 Gestión Editorial</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                <Button 
                  colorScheme="purple" 
                  w="100%"
                  onClick={() => navigate('/admin/articulos')}
                >
                  Panel de Artículos
                </Button>
                <Button 
                  colorScheme="teal" 
                  variant="outline" 
                  w="100%"
                  onClick={() => navigate('/admin/revisiones')}
                >
                  Gestionar Revisiones
                </Button>
                <Button 
                  colorScheme="cyan" 
                  variant="outline" 
                  w="100%"
                  onClick={() => navigate('/admin/configuracion')}
                >
                  Configuración Sistema
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Actividad reciente */}
      <Card bg={cardBg}>
        <CardHeader>
          <Heading size="md">📊 Actividad Reciente</Heading>
        </CardHeader>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Fecha</Th>
                <Th>Evento</Th>
                <Th>Usuario</Th>
                <Th>Estado</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>25/07/2025 09:30</Td>
                <Td>Artículo enviado</Td>
                <Td>Dr. García López</Td>
                <Td><Badge colorScheme="blue">Nuevo</Badge></Td>
              </Tr>
              <Tr>
                <Td>25/07/2025 08:15</Td>
                <Td>Revisión completada</Td>
                <Td>Dra. Martínez</Td>
                <Td><Badge colorScheme="green">Completado</Badge></Td>
              </Tr>
              <Tr>
                <Td>24/07/2025 16:45</Td>
                <Td>Usuario registrado</Td>
                <Td>Prof. Rodríguez</Td>
                <Td><Badge colorScheme="purple">Activo</Badge></Td>
              </Tr>
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Estado del sistema */}
      <Card bg={cardBg} mt={8}>
        <CardHeader>
          <Heading size="md">⚙️ Estado del Sistema</Heading>
        </CardHeader>
        <CardBody>
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
            <GridItem>
              <VStack spacing={2}>
                <Text fontWeight="medium">Uso de Almacenamiento</Text>
                <Progress value={45} colorScheme="blue" w="100%" />
                <Text fontSize="sm" color="gray.500">2.3 GB / 5 GB</Text>
              </VStack>
            </GridItem>
            <GridItem>
              <VStack spacing={2}>
                <Text fontWeight="medium">Carga del Servidor</Text>
                <Progress value={25} colorScheme="green" w="100%" />
                <Text fontSize="sm" color="gray.500">Bajo - Óptimo</Text>
              </VStack>
            </GridItem>
            <GridItem>
              <VStack spacing={2}>
                <Text fontWeight="medium">Base de Datos</Text>
                <Badge colorScheme="green" variant="solid">✓ Conectada</Badge>
                <Text fontSize="sm" color="gray.500">Latencia: 12ms</Text>
              </VStack>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
    </Box>
  );
};

export default AdminDashboard;
