// pages/NuevoArticuloPage.jsx - VERSIÓN SIMPLIFICADA PARA ESTABILIDAD
import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Input,
  Textarea,
  Button,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Heading
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { articulosAPI } from '../services/api';

const NuevoArticuloPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    categoria: '',
    palabras_clave: '',
    archivo: null
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

  // Validación
  const validateForm = () => {
    const newErrors = {};
    if (!formData.titulo.trim()) newErrors.titulo = 'El título es obligatorio';
    if (!formData.resumen.trim()) newErrors.resumen = 'El resumen es obligatorio';
    if (!formData.archivo) newErrors.archivo = 'Debes cargar el archivo del artículo';
    if (!formData.categoria) newErrors.categoria = 'La categoría es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en campos de texto
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Manejar cambio de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      handleChange('archivo', null);
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Tipo de archivo no válido',
        description: 'Solo se permiten archivos PDF, DOC o DOCX.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      e.target.value = null; // Limpiar input
      handleChange('archivo', null);
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: 'Archivo muy grande',
        description: 'El archivo no puede superar los 10MB.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      e.target.value = null; // Limpiar input
      handleChange('archivo', null);
      return;
    }

    handleChange('archivo', file);
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: 'Error en el formulario',
        description: 'Por favor corrige los errores marcados.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo.trim());
      formDataToSend.append('resumen', formData.resumen.trim());
      const palabrasClaveArray = formData.palabras_clave.trim().split(',').map(p => p.trim()).filter(p => p.length > 0);
      formDataToSend.append('palabras_clave', JSON.stringify(palabrasClaveArray));
      formDataToSend.append('area_tematica', formData.categoria);
      formDataToSend.append('archivos', formData.archivo);

      await articulosAPI.crearConArchivo(formDataToSend);

      toast({
        title: 'Artículo creado exitosamente',
        description: `Tu artículo "${formData.titulo}" ha sido enviado y está en revisión.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });

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
        <Box>
          <Heading size="lg" mb={2}>Nuevo Artículo</Heading>
          <Text color="gray.600">
            Enviado por: {user?.nombre || 'Usuario'} ({user?.email})
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            
            <FormControl isInvalid={!!errors.titulo}>
              <FormLabel>Título del Artículo</FormLabel>
              <Input
                value={formData.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                placeholder="Escribe el título de tu artículo..."
              />
              <FormErrorMessage>{errors.titulo}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.categoria}>
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

            <FormControl>
              <FormLabel>Palabras Clave (separadas por comas)</FormLabel>
              <Input
                value={formData.palabras_clave}
                onChange={(e) => handleChange('palabras_clave', e.target.value)}
                placeholder="palabra1, palabra2, palabra3..."
              />
            </FormControl>

            <FormControl isInvalid={!!errors.resumen}>
              <FormLabel>Resumen</FormLabel>
              <Textarea
                value={formData.resumen}
                onChange={(e) => handleChange('resumen', e.target.value)}
                placeholder="Escribe un resumen del artículo..."
                rows={4}
              />
              <FormErrorMessage>{errors.resumen}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.archivo}>
              <FormLabel>Archivo del Artículo (PDF, DOC, DOCX - Máx 10MB)</FormLabel>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                p={1} // Estilo para que se vea mejor
              />
              <FormErrorMessage>{errors.archivo}</FormErrorMessage>
            </FormControl>

            <Button
              mt={4}
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText="Guardando..."
            >
              Guardar Artículo
            </Button>
            
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default NuevoArticuloPage;
