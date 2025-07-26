// components/busqueda/BusquedaArticulos.jsx - Búsqueda avanzada de artículos
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Select,
  Text,
  Badge,
  Card,
  CardBody,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Collapse,
  IconButton,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { busquedaAPI } from '../../services/busquedaAPI';
import { useAuth } from '../../context/AuthContext';

const BusquedaArticulos = () => {
  const [filtros, setFiltros] = useState({
    termino: '',
    estado: '',
    autor_usuario_id: '',
    fecha_desde: '',
    fecha_hasta: '',
    page: 1,
    limit: 10,
    ordenar_por: 'fecha_creacion',
    orden: 'DESC'
  });
  
  const [resultados, setResultados] = useState(null);
  const [opcionesFiltros, setOpcionesFiltros] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  
  const { isOpen: isFiltersOpen, onToggle: onFiltersToggle } = useDisclosure();
  const { user } = useAuth();
  const toast = useToast();

  // Cargar opciones de filtros al montar el componente
  useEffect(() => {
    cargarOpcionesFiltros();
  }, []);

  const cargarOpcionesFiltros = async () => {
    try {
      const response = await busquedaAPI.obtenerOpcionesFiltros();
      setOpcionesFiltros(response.opciones);
    } catch (error) {
      console.error('Error al cargar opciones de filtros:', error);
    }
  };

  const handleBuscar = async (nuevaPagina = 1) => {
    setCargando(true);
    setError(null);

    try {
      const filtrosParaBusqueda = {
        ...filtros,
        page: nuevaPagina
      };

      const response = await busquedaAPI.busquedaArticulos(filtrosParaBusqueda);
      setResultados(response);
      setFiltros(prev => ({ ...prev, page: nuevaPagina }));
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setError('Error al realizar la búsqueda. Inténtalo de nuevo.');
      toast({
        title: 'Error',
        description: 'Error al realizar la búsqueda',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setCargando(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
      page: 1 // Reset página al cambiar filtros
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      termino: '',
      estado: '',
      autor_usuario_id: '',
      fecha_desde: '',
      fecha_hasta: '',
      page: 1,
      limit: 10,
      ordenar_por: 'fecha_creacion',
      orden: 'DESC'
    });
    setResultados(null);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderPaginacion = () => {
    if (!resultados?.pagination) return null;

    const { current_page, total_pages, total_count } = resultados.pagination;

    return (
      <Card>
        <CardBody>
          <HStack justify="space-between" align="center">
            <Text fontSize="sm" color="gray.600">
              Mostrando {((current_page - 1) * filtros.limit) + 1} - {Math.min(current_page * filtros.limit, total_count)} de {total_count} artículos
            </Text>
            
            <HStack>
              <Button
                size="sm"
                onClick={() => handleBuscar(current_page - 1)}
                isDisabled={current_page <= 1 || cargando}
              >
                Anterior
              </Button>
              
              <Text fontSize="sm" mx={2}>
                Página {current_page} de {total_pages}
              </Text>
              
              <Button
                size="sm"
                onClick={() => handleBuscar(current_page + 1)}
                isDisabled={current_page >= total_pages || cargando}
              >
                Siguiente
              </Button>
            </HStack>
          </HStack>
        </CardBody>
      </Card>
    );
  };

  return (
    <Box maxW="7xl" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Título */}
        <Box textAlign="center">
          <Heading size="lg" color="blue.600" mb={2}>
            📚 Búsqueda Avanzada de Artículos
          </Heading>
          <Text color="gray.600">
            Encuentra artículos con filtros específicos
          </Text>
        </Box>

        {/* Formulario de búsqueda básica */}
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <HStack w="full">
                <Input
                  placeholder="Buscar en títulos, resúmenes y autores..."
                  value={filtros.termino}
                  onChange={(e) => handleFiltroChange('termino', e.target.value)}
                  onKeyPress={handleKeyPress}
                  size="lg"
                />
                <Button
                  leftIcon={<SearchIcon />}
                  colorScheme="blue"
                  size="lg"
                  onClick={() => handleBuscar()}
                  isLoading={cargando}
                  loadingText="Buscando..."
                >
                  Buscar
                </Button>
              </HStack>
              
              {/* Toggle para filtros avanzados */}
              <HStack w="full" justify="center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onFiltersToggle}
                  rightIcon={isFiltersOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                >
                  Filtros Avanzados
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Filtros avanzados */}
        <Collapse in={isFiltersOpen}>
          <Card bg="gray.50">
            <CardBody>
              <VStack spacing={4}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} w="full">
                  {/* Estado */}
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Estado</Text>
                    <Select
                      value={filtros.estado}
                      onChange={(e) => handleFiltroChange('estado', e.target.value)}
                      placeholder="Todos los estados"
                    >
                      {opcionesFiltros?.estados?.map((estado) => (
                        <option key={estado.estado} value={estado.estado}>
                          {estado.estado} ({estado.count})
                        </option>
                      ))}
                    </Select>
                  </Box>

                  {/* Autor */}
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Autor</Text>
                    <Select
                      value={filtros.autor_usuario_id}
                      onChange={(e) => handleFiltroChange('autor_usuario_id', e.target.value)}
                      placeholder="Todos los autores"
                    >
                      {opcionesFiltros?.autores?.map((autor) => (
                        <option key={autor.id} value={autor.id}>
                          {autor.nombre} ({autor.articulos_count})
                        </option>
                      ))}
                    </Select>
                  </Box>

                  {/* Ordenar por */}
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Ordenar por</Text>
                    <HStack>
                      <Select
                        value={filtros.ordenar_por}
                        onChange={(e) => handleFiltroChange('ordenar_por', e.target.value)}
                      >
                        <option value="fecha_creacion">Fecha de creación</option>
                        <option value="titulo">Título</option>
                        <option value="estado">Estado</option>
                      </Select>
                      <Select
                        value={filtros.orden}
                        onChange={(e) => handleFiltroChange('orden', e.target.value)}
                        maxW="120px"
                      >
                        <option value="DESC">Desc</option>
                        <option value="ASC">Asc</option>
                      </Select>
                    </HStack>
                  </Box>

                  {/* Fecha desde */}
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Fecha desde</Text>
                    <Input
                      type="date"
                      value={filtros.fecha_desde}
                      onChange={(e) => handleFiltroChange('fecha_desde', e.target.value)}
                    />
                  </Box>

                  {/* Fecha hasta */}
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Fecha hasta</Text>
                    <Input
                      type="date"
                      value={filtros.fecha_hasta}
                      onChange={(e) => handleFiltroChange('fecha_hasta', e.target.value)}
                    />
                  </Box>

                  {/* Resultados por página */}
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Resultados por página</Text>
                    <NumberInput
                      value={filtros.limit}
                      onChange={(value) => handleFiltroChange('limit', parseInt(value) || 10)}
                      min={5}
                      max={100}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Box>
                </SimpleGrid>

                <HStack>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleBuscar()}
                    isLoading={cargando}
                  >
                    Aplicar Filtros
                  </Button>
                  <Button variant="outline" onClick={limpiarFiltros}>
                    Limpiar Filtros
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </Collapse>

        {/* Error */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Loading */}
        {cargando && (
          <Box textAlign="center" py={8}>
            <Spinner size="xl" color="blue.500" />
            <Text mt={4} color="gray.600">Buscando artículos...</Text>
          </Box>
        )}

        {/* Resultados */}
        {resultados && !cargando && (
          <VStack spacing={6} align="stretch">
            {/* Resumen */}
            <Card bg="blue.50" borderColor="blue.200">
              <CardBody>
                <HStack justify="space-between" wrap="wrap">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" color="blue.700">
                      {resultados.articulos.length > 0 
                        ? `${resultados.pagination.total_count} artículos encontrados`
                        : 'No se encontraron artículos'
                      }
                    </Text>
                    {filtros.termino && (
                      <Text fontSize="sm" color="gray.600">
                        Término: "{filtros.termino}"
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </CardBody>
            </Card>

            {/* Lista de artículos */}
            {resultados.articulos.length === 0 ? (
              <Alert status="info">
                <AlertIcon />
                No se encontraron artículos con los filtros especificados
              </Alert>
            ) : (
              <VStack spacing={4} align="stretch">
                {resultados.articulos.map((articulo) => (
                  <Card key={articulo.id} variant="outline" _hover={{ shadow: 'md' }}>
                    <CardBody>
                      <VStack align="start" spacing={3}>
                        {/* Título y estado */}
                        <HStack justify="space-between" w="full">
                          <Heading size="md" color="blue.700">
                            {articulo.titulo}
                          </Heading>
                          <HStack>
                            <Badge 
                              colorScheme={
                                articulo.estado === 'publicado' ? 'green' :
                                articulo.estado === 'en_revision' ? 'yellow' :
                                articulo.estado === 'enviado' ? 'blue' : 'gray'
                              }
                            >
                              {articulo.estado}
                            </Badge>
                          </HStack>
                        </HStack>
                        
                        {/* Resumen */}
                        {articulo.resumen && (
                          <Text color="gray.700" noOfLines={2}>
                            {articulo.resumen}
                          </Text>
                        )}
                        
                        {/* Palabras clave */}
                        {articulo.palabras_clave && articulo.palabras_clave.length > 0 && (
                          <HStack wrap="wrap">
                            <Text fontSize="sm" color="gray.500">Palabras clave:</Text>
                            {articulo.palabras_clave.map((palabra, index) => (
                              <Badge key={index} variant="outline" fontSize="xs">
                                {palabra}
                              </Badge>
                            ))}
                          </HStack>
                        )}
                        
                        {/* Información adicional */}
                        <HStack spacing={6} fontSize="sm" color="gray.500" wrap="wrap">
                          <Text>📅 {formatearFecha(articulo.fecha_creacion)}</Text>
                          {articulo.autor && (
                            <Text>👤 {articulo.autor}</Text>
                          )}
                          <Text>💬 {articulo.total_comentarios} comentarios</Text>
                          {articulo.archivo_nombre && (
                            <Text>📎 {articulo.archivo_nombre}</Text>
                          )}
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            )}

            {/* Paginación */}
            {renderPaginacion()}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default BusquedaArticulos;
