// pages/RevisionDetallePage.jsx - Página detallada de revisión con comentarios
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Badge,
  Divider,
  Icon,
  useToast,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  GridItem,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { 
  FiArrowLeft, 
  FiDownload, 
  FiEye, 
  FiClock, 
  FiUser, 
  FiFileText,
  FiMessageSquare,
  FiCheckCircle,
  FiEdit
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { revisionAPI } from '../services/revisionAPI';
import SistemaComentarios from '../components/SistemaComentarios';

const RevisionDetallePage = () => {
  const { revisionId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { usuario } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [revision, setRevision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actualizandoEstado, setActualizandoEstado] = useState(false);
  
  // Estados para el formulario de decisión
  const [decision, setDecision] = useState({
    estado: '',
    comentarios: '',
    recomendaciones: ''
  });

  useEffect(() => {
    if (revisionId) {
      cargarDetalleRevision();
    }
  }, [revisionId]);

  const cargarDetalleRevision = async () => {
    try {
      setLoading(true);
      const response = await revisionAPI.obtenerDetalleRevision(revisionId);
      
      if (response.success) {
        setRevision(response.data);
      } else {
        toast({
          title: 'Error',
          description: response.mensaje || 'No se pudieron cargar los detalles',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error al cargar revisión:', error);
      toast({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const descargarArchivo = async () => {
    try {
      if (!revision?.archivo_ruta) {
        toast({
          title: 'Error',
          description: 'Archivo no disponible',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const response = await revisionAPI.descargarArchivo(revision.articulo_id);
      
      if (response.success) {
        // Crear enlace de descarga
        const link = document.createElement('a');
        link.href = response.data.url;
        link.download = revision.archivo_nombre;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo descargar el archivo',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      toast({
        title: 'Error',
        description: 'Error al descargar el archivo',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const actualizarEstadoRevision = async () => {
    try {
      setActualizandoEstado(true);
      
      const datosActualizacion = {
        estado: decision.estado,
        comentarios_revision: decision.comentarios,
        recomendaciones: decision.recomendaciones
      };

      const response = await revisionAPI.actualizarEstadoRevision(revisionId, datosActualizacion);
      
      if (response.success) {
        toast({
          title: 'Estado actualizado',
          description: 'La revisión ha sido actualizada exitosamente',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Recargar datos
        await cargarDetalleRevision();
        onClose();
        
        // Limpiar formulario
        setDecision({
          estado: '',
          comentarios: '',
          recomendaciones: ''
        });
      } else {
        toast({
          title: 'Error',
          description: response.mensaje || 'No se pudo actualizar el estado',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar el estado',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setActualizandoEstado(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado) => {
    const configs = {
      'pendiente': { colorScheme: 'yellow', text: 'Pendiente' },
      'en_progreso': { colorScheme: 'blue', text: 'En Progreso' },
      'completada': { colorScheme: 'green', text: 'Completada' },
      'rechazada': { colorScheme: 'red', text: 'Rechazada' }
    };
    
    const config = configs[estado] || { colorScheme: 'gray', text: estado };
    
    return (
      <Badge colorScheme={config.colorScheme} size="lg">
        {config.text}
      </Badge>
    );
  };

  const puedeActualizar = () => {
    return usuario?.rol === 'revisor' && revision?.revision_estado !== 'completada';
  };

  if (loading) {
    return (
      <Container maxW="7xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Cargando detalles de la revisión...</Text>
        </VStack>
      </Container>
    );
  }

  if (!revision) {
    return (
      <Container maxW="7xl" py={8}>
        <VStack spacing={4}>
          <Text>No se encontró la revisión solicitada</Text>
          <Button leftIcon={<FiArrowLeft />} onClick={() => navigate('/dashboard')}>
            Volver al Dashboard
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      {/* Header con navegación */}
      <HStack mb={6} justify="space-between">
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => navigate('/dashboard')}
        >
          Volver
        </Button>
        
        <HStack spacing={3}>
          {revision.archivo_ruta && (
            <Button
              leftIcon={<FiDownload />}
              colorScheme="blue"
              variant="outline"
              onClick={descargarArchivo}
            >
              Descargar Archivo
            </Button>
          )}
          
          {puedeActualizar() && (
            <Button
              leftIcon={<FiEdit />}
              colorScheme="green"
              onClick={onOpen}
            >
              Actualizar Estado
            </Button>
          )}
        </HStack>
      </HStack>

      {/* Información principal de la revisión */}
      <Card mb={6}>
        <CardHeader>
          <VStack align="start" spacing={2}>
            <HStack justify="space-between" w="100%">
              <Heading size="lg" color="blue.600">
                {revision.titulo}
              </Heading>
              {getEstadoBadge(revision.revision_estado)}
            </HStack>
            <Text color="gray.600" fontSize="lg">
              Autor: {revision.autor_nombre}
            </Text>
          </VStack>
        </CardHeader>
        
        <CardBody>
          <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
            <GridItem>
              <VStack align="start" spacing={3}>
                <HStack>
                  <Icon as={FiClock} color="blue.500" />
                  <Text fontWeight="semibold">Fecha de Asignación:</Text>
                  <Text>{formatearFecha(revision.fecha_asignacion)}</Text>
                </HStack>
                
                <HStack>
                  <Icon as={FiUser} color="green.500" />
                  <Text fontWeight="semibold">Revisor:</Text>
                  <Text>{revision.revisor_nombre}</Text>
                </HStack>
                
                {revision.archivo_nombre && (
                  <HStack>
                    <Icon as={FiFileText} color="purple.500" />
                    <Text fontWeight="semibold">Archivo:</Text>
                    <Text>{revision.archivo_nombre}</Text>
                  </HStack>
                )}
              </VStack>
            </GridItem>
            
            <GridItem>
              {revision.resumen && (
                <Box>
                  <Text fontWeight="semibold" mb={2}>Resumen:</Text>
                  <Text color="gray.700" lineHeight="1.6">
                    {revision.resumen}
                  </Text>
                </Box>
              )}
            </GridItem>
          </Grid>
          
          {revision.comentarios_revision && (
            <Box mt={4} p={4} bg="gray.50" borderRadius="md">
              <Text fontWeight="semibold" mb={2}>Comentarios de Revisión:</Text>
              <Text color="gray.700" lineHeight="1.6">
                {revision.comentarios_revision}
              </Text>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Pestañas para contenido detallado */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>
            <HStack>
              <Icon as={FiFileText} />
              <Text>Documento</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <Icon as={FiMessageSquare} />
              <Text>Comentarios</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Card>
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Heading size="md">Información del Documento</Heading>
                  
                  {revision.archivo_ruta ? (
                    <Box w="100%">
                      <Text mb={2} fontWeight="semibold">Archivo adjunto:</Text>
                      <HStack p={4} bg="blue.50" borderRadius="md" justify="space-between">
                        <HStack>
                          <Icon as={FiFileText} color="blue.500" />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium">{revision.archivo_nombre}</Text>
                            <Text fontSize="sm" color="gray.600">
                              Subido: {formatearFecha(revision.fecha_creacion)}
                            </Text>
                          </VStack>
                        </HStack>
                        <Button
                          leftIcon={<FiDownload />}
                          colorScheme="blue"
                          size="sm"
                          onClick={descargarArchivo}
                        >
                          Descargar
                        </Button>
                      </HStack>
                    </Box>
                  ) : (
                    <Text color="gray.500" fontStyle="italic">
                      No hay archivo adjunto
                    </Text>
                  )}
                  
                  {revision.resumen && (
                    <Box w="100%">
                      <Text mb={2} fontWeight="semibold">Resumen del artículo:</Text>
                      <Box p={4} bg="gray.50" borderRadius="md">
                        <Text lineHeight="1.7">{revision.resumen}</Text>
                      </Box>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <SistemaComentarios 
              revisionId={revisionId} 
              onComentarioAdded={cargarDetalleRevision}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Modal para actualizar estado */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Actualizar Estado de Revisión</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Nuevo Estado</FormLabel>
                <Select
                  value={decision.estado}
                  onChange={(e) => setDecision({...decision, estado: e.target.value})}
                  placeholder="Seleccionar estado"
                >
                  <option value="en_progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                  <option value="rechazada">Rechazada</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Comentarios de Revisión</FormLabel>
                <Textarea
                  value={decision.comentarios}
                  onChange={(e) => setDecision({...decision, comentarios: e.target.value})}
                  placeholder="Ingrese sus comentarios sobre la revisión"
                  rows={4}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Recomendaciones</FormLabel>
                <Textarea
                  value={decision.recomendaciones}
                  onChange={(e) => setDecision({...decision, recomendaciones: e.target.value})}
                  placeholder="Ingrese recomendaciones para el autor"
                  rows={4}
                />
              </FormControl>
              
              <HStack spacing={3} justify="flex-end" w="100%">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={actualizarEstadoRevision}
                  isLoading={actualizandoEstado}
                  loadingText="Guardando..."
                  isDisabled={!decision.estado}
                >
                  Guardar Cambios
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default RevisionDetallePage;
