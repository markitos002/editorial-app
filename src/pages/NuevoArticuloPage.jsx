// pages/NuevoArticuloPage.jsx - Página para crear nuevos artículos (RECONSTRUIDA DESDE CERO)
import React, { useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Textarea,
  Button,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  useToast,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
  Flex,
  Badge,
  CloseButton
} from '@chakra-ui/react';
import { FiUpload, FiFile, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { articulosAPI } from '../services/api';

const NuevoArticuloPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);
  
  // Estado del formulario - SIMPLE Y LIMPIO
  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    categoria: '',
    palabras_clave: '',
    archivo: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  // Categorías disponibles
  const categorias = [
    'Investigación',
    'Revisión',
    'Artículo Original',
    'Caso Clínico',
    'Editorial',
    'Carta al Editor'
  ];

  // Validación simple
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }
    
    if (!formData.resumen.trim()) {
      newErrors.resumen = 'El resumen es obligatorio';
    }
    
    if (!formData.archivo) {
      newErrors.archivo = 'Debes cargar el archivo del artículo';
    }
    
    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Manejar carga de archivos
  const handleFileSelect = (file) => {
    // Validar tipo de archivo
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Tipo de archivo no válido',
        description: 'Solo se permiten archivos PDF, DOC o DOCX',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: 'Archivo muy grande',
        description: 'El archivo no puede superar los 10MB',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    handleChange('archivo', file);
    
    toast({
      title: 'Archivo cargado',
      description: `${file.name} se ha cargado correctamente`,
      status: 'success',
      duration: 3000,
      isClosable: true
    });
  };

  // Manejar drop de archivos
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Manejar click en input de archivo
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Remover archivo
  const removeFile = () => {
    handleChange('archivo', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Obtener icono del archivo
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    return extension === 'pdf' ? '📄' : '📝';
  };

  // Formatear tamaño del archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Enviar artículo
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Error en el formulario',
        description: 'Por favor corrige los errores marcados',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Crear FormData para envío con archivo
      const formDataToSend = new FormData();
      
      // Agregar datos del formulario
      formDataToSend.append('titulo', formData.titulo.trim());
      formDataToSend.append('resumen', formData.resumen.trim());
      formDataToSend.append('palabras_clave', formData.palabras_clave.trim());
      formDataToSend.append('area_tematica', formData.categoria); // El backend usa 'area_tematica'
      formDataToSend.append('archivo', formData.archivo);

      console.log('Enviando artículo con archivo...');
      console.log('Datos del formulario:');
      console.log('- Título:', formData.titulo);
      console.log('- Resumen:', formData.resumen);
      console.log('- Categoría:', formData.categoria);
      console.log('- Palabras clave:', formData.palabras_clave);
      console.log('- Archivo:', formData.archivo.name, formData.archivo.size, 'bytes');

      // Enviar usando la API configurada
      const response = await articulosAPI.crearConArchivo(formDataToSend);

      console.log('Respuesta del servidor:', response);

      toast({
        title: 'Artículo creado exitosamente',
        description: `Tu artículo "${formData.titulo}" ha sido enviado y está en revisión`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      // Redirigir a la lista de artículos
      navigate('/articulos');

    } catch (error) {
      console.error('Error creando artículo:', error);
      
      const errorMessage = error.response?.data?.mensaje || error.message || 'Error desconocido';
      
      toast({
        title: 'Error al crear artículo',
        description: errorMessage,
        status: 'error',
        duration: 7000,
        isClosable: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box p={6} maxW="4xl" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Nuevo Artículo</Heading>
          <Text color="gray.600">
            Completa el formulario para crear un nuevo artículo
          </Text>
        </Box>

        {/* Información del autor */}
        <Alert status="info">
          <AlertIcon />
          <Box>
            <AlertTitle>Autor:</AlertTitle>
            <AlertDescription>
              {user?.nombre || 'Usuario'} ({user?.email})
            </AlertDescription>
          </Box>
        </Alert>

        {/* Formulario */}
        <Card>
          <CardHeader>
            <Heading size="md">Datos del Artículo</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                
                {/* Título */}
                <FormControl isInvalid={errors.titulo}>
                  <FormLabel>Título del Artículo</FormLabel>
                  <Input
                    value={formData.titulo}
                    onChange={(e) => handleChange('titulo', e.target.value)}
                    placeholder="Escribe el título de tu artículo..."
                  />
                  <FormErrorMessage>{errors.titulo}</FormErrorMessage>
                </FormControl>

                {/* Categoría */}
                <FormControl isInvalid={errors.categoria}>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    value={formData.categoria}
                    onChange={(e) => handleChange('categoria', e.target.value)}
                    placeholder="Selecciona una categoría"
                  >
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.categoria}</FormErrorMessage>
                </FormControl>

                {/* Palabras clave */}
                <FormControl>
                  <FormLabel>Palabras Clave</FormLabel>
                  <Input
                    value={formData.palabras_clave}
                    onChange={(e) => handleChange('palabras_clave', e.target.value)}
                    placeholder="palabra1, palabra2, palabra3..."
                  />
                </FormControl>

                {/* Resumen */}
                <FormControl isInvalid={errors.resumen}>
                  <FormLabel>Resumen</FormLabel>
                  <Textarea
                    value={formData.resumen}
                    onChange={(e) => handleChange('resumen', e.target.value)}
                    placeholder="Escribe un resumen del artículo..."
                    rows={4}
                  />
                  <FormErrorMessage>{errors.resumen}</FormErrorMessage>
                </FormControl>

                {/* Carga de Archivo */}
                <FormControl isInvalid={errors.archivo}>
                  <FormLabel>Archivo del Artículo</FormLabel>
                  <FormHelperText mb={3}>
                    Carga tu artículo en formato PDF, DOC o DOCX (máximo 10MB)
                  </FormHelperText>
                  
                  {!formData.archivo ? (
                    <Box
                      p={8}
                      border="2px dashed"
                      borderColor={dragActive ? 'blue.400' : errors.archivo ? 'red.300' : 'gray.300'}
                      borderRadius="md"
                      bg={dragActive ? 'blue.50' : 'gray.50'}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ borderColor: 'blue.400', bg: 'blue.50' }}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <VStack spacing={3}>
                        <Icon as={FiUpload} w={8} h={8} color="gray.400" />
                        <VStack spacing={1}>
                          <Text fontWeight="medium">
                            Arrastra tu archivo aquí o haz clic para seleccionar
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Archivos soportados: PDF, DOC, DOCX
                          </Text>
                        </VStack>
                      </VStack>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileInputChange}
                        display="none"
                      />
                    </Box>
                  ) : (
                    <Card>
                      <CardBody>
                        <Flex justify="space-between" align="center">
                          <HStack spacing={3}>
                            <Text fontSize="2xl">
                              {getFileIcon(formData.archivo.name)}
                            </Text>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium">
                                {formData.archivo.name}
                              </Text>
                              <HStack spacing={2}>
                                <Badge colorScheme="green" size="sm">
                                  <Icon as={FiCheck} mr={1} />
                                  Cargado
                                </Badge>
                                <Text fontSize="sm" color="gray.500">
                                  {formatFileSize(formData.archivo.size)}
                                </Text>
                              </HStack>
                            </VStack>
                          </HStack>
                          <CloseButton onClick={removeFile} />
                        </Flex>
                      </CardBody>
                    </Card>
                  )}
                  
                  <FormErrorMessage>{errors.archivo}</FormErrorMessage>
                </FormControl>

                <Divider />

                {/* Botones */}
                <HStack spacing={4} justifyContent="flex-end">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/articulos')}
                    isDisabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    loadingText="Guardando..."
                  >
                    Guardar Artículo
                  </Button>
                </HStack>

              </VStack>
            </form>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default NuevoArticuloPage;
