// components/dashboards/EditorDashboard.jsx
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
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Progress,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { estadisticasAPI } from '../../services/estadisticasAPI';

const EditorDashboard = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Estados para estadísticas de editor (datos reales desde API)
  const [editorStats, setEditorStats] = useState({
    articulosEnRevision: 0,
    articulosAprobados: 0,
    articulosRechazados: 0,
    revisoresPendientes: 0,
    articulosListos: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        setLoading(true);
        const response = await estadisticasAPI.getEstadisticasEditor();
        if (response.success) {
          setEditorStats(response.data);
        }
      } catch (error) {
        console.error('Error al cargar estadísticas de editor:', error);
        // Fallback a datos simulados
        setEditorStats({
          articulosEnRevision: 12,
          articulosAprobados: 8,
          articulosRechazados: 3,
          revisoresPendientes: 5,
          articulosListos: 4
        });
      } finally {
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, []);

  return (
    <Box>
      {/* Estadísticas principales del editor */}
      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6} mb={8}>
        <GridItem>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>En Revisión</StatLabel>
                <StatNumber color="orange.500">{editorStats.articulosEnRevision}</StatNumber>
                <StatHelpText>Artículos activos</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Aprobados</StatLabel>
                <StatNumber color="green.500">{editorStats.articulosAprobados}</StatNumber>
                <StatHelpText>Este mes</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Revisores Activos</StatLabel>
                <StatNumber color="blue.500">{editorStats.revisoresPendientes}</StatNumber>
                <StatHelpText>Trabajando ahora</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Listos Publicar</StatLabel>
                <StatNumber color="purple.500">{editorStats.articulosListos}</StatNumber>
                <StatHelpText>Aprobados finales</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Alertas importantes para editores */}
      <Card bg={cardBg} mb={8}>
        <CardHeader>
          <Heading size="md">⚠️ Tareas Prioritarias</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Alert status="error">
              <AlertIcon />
              3 artículos han superado el tiempo límite de revisión (7 días)
            </Alert>
            <Alert status="warning">
              <AlertIcon />
              2 revisores no han respondido a asignaciones en 48 horas
            </Alert>
            <Alert status="info">
              <AlertIcon />
              Hay 4 artículos listos para publicación final
            </Alert>
          </VStack>
        </CardBody>
      </Card>

      {/* Tabs para diferentes vistas de trabajo */}
      <Card bg={cardBg} mb={8}>
        <CardBody>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>📋 Artículos Pendientes</Tab>
              <Tab>👥 Gestión Revisores</Tab>
              <Tab>✅ Listos para Publicar</Tab>
            </TabList>

            <TabPanels>
              {/* Tab 1: Artículos Pendientes */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="sm">Artículos Esperando Asignación</Heading>
                    <Button size="sm" colorScheme="blue" onClick={() => navigate('/editor/asignar')}>
                      Asignar Revisores
                    </Button>
                  </HStack>
                  
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Título</Th>
                        <Th>Autor</Th>
                        <Th>Fecha Envío</Th>
                        <Th>Días Esperando</Th>
                        <Th>Acción</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Cuidados paliativos en domicilio</Td>
                        <Td>Dr. García</Td>
                        <Td>20/07/2025</Td>
                        <Td><Badge colorScheme="red">5 días</Badge></Td>
                        <Td>
                          <Button size="xs" colorScheme="blue">Asignar</Button>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Enfermería geriátrica avanzada</Td>
                        <Td>Enf. Martínez</Td>
                        <Td>22/07/2025</Td>
                        <Td><Badge colorScheme="orange">3 días</Badge></Td>
                        <Td>
                          <Button size="xs" colorScheme="blue">Asignar</Button>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </VStack>
              </TabPanel>

              {/* Tab 2: Gestión de Revisores */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="sm">Estado de Revisores</Heading>
                    <Button size="sm" colorScheme="green" onClick={() => navigate('/editor/revisores')}>
                      Gestionar Revisores
                    </Button>
                  </HStack>
                  
                  <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                    <GridItem>
                      <Card size="sm">
                        <CardBody>
                          <VStack spacing={2}>
                            <Text fontWeight="medium">Dr. López Herrera</Text>
                            <Badge colorScheme="green">Disponible</Badge>
                            <Text fontSize="sm" color="gray.500">Especialidad: Cardiología</Text>
                            <Text fontSize="sm" color="gray.500">Carga: 2/5 artículos</Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    </GridItem>
                    
                    <GridItem>
                      <Card size="sm">
                        <CardBody>
                          <VStack spacing={2}>
                            <Text fontWeight="medium">Dra. Ruiz Campos</Text>
                            <Badge colorScheme="orange">Ocupada</Badge>
                            <Text fontSize="sm" color="gray.500">Especialidad: Neurología</Text>
                            <Text fontSize="sm" color="gray.500">Carga: 5/5 artículos</Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    </GridItem>
                  </Grid>
                </VStack>
              </TabPanel>

              {/* Tab 3: Listos para Publicar */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="sm">Artículos Aprobados - Listos para Publicación</Heading>
                    <Button size="sm" colorScheme="purple" onClick={() => navigate('/editor/publicar')}>
                      Publicar Seleccionados
                    </Button>
                  </HStack>
                  
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Título</Th>
                        <Th>Autor</Th>
                        <Th>Fecha Aprobación</Th>
                        <Th>Puntuación</Th>
                        <Th>Acción</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Innovaciones en cuidados intensivos</Td>
                        <Td>Dr. Fernández</Td>
                        <Td>23/07/2025</Td>
                        <Td><Badge colorScheme="green">Excelente</Badge></Td>
                        <Td>
                          <Button size="xs" colorScheme="purple">Publicar</Button>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      {/* Panel de herramientas rápidas */}
      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6} mb={8}>
        <GridItem>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">🛠️ Herramientas de Editor</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3}>
                <Button 
                  colorScheme="blue" 
                  w="100%" 
                  onClick={() => navigate('/editor/workflow')}
                >
                  Panel de Flujo Editorial
                </Button>
                <Button 
                  colorScheme="teal" 
                  variant="outline" 
                  w="100%"
                  onClick={() => navigate('/editor/plantillas')}
                >
                  Plantillas de Revisión
                </Button>
                <Button 
                  colorScheme="purple" 
                  variant="outline" 
                  w="100%"
                  onClick={() => navigate('/editor/comunicaciones')}
                >
                  Centro de Comunicaciones
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">📊 Métricas de Rendimiento</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                <HStack justify="space-between" w="100%">
                  <Text fontSize="sm">Tiempo Promedio de Revisión</Text>
                  <Badge colorScheme="green">4.2 días</Badge>
                </HStack>
                <Progress value={85} colorScheme="green" w="100%" />
                
                <HStack justify="space-between" w="100%">
                  <Text fontSize="sm">Tasa de Aprobación</Text>
                  <Badge colorScheme="blue">72%</Badge>
                </HStack>
                <Progress value={72} colorScheme="blue" w="100%" />
                
                <HStack justify="space-between" w="100%">
                  <Text fontSize="sm">Satisfacción Autores</Text>
                  <Badge colorScheme="purple">4.6/5</Badge>
                </HStack>
                <Progress value={92} colorScheme="purple" w="100%" />
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default EditorDashboard;
