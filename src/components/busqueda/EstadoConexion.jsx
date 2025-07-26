// components/busqueda/EstadoConexion.jsx - Indicador sutil de estado de conexión
import {
  Box,
  HStack,
  Text,
  Circle,
  Spinner,
  useColorModeValue,
  Tooltip
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { busquedaAPI } from '../../services/busquedaAPI';

const EstadoConexion = () => {
  const [estado, setEstado] = useState('verificando');
  const [ultimaVerificacion, setUltimaVerificacion] = useState(null);
  
  const bgColor = useColorModeValue('rgba(255,255,255,0.8)', 'rgba(26,32,44,0.8)');

  useEffect(() => {
    verificarConexion();
    // Verificar cada 30 segundos
    const interval = setInterval(verificarConexion, 30000);
    return () => clearInterval(interval);
  }, []);

  const verificarConexion = async () => {
    try {
      setEstado('verificando');
      await busquedaAPI.obtenerOpcionesFiltros();
      setEstado('conectado');
      setUltimaVerificacion(new Date());
    } catch (error) {
      console.error('Error de conexión:', error);
      setEstado('desconectado');
      setUltimaVerificacion(new Date());
    }
  };

  const getEstadoColor = () => {
    switch (estado) {
      case 'conectado': return 'green.400';
      case 'desconectado': return 'red.400';
      case 'verificando': return 'yellow.400';
      default: return 'gray.400';
    }
  };

  const getTooltipText = () => {
    const estadoTexto = {
      conectado: 'Servidor conectado',
      desconectado: 'Servidor desconectado',
      verificando: 'Verificando conexión...'
    }[estado] || 'Estado desconocido';
    
    const tiempo = ultimaVerificacion 
      ? ` - Última verificación: ${ultimaVerificacion.toLocaleTimeString()}`
      : '';
    
    return estadoTexto + tiempo;
  };

  return (
    <Tooltip label={getTooltipText()} fontSize="sm" placement="top">
      <Box 
        position="fixed"
        bottom="20px"
        right="20px"
        bg={bgColor}
        p={2}
        borderRadius="full"
        border="1px solid"
        borderColor="gray.200"
        backdropFilter="blur(10px)"
        boxShadow="sm"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
          transform: 'scale(1.05)',
          boxShadow: 'md'
        }}
        zIndex={1000}
      >
        <HStack spacing={2}>
          {estado === 'verificando' ? (
            <Spinner size="xs" color={getEstadoColor()} />
          ) : (
            <Circle size="8px" bg={getEstadoColor()} />
          )}
          <Text fontSize="xs" color="gray.600" fontWeight="medium">
            API
          </Text>
        </HStack>
      </Box>
    </Tooltip>
  );
};

export default EstadoConexion;
