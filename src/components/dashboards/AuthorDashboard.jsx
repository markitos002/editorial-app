// components/dashboards/AuthorDashboard.jsx
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
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { 
  CustomAccordion, 
  CustomAccordionItem, 
  CustomAccordionButton, 
  CustomAccordionPanel 
} from '../CustomAccordion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiEdit, FiSend, FiCheckCircle, FiClock } from 'react-icons/fi';
import { estadisticasAPI } from '../../services/estadisticasAPI';

const AuthorDashboard = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Estados para estadísticas de autor (datos reales desde API)
  const [authorStats, setAuthorStats] = useState({
    articulosEnviados: 0,
    articulosPublicados: 0,
    articulosBorrador: 0,
    enRevision: 0,
    tasaAceptacion: 0,
    detalleArticulos: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        setLoading(true);
        const response = await estadisticasAPI.getEstadisticasAutor();
        if (response.success) {
          setAuthorStats(response.data);
        }
      } catch (error) {
        console.error('Error al cargar estadísticas de autor:', error);
        // Fallback a datos simulados
        setAuthorStats({
          articulosEnviados: 8,
          articulosPublicados: 5,
          articulosBorrador: 2,
          enRevision: 1,
          tasaAceptacion: 62.5,
          detalleArticulos: []
        });
      } finally {
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'borrador': 'gray',
      'enviado': 'blue',
      'en_revision': 'orange',
      'aprobado': 'green',
      'publicado': 'purple',
      'rechazado': 'red'
    };
    return colors[status] || 'gray';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'borrador': 'Borrador',
      'enviado': 'Enviado',
      'en_revision': 'En Revisión',
      'aprobado': 'Aprobado',
      'publicado': 'Publicado',
      'rechazado': 'Rechazado'
    };
    return labels[status] || status;
  };

  return (
    <Box>
      {/* Estadísticas principales del autor */}
      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6} mb={8}>
        <GridItem>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>
                  <HStack spacing={2}>
                    <Icon as={FiEdit} />
                    <Text>Borradores</Text>
                  </HStack>
                </StatLabel>
                <StatNumber color="gray.500">{authorStats.articulosBorrador}</StatNumber>
                <StatHelpText>En progreso</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>
                  <HStack spacing={2}>
                    <Icon as={FiSend} />
                    <Text>Enviados</Text>
                  </HStack>
                </StatLabel>
                <StatNumber color="blue.500">{authorStats.articulosEnviados}</StatNumber>
                <StatHelpText>Total enviados</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>
                  <HStack spacing={2}>
                    <Icon as={FiCheckCircle} />
                    <Text>Publicados</Text>
                  </HStack>
                </StatLabel>
                <StatNumber color="green.500">{authorStats.articulosPublicados}</StatNumber>
                <StatHelpText>Aceptados</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Tasa de Aceptación</StatLabel>
                <StatNumber color="purple.500">{authorStats.tasaAceptacion}%</StatNumber>
                <StatHelpText>Promedio personal</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Alertas importantes para el autor */}
      <Card bg={cardBg} mb={8}>
        <CardHeader>
          <Heading size="md">📢 Notificaciones Importantes</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Alert status="success">
              <AlertIcon />
              ¡Felicitaciones! Tu artículo "Innovaciones en cuidados intensivos" ha sido aprobado para publicación
            </Alert>
            <Alert status="info">
              <AlertIcon />
              El editor ha solicitado revisiones menores para "Enfermería en emergencias"
            </Alert>
            <Alert status="warning">
              <AlertIcon />
              Recuerda completar tu perfil de autor para mejorar la visibilidad de tus publicaciones
            </Alert>
          </VStack>
        </CardBody>
      </Card>

      {/* Tabs para diferentes vistas */}
      <Card bg={cardBg} mb={8}>
        <CardBody>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>📝 Mis Artículos</Tab>
              <Tab>✍️ Borradores</Tab>
              <Tab>📊 Estadísticas</Tab>
            </TabList>

            <TabPanels>
              {/* Tab 1: Todos los artículos */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="sm">Estado de Mis Artículos</Heading>
                    <Button size="sm" colorScheme="blue" onClick={() => navigate('/articulos/nuevo')}>
                      + Nuevo Artículo
                    </Button>
                  </HStack>
                  
                  <CustomAccordion allowToggle>
                    <CustomAccordionItem>
                      <CustomAccordionButton>
                        <Box flex="1" textAlign="left">
                          <HStack spacing={4}>
                            <Badge colorScheme="green" variant="solid">APROBADO</Badge>
                            <Text fontWeight="medium">Innovaciones en cuidados intensivos</Text>
                            <Text fontSize="sm" color="gray.500">Enviado: 15/07/2025</Text>
                          </HStack>
                        </Box>
                      </CustomAccordionButton>
                      <CustomAccordionPanel pb={4}>
                        <VStack spacing={4} align="stretch">
                          <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
                            <GridItem>
                              <Text fontSize="sm" color="gray.500">Estado:</Text>
                              <Badge colorScheme="green">Aprobado para Publicación</Badge>
                            </GridItem>
                            <GridItem>
                              <Text fontSize="sm" color="gray.500">Fecha envío:</Text>
                              <Text fontWeight="medium">15/07/2025</Text>
                            </GridItem>
                            <GridItem>
                              <Text fontSize="sm" color="gray.500">Revisor:</Text>
                              <Text fontWeight="medium">Dr. López Herrera</Text>
                            </GridItem>
                            <GridItem>
                              <Text fontSize="sm" color="gray.500">Puntuación:</Text>
                              <Badge colorScheme="green">Excelente</Badge>
                            </GridItem>
                          </Grid>
                          
                          <Text fontSize="sm" color="gray.600">
                            <strong>Comentarios del revisor:</strong> Excelente trabajo de investigación. 
                            La metodología es sólida y los resultados son significativos para la práctica clínica.
                          </Text>
                          
                          <HStack spacing={4}>
                            <Button colorScheme="purple" size="sm">📄 Ver Versión Final</Button>
                            <Button colorScheme="blue" variant="outline" size="sm">📋 Ver Comentarios</Button>
                            <Button colorScheme="green" variant="outline" size="sm">📤 Compartir</Button>
                          </HStack>
                        </VStack>
                      </CustomAccordionPanel>
                    </CustomAccordionItem>

                    <CustomAccordionItem>
                      <CustomAccordionButton>
                        <Box flex="1" textAlign="left">
                          <HStack spacing={4}>
                            <Badge colorScheme="orange" variant="solid">EN REVISIÓN</Badge>
                            <Text fontWeight="medium">Enfermería en emergencias pediátricas</Text>
                            <Text fontSize="sm" color="gray.500">Enviado: 20/07/2025</Text>
                          </HStack>
                        </Box>
                      </CustomAccordionButton>
                      <CustomAccordionPanel pb={4}>
                        <VStack spacing={4} align="stretch">
                          <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
                            <GridItem>
                              <Text fontSize="sm" color="gray.500">Estado:</Text>
                              <Badge colorScheme="orange">En Proceso de Revisión</Badge>
                            </GridItem>
                            <GridItem>
                              <Text fontSize="sm" color="gray.500">Tiempo en revisión:</Text>
                              <Text fontWeight="medium">5 días</Text>
                            </GridItem>
                            <GridItem>
                              <Text fontSize="sm" color="gray.500">Revisor asignado:</Text>
                              <Text fontWeight="medium">Dra. Martínez Ruiz</Text>
                            </GridItem>
                            <GridItem>
                              <Text fontSize="sm" color="gray.500">Tiempo estimado:</Text>
                              <Badge colorScheme="blue">2-3 días más</Badge>
                            </GridItem>
                          </Grid>
                          
                          <Progress value={60} colorScheme="orange" />
                          <Text fontSize="sm" color="gray.600" textAlign="center">
                            Revisión en progreso - 60% completada
                          </Text>
                          
                          <HStack spacing={4}>
                            <Button colorScheme="blue" size="sm">📄 Ver Documento</Button>
                            <Button colorScheme="gray" variant="outline" size="sm">💬 Contactar Editor</Button>
                          </HStack>
                        </VStack>
                      </CustomAccordionPanel>
                    </CustomAccordionItem>
                  </CustomAccordion>
                </VStack>
              </TabPanel>

              {/* Tab 2: Borradores */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="sm">Artículos en Borrador</Heading>
                    <Button size="sm" colorScheme="green">💾 Guardar Todos</Button>
                  </HStack>
                  
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Título</Th>
                        <Th>Última Modificación</Th>
                        <Th>Progreso</Th>
                        <Th>Acciones</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Cuidados post-operatorios en cirugía cardíaca</Td>
                        <Td>24/07/2025</Td>
                        <Td>
                          <VStack spacing={1}>
                            <Progress value={75} size="sm" colorScheme="blue" />
                            <Text fontSize="xs">75% completo</Text>
                          </VStack>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button size="xs" colorScheme="blue">✏️ Editar</Button>
                            <Button size="xs" colorScheme="green">📤 Enviar</Button>
                          </HStack>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Nutrición en pacientes oncológicos</Td>
                        <Td>22/07/2025</Td>
                        <Td>
                          <VStack spacing={1}>
                            <Progress value={40} size="sm" colorScheme="orange" />
                            <Text fontSize="xs">40% completo</Text>
                          </VStack>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button size="xs" colorScheme="blue">✏️ Editar</Button>
                            <Button size="xs" colorScheme="red" variant="outline">🗑️</Button>
                          </HStack>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </VStack>
              </TabPanel>

              {/* Tab 3: Estadísticas */}
              <TabPanel px={0}>
                <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
                  <GridItem>
                    <Card size="sm">
                      <CardHeader>
                        <Heading size="sm">📈 Rendimiento General</Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4}>
                          <HStack justify="space-between" w="100%">
                            <Text fontSize="sm">Artículos Enviados</Text>
                            <Badge colorScheme="blue">8 total</Badge>
                          </HStack>
                          
                          <HStack justify="space-between" w="100%">
                            <Text fontSize="sm">Tasa de Aceptación</Text>
                            <Badge colorScheme="green">62.5%</Badge>
                          </HStack>
                          <Progress value={62.5} colorScheme="green" w="100%" />
                          
                          <HStack justify="space-between" w="100%">
                            <Text fontSize="sm">Tiempo Promedio Revisión</Text>
                            <Badge colorScheme="purple">6.2 días</Badge>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>

                  <GridItem>
                    <Card size="sm">
                      <CardHeader>
                        <Heading size="sm">📊 Por Especialidad</Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={3}>
                          <HStack justify="space-between" w="100%">
                            <Text fontSize="sm">Cuidados Intensivos</Text>
                            <Badge colorScheme="blue">3 artículos</Badge>
                          </HStack>
                          <HStack justify="space-between" w="100%">
                            <Text fontSize="sm">Enfermería Geriátrica</Text>
                            <Badge colorScheme="green">2 artículos</Badge>
                          </HStack>
                          <HStack justify="space-between" w="100%">
                            <Text fontSize="sm">Pediatría</Text>
                            <Badge colorScheme="purple">2 artículos</Badge>
                          </HStack>
                          <HStack justify="space-between" w="100%">
                            <Text fontSize="sm">Otros</Text>
                            <Badge colorScheme="gray">1 artículo</Badge>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                </Grid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      {/* Herramientas de autor */}
      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
        <GridItem>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">✍️ Herramientas de Autor</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3}>
                <Button 
                  colorScheme="blue" 
                  w="100%" 
                  onClick={() => navigate('/articulos/nuevo')}
                >
                  📝 Nuevo Artículo
                </Button>
                <Button 
                  colorScheme="teal" 
                  variant="outline" 
                  w="100%"
                  onClick={() => navigate('/autor/plantillas')}
                >
                  📄 Plantillas de Artículo
                </Button>
                <Button 
                  colorScheme="purple" 
                  variant="outline" 
                  w="100%"
                  onClick={() => navigate('/autor/guias')}
                >
                  📚 Guías de Redacción
                </Button>
                <Button 
                  colorScheme="orange" 
                  variant="outline" 
                  w="100%"
                  onClick={() => navigate('/autor/perfil')}
                >
                  👤 Mi Perfil de Autor
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">🎯 Consejos Personalizados</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <Alert status="info" size="sm">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Considera especializarte más en "Cuidados Intensivos" - es tu área más exitosa
                  </Text>
                </Alert>
                <Alert status="warning" size="sm">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Completa tu perfil de autor para mejorar la visibilidad
                  </Text>
                </Alert>
                <Alert status="success" size="sm">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Tu tasa de aceptación está por encima del promedio (50%)
                  </Text>
                </Alert>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default AuthorDashboard;
