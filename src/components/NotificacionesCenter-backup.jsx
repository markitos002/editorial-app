// components/NotificacionesCenter.jsx - Centro de notificaciones
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  useToast,
  Spinner,
  Card,
  CardBody,
  Heading,
  Divider,
  useColorModeValue,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverHeader,
  PopoverCloseButton,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure
} from '@chakra-ui/react';
import { 
  FiBell, 
  FiCheck, 
  FiX, 
  FiCheckCircle, 
  FiClock,
  FiMoreVertical,
  FiTrash2,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import notificacionesService from '../services/notificacionesService';

const NotificacionesCenter = ({ triggerComponent }) => {
  const { usuario } = useAuth();
  const toast = useToast();
  const { isOpen, onToggle, onClose } = useDisclosure();
  
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noLeidas, setNoLeidas] = useState(0);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (usuario && isOpen) {
      cargarNotificaciones();
    }
  }, [usuario, isOpen]);

  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      const response = await notificacionesService.obtenerNotificaciones({
        limit: 10
      });
      
      setNotificaciones(response.notificaciones || []);
      setNoLeidas(response.notificaciones_no_leidas || 0);
      
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las notificaciones',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLeida = async (notificacionId) => {
    try {
      await notificacionesService.marcarComoLeida(notificacionId);
      
      // Actualizar estado local
      setNotificaciones(prev => 
        prev.map(n => 
          n.id === notificacionId ? { ...n, leida: true } : n
        )
      );
      setNoLeidas(prev => Math.max(0, prev - 1));
      
    } catch (error) {
      console.error('Error al marcar como leída:', error);
      toast({
        title: 'Error',
        description: 'No se pudo marcar la notificación como leída',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const marcarComoNoLeida = async (notificacionId) => {
    try {
      await notificacionesService.marcarComoNoLeida(notificacionId);
      
      // Actualizar estado local
      setNotificaciones(prev => 
        prev.map(n => 
          n.id === notificacionId ? { ...n, leida: false } : n
        )
      );
      setNoLeidas(prev => prev + 1);
      
    } catch (error) {
      console.error('Error al marcar como no leída:', error);
      toast({
        title: 'Error',
        description: 'No se pudo marcar la notificación como no leída',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const marcarTodasComoLeidas = async () => {
    try {
      await notificacionesService.marcarTodasComoLeidas(usuario.id);
      
      // Actualizar estado local
      setNotificaciones(prev => 
        prev.map(n => ({ ...n, leida: true }))
      );
      setNoLeidas(0);
      
      toast({
        title: 'Éxito',
        description: 'Todas las notificaciones marcadas como leídas',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron marcar todas las notificaciones',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const eliminarNotificacion = async (notificacionId) => {
    try {
      await notificacionesService.eliminarNotificacion(notificacionId);
      
      // Actualizar estado local
      const notificacionEliminada = notificaciones.find(n => n.id === notificacionId);
      setNotificaciones(prev => prev.filter(n => n.id !== notificacionId));
      
      if (notificacionEliminada && !notificacionEliminada.leida) {
        setNoLeidas(prev => Math.max(0, prev - 1));
      }
      
      toast({
        title: 'Éxito',
        description: 'Notificación eliminada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la notificación',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getTipoIcon = (tipo) => {
    const iconProps = { size: '16px' };
    switch (tipo) {
      case 'success': return <FiCheckCircle color="green" {...iconProps} />;
      case 'warning': return <FiClock color="orange" {...iconProps} />;
      case 'error': return <FiX color="red" {...iconProps} />;
      default: return <FiBell color="blue" {...iconProps} />;
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'success': return 'green';
      case 'warning': return 'orange';
      case 'error': return 'red';
      default: return 'blue';
    }
  };

  const formatearFecha = (fecha) => {
    const ahora = new Date();
    const fechaNotif = new Date(fecha);
    const diffMs = ahora - fechaNotif;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHoras < 24) return `${diffHoras}h`;
    return `${diffDias}d`;
  };

  const TriggerButton = triggerComponent || (
    <IconButton
      icon={<FiBell />}
      variant="ghost"
      position="relative"
      onClick={onToggle}
      aria-label="Notificaciones"
    >
      {noLeidas > 0 && (
        <Badge
          colorScheme="red"
          borderRadius="full"
          position="absolute"
          top="-1"
          right="-1"
          fontSize="xs"
          minWidth="20px"
          height="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {noLeidas > 99 ? '99+' : noLeidas}
        </Badge>
      )}
    </IconButton>
  );

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-end"
      closeOnBlur={true}
    >
      <PopoverTrigger>
        {TriggerButton}
      </PopoverTrigger>
      
      <PopoverContent 
        w="400px" 
        maxH="500px" 
        bg={bgColor}
        borderColor={borderColor}
        borderRadius="lg"
        boxShadow="lg"
      >
        <PopoverArrow />
        <PopoverCloseButton />
        
        <PopoverHeader p={4}>
          <HStack justify="space-between">
            <Heading size="sm">
              Notificaciones {noLeidas > 0 && `(${noLeidas})`}
            </Heading>
            {notificaciones.length > 0 && (
              <Button
                size="xs"
                variant="ghost"
                onClick={marcarTodasComoLeidas}
                leftIcon={<FiCheckCircle />}
              >
                Marcar todas
              </Button>
            )}
          </HStack>
        </PopoverHeader>
        
        <PopoverBody p={0} maxH="400px" overflowY="auto">
          {loading ? (
            <VStack p={4}>
              <Spinner size="md" />
              <Text fontSize="sm" color="gray.500">
                Cargando notificaciones...
              </Text>
            </VStack>
          ) : notificaciones.length === 0 ? (
            <VStack p={6} spacing={3}>
              <Icon as={FiBell} size="40px" color="gray.400" />
              <Text color="gray.500" textAlign="center">
                No tienes notificaciones
              </Text>
            </VStack>
          ) : (
            <VStack spacing={0} align="stretch">
              {notificaciones.map((notif, index) => (
                <Box key={notif.id}>
                  <HStack
                    p={3}
                    spacing={3}
                    align="start"
                    bg={!notif.leida ? 'blue.50' : 'transparent'}
                    _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                    transition="all 0.2s"
                    cursor="pointer"
                    onClick={() => !notif.leida && marcarComoLeida(notif.id)}
                  >
                    <Box mt={1}>
                      {getTipoIcon(notif.tipo)}
                    </Box>
                    
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack w="100%" justify="space-between">
                        <Text 
                          fontSize="sm" 
                          fontWeight={!notif.leida ? "bold" : "normal"}
                          color={!notif.leida ? "gray.900" : "gray.600"}
                          noOfLines={1}
                        >
                          {notif.titulo}
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                          {formatearFecha(notif.fecha_creacion)}
                        </Text>
                      </HStack>
                      
                      <Text 
                        fontSize="xs" 
                        color="gray.600"
                        noOfLines={2}
                        lineHeight="1.3"
                      >
                        {notif.mensaje}
                      </Text>
                      
                      {notif.articulo_titulo && (
                        <Badge 
                          size="sm" 
                          colorScheme={getTipoColor(notif.tipo)}
                          variant="subtle"
                        >
                          {notif.articulo_titulo}
                        </Badge>
                      )}
                    </VStack>
                    
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <MenuList>
                        <MenuItem
                          icon={notif.leida ? <FiEyeOff /> : <FiEye />}
                          onClick={(e) => {
                            e.stopPropagation();
                            notif.leida ? marcarComoNoLeida(notif.id) : marcarComoLeida(notif.id);
                          }}
                        >
                          {notif.leida ? 'Marcar como no leída' : 'Marcar como leída'}
                        </MenuItem>
                        <MenuItem
                          icon={<FiTrash2 />}
                          color="red.500"
                          onClick={(e) => {
                            e.stopPropagation();
                            eliminarNotificacion(notif.id);
                          }}
                        >
                          Eliminar
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                  
                  {index < notificaciones.length - 1 && <Divider />}
                </Box>
              ))}
            </VStack>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default NotificacionesCenter;
