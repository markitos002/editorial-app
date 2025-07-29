// components/notificaciones/CentroNotificaciones.jsx - Centro de notificaciones
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  IconButton,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  useColorModeValue,
  useToast,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip
} from '@chakra-ui/react';
import { 
  BellIcon, 
  CheckIcon, 
  InfoIcon,
  ChatIcon,
  EmailIcon,
  SettingsIcon,
  TimeIcon
} from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import notificacionesAPI from '../../services/notificacionesAPI';

const CentroNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [resumen, setResumen] = useState({ total: 0, noLeidas: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ leido: undefined, tipo: undefined });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Cargar notificaciones
  const cargarNotificaciones = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: reset ? 1 : page,
        limit: 10,
        ...filtros
      };
      
      const response = await notificacionesAPI.obtenerNotificaciones(params);
      
      if (reset) {
        setNotificaciones(response.notificaciones || []);
        setPage(1);
      } else {
        setNotificaciones(prev => [...prev, ...(response.notificaciones || [])]);
      }
      
      setResumen({
        total: response.total_notificaciones || 0,
        noLeidas: response.notificaciones_no_leidas || 0
      });
      
      const pagination = response.pagination || {};
      setHasMore((pagination.current_page || 1) < (pagination.total_pages || 1));
      
    } catch (error) {
      setError(error.message);
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar resumen
  const cargarResumen = async () => {
    try {
      const response = await notificacionesAPI.obtenerResumen();
      setResumen(response.data);
    } catch (error) {
      console.error('Error al cargar resumen:', error);
    }
  };

  useEffect(() => {
    cargarNotificaciones(true);
    cargarResumen();
  }, [filtros]);

  // Marcar como leída
  const marcarComoLeida = async (id) => {
    try {
      await notificacionesAPI.marcarComoLeida(id);
      
      setNotificaciones(prev => 
        prev.map(notif => 
          notif.id === id 
            ? { ...notif, leida: true, fecha_lectura: new Date().toISOString() }
            : notif
        )
      );
      
      setResumen(prev => ({ 
        ...prev, 
        noLeidas: Math.max(0, prev.noLeidas - 1) 
      }));
      
      toast({
        title: 'Notificación marcada como leída',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
      
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  // Marcar todas como leídas
  const marcarTodasComoLeidas = async () => {
    try {
      const response = await notificacionesAPI.marcarTodasComoLeidas();
      
      setNotificaciones(prev => 
        prev.map(notif => ({ 
          ...notif, 
          leida: true, 
          fecha_lectura: new Date().toISOString() 
        }))
      );
      
      setResumen(prev => ({ ...prev, noLeidas: 0 }));
      
      toast({
        title: 'Todas las notificaciones marcadas como leídas',
        description: `${response.data.actualizadas} notificaciones actualizadas`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  // Obtener icono por tipo de notificación
  const getIconoPorTipo = (tipo) => {
    switch (tipo) {
      case 'asignacion': return <EmailIcon color="blue.500" />;
      case 'comentario': return <ChatIcon color="green.500" />;
      case 'estado_articulo': return <InfoIcon color="orange.500" />;
      case 'sistema': return <SettingsIcon color="purple.500" />;
      default: return <BellIcon color="gray.500" />;
    }
  };

  // Obtener color de badge por tipo
  const getColorBadge = (tipo) => {
    switch (tipo) {
      case 'asignacion': return 'blue';
      case 'comentario': return 'green';
      case 'estado_articulo': return 'orange';
      case 'sistema': return 'purple';
      default: return 'gray';
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    const now = new Date();
    const notifFecha = new Date(fecha);
    const diffMs = now - notifFecha;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return notifFecha.toLocaleDateString();
  };

  if (loading && notificaciones.length === 0) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="lg" color="blue.500" />
        <Text mt={2} color="gray.600">Cargando notificaciones...</Text>
      </Box>
    );
  }

  return (
    <Box maxW="4xl" mx="auto" p={6}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <VStack align="start" spacing={1}>
          <HStack>
            <BellIcon boxSize={6} color="blue.500" />
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              Centro de Notificaciones
            </Text>
            {resumen.noLeidas > 0 && (
              <Badge colorScheme="red" variant="solid" borderRadius="full">
                {resumen.noLeidas}
              </Badge>
            )}
          </HStack>
          <Text color="gray.600" fontSize="sm">
            {resumen.total} notificaciones totales • {resumen.noLeidas} sin leer
          </Text>
        </VStack>

        <HStack>
          {resumen.noLeidas > 0 && (
            <Button
              size="sm"
              colorScheme="blue"
              variant="outline"
              leftIcon={<CheckIcon />}
              onClick={marcarTodasComoLeidas}
            >
              Marcar todas como leídas
            </Button>
          )}
          
          <Menu>
            <MenuButton as={IconButton} icon={<SettingsIcon />} variant="ghost" />
            <MenuList>
              <MenuItem onClick={() => setFiltros({ leido: false })}>
                Solo no leídas
              </MenuItem>
              <MenuItem onClick={() => setFiltros({ tipo: 'asignacion' })}>
                Solo asignaciones
              </MenuItem>
              <MenuItem onClick={() => setFiltros({ tipo: 'comentario' })}>
                Solo comentarios
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => setFiltros({})}>
                Mostrar todas
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Error */}
      {error && (
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon />
          <AlertTitle>Error al cargar notificaciones</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Lista de notificaciones */}
      <VStack spacing={3} align="stretch">
        {notificaciones.map((notif) => (
          <Box
            key={notif.id}
            bg={bgColor}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="lg"
            p={4}
            opacity={notif.leida ? 0.7 : 1}
            borderLeft="4px solid"
            borderLeftColor={notif.leida ? 'gray.300' : `${getColorBadge(notif.tipo)}.400`}
            transition="all 0.2s"
            _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
          >
            <HStack align="start" spacing={4}>
              <Avatar size="sm" icon={getIconoPorTipo(notif.tipo)} />
              
              <VStack align="start" flex={1} spacing={2}>
                <HStack justify="space-between" w="100%">
                  <HStack>
                    <Badge 
                      colorScheme={getColorBadge(notif.tipo)} 
                      variant="subtle"
                      textTransform="capitalize"
                    >
                      {notif.tipo.replace('_', ' ')}
                    </Badge>
                    {!notif.leida && (
                      <Badge colorScheme="red" variant="solid" size="sm">
                        Nueva
                      </Badge>
                    )}
                  </HStack>
                  
                  <HStack spacing={2}>
                    <Tooltip label={new Date(notif.fecha_creacion).toLocaleString()}>
                      <HStack spacing={1} color="gray.500" fontSize="xs">
                        <TimeIcon />
                        <Text>{formatearFecha(notif.fecha_creacion)}</Text>
                      </HStack>
                    </Tooltip>
                    
                    {!notif.leida && (
                      <IconButton
                        size="xs"
                        icon={<CheckIcon />}
                        colorScheme="green"
                        variant="ghost"
                        onClick={() => marcarComoLeida(notif.id)}
                        aria-label="Marcar como leída"
                      />
                    )}
                  </HStack>
                </HStack>
                
                <Text fontWeight="semibold" fontSize="md">
                  {notif.titulo}
                </Text>
                
                <Text color="gray.600" fontSize="sm">
                  {notif.mensaje}
                </Text>
                
                {notif.articulo_titulo && (
                  <Text color="blue.600" fontSize="xs" fontStyle="italic">
                    📄 Artículo: {notif.articulo_titulo}
                  </Text>
                )}
              </VStack>
            </HStack>
          </Box>
        ))}
      </VStack>

      {/* Cargar más */}
      {hasMore && !loading && (
        <Box textAlign="center" mt={6}>
          <Button
            onClick={() => {
              setPage(prev => prev + 1);
              cargarNotificaciones();
            }}
            isLoading={loading}
            colorScheme="blue"
            variant="outline"
          >
            Cargar más notificaciones
          </Button>
        </Box>
      )}

      {/* Sin notificaciones */}
      {notificaciones.length === 0 && !loading && (
        <Box textAlign="center" py={10}>
          <BellIcon boxSize={12} color="gray.400" mb={4} />
          <Text fontSize="lg" color="gray.500" mb={2}>
            No tienes notificaciones
          </Text>
          <Text color="gray.400" fontSize="sm">
            Las notificaciones aparecerán aquí cuando recibas actualizaciones del sistema
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default CentroNotificaciones;
