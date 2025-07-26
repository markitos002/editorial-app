// FormularioRevision.jsx - Componente para revisar documentos en detalle
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Divider,
  useToast,
  Spinner,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Icon,
  Tooltip,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { FiSave, FiCheck, FiDownload, FiInfo, FiArrowLeft } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { revisionAPI } from '../services/revisionAPI';

const FormularioRevision = () => {
  const { revisionId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Estados del componente
  const [revision, setRevision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [completando, setCompletando] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    observaciones: '',
    calificacion: '',
    recomendacion: 'revisar', // 'aceptar', 'revisar', 'rechazar'
    observacionesPrivadas: ''
  });

  const [cambiosSinGuardar, setCambiosSinGuardar] = useState(false);

  // Cargar datos de la revisión
  useEffect(() => {
    if (revisionId) {
      cargarRevision();
    }
  }, [revisionId]);

  // Detectar cambios no guardados
  useEffect(() => {
    const datosIniciales = {
      observaciones: revision?.observaciones || '',
      calificacion: revision?.calificacion || '',
      recomendacion: 'revisar',
      observacionesPrivadas: ''
    };

    const hayCambios = Object.keys(formData).some(
      key => formData[key] !== datosIniciales[key]
    );

    setCambiosSinGuardar(hayCambios);
  }, [formData, revision]);

  const cargarRevision = async () => {
    try {
      setLoading(true);
      const response = await revisionAPI.obtenerDetalleRevision(revisionId);
      
      if (response.success) {
        setRevision(response.data);
        setFormData({
          observaciones: response.data.observaciones || '',
          calificacion: response.data.calificacion || '',
          recomendacion: 'revisar',
          observacionesPrivadas: ''
        });
      } else {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los datos de la revisión',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        navigate('/revision');
      }
    } catch (error) {
      toast({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      navigate('/revision');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const guardarProgreso = async () => {
    try {
      setGuardando(true);
      
      const datos = {
        observaciones: formData.observaciones,
        calificacion: formData.calificacion ? parseInt(formData.calificacion) : null
      };

      const response = await revisionAPI.guardarProgreso(revisionId, datos);
      
      if (response.success) {
        toast({
          title: 'Progreso guardado',
          description: 'Los cambios se han guardado correctamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setCambiosSinGuardar(false);
        
        // Actualizar los datos locales
        setRevision(prev => ({
          ...prev,
          observaciones: formData.observaciones,
          calificacion: formData.calificacion
        }));
      } else {
        toast({
          title: 'Error al guardar',
          description: response.mensaje || 'No se pudo guardar el progreso',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el progreso',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setGuardando(false);
    }
  };

  const completarRevision = async () => {
    try {
      setCompletando(true);
      
      // Validaciones
      if (!formData.observaciones.trim()) {
        toast({
          title: 'Campos requeridos',
          description: 'Las observaciones son obligatorias para completar la revisión',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (!formData.calificacion) {
        toast({
          title: 'Campos requeridos',
          description: 'La calificación es obligatoria para completar la revisión',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const datos = {
        observaciones: formData.observaciones,
        calificacion: parseInt(formData.calificacion),
        recomendacion: formData.recomendacion,
        observaciones_privadas: formData.observacionesPrivadas
      };

      const response = await revisionAPI.completarRevision(revisionId, datos);
      
      if (response.success) {
        toast({
          title: 'Revisión completada',
          description: 'La revisión se ha completado exitosamente',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/revision');
      } else {
        toast({
          title: 'Error al completar',
          description: response.mensaje || 'No se pudo completar la revisión',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo completar la revisión',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setCompletando(false);
      onClose();
    }
  };

  const descargarDocumento = async () => {
    try {
      await revisionAPI.descargarDocumento(revisionId);
      toast({
        title: 'Descarga iniciada',
        description: 'El documento se está descargando',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error en descarga',
        description: 'No se pudo descargar el documento',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const calcularProgreso = () => {
    let completado = 0;
    const total = 3; // observaciones, calificacion, recomendacion

    if (formData.observaciones.trim()) completado++;
    if (formData.calificacion) completado++;
    if (formData.recomendacion !== 'revisar') completado++;

    return (completado / total) * 100;
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="lg" />
          <Text>Cargando revisión...</Text>
        </VStack>
      </Container>
    );
  }

  if (!revision) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No se pudo cargar la revisión solicitada.</AlertDescription>
        </Alert>
      </Container>
    );
  }

  const progreso = calcularProgreso();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header con navegación */}
        <HStack justify="space-between" align="center">
          <HStack>
            <Button
              leftIcon={<FiArrowLeft />}
              variant="ghost"
              onClick={() => navigate('/revision')}
            >
              Volver a Mis Revisiones
            </Button>
          </HStack>
          
          <HStack>
            {revision.archivo_nombre && (
              <Button
                leftIcon={<FiDownload />}
                variant="outline"
                onClick={descargarDocumento}
              >
                Descargar Documento
              </Button>
            )}
          </HStack>
        </HStack>

        {/* Información del artículo */}
        <Card>
          <CardHeader>
            <HStack justify="space-between" align="start">
              <VStack align="start" spacing={2}>
                <Heading size="lg">{revision.titulo}</Heading>
                <Text color="gray.600">
                  Autor: {revision.autor_nombre} ({revision.autor_email})
                </Text>
                {revision.archivo_nombre && (
                  <Text color="gray.500" fontSize="sm">
                    Archivo: {revision.archivo_nombre} ({(revision.archivo_size / 1024).toFixed(1)} KB)
                  </Text>
                )}
              </VStack>
              
              <VStack align="end">
                <Badge colorScheme="blue" fontSize="sm">
                  {revision.estado === 'pendiente' ? 'Pendiente' : 
                   revision.estado === 'en_progreso' ? 'En Progreso' : 
                   revision.estado === 'completada' ? 'Completada' : revision.estado}
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  Asignado: {new Date(revision.fecha_asignacion).toLocaleDateString()}
                </Text>
              </VStack>
            </HStack>
          </CardHeader>
        </Card>

        {/* Progreso de revisión */}
        <Card>
          <CardBody>
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text fontWeight="semibold">Progreso de Revisión</Text>
                <Text fontSize="sm" color="gray.600">{Math.round(progreso)}% completado</Text>
              </HStack>
              <Progress value={progreso} colorScheme="blue" size="lg" />
            </VStack>
          </CardBody>
        </Card>

        {/* Formulario de revisión */}
        <Card>
          <CardHeader>
            <Heading size="md">Formulario de Revisión</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {/* Observaciones */}
              <FormControl isRequired>
                <FormLabel>Observaciones para el Autor</FormLabel>
                <Textarea
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  placeholder="Escribe tus observaciones, comentarios y sugerencias para el autor..."
                  minH="150px"
                  resize="vertical"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Estas observaciones serán visibles para el autor del artículo.
                </Text>
              </FormControl>

              {/* Calificación */}
              <FormControl isRequired>
                <FormLabel>Calificación (1-10)</FormLabel>
                <NumberInput
                  value={formData.calificacion}
                  onChange={(value) => handleInputChange('calificacion', value)}
                  min={1}
                  max={10}
                  step={1}
                >
                  <NumberInputField placeholder="Selecciona una calificación del 1 al 10" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              {/* Recomendación */}
              <FormControl isRequired>
                <FormLabel>Recomendación Final</FormLabel>
                <Select
                  value={formData.recomendacion}
                  onChange={(e) => handleInputChange('recomendacion', e.target.value)}
                >
                  <option value="revisar">En revisión (borrador)</option>
                  <option value="aceptar">Aceptar para publicación</option>
                  <option value="revisar_cambios">Aceptar con cambios menores</option>
                  <option value="rechazar">Rechazar</option>
                </Select>
              </FormControl>

              {/* Observaciones privadas */}
              <FormControl>
                <FormLabel>
                  Observaciones Privadas 
                  <Tooltip label="Estas observaciones solo las verán los editores, no el autor">
                    <Icon as={FiInfo} ml={1} color="gray.400" />
                  </Tooltip>
                </FormLabel>
                <Textarea
                  value={formData.observacionesPrivadas}
                  onChange={(e) => handleInputChange('observacionesPrivadas', e.target.value)}
                  placeholder="Comentarios internos solo para editores..."
                  minH="100px"
                  resize="vertical"
                />
              </FormControl>

              <Divider />

              {/* Botones de acción */}
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.500">
                  {cambiosSinGuardar && (
                    <Text color="orange.500">
                      ⚠️ Tienes cambios sin guardar
                    </Text>
                  )}
                </Text>

                <ButtonGroup spacing={3}>
                  <Button
                    leftIcon={<FiSave />}
                    onClick={guardarProgreso}
                    isLoading={guardando}
                    loadingText="Guardando..."
                    variant="outline"
                    isDisabled={!cambiosSinGuardar}
                  >
                    Guardar Progreso
                  </Button>
                  
                  <Button
                    leftIcon={<FiCheck />}
                    colorScheme="green"
                    onClick={onOpen}
                    isDisabled={!formData.observaciones.trim() || !formData.calificacion}
                  >
                    Completar Revisión
                  </Button>
                </ButtonGroup>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Modal de confirmación */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmar Completar Revisión</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="stretch" spacing={4}>
                <Alert status="info">
                  <AlertIcon />
                  <AlertDescription>
                    Una vez completada, no podrás modificar esta revisión. ¿Estás seguro de que quieres continuar?
                  </AlertDescription>
                </Alert>
                
                <Box>
                  <Text fontWeight="semibold" mb={2}>Resumen de tu revisión:</Text>
                  <VStack align="stretch" spacing={2} fontSize="sm">
                    <HStack>
                      <Text fontWeight="semibold">Calificación:</Text>
                      <Text>{formData.calificacion}/10</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="semibold">Recomendación:</Text>
                      <Text>{
                        formData.recomendacion === 'aceptar' ? 'Aceptar para publicación' :
                        formData.recomendacion === 'revisar_cambios' ? 'Aceptar con cambios menores' :
                        formData.recomendacion === 'rechazar' ? 'Rechazar' : 'En revisión'
                      }</Text>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            </ModalBody>
            
            <ModalFooter>
              <ButtonGroup spacing={3}>
                <Button variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="green"
                  onClick={completarRevision}
                  isLoading={completando}
                  loadingText="Completando..."
                >
                  Sí, Completar Revisión
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default FormularioRevision;
