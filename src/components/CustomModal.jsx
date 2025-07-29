// components/CustomModal.jsx - Modal personalizado que evita errores de Chakra UI
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  IconButton,
  Heading,
  useColorModeValue,
  Portal
} from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';

const CustomModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const overlayBg = useColorModeValue('blackAlpha.600', 'blackAlpha.800');
  
  const sizeProps = {
    sm: { maxW: '400px' },
    md: { maxW: '500px' },
    lg: { maxW: '700px' },
    xl: { maxW: '900px' }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Portal>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg={overlayBg}
        zIndex={1300}
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={handleOverlayClick}
      >
        <Box
          bg={bg}
          borderRadius="md"
          boxShadow="2xl"
          {...sizeProps[size]}
          maxH="90vh"
          m={4}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <HStack
            justify="space-between"
            align="center"
            p={4}
            borderBottom="1px"
            borderColor="gray.200"
          >
            <Heading size="md">{title}</Heading>
            <IconButton
              icon={<FiX />}
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Cerrar modal"
            />
          </HStack>
          
          {/* Body */}
          <Box p={4} overflowY="auto" maxH="calc(90vh - 80px)">
            {children}
          </Box>
        </Box>
      </Box>
    </Portal>
  );
};

export default CustomModal;
