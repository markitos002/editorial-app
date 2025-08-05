// pages/TestLayoutPage.jsx - Prueba con Layout pero sin AuthContext
import React from 'react';
import { Box, Text, Button, VStack } from '@chakra-ui/react';

const TestLayoutPage = () => {
  console.log('TestLayoutPage: Renderizando con Layout...');
  
  return (
    <Box p={8} maxW="800px" mx="auto">
      <VStack spacing={6} align="start">
        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
          🧪 Prueba con Layout
        </Text>
        
        <Text>
          Esta página se renderiza dentro del Layout normal pero sin usar AuthContext directamente.
        </Text>
        
        <Text>
          Si esta funciona pero /articles/new no, el problema está en NuevoArticuloPage o ProtectedRoute.
        </Text>
        
        <Button colorScheme="green" onClick={() => console.log('Test Layout clicked')}>
          Probar Layout
        </Button>
        
        <Box p={4} bg="blue.50" borderRadius="md" w="100%">
          <Text fontWeight="bold">Layout Test Info:</Text>
          <Text fontSize="sm">- Componente: TestLayoutPage</Text>
          <Text fontSize="sm">- Layout: Activo</Text>
          <Text fontSize="sm">- AuthContext: No usado directamente</Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default TestLayoutPage;
