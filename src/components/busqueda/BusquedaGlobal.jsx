// components/busqueda/BusquedaGlobal.jsx - Componente de búsqueda global
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
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  Tag,
  TagLabel,
  SimpleGrid,
  useToast
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { busquedaAPI } from '../../services/busquedaAPI';
import { useAuth } from '../../context/AuthContext';

// Helper para convertir valores de manera segura
const toSafeString = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '[object]';
    }
  }
  return String(value);
};

const BusquedaGlobal = () => {
  const [termino, setTermino] = useState('');
  const [tipo, setTipo] = useState('todos');
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  
  const { user, isAdmin, isEditor } = useAuth();
  const toast = useToast();

  // Efecto para manejar término de búsqueda desde URL
  useEffect(() => {
    const terminoURL = searchParams.get('q');
    if (terminoURL && terminoURL.trim()) {
      setTermino(terminoURL.trim());
      // Auto-ejecutar búsqueda si viene término de la URL
      setTimeout(() => {
        handleBuscar(terminoURL.trim());
      }, 100);
    }
  }, [searchParams]);

  const handleBuscar = async (terminoBusqueda = termino) => {
    if (!terminoBusqueda.trim() || terminoBusqueda.trim().length < 2) {
      toast({
        title: 'Error',
        description: 'Ingresa al menos 2 caracteres para buscar',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const response = await busquedaAPI.busquedaGlobal({
        termino: terminoBusqueda.trim(),
        tipo,
        limite: 50
      });

      setResultados(response);
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderResultadosArticulos = () => {
    if (!resultados?.resultados?.articulos?.length) return null;

    return (
      <Box>
        <Heading size="md" mb={4} color="blue.600">
          📝 Artículos ({resultados.totales.articulos})
        </Heading>
        <VStack spacing={4} align="stretch">
          {resultados.resultados.articulos.map((articulo) => (
            <Card key={`articulo-${articulo.id}`} variant="outline">
              <CardBody>
                <VStack align="start" spacing={2}>
                  <HStack justify="space-between" w="full">
                    <Heading size="sm" color="blue.700">
                      {toSafeString(articulo.titulo)}
                    </Heading>
                    <HStack>
                      <Badge 
                        colorScheme={
                          articulo.estado === 'publicado' ? 'green' :
                          articulo.estado === 'en_revision' ? 'yellow' :
                          articulo.estado === 'enviado' ? 'blue' : 'gray'
                        }
                      >
                        {toSafeString(articulo.estado)}
                      </Badge>
                      <Badge variant="outline">
                        Relevancia: {toSafeString(articulo.relevancia)}
                      </Badge>
                    </HStack>
                  </HStack>
                  
                  {articulo.resumen && (
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {toSafeString(articulo.resumen)}
                    </Text>
                  )}
                  
                  <HStack spacing={4} fontSize="sm" color="gray.500">
                    <Text>📅 {formatearFecha(articulo.fecha_creacion)}</Text>
                    {articulo.autor && (
                      <Text>👤 {toSafeString(articulo.autor)}</Text>
                    )}
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Box>
    );
  };

  const renderResultadosComentarios = () => {
    if (!resultados?.resultados?.comentarios?.length) return null;

    return (
      <Box>
        <Heading size="md" mb={4} color="orange.600">
          💬 Comentarios ({resultados.totales.comentarios})
        </Heading>
        <VStack spacing={4} align="stretch">
          {resultados.resultados.comentarios.map((comentario) => (
            <Card key={`comentario-${comentario.id}`} variant="outline">
              <CardBody>
                <VStack align="start" spacing={2}>
                  <HStack justify="space-between" w="full">
                    <Text fontWeight="medium" color="orange.700">
                      💬 {toSafeString(comentario.tipo_comentario)}
                    </Text>
                    <HStack>
                      <Badge 
                        colorScheme={comentario.estado === 'activo' ? 'green' : 'gray'}
                      >
                        {toSafeString(comentario.estado)}
                      </Badge>
                      <Badge variant="outline">
                        Relevancia: {toSafeString(comentario.relevancia)}
                      </Badge>
                    </HStack>
                  </HStack>
                  
                  <Text fontSize="sm" color="gray.700">
                    {toSafeString(comentario.contenido)}
                  </Text>
                  
                  <HStack spacing={4} fontSize="sm" color="gray.500">
                    <Text>📅 {formatearFecha(comentario.fecha_creacion)}</Text>
                    {comentario.autor_comentario && (
                      <Text>👤 {toSafeString(comentario.autor_comentario)}</Text>
                    )}
                    {comentario.articulo_titulo && (
                      <Text>📝 En: {toSafeString(comentario.articulo_titulo)}</Text>
                    )}
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Box>
    );
  };

  const renderResultadosUsuarios = () => {
    if (!resultados?.resultados?.usuarios?.length || (!isAdmin && !isEditor)) return null;

    return (
      <Box>
        <Heading size="md" mb={4} color="purple.600">
          👥 Usuarios ({resultados.totales.usuarios})
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {resultados.resultados.usuarios.map((usuario) => (
            <Card key={`usuario-${usuario.id}`} variant="outline">
              <CardBody>
                <VStack align="start" spacing={2}>
                  <HStack justify="space-between" w="full">
                    <Text fontWeight="medium" color="purple.700">
                      👤 {toSafeString(usuario.nombre)}
                    </Text>
                    <Badge 
                      colorScheme={
                        usuario.rol === 'admin' ? 'red' :
                        usuario.rol === 'editor' ? 'blue' :
                        usuario.rol === 'revisor' ? 'green' : 'gray'
                      }
                    >
                      {toSafeString(usuario.rol)}
                    </Badge>
                  </HStack>
                  
                  <Text fontSize="sm" color="gray.600">
                    {toSafeString(usuario.email)}
                  </Text>
                  
                  <Text fontSize="sm" color="gray.500">
                    📅 Registrado: {formatearFecha(usuario.fecha_creacion)}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    );
  };

  return (
    <Box maxW="6xl" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Título */}
        <Box textAlign="center">
          <Heading size="lg" color="blue.600" mb={2}>
            🔍 Búsqueda Global
          </Heading>
          <Text color="gray.600">
            Busca en artículos, comentarios y usuarios del sistema
          </Text>
        </Box>

        {/* Formulario de búsqueda */}
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <HStack w="full">
                <Input
                  placeholder="¿Qué estás buscando?"
                  value={termino}
                  onChange={(e) => setTermino(e.target.value)}
                  onKeyPress={handleKeyPress}
                  size="lg"
                />
                <Select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  size="lg"
                  maxW="200px"
                >
                  <option value="todos">Todo</option>
                  <option value="articulos">Artículos</option>
                  <option value="comentarios">Comentarios</option>
                  {(isAdmin || isEditor) && (
                    <option value="usuarios">Usuarios</option>
                  )}
                </Select>
                <Button
                  leftIcon={<SearchIcon />}
                  colorScheme="blue"
                  size="lg"
                  onClick={handleBuscar}
                  isLoading={cargando}
                  loadingText="Buscando..."
                >
                  Buscar
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

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
            <Text mt={4} color="gray.600">Buscando...</Text>
          </Box>
        )}

        {/* Resultados */}
        {resultados && !cargando && (
          <VStack spacing={8} align="stretch">
            {/* Resumen de resultados */}
            <Card bg="blue.50" borderColor="blue.200">
              <CardBody>
                <HStack justify="space-between" wrap="wrap">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" color="blue.700">
                      Resultados para: "{toSafeString(resultados.termino_busqueda)}"
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Total encontrados: {toSafeString(resultados.total_general)}
                    </Text>
                  </VStack>
                  
                  <HStack spacing={2}>
                    {resultados.totales.articulos > 0 && (
                      <Tag colorScheme="blue" size="sm">
                        <TagLabel>📝 {toSafeString(resultados.totales.articulos)}</TagLabel>
                      </Tag>
                    )}
                    {resultados.totales.comentarios > 0 && (
                      <Tag colorScheme="orange" size="sm">
                        <TagLabel>💬 {toSafeString(resultados.totales.comentarios)}</TagLabel>
                      </Tag>
                    )}
                    {resultados.totales.usuarios > 0 && (
                      <Tag colorScheme="purple" size="sm">
                        <TagLabel>👥 {toSafeString(resultados.totales.usuarios)}</TagLabel>
                      </Tag>
                    )}
                  </HStack>
                </HStack>
              </CardBody>
            </Card>

            {/* Resultados por categoría */}
            {resultados.total_general === 0 ? (
              <Alert status="info">
                <AlertIcon />
                No se encontraron resultados para "{resultados.termino_busqueda}"
              </Alert>
            ) : (
              <VStack spacing={8} align="stretch">
                {renderResultadosArticulos()}
                {renderResultadosComentarios()}
                {renderResultadosUsuarios()}
              </VStack>
            )}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default BusquedaGlobal;
