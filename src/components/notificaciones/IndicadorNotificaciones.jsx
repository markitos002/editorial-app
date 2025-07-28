// components/notificaciones/IndicadorNotificaciones.jsx - Indicador de notificaciones para navbar
import {
  Box,
  IconButton,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  Spinner,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { BellIcon, ViewIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import notificacionesAPI from '../../services/notificacionesAPI';

const IndicadorNotificaciones = () => {
  const [resumen, setResumen] = useState({ total: 0, noLeidas: 0 });
  const [notificacionesRecientes, setNotificacionesRecientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Cargar resumen y notificaciones recientes
  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar resumen
      const resumenResponse = await notificacionesAPI.obtenerResumen();
      setResumen(resumenResponse.data);
      
      // Cargar últimas 5 notificaciones
      const notifResponse = await notificacionesAPI.obtenerNotificaciones({
        limit: 5,
        page: 1
      });
      setNotificacionesRecientes(notifResponse.notificaciones || []);
      
    } catch (error) {
      console.error('Error al cargar datos de notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar y cada 30 segundos
  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 30000);
    return () => clearInterval(interval);
  }, []);

  // Marcar notificación como leída
  const marcarComoLeida = async (id, event) => {
    event.stopPropagation();
    try {
      await notificacionesAPI.marcarComoLeida(id);
      
      setNotificacionesRecientes(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, leida: true } : notif
        )
      );
      
      setResumen(prev => ({ 
        ...prev, 
        noLeidas: Math.max(0, prev.noLeidas - 1) 
      }));
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo marcar la notificación como leída',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  // Formatear fecha corta
  const formatearFechaCorta = (fecha) => {
    const now = new Date();
    const notifFecha = new Date(fecha);
    const diffMs = now - notifFecha;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return notifFecha.toLocaleDateString();
  };

  // Obtener color por tipo
  const getColorPorTipo = (tipo) => {
    switch (tipo) {
      case 'asignacion': return 'blue.500';
      case 'comentario': return 'green.500';
      case 'estado_articulo': return 'orange.500';
      case 'sistema': return 'purple.500';
      default: return 'gray.500';
    }
  };

  return (
    <Popover 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)}
      placement="bottom-end"
    >
      <PopoverTrigger>
        <Box position="relative">
          <IconButton
            icon={<BellIcon />}
            variant="ghost"
            colorScheme="gray"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Notificaciones"
          />
          {resumen.noLeidas > 0 && (
            <Badge
              position="absolute"
              top="-1"
              right="-1"
              colorScheme="red"
              variant="solid"
              borderRadius="full"
              fontSize="xs"
              minW="18px"
              h="18px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {resumen.noLeidas > 99 ? '99+' : resumen.noLeidas}
            </Badge>
          )}
        </Box>
      </PopoverTrigger>
      
      <PopoverContent 
        w="400px" 
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
        boxShadow="lg"
      >
        <PopoverArrow />
        <PopoverCloseButton />
        
        <PopoverHeader>
          <HStack justify="space-between">
            <Text fontWeight="bold">Notificaciones</Text>
            {resumen.noLeidas > 0 && (
              <Badge colorScheme="red" variant="solid">
                {resumen.noLeidas} nuevas
              </Badge>
            )}
          </HStack>
        </PopoverHeader>
        
        <PopoverBody p={0}>
          {loading ? (
            <Box p={4} textAlign="center">
              <Spinner size="sm" />
              <Text mt={2} fontSize="sm" color="gray.600">
                Cargando...
              </Text>
            </Box>
          ) : (
            <VStack spacing={0} align="stretch">
              {notificacionesRecientes.length === 0 ? (
                <Box p={4} textAlign="center">
                  <Text color="gray.500" fontSize="sm">
                    No tienes notificaciones
                  </Text>
                </Box>
              ) : (
                <>
                  {notificacionesRecientes.map((notif, index) => (
                    <Box key={notif.id}>
                      <Box
                        p={3}
                        bg={notif.leida ? 'transparent' : 'blue.50'}
                        opacity={notif.leida ? 0.7 : 1}
                        cursor="pointer"
                        _hover={{ bg: 'gray.50' }}
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/notificaciones');
                        }}
                      >
                        <HStack align="start" spacing={3}>
                          <Box
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            bg={getColorPorTipo(notif.tipo)}
                            mt={2}
                            flexShrink={0}
                          />
                          
                          <VStack align="start" spacing={1} flex={1}>
                            <HStack justify="space-between" w="100%">
                              <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                {notif.titulo}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {formatearFechaCorta(notif.fecha_creacion)}
                              </Text>
                            </HStack>
                            
                            <Text fontSize="xs" color="gray.600" noOfLines={2}>
                              {notif.mensaje}
                            </Text>
                            
                            {!notif.leida && (
                              <Button
                                size="xs"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={(e) => marcarComoLeida(notif.id, e)}
                                fontSize="xs"
                              >
                                Marcar como leída
                              </Button>
                            )}
                          </VStack>
                        </HStack>
                      </Box>
                      
                      {index < notificacionesRecientes.length - 1 && (
                        <Divider />
                      )}
                    </Box>
                  ))}
                  
                  <Divider />
                  
                  <Box p={3} textAlign="center">
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      leftIcon={<ViewIcon />}
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/notificaciones');
                      }}
                      w="100%"
                    >
                      Ver todas las notificaciones
                    </Button>
                  </Box>
                </>
              )}
            </VStack>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default IndicadorNotificaciones;
