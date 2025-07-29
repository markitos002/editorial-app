// src/pages/AsignacionesPage.jsx - Interface para asignación de revisores
import React, { useState, useEffect } from 'react';
import {
  Box, VStack, HStack, Heading, Text, Button, Card, CardBody,
  Table, Thead, Tbody, Tr, Th, Td, Badge, Spinner, Alert, AlertIcon,
  Select, Textarea, useDisclosure, useToast, Flex, Spacer,
  Tabs, TabList, TabPanels, Tab, TabPanel, useColorModeValue
} from '@chakra-ui/react';
import CustomModal from '../components/CustomModal';
import { asignacionesAPI } from '../services/asignacionesAPI';

const AsignacionesPage = () => {
  // Estados principales
  const [revisores, setRevisores] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del modal de asignación
  const [selectedArticulo, setSelectedArticulo] = useState(null);
  const [selectedRevisor, setSelectedRevisor] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Hooks de Chakra UI
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Colores para modo claro/oscuro
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [revisoresRes, articulosRes, asignacionesRes] = await Promise.all([
        asignacionesAPI.obtenerRevisoresDisponibles(),
        asignacionesAPI.obtenerArticulosSinAsignar(),
        asignacionesAPI.obtenerAsignaciones()
      ]);

      if (revisoresRes.success) setRevisores(revisoresRes.data);
      if (articulosRes.success) setArticulos(articulosRes.data);
      if (asignacionesRes.success) setAsignaciones(asignacionesRes.data);

    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos. Verifica tu conexión.');
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const abrirModalAsignacion = (articulo) => {
    setSelectedArticulo(articulo);
    setSelectedRevisor('');
    setObservaciones('');
    onOpen();
  };

  const handleAsignar = async () => {
    if (!selectedRevisor) {
      toast({
        title: 'Error',
        description: 'Debes seleccionar un revisor.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await asignacionesAPI.asignarRevisor(
        selectedArticulo.id,
        parseInt(selectedRevisor),
        observaciones
      );

      if (response.success) {
        toast({
          title: 'Éxito',
          description: 'Revisor asignado exitosamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        onClose();
        cargarDatos(); // Recargar datos
      }
    } catch (error) {
      console.error('Error al asignar revisor:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.mensaje || 'Error al asignar revisor.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelarAsignacion = async (revisionId, tituloArticulo) => {
    if (!window.confirm(`¿Estás seguro de cancelar la asignación para "${tituloArticulo}"?`)) {
      return;
    }

    try {
      const response = await asignacionesAPI.cancelarAsignacion(revisionId, 'Cancelado por editor');
      
      if (response.success) {
        toast({
          title: 'Éxito',
          description: 'Asignación cancelada exitosamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        cargarDatos();
      }
    } catch (error) {
      console.error('Error al cancelar asignación:', error);
      toast({
        title: 'Error',
        description: 'Error al cancelar la asignación.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getBadgeColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'orange';
      case 'completado': return 'green';
      case 'cancelado': return 'red';
      case 'enviado': return 'blue';
      case 'en_revision': return 'purple';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" margin={4}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Asignación de Revisores</Heading>
          <Text color="gray.600">Gestiona la asignación de revisores a artículos académicos</Text>
        </Box>

        <Tabs colorScheme="blue">
          <TabList>
            <Tab>Artículos Pendientes ({articulos.length})</Tab>
            <Tab>Revisores Disponibles ({revisores.length})</Tab>
            <Tab>Asignaciones Activas ({asignaciones.length})</Tab>
          </TabList>

          <TabPanels>
            {/* Tab 1: Artículos Pendientes */}
            <TabPanel>
              <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <Heading size="md" mb={4}>Artículos Pendientes de Asignación</Heading>
                  {articulos.length > 0 ? (
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Título</Th>
                          <Th>Autor</Th>
                          <Th>Estado</Th>
                          <Th>Fecha</Th>
                          <Th>Revisores</Th>
                          <Th>Acción</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {articulos.map((articulo) => (
                          <Tr key={articulo.id}>
                            <Td>
                              <Text fontWeight="medium" maxW="200px" isTruncated>
                                {articulo.titulo}
                              </Text>
                            </Td>
                            <Td>{articulo.autor_nombre}</Td>
                            <Td>
                              <Badge colorScheme={getBadgeColor(articulo.estado)}>
                                {articulo.estado}
                              </Badge>
                            </Td>
                            <Td>{new Date(articulo.fecha_creacion).toLocaleDateString()}</Td>
                            <Td>{articulo.revisores_asignados}</Td>
                            <Td>
                              <Button
                                size="sm"
                                colorScheme="blue"
                                onClick={() => abrirModalAsignacion(articulo)}
                              >
                                Asignar Revisor
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Text color="gray.500" textAlign="center" py={8}>
                      No hay artículos pendientes de asignación
                    </Text>
                  )}
                </CardBody>
              </Card>
            </TabPanel>

            {/* Tab 2: Revisores Disponibles */}
            <TabPanel>
              <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <Heading size="md" mb={4}>Revisores Disponibles</Heading>
                  {revisores.length > 0 ? (
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Nombre</Th>
                          <Th>Email</Th>
                          <Th>Pendientes</Th>
                          <Th>Completadas</Th>
                          <Th>Carga</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {revisores.map((revisor) => (
                          <Tr key={revisor.id}>
                            <Td fontWeight="medium">{revisor.nombre}</Td>
                            <Td>{revisor.email}</Td>
                            <Td>
                              <Badge colorScheme="orange">
                                {revisor.revisiones_pendientes}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge colorScheme="green">
                                {revisor.revisiones_completadas}
                              </Badge>
                            </Td>
                            <Td>
                              <Text fontSize="sm" color={revisor.revisiones_pendientes > 2 ? 'red.500' : 'green.500'}>
                                {revisor.revisiones_pendientes > 2 ? 'Alta' : 'Disponible'}
                              </Text>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Text color="gray.500" textAlign="center" py={8}>
                      No hay revisores disponibles
                    </Text>
                  )}
                </CardBody>
              </Card>
            </TabPanel>

            {/* Tab 3: Asignaciones Activas */}
            <TabPanel>
              <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <Heading size="md" mb={4}>Asignaciones Activas</Heading>
                  {asignaciones.length > 0 ? (
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Artículo</Th>
                          <Th>Autor</Th>
                          <Th>Revisor</Th>
                          <Th>Estado</Th>
                          <Th>Asignado</Th>
                          <Th>Acción</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {asignaciones.map((asignacion) => (
                          <Tr key={asignacion.revision_id}>
                            <Td>
                              <Text fontWeight="medium" maxW="200px" isTruncated>
                                {asignacion.articulo_titulo}
                              </Text>
                            </Td>
                            <Td>{asignacion.autor_nombre}</Td>
                            <Td>{asignacion.revisor_nombre}</Td>
                            <Td>
                              <Badge colorScheme={getBadgeColor(asignacion.revision_estado)}>
                                {asignacion.revision_estado}
                              </Badge>
                            </Td>
                            <Td>{new Date(asignacion.fecha_asignacion).toLocaleDateString()}</Td>
                            <Td>
                              {asignacion.revision_estado === 'pendiente' && (
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  variant="outline"
                                  onClick={() => handleCancelarAsignacion(
                                    asignacion.revision_id,
                                    asignacion.articulo_titulo
                                  )}
                                >
                                  Cancelar
                                </Button>
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Text color="gray.500" textAlign="center" py={8}>
                      No hay asignaciones activas
                    </Text>
                  )}
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Modal de Asignación */}
      <CustomModal isOpen={isOpen} onClose={onClose} size="lg" title="Asignar Revisor">
            {selectedArticulo && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold">Artículo:</Text>
                  <Text>{selectedArticulo.titulo}</Text>
                  <Text fontSize="sm" color="gray.600">
                    Autor: {selectedArticulo.autor_nombre}
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>Seleccionar Revisor:</Text>
                  <Select
                    placeholder="Selecciona un revisor..."
                    value={selectedRevisor}
                    onChange={(e) => setSelectedRevisor(e.target.value)}
                  >
                    {revisores.map((revisor) => (
                      <option key={revisor.id} value={revisor.id}>
                        {revisor.nombre} - {revisor.revisiones_pendientes} pendientes
                      </option>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>Observaciones (opcional):</Text>
                  <Textarea
                    placeholder="Instrucciones especiales para el revisor..."
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    rows={3}
                  />
                </Box>
              <HStack spacing={3} justify="flex-end" w="100%">
                <Button variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleAsignar}
                  isLoading={submitting}
                  loadingText="Asignando..."
                >
                  Asignar Revisor
                </Button>
              </HStack>
            </VStack>
          )}
      </CustomModal>
    </Box>
  );
};

export default AsignacionesPage;
