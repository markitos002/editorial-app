// pages/NuevoArticuloPage.jsx
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Checkbox,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Card,
  CardHeader,
  CardBody,
  Badge,
  useToast,
  Progress,
  Collapse,
  useDisclosure
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

const NuevoArticuloPage = () => {
  console.log('NuevoArticuloPage: Iniciando render...');
  
  const { user } = useAuth();
  console.log('NuevoArticuloPage: User obtenido:', user);
  
  const toast = useToast();
  const { isOpen: isChecklistOpen, onToggle: onChecklistToggle } = useDisclosure({ defaultIsOpen: true });
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    palabrasClave: '',
    comentariosEditor: '',
    archivo: null
  });
  
  // Estados de la lista de comprobación
  const [checklist, setChecklist] = useState({
    originalidad: false,
    formato: false,
    referencias: false,
    formatoTexto: false,
    estilo: false,
    evaluacionAnonima: false
  });
  
  // Estados de validación y envío
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calcular progreso de la lista de comprobación
  const checklistItems = Object.values(checklist);
  const completedItems = checklistItems.filter(Boolean).length;
  const progressPercentage = (completedItems / checklistItems.length) * 100;
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };
  
  const handleChecklistChange = (item, checked) => {
    setChecklist(prev => ({
      ...prev,
      [item]: checked
    }));
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/msword', // .doc
        'application/rtf', // .rtf
        'application/vnd.oasis.opendocument.text' // .odt
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Formato de archivo no válido',
          description: 'Por favor, seleccione un archivo .doc, .docx, .rtf o .odt',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        archivo: file
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    }
    
    if (!formData.resumen.trim()) {
      newErrors.resumen = 'El resumen es requerido';
    } else if (formData.resumen.length > 250) {
      newErrors.resumen = 'El resumen no puede exceder 250 caracteres';
    }
    
    if (!formData.palabrasClave.trim()) {
      newErrors.palabrasClave = 'Las palabras clave son requeridas';
    }
    
    if (!formData.archivo) {
      newErrors.archivo = 'Debe subir un archivo del artículo';
    }
    
    // Validar que todas las casillas estén marcadas
    const allChecked = Object.values(checklist).every(Boolean);
    if (!allChecked) {
      newErrors.checklist = 'Debe completar toda la lista de comprobación';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Error en el formulario',
        description: 'Por favor, complete todos los campos requeridos y la lista de comprobación.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Aquí iría la lógica para enviar el artículo
      // Por ahora simulamos el envío
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Artículo enviado exitosamente',
        description: 'Su artículo ha sido enviado para revisión. Recibirá una confirmación por email.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Resetear formulario
      setFormData({
        titulo: '',
        resumen: '',
        palabrasClave: '',
        comentariosEditor: '',
        archivo: null
      });
      
      setChecklist({
        originalidad: false,
        formato: false,
        referencias: false,
        formatoTexto: false,
        estilo: false,
        evaluacionAnonima: false
      });
      
    } catch (error) {
      toast({
        title: 'Error al enviar artículo',
        description: 'Hubo un problema al enviar su artículo. Por favor, inténtelo de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  console.log('NuevoArticuloPage: Llegando al render JSX...');
  
  return (
    <Box maxW="4xl" mx="auto" p={6}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="purple.600" mb={2}>
            📝 Envío de Nuevo Artículo
          </Text>
          <Text color="gray.600">
            Revista Manos al Cuidado - Complete el formulario y la lista de comprobación para enviar su artículo.
          </Text>
          <Badge colorScheme="blue" mt={2}>
            Usuario: {user?.nombre || 'Cargando...'} ({user?.rol || 'N/A'})
          </Badge>
        </Box>
        
        {/* Lista de Comprobación */}
        <Card>
          <CardHeader>
            <HStack justify="space-between" cursor="pointer" onClick={onChecklistToggle}>
              <VStack align="start" spacing={1}>
                <Text fontSize="lg" fontWeight="bold">
                  📋 Lista de Comprobación para Envíos
                </Text>
                <HStack>
                  <Progress 
                    value={progressPercentage} 
                    size="sm" 
                    colorScheme={progressPercentage === 100 ? "green" : "blue"}
                    w="200px"
                  />
                  <Text fontSize="sm" color="gray.600">
                    {completedItems}/{checklistItems.length} completados
                  </Text>
                </HStack>
              </VStack>
              {isChecklistOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </HStack>
          </CardHeader>
          
          <Collapse in={isChecklistOpen}>
            <CardBody pt={0}>
              <Alert status="info" mb={4}>
                <AlertIcon />
                <Box>
                  <AlertTitle>¡Importante!</AlertTitle>
                  <AlertDescription>
                    Como parte del proceso de envío, debe comprobar que su artículo cumpla todos los elementos listados. 
                    Se devolverán aquellos envíos que no cumplan estas directrices.
                  </AlertDescription>
                </Box>
              </Alert>
              
              <VStack align="start" spacing={3}>
                <Checkbox
                  isChecked={checklist.originalidad}
                  onChange={(e) => handleChecklistChange('originalidad', e.target.checked)}
                  colorScheme="green"
                >
                  <Text fontSize="sm">
                    El envío no ha sido publicado previamente ni se ha sometido a consideración por ninguna otra revista 
                    (o se ha proporcionado una explicación en los Comentarios al editor/a).
                  </Text>
                </Checkbox>
                
                <Checkbox
                  isChecked={checklist.formato}
                  onChange={(e) => handleChecklistChange('formato', e.target.checked)}
                  colorScheme="green"
                >
                  <Text fontSize="sm">
                    El archivo de envío está en formato OpenOffice, Microsoft Word, RTF o WordPerfect.
                  </Text>
                </Checkbox>
                
                <Checkbox
                  isChecked={checklist.referencias}
                  onChange={(e) => handleChecklistChange('referencias', e.target.checked)}
                  colorScheme="green"
                >
                  <Text fontSize="sm">
                    Siempre que sea posible, se proporcionan direcciones URL para las referencias.
                  </Text>
                </Checkbox>
                
                <Checkbox
                  isChecked={checklist.formatoTexto}
                  onChange={(e) => handleChecklistChange('formatoTexto', e.target.checked)}
                  colorScheme="green"
                >
                  <Text fontSize="sm">
                    El texto se adhiere a los requisitos estilísticos y bibliográficos incluidos en las 
                    Directrices del autor/a, que aparecen en Acerca de la revista.
                  </Text>
                </Checkbox>
                
                <Checkbox
                  isChecked={checklist.estilo}
                  onChange={(e) => handleChecklistChange('estilo', e.target.checked)}
                  colorScheme="green"
                >
                  <Text fontSize="sm">
                    Si se envía a una sección evaluada por pares de la revista, deben seguirse las instrucciones en 
                    Asegurar una evaluación anónima.
                  </Text>
                </Checkbox>
                
                <Checkbox
                  isChecked={checklist.evaluacionAnonima}
                  onChange={(e) => handleChecklistChange('evaluacionAnonima', e.target.checked)}
                  colorScheme="green"
                >
                  <Text fontSize="sm">
                    El archivo enviado se ha eliminado toda información que pueda identificar al autor/a del trabajo.
                  </Text>
                </Checkbox>
              </VStack>
              
              {errors.checklist && (
                <Text color="red.500" fontSize="sm" mt={2}>
                  {errors.checklist}
                </Text>
              )}
            </CardBody>
          </Collapse>
        </Card>
        
        {/* Formulario de Envío */}
        <Card>
          <CardHeader>
            <Text fontSize="lg" fontWeight="bold">
              📄 Datos del Artículo
            </Text>
          </CardHeader>
          
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                {/* Título */}
                <FormControl isRequired isInvalid={errors.titulo}>
                  <FormLabel>Título del Artículo</FormLabel>
                  <Input
                    value={formData.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    placeholder="Ingrese el título completo del artículo"
                  />
                  <FormErrorMessage>{errors.titulo}</FormErrorMessage>
                </FormControl>
                
                {/* Resumen */}
                <FormControl isRequired isInvalid={errors.resumen}>
                  <FormLabel>Resumen (máximo 250 palabras)</FormLabel>
                  <Textarea
                    value={formData.resumen}
                    onChange={(e) => handleInputChange('resumen', e.target.value)}
                    placeholder="Escriba un resumen claro y conciso del artículo"
                    rows={6}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {formData.resumen.length}/250 caracteres
                  </Text>
                  <FormErrorMessage>{errors.resumen}</FormErrorMessage>
                </FormControl>
                
                {/* Palabras Clave */}
                <FormControl isRequired isInvalid={errors.palabrasClave}>
                  <FormLabel>Palabras Clave (3-6 términos, separados por comas)</FormLabel>
                  <Input
                    value={formData.palabrasClave}
                    onChange={(e) => handleInputChange('palabrasClave', e.target.value)}
                    placeholder="palabra1, palabra2, palabra3"
                  />
                  <FormErrorMessage>{errors.palabrasClave}</FormErrorMessage>
                </FormControl>
                
                {/* Archivo */}
                <FormControl isRequired isInvalid={errors.archivo}>
                  <FormLabel>Archivo del Artículo</FormLabel>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    accept=".doc,.docx,.rtf,.odt"
                    p={1}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Formatos aceptados: .doc, .docx, .rtf, .odt
                  </Text>
                  {formData.archivo && (
                    <Text fontSize="sm" color="green.600" mt={2}>
                      ✅ Archivo seleccionado: {formData.archivo.name}
                    </Text>
                  )}
                  <FormErrorMessage>{errors.archivo}</FormErrorMessage>
                </FormControl>
                
                {/* Comentarios al Editor */}
                <FormControl>
                  <FormLabel>Comentarios al Editor/a (opcional)</FormLabel>
                  <Textarea
                    value={formData.comentariosEditor}
                    onChange={(e) => handleInputChange('comentariosEditor', e.target.value)}
                    placeholder="Comentarios adicionales para el editor, explicaciones sobre publicaciones previas, etc."
                    rows={4}
                  />
                </FormControl>
                
                <Divider />
                
                {/* Declaración de Privacidad */}
                <Alert status="info">
                  <AlertIcon />
                  <Box ml={3}>
                    <AlertTitle>Declaración de Privacidad</AlertTitle>
                    <AlertDescription>
                      Los nombres y las direcciones de correo electrónico introducidos en esta revista se usarán 
                      exclusivamente para los fines establecidos en ella y no se proporcionarán a terceros o para su uso con otros fines.
                    </AlertDescription>
                  </Box>
                </Alert>
                
                {/* Botones de Acción */}
                <HStack justify="space-between" pt={4}>
                  <Button variant="outline" size="lg">
                    Guardar Borrador
                  </Button>
                  
                  <Button
                    type="submit"
                    colorScheme="purple"
                    size="lg"
                    isLoading={isSubmitting}
                    loadingText="Enviando..."
                    isDisabled={progressPercentage !== 100}
                  >
                    Enviar Artículo
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
