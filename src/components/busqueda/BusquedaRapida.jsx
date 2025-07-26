// components/busqueda/BusquedaRapida.jsx - Búsqueda rápida en la barra superior
import {
  Box,
  Input,
  Button,
  HStack,
  useToast
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AutocompletadoBusqueda from './AutocompletadoBusqueda';

const BusquedaRapida = ({ size = "sm", maxW = "300px" }) => {
  const [termino, setTermino] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleBuscar = () => {
    if (!termino.trim() || termino.trim().length < 2) {
      toast({
        title: 'Error',
        description: 'Ingresa al menos 2 caracteres para buscar',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Navegar a la página de búsqueda con el término
    navigate(`/busqueda?q=${encodeURIComponent(termino.trim())}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  const handleSugerenciaSelect = (sugerencia) => {
    setTermino(sugerencia.sugerencia);
    // Auto-buscar cuando se selecciona una sugerencia
    setTimeout(() => {
      navigate(`/busqueda?q=${encodeURIComponent(sugerencia.sugerencia)}`);
    }, 100);
  };

  return (
    <HStack maxW={maxW} spacing={2}>
      <Box flex={1}>
        <AutocompletadoBusqueda
          placeholder="Búsqueda rápida..."
          tipo="articulos"
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          onSelect={handleSugerenciaSelect}
          size={size}
        />
      </Box>
      <Button
        size={size}
        colorScheme="blue"
        variant="ghost"
        onClick={handleBuscar}
        minW="40px"
        px={2}
      >
        <SearchIcon />
      </Button>
    </HStack>
  );
};

export default BusquedaRapida;
