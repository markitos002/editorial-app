// pages/TestPage.jsx - Página de prueba completamente aislada
import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';

const TestPage = () => {
  console.log('TestPage: Renderizando página de prueba...');
  
  return (
    <Box p={8} maxW="800px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" color="green.600" mb={4}>
        ✅ Página de Prueba - Funcionando
      </Text>
      <Text mb={4}>
        Esta página usa solo componentes básicos de Chakra UI sin AuthContext, Layout, o Navigation.
      </Text>
      <Text mb={4}>
        Si esta página funciona en producción, el problema está en otro componente.
      </Text>
      <Button colorScheme="blue" onClick={() => alert('¡Funciona!')}>
        Probar Interacción
      </Button>
      
      <Box mt={8} p={4} bg="gray.100" borderRadius="md">
        <Text fontWeight="bold" mb={2}>Debugging Info:</Text>
        <Text fontSize="sm">- React: {React.version}</Text>
        <Text fontSize="sm">- Date: {new Date().toISOString()}</Text>
        <Text fontSize="sm">- Environment: {process.env.NODE_ENV || 'development'}</Text>
      </Box>
    </Box>
  );
};

export default TestPage;
