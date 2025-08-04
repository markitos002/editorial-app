// Debug component for NuevoArticuloPage
import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack,
  Button,
  Input,
  FormControl,
  FormLabel,
  Card,
  CardHeader,
  CardBody
} from '@chakra-ui/react';

const NuevoArticuloPageDebug = () => {
  console.log('NuevoArticuloPageDebug rendering...');
  
  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch" maxW="4xl" mx="auto">
        <Box>
          <Heading>🆕 Enviar Nuevo Artículo</Heading>
          <Text color="gray.600" mt={2}>
            Esta página está funcionando correctamente. Debug version.
          </Text>
        </Box>
        
        <Card>
          <CardHeader>
            <Heading size="md">Formulario de Prueba</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Título del Artículo</FormLabel>
                <Input placeholder="Ingrese el título" />
              </FormControl>
              
              <Button colorScheme="blue" size="lg">
                Probar Funcionalidad
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default NuevoArticuloPageDebug;
