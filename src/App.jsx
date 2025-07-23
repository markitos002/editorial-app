import { ChakraProvider, Box, Heading, Text, createSystem, defaultConfig } from '@chakra-ui/react';

const system = createSystem(defaultConfig);

function App() {
  return (
    <ChakraProvider value={system}>
      <Box p={4}>
        <Heading>Editorial App</Heading>
        <Text mt={2}>¡Bienvenido a tu nueva aplicación con Chakra UI y React!</Text>
      </Box>
    </ChakraProvider>
  );
}

export default App;
