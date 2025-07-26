// components/busqueda/AutocompletadoBusqueda.jsx - Componente de autocompletado
import {
  Box,
  Input,
  VStack,
  Text,
  Card,
  CardBody,
  HStack,
  Badge,
  Spinner,
  useOutsideClick
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { busquedaAPI } from '../../services/busquedaAPI';

const AutocompletadoBusqueda = ({ 
  placeholder = "Buscar...",
  tipo = 'articulos', // 'articulos', 'autores', 'usuarios'
  onSelect,
  value,
  onChange,
  size = 'md',
  isDisabled = false
}) => {
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [terminoActual, setTerminoActual] = useState(value || '');
  
  const containerRef = useRef();
  const inputRef = useRef();

  // Cerrar sugerencias al hacer clic fuera
  useOutsideClick({
    ref: containerRef,
    handler: () => setMostrarSugerencias(false),
  });

  // Debounce para las búsquedas
  useEffect(() => {
    const timer = setTimeout(() => {
      if (terminoActual && terminoActual.length >= 2) {
        obtenerSugerencias(terminoActual);
      } else {
        setSugerencias([]);
        setMostrarSugerencias(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [terminoActual, tipo]);

  const obtenerSugerencias = async (termino) => {
    if (!termino || termino.length < 2) return;

    setCargando(true);
    try {
      const response = await busquedaAPI.obtenerSugerencias({
        termino,
        tipo,
        limite: 10
      });
      
      setSugerencias(response.sugerencias || []);
      setMostrarSugerencias(true);
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
      setSugerencias([]);
    } finally {
      setCargando(false);
    }
  };

  const handleInputChange = (e) => {
    const valor = e.target.value;
    setTerminoActual(valor);
    if (onChange) {
      onChange(e);
    }
  };

  const handleSugerenciaClick = (sugerencia) => {
    setTerminoActual(sugerencia.sugerencia);
    setMostrarSugerencias(false);
    
    if (onSelect) {
      onSelect(sugerencia);
    }
    
    if (onChange) {
      onChange({
        target: { value: sugerencia.sugerencia }
      });
    }
  };

  const handleInputFocus = () => {
    if (sugerencias.length > 0) {
      setMostrarSugerencias(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setMostrarSugerencias(false);
      inputRef.current?.blur();
    }
  };

  const getIconoTipo = (tipoSugerencia) => {
    switch (tipoSugerencia) {
      case 'articulo': return '📝';
      case 'autor': return '👤';
      case 'usuario': return '👥';
      default: return '🔍';
    }
  };

  const getColorTipo = (tipoSugerencia) => {
    switch (tipoSugerencia) {
      case 'articulo': return 'blue';
      case 'autor': return 'green';
      case 'usuario': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <Box position="relative" ref={containerRef} width="100%">
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={terminoActual}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        size={size}
        isDisabled={isDisabled}
        autoComplete="off"
      />
      
      {/* Loading indicator en el input */}
      {cargando && (
        <Box
          position="absolute"
          right="12px"
          top="50%"
          transform="translateY(-50%)"
          pointerEvents="none"
        >
          <Spinner size="sm" color="blue.500" />
        </Box>
      )}

      {/* Panel de sugerencias */}
      {mostrarSugerencias && sugerencias.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          zIndex={1000}
          mt={1}
        >
          <Card shadow="lg" border="1px solid" borderColor="gray.200">
            <CardBody p={0}>
              <VStack spacing={0} align="stretch">
                {sugerencias.map((sugerencia, index) => (
                  <Box
                    key={index}
                    px={4}
                    py={3}
                    cursor="pointer"
                    _hover={{ bg: 'gray.50' }}
                    _first={{ borderTopRadius: 'md' }}
                    _last={{ borderBottomRadius: 'md' }}
                    borderBottom={index < sugerencias.length - 1 ? '1px solid' : 'none'}
                    borderBottomColor="gray.100"
                    onClick={() => handleSugerenciaClick(sugerencia)}
                  >
                    <HStack justify="space-between">
                      <HStack>
                        <Text fontSize="sm">
                          {getIconoTipo(sugerencia.tipo)}
                        </Text>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          noOfLines={1}
                        >
                          {sugerencia.sugerencia}
                        </Text>
                      </HStack>
                      <Badge
                        size="sm"
                        colorScheme={getColorTipo(sugerencia.tipo)}
                        variant="subtle"
                      >
                        {sugerencia.tipo}
                      </Badge>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </Box>
      )}

      {/* Mensaje cuando no hay sugerencias */}
      {mostrarSugerencias && !cargando && sugerencias.length === 0 && terminoActual.length >= 2 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          zIndex={1000}
          mt={1}
        >
          <Card shadow="lg" border="1px solid" borderColor="gray.200">
            <CardBody py={3}>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                No se encontraron sugerencias
              </Text>
            </CardBody>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default AutocompletadoBusqueda;
