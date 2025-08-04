// pages/NuevoArticuloPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Text,
  VStack,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  useDisclosure,
  HStack,
  Progress,
  Collapse,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Checkbox,
  Button
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

const NuevoArticuloPage = () => {
  console.log('NuevoArticuloPage: Paso 4 - Agregando formularios...');
  
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen: isChecklistOpen, onToggle: onChecklistToggle } = useDisclosure({ defaultIsOpen: true });
  
  // Estados de ejemplo
  const [formData, setFormData] = useState({
    titulo: '',
    resumen: ''
  });
  
  const [checklist, setChecklist] = useState({
    originalidad: false,
    formato: false
  });
  
  const [errors, setErrors] = useState({});
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleChecklistChange = (item, checked) => {
    setChecklist(prev => ({
      ...prev,
      [item]: checked
    }));
  };
  
  console.log('Debug - FormData:', formData);
  console.log('Debug - Checklist:', checklist);
  
  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" color="purple.600">
          📝 Envío de Nuevo Artículo - Debug Paso 4
        </Text>
        
        {user && (
          <Badge colorScheme="blue">
            Usuario: {user.nombre || 'Sin nombre'} ({user.rol || 'Sin rol'})
          </Badge>
        )}
        
        <Card>
          <CardHeader>
            <Text fontSize="lg" fontWeight="bold">
              Formulario de Test
            </Text>
          </CardHeader>
          
          <CardBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired isInvalid={errors.titulo}>
                <FormLabel>Título del Artículo</FormLabel>
                <Input
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  placeholder="Ingrese el título"
                />
                <FormErrorMessage>{errors.titulo}</FormErrorMessage>
              </FormControl>
              
              <FormControl isRequired isInvalid={errors.resumen}>
                <FormLabel>Resumen</FormLabel>
                <Textarea
                  value={formData.resumen}
                  onChange={(e) => handleInputChange('resumen', e.target.value)}
                  placeholder="Escriba un resumen"
                  rows={3}
                />
                <FormErrorMessage>{errors.resumen}</FormErrorMessage>
              </FormControl>
              
              <VStack align="start" spacing={2}>
                <Checkbox
                  isChecked={checklist.originalidad}
                  onChange={(e) => handleChecklistChange('originalidad', e.target.checked)}
                  colorScheme="green"
                >
                  <Text fontSize="sm">
                    El envío no ha sido publicado previamente
                  </Text>
                </Checkbox>
                
                <Checkbox
                  isChecked={checklist.formato}
                  onChange={(e) => handleChecklistChange('formato', e.target.checked)}
                  colorScheme="green"
                >
                  <Text fontSize="sm">
                    El archivo está en formato correcto
                  </Text>
                </Checkbox>
              </VStack>
              
              <Button colorScheme="purple" size="lg">
                Test Submit
              </Button>
            </VStack>
          </CardBody>
        </Card>
        
        <Text color="green.500">
          ✅ Formularios funcionando: Input, Textarea, Checkbox, FormControl
        </Text>
      </VStack>
    </Box>
  );
};

export default NuevoArticuloPage;
