// Versión minimalista para debugging
import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const NuevoArticuloPageSimple = () => {
  console.log('NuevoArticuloPageSimple: Rendering...');
  
  return (
    <Box p={6}>
      <Text>Página de Nuevo Artículo - Versión Simple</Text>
    </Box>
  );
};

export default NuevoArticuloPageSimple;
