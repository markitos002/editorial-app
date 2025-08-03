// pages/BusquedaPage.jsx - Página principal del sistema de búsqueda
import {
  Box,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BusquedaGlobal from '../components/busqueda/BusquedaGlobal';
import BusquedaArticulos from '../components/busqueda/BusquedaArticulos';
import BusquedaArticulosSimple from '../components/busqueda/BusquedaArticulosSimple';
import EstadoConexion from '../components/busqueda/EstadoConexion';
import { useAuth } from '../context/AuthContext';

const BusquedaPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchParams] = useSearchParams();
  const { user, isAdmin, isEditor } = useAuth();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Detectar si viene un término de búsqueda en la URL
  useEffect(() => {
    const termino = searchParams.get('q');
    if (termino) {
      // Si hay un término, activar la pestaña de búsqueda global
      setTabIndex(0);
    }
  }, [searchParams]);

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Header */}
      <Box bg={bgColor} borderBottom="1px solid" borderColor={borderColor} py={6}>
        <Box maxW="7xl" mx="auto" px={6}>
          <VStack spacing={3}>
            <Heading size="xl" color="blue.600" textAlign="center">
              🔍 Centro de Búsqueda
            </Heading>
            <Text color="gray.600" textAlign="center" maxW="2xl">
              Encuentra rápidamente artículos, comentarios y usuarios en el sistema editorial
            </Text>
          </VStack>
        </Box>
      </Box>

      {/* Contenido principal */}
      <Box py={8}>
        <Box maxW="7xl" mx="auto" px={6}>
          <Tabs 
            index={tabIndex} 
            onChange={setTabIndex}
            variant="enclosed"
            colorScheme="blue"
          >
            <TabList mb={6} justifyContent="center">
              <Tab fontWeight="semibold">
                🌐 Búsqueda Global
              </Tab>
              <Tab fontWeight="semibold">
                📚 Búsqueda de Artículos
              </Tab>
            </TabList>

            <TabPanels>
              {/* Panel de búsqueda global */}
              <TabPanel p={0}>
                <Box bg={bgColor} borderRadius="lg" border="1px solid" borderColor={borderColor}>
                  <BusquedaGlobal />
                </Box>
              </TabPanel>

              {/* Panel de búsqueda de artículos */}
              <TabPanel p={0}>
                <Box bg={bgColor} borderRadius="lg" border="1px solid" borderColor={borderColor}>
                  <BusquedaArticulosSimple />
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>

      {/* Footer informativo */}
      <Box mt={12} py={6} bg={bgColor} borderTop="1px solid" borderColor={borderColor}>
        <Box maxW="7xl" mx="auto" px={6}>
          <VStack spacing={4}>
            <Heading size="sm" color="gray.600">
              💡 Consejos de Búsqueda
            </Heading>
            <HStack spacing={8} wrap="wrap" justify="center" fontSize="sm" color="gray.500">
              <Text>• Usa al menos 2 caracteres para buscar</Text>
              <Text>• La búsqueda no distingue mayúsculas/minúsculas</Text>
              <Text>• Usa filtros para resultados más precisos</Text>
              {(isAdmin || isEditor) && (
                <Text>• Como {isAdmin ? 'admin' : 'editor'} puedes buscar usuarios</Text>
              )}
            </HStack>
          </VStack>
        </Box>
      </Box>

      {/* Indicador de estado flotante */}
      <EstadoConexion />
    </Box>
  );
};

export default BusquedaPage;
