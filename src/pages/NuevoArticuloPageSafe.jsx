// pages/NuevoArticuloPageSafe.jsx
import React from 'react';
import { Box, Text, Alert, AlertIcon } from '@chakra-ui/react';

const NuevoArticuloPageSafe = () => {
  console.log('NuevoArticuloPageSafe: Iniciando...');
  
  try {
    return (
      <Box p={6}>
        <Text fontSize="2xl" fontWeight="bold" color="purple.600" mb={4}>
          📝 Nuevo Artículo - Versión Segura
        </Text>
        
        <Alert status="info">
          <AlertIcon />
          Esta es una versión simplificada para debugging del React error #31
        </Alert>
        
        <Text mt={4}>
          Si ves este mensaje, el componente básico funciona correctamente.
        </Text>
      </Box>
    );
  } catch (error) {
    console.error('Error en NuevoArticuloPageSafe:', error);
    return (
      <Box p={6}>
        <Text color="red.500">
          Error capturado: {error.message}
        </Text>
      </Box>
    );
  }
};

export default NuevoArticuloPageSafe;
