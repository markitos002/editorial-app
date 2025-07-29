// hooks/useResponsive.js - Hook personalizado sin dependencias de Framer Motion
import { useState, useEffect } from 'react';

// Hook personalizado para detectar responsive breakpoints
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isTablet, isDesktop };
};

// Hook personalizado para modals sin useDisclosure
export const useModal = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen(prev => !prev);
  
  return { isOpen, onOpen, onClose, onToggle };
};

// Función para obtener valores responsive sin useBreakpointValue  
export const getResponsiveValue = (values, breakpoint) => {
  if (typeof values === 'object' && values !== null) {
    if (breakpoint === 'mobile' && values.base) return values.base;
    if (breakpoint === 'tablet' && (values.md || values.base)) return values.md || values.base;
    if (breakpoint === 'desktop' && (values.lg || values.md || values.base)) return values.lg || values.md || values.base;
    return values.base || values;
  }
  return values;
};
