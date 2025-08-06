// pages/NuevoArticuloPage.jsx - Página para crear nuevos artículos (RECONSTRUIDA DESDE CERO)
import React, { useState } from 'react';
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
  useToast,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NuevoArticuloPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Estado del formulario - SIMPLE Y LIMPIO
  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    contenido: '',
    categoria: '',
    palabras_clave: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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
    
    if (!formData.contenido.trim()) {
      newErrors.contenido = 'El contenido es obligatorio';
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
      // Construir payload del artículo
      const articulo = {
        titulo: formData.titulo.trim(),
        resumen: formData.resumen.trim(),
        contenido: formData.contenido.trim(),
        categoria: formData.categoria,
        palabras_clave: formData.palabras_clave.trim(),
        autor_id: user.id,
        estado: 'borrador'
      };

      console.log('Enviando artículo:', articulo);

      // Simular envío (PLACEHOLDER - conectar con API real)
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: 'Artículo creado',
        description: 'Tu artículo ha sido guardado como borrador',
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      // Redirigir a la lista de artículos
      navigate('/articulos');

    } catch (error) {
      console.error('Error creando artículo:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al crear el artículo',
        status: 'error',
        duration: 5000,
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

                {/* Contenido */}
                <FormControl isInvalid={errors.contenido}>
                  <FormLabel>Contenido del Artículo</FormLabel>
                  <Textarea
                    value={formData.contenido}
                    onChange={(e) => handleChange('contenido', e.target.value)}
                    placeholder="Escribe el contenido completo del artículo..."
                    rows={12}
                  />
                  <FormErrorMessage>{errors.contenido}</FormErrorMessage>
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
