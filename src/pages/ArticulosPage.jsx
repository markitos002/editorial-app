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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
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
import { articulosAPI } from '../services/api';
import { formatDateShort, getStatusColor, getStatusDisplayName } from '../utils/helpers';

const ArticulosPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Estados
  const [articulos, setArticulos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Formulario para nuevo artículo
  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    palabras_clave: '',
    area_tematica: 'cuidados-enfermeria',
    contenido: ''
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    try {
      setIsSubmitting(true);
      
      const articuloData = {
        ...formData,
        palabras_clave: formData.palabras_clave.split(',').map(k => k.trim()).filter(k => k)
      };
      
      await articulosAPI.crear(articuloData);
      
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
        contenido: ''
      });
      onClose();
      
      // Recargar artículos
      cargarArticulos();
      
    } catch (error) {
      console.error('Error enviando artículo:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.mensaje || 'Error al enviar el artículo',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
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
            <Button colorScheme="blue" onClick={onOpen}>
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
                          <Button size="sm" variant="outline">
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

      {/* Modal para nuevo artículo */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enviar Nuevo Artículo</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
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

                <FormControl>
                  <FormLabel>Contenido del artículo</FormLabel>
                  <Textarea
                    name="contenido"
                    value={formData.contenido}
                    onChange={handleInputChange}
                    placeholder="Contenido completo del artículo..."
                    rows={8}
                  />
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ArticulosPage;
