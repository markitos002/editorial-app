// pages/ArticulosPage.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
  Spinner,
  Text,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../components/CustomModal';
import { articulosAPI } from '../services/api';
import { formatDateShort, getStatusColor, getStatusDisplayName } from '../utils/helpers';

const ArticulosPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDetalleOpen, onOpen: onDetalleOpen, onClose: onDetalleClose } = useDisclosure();
  
  // Estados
  const [articulos, setArticulos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  
  // Formulario para nuevo artículo
  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    palabras_clave: '',
    area_tematica: 'cuidados-enfermeria',
    archivo: null
  });
  
  // Colores para modo claro/oscuro
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Cargar artículos al montar el componente
  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      setIsLoading(true);
      const response = await articulosAPI.getMisArticulos();
      setArticulos(response.articulos || []);
      setError(null);
    } catch (error) {
      console.error('Error cargando artículos:', error);
      setError('Error al cargar los artículos');
      setArticulos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'archivo') {
      setFormData(prev => ({
        ...prev,
        [name]: files ? files[0] : null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.resumen.trim()) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completa título y resumen',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.archivo) {
      toast({
        title: 'Archivo requerido',
        description: 'Por favor selecciona un archivo con el contenido del artículo',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Crear FormData para enviar archivo
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('resumen', formData.resumen);
      formDataToSend.append('area_tematica', formData.area_tematica);
      formDataToSend.append('archivo', formData.archivo);
      
      // Procesar palabras clave
      const palabrasClave = formData.palabras_clave.split(',').map(k => k.trim()).filter(k => k);
      formDataToSend.append('palabras_clave', JSON.stringify(palabrasClave));
      
      // Llamada directa a la API con FormData
      const response = await fetch('/api/articulos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('editorial_token')}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al enviar artículo');
      }
      
      toast({
        title: 'Artículo enviado',
        description: 'Tu artículo ha sido enviado para revisión',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Limpiar formulario y cerrar modal
      setFormData({
        titulo: '',
        resumen: '',
        palabras_clave: '',
        area_tematica: 'cuidados-enfermeria',
        archivo: null
      });
      
      // Limpiar el input de archivo
      const fileInput = document.querySelector('input[name="archivo"]');
      if (fileInput) fileInput.value = '';
      
      onClose();
      
      // Recargar artículos
      cargarArticulos();
      
    } catch (error) {
      console.error('Error enviando artículo:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al enviar el artículo',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerDetalles = (articulo) => {
    setArticuloSeleccionado(articulo);
    onDetalleOpen();
  };

  const descargarArchivo = async (articuloId) => {
    try {
      const token = localStorage.getItem('editorial_token');
      const response = await fetch(`/api/articulos/${articuloId}/archivo`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }

      // Crear blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = articuloSeleccionado?.archivo_nombre || 'articulo.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Descarga iniciada',
        description: 'El archivo se está descargando',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Error descargando archivo:', error);
      toast({
        title: 'Error',
        description: 'No se pudo descargar el archivo',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const areas_tematicas = [
    { value: 'cuidados-enfermeria', label: 'Cuidados de Enfermería' },
    { value: 'salud-mental', label: 'Salud Mental' },
    { value: 'cuidados-intensivos', label: 'Cuidados Intensivos' },
    { value: 'pediatria', label: 'Pediatría' },
    { value: 'geriatria', label: 'Geriatría' },
    { value: 'salud-comunitaria', label: 'Salud Comunitaria' },
    { value: 'investigacion', label: 'Investigación en Enfermería' },
    { value: 'educacion', label: 'Educación en Salud' }
  ];

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <Heading size="lg">Mis Artículos</Heading>
            <Button colorScheme="blue" onClick={() => navigate('/articles/new')}>
              📝 Nuevo Artículo
            </Button>
          </HStack>

          {/* Contenido principal */}
          <Card bg={cardBg}>
            <CardBody>
              {error && (
                <Alert status="error" mb={4}>
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              {isLoading ? (
                <VStack py={8}>
                  <Spinner size="lg" />
                  <Text>Cargando artículos...</Text>
                </VStack>
              ) : articulos.length === 0 ? (
                <VStack py={8} spacing={4}>
                  <Text fontSize="lg" color="gray.500">
                    No has enviado ningún artículo aún
                  </Text>
                  <Button colorScheme="blue" onClick={onOpen}>
                    Enviar tu primer artículo
                  </Button>
                </VStack>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Título</Th>
                      <Th>Área Temática</Th>
                      <Th>Estado</Th>
                      <Th>Fecha Envío</Th>
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {articulos.map((articulo) => (
                      <Tr key={articulo.id}>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">{articulo.titulo}</Text>
                            <Text fontSize="sm" color="gray.500" noOfLines={2}>
                              {articulo.resumen}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Badge variant="outline">
                            {areas_tematicas.find(a => a.value === articulo.area_tematica)?.label || articulo.area_tematica}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(articulo.estado)}>
                            {getStatusDisplayName(articulo.estado)}
                          </Badge>
                        </Td>
                        <Td>{formatDateShort(articulo.creado_en)}</Td>
                        <Td>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleVerDetalles(articulo)}
                          >
                            Ver Detalles
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>

      {/* Modal para ver detalles del artículo */}
      <CustomModal isOpen={isDetalleOpen} onClose={onDetalleClose} size="xl" title="Detalles del Artículo">
            {articuloSeleccionado && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={2}>Título:</Text>
                  <Text>{articuloSeleccionado.titulo}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>Estado:</Text>
                  <Badge colorScheme={getStatusColor(articuloSeleccionado.estado)}>
                    {getStatusDisplayName(articuloSeleccionado.estado)}
                  </Badge>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>Área Temática:</Text>
                  <Badge variant="outline">
                    {areas_tematicas.find(a => a.value === articuloSeleccionado.area_tematica)?.label || articuloSeleccionado.area_tematica}
                  </Badge>
                </Box>

                {articuloSeleccionado.palabras_clave && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Palabras Clave:</Text>
                    <HStack wrap="wrap" spacing={2}>
                      {(() => {
                        try {
                          const palabras = Array.isArray(articuloSeleccionado.palabras_clave) 
                            ? articuloSeleccionado.palabras_clave
                            : typeof articuloSeleccionado.palabras_clave === 'string'
                              ? JSON.parse(articuloSeleccionado.palabras_clave)
                              : [];
                          
                          return palabras.map((palabra, index) => (
                            <Badge key={index} colorScheme="blue" variant="subtle">
                              {typeof palabra === 'string' ? palabra : String(palabra)}
                            </Badge>
                          ));
                        } catch (error) {
                          console.error('Error parsing palabras_clave:', error);
                          return (
                            <Badge colorScheme="red" variant="subtle">
                              Error al cargar palabras clave
                            </Badge>
                          );
                        }
                      })()}
                    </HStack>
                  </Box>
                )}

                <Box>
                  <Text fontWeight="bold" mb={2}>Resumen:</Text>
                  <Text whiteSpace="pre-wrap">{articuloSeleccionado.resumen}</Text>
                </Box>

                {articuloSeleccionado.archivo_nombre && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Archivo adjunto:</Text>
                    <HStack>
                      <Text>{articuloSeleccionado.archivo_nombre}</Text>
                      <Button 
                        size="sm" 
                        colorScheme="blue" 
                        variant="outline"
                        onClick={() => descargarArchivo(articuloSeleccionado.id)}
                      >
                        📄 Descargar
                      </Button>
                    </HStack>
                    {articuloSeleccionado.archivo_size && (
                      <Text fontSize="sm" color="gray.500">
                        Tamaño: {(articuloSeleccionado.archivo_size / 1024 / 1024).toFixed(2)} MB
                      </Text>
                    )}
                  </Box>
                )}

                <Box>
                  <Text fontWeight="bold" mb={2}>Fecha de Envío:</Text>
                  <Text>{formatDateShort(articuloSeleccionado.creado_en)}</Text>
                </Box>

                {articuloSeleccionado.autor_nombre && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Autor:</Text>
                    <Text>{articuloSeleccionado.autor_nombre}</Text>
                  </Box>
                )}

                <HStack w="100%" justify="end" spacing={3} pt={4}>
                  <Button variant="outline" onClick={onDetalleClose}>
                    Cerrar
                  </Button>
                  {articuloSeleccionado.estado === 'enviado' && (
                    <Button colorScheme="blue" variant="outline">
                      Editar Artículo
                    </Button>
                  )}
                </HStack>
            </VStack>
          )}
      </CustomModal>

      {/* Modal para nuevo artículo */}
      <CustomModal isOpen={isOpen} onClose={onClose} size="xl" title="Enviar Nuevo Artículo">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Título del artículo</FormLabel>
                  <Input
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder="Ingresa el título de tu artículo"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Resumen</FormLabel>
                  <Textarea
                    name="resumen"
                    value={formData.resumen}
                    onChange={handleInputChange}
                    placeholder="Resumen del artículo (máximo 300 palabras)"
                    rows={4}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Palabras clave</FormLabel>
                  <Input
                    name="palabras_clave"
                    value={formData.palabras_clave}
                    onChange={handleInputChange}
                    placeholder="cuidados, enfermería, salud (separadas por comas)"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Área temática</FormLabel>
                  <Select
                    name="area_tematica"
                    value={formData.area_tematica}
                    onChange={handleInputChange}
                  >
                    {areas_tematicas.map(area => (
                      <option key={area.value} value={area.value}>
                        {area.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Archivo del artículo</FormLabel>
                  <Input
                    type="file"
                    name="archivo"
                    onChange={handleInputChange}
                    accept=".doc,.docx,.pdf,.txt"
                    pt={1}
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Formatos permitidos: .doc, .docx, .pdf, .txt (máximo 10MB)
                  </Text>
                  {formData.archivo && (
                    <Text fontSize="sm" color="green.500" mt={1}>
                      ✓ Archivo seleccionado: {formData.archivo.name}
                    </Text>
                  )}
                </FormControl>

                <HStack w="100%" justify="end" spacing={3}>
                  <Button variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    loadingText="Enviando..."
                  >
                    Enviar Artículo
                  </Button>
                </HStack>
              </VStack>
            </form>
      </CustomModal>
    </Box>
  );
};

export default ArticulosPage;
