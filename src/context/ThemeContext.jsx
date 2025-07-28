// context/ThemeContext.jsx - Contexto para el sistema de temas oscuro/claro
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorMode, useColorModeValue } from '@chakra-ui/react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  
  // Colores personalizados para el tema editorial
  const colors = {
    // Tema claro
    light: {
      bg: 'white',
      cardBg: 'white',
      border: 'gray.200',
      text: 'gray.800',
      textSecondary: 'gray.600',
      primary: 'blue.500',
      primaryHover: 'blue.600',
      secondary: 'gray.100',
      accent: 'purple.500',
      success: 'green.500',
      warning: 'orange.500',
      error: 'red.500',
      shadow: 'lg',
      navbar: 'white',
      sidebar: 'gray.50'
    },
    // Tema oscuro
    dark: {
      bg: 'gray.900',
      cardBg: 'gray.800',
      border: 'gray.600',
      text: 'white',
      textSecondary: 'gray.300',
      primary: 'blue.400',
      primaryHover: 'blue.300',
      secondary: 'gray.700',
      accent: 'purple.400',
      success: 'green.400',
      warning: 'orange.400',
      error: 'red.400',
      shadow: 'dark-lg',
      navbar: 'gray.800',
      sidebar: 'gray.900'
    }
  };

  // Obtener colores actuales basados en el modo
  const currentColors = colors[colorMode];

  // Funciones utilitarias para colores dinámicos
  const getColor = (lightColor, darkColor) => {
    return colorMode === 'light' ? lightColor : darkColor;
  };

  // Valores de color usando useColorModeValue
  const bgColor = useColorModeValue(colors.light.bg, colors.dark.bg);
  const cardBgColor = useColorModeValue(colors.light.cardBg, colors.dark.cardBg);
  const borderColor = useColorModeValue(colors.light.border, colors.dark.border);
  const textColor = useColorModeValue(colors.light.text, colors.dark.text);
  const textSecondaryColor = useColorModeValue(colors.light.textSecondary, colors.dark.textSecondary);

  // Configuración de animaciones
  const animations = {
    transition: '0.2s ease-in-out',
    hoverTransform: 'translateY(-2px)',
    clickTransform: 'scale(0.98)',
    fadeIn: 'fadeIn 0.3s ease-in-out',
    slideIn: 'slideInFromRight 0.3s ease-out'
  };

  // Estado para animaciones
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Persistir preferencia de tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('editorial-theme');
    if (savedTheme && savedTheme !== colorMode) {
      toggleColorMode();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('editorial-theme', colorMode);
  }, [colorMode]);

  const value = {
    // Estado del tema
    colorMode,
    toggleColorMode,
    isDark: colorMode === 'dark',
    
    // Colores
    colors: currentColors,
    bgColor,
    cardBgColor,
    borderColor,
    textColor,
    textSecondaryColor,
    getColor,
    
    // Animaciones
    animations,
    animationsEnabled,
    setAnimationsEnabled,
    
    // Utilidades de estilo
    cardStyle: {
      bg: cardBgColor,
      borderColor: borderColor,
      borderWidth: '1px',
      shadow: currentColors.shadow,
      transition: animations.transition,
      _hover: animationsEnabled ? {
        transform: animations.hoverTransform,
        shadow: 'xl'
      } : {}
    },
    
    buttonStyle: {
      transition: animations.transition,
      _hover: animationsEnabled ? {
        transform: 'translateY(-1px)'
      } : {},
      _active: animationsEnabled ? {
        transform: animations.clickTransform
      } : {}
    },
    
    inputStyle: {
      bg: cardBgColor,
      borderColor: borderColor,
      color: textColor,
      _focus: {
        borderColor: currentColors.primary,
        boxShadow: `0 0 0 1px ${currentColors.primary}`
      }
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
