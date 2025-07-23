// Test simple para verificar si React funciona
import { ChakraProvider, Box, Heading, Text } from '@chakra-ui/react';

function SimpleApp() {
  return (
    <ChakraProvider>
      <Box p={8}>
        <Heading>Prueba Simple</Heading>
        <Text>Si ves esto, React y Chakra están funcionando</Text>
      </Box>
    </ChakraProvider>
  );
}

export default SimpleApp;
