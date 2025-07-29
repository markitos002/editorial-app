// components/CustomDrawer.jsx - Drawer personalizado que evita errores de Chakra UI
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

const CustomDrawer = ({ 
  isOpen, 
  onClose, 
  children,
  placement = 'left',
  size = 'md'
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const overlayBg = useColorModeValue('blackAlpha.600', 'blackAlpha.800');
  
  const sizeProps = {
    sm: { width: '200px' },
    md: { width: '300px' },
    lg: { width: '400px' },
    xl: { width: '500px' }
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
        onClick={handleOverlayClick}
      >
        <Box
          position="fixed"
          top="0"
          left={placement === 'left' ? '0' : 'auto'}
          right={placement === 'right' ? '0' : 'auto'}
          bottom="0"
          bg={bg}
          {...sizeProps[size]}
          boxShadow="xl"
          overflow="auto"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </Box>
      </Box>
    </Portal>
  );
};

const CustomDrawerHeader = ({ children, onClose, ...props }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <HStack
      justify="space-between"
      align="center"
      p={4}
      borderBottom="1px"
      borderColor={borderColor}
      {...props}
    >
      <Box flex={1}>{children}</Box>
      {onClose && (
        <IconButton
          icon={<FiX />}
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Cerrar drawer"
        />
      )}
    </HStack>
  );
};

const CustomDrawerBody = ({ children, ...props }) => {
  return (
    <Box flex={1} overflow="auto" {...props}>
      {children}
    </Box>
  );
};

export { CustomDrawer, CustomDrawerHeader, CustomDrawerBody };
