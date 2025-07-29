// components/CustomTooltip.jsx - Tooltip personalizado que evita errores de Chakra UI
import React, { useState } from 'react';
import {
  Box,
  Portal,
  useColorModeValue
} from '@chakra-ui/react';

const CustomTooltip = ({ 
  children, 
  label, 
  placement = 'top',
  fontSize = 'sm'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const bg = useColorModeValue('gray.700', 'gray.200');
  const color = useColorModeValue('white', 'gray.800');

  if (!label) return children;

  return (
    <Box
      position="relative"
      display="inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <Portal>
          <Box
            position="fixed"
            bg={bg}
            color={color}
            px={2}
            py={1}
            borderRadius="md"
            fontSize={fontSize}
            zIndex={1500}
            whiteSpace="nowrap"
            maxW="200px"
            wordBreak="break-word"
            // Posicionamiento simple - en el cursor del mouse
            style={{
              left: '50%',
              top: '10px',
              transform: 'translateX(-50%)'
            }}
          >
            {label}
          </Box>
        </Portal>
      )}
    </Box>
  );
};

export default CustomTooltip;
