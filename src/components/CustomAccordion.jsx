// components/CustomAccordion.jsx - Accordion personalizado que evita errores de Chakra UI
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  IconButton,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

const CustomAccordion = ({ 
  children, 
  allowToggle = true,
  allowMultiple = false,
  defaultIndex = [],
  ...props 
}) => {
  const [openIndexes, setOpenIndexes] = useState(
    Array.isArray(defaultIndex) ? defaultIndex : 
    typeof defaultIndex === 'number' ? [defaultIndex] : []
  );

  const toggleIndex = (index) => {
    setOpenIndexes(prev => {
      if (allowMultiple) {
        return prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index];
      } else {
        return prev.includes(index) ? [] : [index];
      }
    });
  };

  const childrenWithProps = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        index,
        isOpen: openIndexes.includes(index),
        onToggle: () => toggleIndex(index)
      });
    }
    return child;
  });

  return (
    <VStack spacing={0} align="stretch" {...props}>
      {childrenWithProps}
    </VStack>
  );
};

const CustomAccordionItem = ({ 
  children, 
  index, 
  isOpen, 
  onToggle,
  ...props 
}) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box
      border="1px"
      borderColor={borderColor}
      borderTop={index === 0 ? "1px" : "0"}
      {...props}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, onToggle });
        }
        return child;
      })}
    </Box>
  );
};

const CustomAccordionButton = ({ 
  children, 
  isOpen, 
  onToggle,
  ...props 
}) => {
  const bg = useColorModeValue('gray.50', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  
  return (
    <HStack
      as="button"
      w="full"
      p={4}
      justify="space-between"
      align="center"
      bg={isOpen ? bg : 'transparent'}
      _hover={{ bg: hoverBg }}
      transition="background-color 0.2s"
      onClick={onToggle}
      cursor="pointer"
      {...props}
    >
      <Box flex={1} textAlign="left">
        {children}
      </Box>
      <Box color="gray.500">
        {isOpen ? <FiChevronDown /> : <FiChevronRight />}
      </Box>
    </HStack>
  );
};

const CustomAccordionPanel = ({ 
  children, 
  isOpen,
  ...props 
}) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  if (!isOpen) return null;
  
  return (
    <Box
      p={4}
      borderTop="1px"
      borderColor={borderColor}
      {...props}
    >
      {children}
    </Box>
  );
};

export { 
  CustomAccordion, 
  CustomAccordionItem, 
  CustomAccordionButton, 
  CustomAccordionPanel 
};
