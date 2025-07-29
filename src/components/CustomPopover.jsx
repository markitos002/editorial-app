// components/CustomPopover.jsx - Popover personalizado que evita errores de Chakra UI
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  IconButton,
  Heading,
  useColorModeValue,
  Portal,
  useOutsideClick
} from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';

const CustomPopover = ({ 
  trigger, 
  children, 
  title,
  placement = 'bottom-start',
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onOpen: controlledOnOpen
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const popoverRef = useRef();
  const triggerRef = useRef();
  
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const onClose = controlledOnClose || (() => setInternalIsOpen(false));
  const onOpen = controlledOnOpen || (() => setInternalIsOpen(true));
  
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const shadow = useColorModeValue('lg', 'dark-lg');

  useOutsideClick({
    ref: popoverRef,
    handler: onClose,
  });

  const handleTriggerClick = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  if (!isOpen) {
    return (
      <Box ref={triggerRef} onClick={handleTriggerClick} display="inline-block">
        {trigger}
      </Box>
    );
  }

  return (
    <>
      <Box ref={triggerRef} onClick={handleTriggerClick} display="inline-block">
        {trigger}
      </Box>
      <Portal>
        <Box
          ref={popoverRef}
          position="fixed"
          zIndex={1400}
          bg={bg}
          border="1px"
          borderColor={borderColor}
          borderRadius="md"
          boxShadow={shadow}
          minW="300px"
          maxW="400px"
          // Posicionamiento simple - en una implementación real usarías una librería como Popper.js
          top="60px"
          right="20px"
        >
          {title && (
            <HStack
              justify="space-between"
              align="center"
              p={3}
              borderBottom="1px"
              borderColor={borderColor}
            >
              <Heading size="sm">{title}</Heading>
              <IconButton
                icon={<FiX />}
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Cerrar popover"
              />
            </HStack>
          )}
          
          <Box p={0}>
            {children}
          </Box>
        </Box>
      </Portal>
    </>
  );
};

export default CustomPopover;
