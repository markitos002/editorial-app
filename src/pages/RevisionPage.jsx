// RevisionPage.jsx - Página principal para revisión de documentos
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Divider,
  Icon,
  useDisclosure
} from '@chakra-ui/react';
import CustomModal from '../components/CustomModal';
import CustomTooltip from '../components/CustomTooltip';
import { FiEye, FiDownload, FiEdit, FiClock, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { revisionAPI } from '../services/revisionAPI';
import { useAuth } from '../context/AuthContext';

// Componente para mostrar el estado de una revisión
const EstadoBadge = ({ estado }) => {
  const colorScheme = {
    'pendiente': 'yellow',
    'en_progreso': 'blue',
    'completada': 'green',
    'rechazada': 'red'
  };

  const texto = {
    'pendiente': 'Pendiente',
    'en_progreso': 'En Progreso',
    'completada': 'Completada',
    'rechazada': 'Rechazada'
  };

  return (
    <Badge colorScheme={colorScheme[estado] || 'gray'}>
      {texto[estado] || estado}
    </Badge>
  );
};

// Componente para mostrar información básica de una revisión
const RevisionCard = ({ revision, onVerDetalle, onDescargar }) => {
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const formatearTamaño = (bytes) => {
    return bytes ? `${(bytes / 1024).toFixed(1)} KB` : 'N/A';
  };

  return (
    <Card mb={4} variant="outline">
      <CardHeader pb={2}>
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Heading size="md" color="blue.600">
              {revision.titulo}
            </Heading>
            <Text color="gray.600" fontSize="sm">
              Por: {revision.autor_nombre}
            </Text>
          </VStack>
          <EstadoBadge estado={revision.revision_estado} />
        </HStack>
      </CardHeader>
      
      <CardBody pt={0}>
        <VStack align="start" spacing={2} mb={4}>
          <HStack>
            <Icon as={FiClock} color="gray.500" />
            <Text fontSize="sm" color="gray.600">
              Asignado: {formatearFecha(revision.fecha_asignacion)}
            </Text>
          </HStack>
          
          {revision.archivo_nombre && (
            <HStack>
              <Icon as={FiDownload} color="gray.500" />
              <Text fontSize="sm" color="gray.600">
                {revision.archivo_nombre} ({formatearTamaño(revision.archivo_size)})
              </Text>
            </HStack>
          )}
          
          {revision.calificacion && (
            <HStack>
              <Icon as={FiCheckCircle} color="green.500" />
              <Text fontSize="sm" color="gray.600">
                Calificación: {revision.calificacion}/10
              </Text>
            </HStack>
          )}
        </VStack>

        <HStack spacing={2}>
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<FiEye />}
            onClick={() => onVerDetalle(revision)}
          >
            Ver Detalles
          </Button>
          
          <Button
            size="sm"
            colorScheme="green"
            leftIcon={<FiMessageSquare />}
            onClick={() => navigate(`/revision/${revision.revision_id}/detalle`)}
          >
            Comentarios
          </Button>
          
          {revision.archivo_nombre && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<FiDownload />}
              onClick={() => onDescargar(revision.revision_id)}
            >
              Descargar
            </Button>
          )}
        </HStack>
      </CardBody>
    </Card>
  );
};

// Componente principal de la página
const RevisionPage = () => {
  const [revisiones, setRevisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRevision, setSelectedRevision] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  // Cargar revisiones al montar el componente
  useEffect(() => {
    cargarRevisiones();
  }, []);

  const cargarRevisiones = async () => {
    try {
      setLoading(true);
      const response = await revisionAPI.obtenerMisRevisiones();
      
      if (response.success) {
        setRevisiones(response.data);
      } else {
        toast({
          title: 'Error',
          description: response.mensaje || 'No se pudieron cargar las revisiones',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
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

  const verDetalle = async (revision) => {
    try {
      const response = await revisionAPI.obtenerDetalleRevision(revision.revision_id);
      
      if (response.success) {
        setSelectedRevision(response.data);
        onOpen();
      } else {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los detalles',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo obtener el detalle de la revisión',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const descargarDocumento = async (revisionId) => {
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

  const contarPorEstado = (estado) => {
    return revisiones.filter(r => r.revision_estado === estado).length;
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="lg" />
          <Text>Cargando revisiones...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading mb={2}>Mis Revisiones</Heading>
          <Text color="gray.600">
            Bienvenido, {usuario?.nombre}. Aquí puedes ver y gestionar tus revisiones asignadas.
          </Text>
        </Box>

        {/* Estadísticas rápidas */}
        <HStack spacing={4} wrap="wrap">
          <Card minW="150px">
            <CardBody textAlign="center" py={4}>
              <Text fontSize="2xl" fontWeight="bold" color="yellow.500">
                {contarPorEstado('pendiente')}
              </Text>
              <Text fontSize="sm" color="gray.600">Pendientes</Text>
            </CardBody>
          </Card>
          
          <Card minW="150px">
            <CardBody textAlign="center" py={4}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                {contarPorEstado('en_progreso')}
              </Text>
              <Text fontSize="sm" color="gray.600">En Progreso</Text>
            </CardBody>
          </Card>
          
          <Card minW="150px">
            <CardBody textAlign="center" py={4}>
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                {contarPorEstado('completada')}
              </Text>
              <Text fontSize="sm" color="gray.600">Completadas</Text>
            </CardBody>
          </Card>
        </HStack>

        <Divider />

        {/* Lista de revisiones */}
        {revisiones.length === 0 ? (
          <Card>
            <CardBody textAlign="center" py={8}>
              <Text color="gray.500">No tienes revisiones asignadas en este momento.</Text>
            </CardBody>
          </Card>
        ) : (
          <VStack spacing={4} align="stretch">
            {revisiones.map((revision) => (
              <RevisionCard
                key={revision.revision_id}
                revision={revision}
                onVerDetalle={verDetalle}
                onDescargar={descargarDocumento}
              />
            ))}
          </VStack>
        )}

        {/* Modal de detalles */}
        <CustomModal 
          isOpen={isOpen} 
          onClose={onClose} 
          size="xl"
          title="Detalles de Revisión"
        >
          {selectedRevision && (
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="bold">Título:</Text>
                <Text>{selectedRevision.titulo}</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">Autor:</Text>
                <Text>{selectedRevision.autor_nombre} ({selectedRevision.autor_email})</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">Estado:</Text>
                <EstadoBadge estado={selectedRevision.estado} />
              </Box>
              
              {selectedRevision.observaciones && (
                <Box>
                  <Text fontWeight="bold">Observaciones actuales:</Text>
                  <Text bg="gray.50" p={3} borderRadius="md">
                    {selectedRevision.observaciones}
                  </Text>
                </Box>
              )}
              
              {selectedRevision.calificacion && (
                <Box>
                  <Text fontWeight="bold">Calificación:</Text>
                  <Text fontSize="lg" color="blue.600">
                    {selectedRevision.calificacion}/10
                  </Text>
                </Box>
              )}
              
              <HStack spacing={2} pt={4}>
                <Button
                  colorScheme="blue"
                  leftIcon={<FiEdit />}
                  onClick={() => {
                    onClose();
                    navigate(`/revision/${selectedRevision.revision_id}`);
                  }}
                >
                  Editar Revisión
                </Button>
                
                {selectedRevision.archivo_nombre && (
                  <Button
                    variant="outline"
                    leftIcon={<FiDownload />}
                    onClick={() => descargarDocumento(selectedRevision.revision_id)}
                  >
                    Descargar Documento
                  </Button>
                )}
              </HStack>
            </VStack>
          )}
        </CustomModal>
      </VStack>
    </Container>
  );
};

export default RevisionPage;
