// components/ThemeToggle.jsx - Componente para cambiar entre tema claro y oscuro
import React from 'react';
import {
  IconButton,
  useColorMode,
  Tooltip,
  HStack,
  VStack,
  Text,
  Switch,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider
} from '@chakra-ui/react';
import { FiSun, FiMoon, FiSettings } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ variant = 'icon' }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { animationsEnabled, setAnimationsEnabled, colors } = useTheme();

  if (variant === 'switch') {
    return (
      <HStack spacing={3} p={2}>
        <FiSun />
        <Switch 
          isChecked={colorMode === 'dark'} 
          onChange={toggleColorMode}
          colorScheme="blue"
          size="md"
        />
        <FiMoon />
        <Text fontSize="sm" color={colors.textSecondary}>
          {colorMode === 'light' ? 'Claro' : 'Oscuro'}
        </Text>
      </HStack>
    );
  }

  if (variant === 'menu') {
    return (
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<FiSettings />}
          variant="ghost"
          size="sm"
          aria-label="Configuración de tema"
        />
        <MenuList>
          <MenuItem 
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
          >
            Cambiar a tema {colorMode === 'light' ? 'oscuro' : 'claro'}
          </MenuItem>
          <MenuDivider />
          <MenuItem 
            icon={<FiSettings />}
            closeOnSelect={false}
          >
            <HStack justify="space-between" width="100%">
              <Text fontSize="sm">Animaciones</Text>
              <Switch 
                isChecked={animationsEnabled}
                onChange={(e) => setAnimationsEnabled(e.target.checked)}
                size="sm"
                colorScheme="blue"
              />
            </HStack>
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }

  // Variant por defecto: 'icon'
  return (
    <Tooltip 
      label={`Cambiar a tema ${colorMode === 'light' ? 'oscuro' : 'claro'}`}
      hasArrow
    >
      <IconButton
        aria-label="Cambiar tema"
        icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
        onClick={toggleColorMode}
        variant="ghost"
        size="md"
        color={colors.text}
        _hover={{
          bg: colors.secondary,
          transform: animationsEnabled ? 'rotate(180deg)' : 'none'
        }}
        transition="all 0.3s ease-in-out"
      />
    </Tooltip>
  );
};

// Componente adicional para mostrar el estado del tema
export const ThemeStatus = () => {
  const { colorMode, colors, animationsEnabled } = useTheme();
  
  return (
    <Box 
      p={3} 
      bg={colors.cardBg} 
      borderRadius="md" 
      border="1px" 
      borderColor={colors.border}
    >
      <HStack justify="space-between">
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" fontWeight="semibold" color={colors.text}>
            Tema actual: {colorMode === 'light' ? 'Claro' : 'Oscuro'}
          </Text>
          <Text fontSize="xs" color={colors.textSecondary}>
            Animaciones: {animationsEnabled ? 'Activadas' : 'Desactivadas'}
          </Text>
        </VStack>
        <Box
          w={4}
          h={4}
          borderRadius="full"
          bg={colorMode === 'light' ? 'yellow.400' : 'blue.400'}
        />
      </HStack>
    </Box>
  );
};

export default ThemeToggle;
