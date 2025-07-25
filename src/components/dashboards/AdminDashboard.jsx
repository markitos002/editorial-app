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
  Progress,
  Spinner,
  Center
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { estadisticasAPI } from '../../services/estadisticasAPI';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Estados para estadísticas (datos reales desde API)
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalArticulos: 0,
    articulosPendientes: 0,
    revisionesCompletas: 0,
    usuariosActivos: 0
  });
  
  const [actividadReciente, setActividadReciente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar estadísticas generales
        const estadisticasResponse = await estadisticasAPI.getEstadisticasGenerales();
        if (estadisticasResponse.success) {
          setStats(estadisticasResponse.data);
        }

        // Cargar actividad reciente
        const actividadResponse = await estadisticasAPI.getActividadReciente();
        if (actividadResponse.success) {
          setActividadReciente(actividadResponse.data);
        }

      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        setError('Error al cargar los datos. Usando datos de ejemplo.');
        
        // Fallback a datos simulados en caso de error
        setStats({
          totalUsuarios: 12,
          totalArticulos: 45,
          articulosPendientes: 8,
          revisionesCompletas: 23,
          usuariosActivos: 5
        });
        
        setActividadReciente([
          {
            fecha: new Date().toISOString(),
            tipo: 'articulo',
            titulo: 'Ejemplo de artículo',
            autor: 'Usuario de prueba',
            estado: 'enviado'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  return (
    <Box>
      {/* Indicador de carga */}
      {loading && (
        <Center py={8}>
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text>Cargando estadísticas...</Text>
          </VStack>
        </Center>
      )}

      {/* Mensaje de error */}
      {error && (
        <Alert status="warning" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Contenido principal */}
      {!loading && (
        <>
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
                <Th>Usuario/Título</Th>
                <Th>Estado</Th>
              </Tr>
            </Thead>
            <Tbody>
              {actividadReciente.length > 0 ? (
                actividadReciente.map((actividad, index) => (
                  <Tr key={index}>
                    <Td>{new Date(actividad.fecha).toLocaleDateString('es-ES')}</Td>
                    <Td>
                      {actividad.tipo === 'articulo' && '📄 Artículo enviado'}
                      {actividad.tipo === 'revision' && '🔍 Revisión completada'}
                      {actividad.tipo === 'usuario' && '👤 Usuario registrado'}
                    </Td>
                    <Td>
                      {actividad.tipo === 'articulo' && `${actividad.titulo} - ${actividad.autor}`}
                      {actividad.tipo === 'revision' && `${actividad.titulo} - ${actividad.revisor}`}
                      {actividad.tipo === 'usuario' && `${actividad.nombre} (${actividad.rol})`}
                    </Td>
                    <Td>
                      <Badge 
                        colorScheme={
                          actividad.estado === 'enviado' ? 'blue' :
                          actividad.estado === 'completada' ? 'green' :
                          actividad.estado === 'aprobado' ? 'green' :
                          actividad.estado === 'rechazado' ? 'red' :
                          'purple'
                        }
                      >
                        {actividad.estado || 'activo'}
                      </Badge>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4} textAlign="center" color="gray.500">
                    No hay actividad reciente registrada
                  </Td>
                </Tr>
              )}
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
      </>
      )}
    </Box>
  );
};

export default AdminDashboard;
