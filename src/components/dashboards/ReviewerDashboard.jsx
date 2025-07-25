// components/dashboards/ReviewerDashboard.jsx
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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiClock, FiFileText, FiCheckCircle } from 'react-icons/fi';

const ReviewerDashboard = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Estados para estadísticas de revisor
  const [reviewerStats, setReviewerStats] = useState({
    articulosAsignados: 0,
    revisionesCompletadas: 0,
    tiempoPromedioRevision: 0,
    articulosPendientes: 0,
    puntuacionMedia: 0
  });

  useEffect(() => {
    // Simular carga de estadísticas de revisor
    setReviewerStats({
      articulosAsignados: 3,
      revisionesCompletadas: 15,
      tiempoPromedioRevision: 3.5,
      articulosPendientes: 2,
      puntuacionMedia: 4.2
    });
  }, []);

  return (
    <Box>
      {/* Estadísticas principales del revisor */}
      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6} mb={8}>
        <GridItem>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>
                  <HStack spacing={2}>
                    <Icon as={FiFileText} />
                    <Text>Pendientes</Text>
                  </HStack>
                </StatLabel>
                <StatNumber color="orange.500">{reviewerStats.articulosPendientes}</StatNumber>
                <StatHelpText>Para revisar</StatHelpText>
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
                    <Text>Completadas</Text>
                  </HStack>
                </StatLabel>
                <StatNumber color="green.500">{reviewerStats.revisionesCompletadas}</StatNumber>
                <StatHelpText>Total revisiones</StatHelpText>
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
                    <Icon as={FiClock} />
                    <Text>Tiempo Promedio</Text>
                  </HStack>
                </StatLabel>
                <StatNumber color="blue.500">{reviewerStats.tiempoPromedioRevision}</StatNumber>
                <StatHelpText>días por revisión</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Puntuación Media</StatLabel>
                <StatNumber color="purple.500">{reviewerStats.puntuacionMedia}/5</StatNumber>
                <StatHelpText>Calidad revisiones</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Alertas para el revisor */}
      <Card bg={cardBg} mb={8}>
        <CardHeader>
          <Heading size="md">⏰ Recordatorios Importantes</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Alert status="warning">
              <AlertIcon />
              Tienes 1 artículo que vence mañana: "Cuidados paliativos en domicilio"
            </Alert>
            <Alert status="info">
              <AlertIcon />
              Nuevo artículo asignado: "Enfermería geriátrica avanzada" - Fecha límite: 2 de agosto
            </Alert>
          </VStack>
        </CardBody>
      </Card>

      {/* Artículos asignados para revisión */}
      <Card bg={cardBg} mb={8}>
        <CardHeader>
          <Heading size="md">📋 Mis Revisiones Asignadas</Heading>
        </CardHeader>
        <CardBody>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <HStack spacing={4}>
                    <Badge colorScheme="red" variant="subtle">URGENTE</Badge>
                    <Text fontWeight="medium">Cuidados paliativos en domicilio</Text>
                    <Text fontSize="sm" color="gray.500">Dr. García López</Text>
                  </HStack>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack spacing={4} align="stretch">
                  <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
                    <GridItem>
                      <Text fontSize="sm" color="gray.500">Fecha asignación:</Text>
                      <Text fontWeight="medium">18/07/2025</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" color="gray.500">Fecha límite:</Text>
                      <Text fontWeight="medium" color="red.500">26/07/2025</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" color="gray.500">Días restantes:</Text>
                      <Badge colorScheme="red">1 día</Badge>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" color="gray.500">Especialidad:</Text>
                      <Text fontWeight="medium">Medicina Paliativa</Text>
                    </GridItem>
                  </Grid>
                  
                  <Text fontSize="sm" color="gray.600">
                    <strong>Resumen:</strong> Estudio sobre la implementación de cuidados paliativos 
                    en el entorno domiciliario y su impacto en la calidad de vida del paciente...
                  </Text>
                  
                  <HStack spacing={4}>
                    <Button colorScheme="blue" size="sm" onClick={() => navigate('/revisor/revisar/1')}>
                      📖 Revisar Artículo
                    </Button>
                    <Button colorScheme="green" variant="outline" size="sm">
                      📄 Descargar PDF
                    </Button>
                    <Button colorScheme="orange" variant="outline" size="sm">
                      💬 Contactar Editor
                    </Button>
                  </HStack>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <HStack spacing={4}>
                    <Badge colorScheme="blue" variant="subtle">NUEVO</Badge>
                    <Text fontWeight="medium">Enfermería geriátrica avanzada</Text>
                    <Text fontSize="sm" color="gray.500">Enf. Martínez Ruiz</Text>
                  </HStack>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack spacing={4} align="stretch">
                  <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
                    <GridItem>
                      <Text fontSize="sm" color="gray.500">Fecha asignación:</Text>
                      <Text fontWeight="medium">22/07/2025</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" color="gray.500">Fecha límite:</Text>
                      <Text fontWeight="medium">02/08/2025</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" color="gray.500">Días restantes:</Text>
                      <Badge colorScheme="green">8 días</Badge>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" color="gray.500">Especialidad:</Text>
                      <Text fontWeight="medium">Enfermería Geriátrica</Text>
                    </GridItem>
                  </Grid>
                  
                  <Text fontSize="sm" color="gray.600">
                    <strong>Resumen:</strong> Investigación sobre técnicas avanzadas de enfermería 
                    aplicadas en la atención geriátrica especializada...
                  </Text>
                  
                  <HStack spacing={4}>
                    <Button colorScheme="blue" size="sm" onClick={() => navigate('/revisor/revisar/2')}>
                      📖 Revisar Artículo
                    </Button>
                    <Button colorScheme="green" variant="outline" size="sm">
                      📄 Descargar PDF
                    </Button>
                    <Button colorScheme="yellow" variant="outline" size="sm">
                      ⏰ Solicitar Extensión
                    </Button>
                  </HStack>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card>

      {/* Herramientas de revisión */}
      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6} mb={8}>
        <GridItem>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">🔧 Herramientas de Revisión</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3}>
                <Button 
                  colorScheme="blue" 
                  w="100%" 
                  onClick={() => navigate('/revisor/plantillas')}
                >
                  📝 Plantillas de Evaluación
                </Button>
                <Button 
                  colorScheme="teal" 
                  variant="outline" 
                  w="100%"
                  onClick={() => navigate('/revisor/criterios')}
                >
                  📊 Criterios de Evaluación
                </Button>
                <Button 
                  colorScheme="purple" 
                  variant="outline" 
                  w="100%"
                  onClick={() => navigate('/revisor/historial')}
                >
                  📚 Historial de Revisiones
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">📈 Mi Rendimiento</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                <HStack justify="space-between" w="100%">
                  <Text fontSize="sm">Revisiones a Tiempo</Text>
                  <Badge colorScheme="green">95%</Badge>
                </HStack>
                <Progress value={95} colorScheme="green" w="100%" />
                
                <HStack justify="space-between" w="100%">
                  <Text fontSize="sm">Calidad de Feedback</Text>
                  <Badge colorScheme="blue">4.2/5</Badge>
                </HStack>
                <Progress value={84} colorScheme="blue" w="100%" />
                
                <HStack justify="space-between" w="100%">
                  <Text fontSize="sm">Disponibilidad</Text>
                  <Badge colorScheme="purple">Alta</Badge>
                </HStack>
                <Progress value={78} colorScheme="purple" w="100%" />
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Historial reciente */}
      <Card bg={cardBg}>
        <CardHeader>
          <Heading size="md">📋 Revisiones Recientes Completadas</Heading>
        </CardHeader>
        <CardBody>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Artículo</Th>
                <Th>Autor</Th>
                <Th>Fecha Completada</Th>
                <Th>Tiempo Usado</Th>
                <Th>Decisión</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Innovaciones en UCI</Td>
                <Td>Dr. Fernández</Td>
                <Td>23/07/2025</Td>
                <Td>3 días</Td>
                <Td><Badge colorScheme="green">Aprobado</Badge></Td>
              </Tr>
              <Tr>
                <Td>Rehabilitación post-quirúrgica</Td>
                <Td>Ft. González</Td>
                <Td>20/07/2025</Td>
                <Td>4 días</Td>
                <Td><Badge colorScheme="yellow">Revisión Menor</Badge></Td>
              </Tr>
              <Tr>
                <Td>Farmacología clínica</Td>
                <Td>Dr. Herrera</Td>
                <Td>15/07/2025</Td>
                <Td>2 días</Td>
                <Td><Badge colorScheme="red">Rechazado</Badge></Td>
              </Tr>
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ReviewerDashboard;
