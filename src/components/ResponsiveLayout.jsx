// components/ResponsiveLayout.jsx - Layout responsive mejorado para la aplicación
import React, { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  useDisclosure,
  useBreakpointValue,
  Container,
  Show,
  Hide
} from '@chakra-ui/react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import AppNavigation from './AppNavigation';
import ThemeToggle from './ThemeToggle';

const ResponsiveLayout = ({ children, showSidebar = true }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colors, cardStyle, animationsEnabled } = useTheme();
  
  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });
  const sidebarWidth = useBreakpointValue({ base: '100%', md: '250px', lg: '280px' });
  const containerMaxW = useBreakpointValue({ base: '100%', md: 'container.xl', lg: 'container.2xl' });
  
  // Estado para colapsar sidebar en desktop
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarContent = (
    <VStack spacing={4} align="stretch" height="100%">
      <Box p={4}>
        <AppNavigation onItemClick={isMobile ? onClose : undefined} />
      </Box>
      
      {/* Controles de tema en sidebar mobile */}
      {isMobile && (
        <Box p={4} borderTop="1px" borderColor={colors.border}>
          <ThemeToggle variant="switch" />
        </Box>
      )}
    </VStack>
  );

  return (
    <Flex minHeight="100vh" bg={colors.bg}>
      {/* Sidebar para desktop */}
      <Show above="md">
        {showSidebar && (
          <Box
            width={sidebarCollapsed ? '60px' : sidebarWidth}
            bg={colors.sidebar}
            borderRight="1px"
            borderColor={colors.border}
            transition={animationsEnabled ? 'width 0.3s ease-in-out' : 'none'}
            position="sticky"
            top={0}
            height="100vh"
            overflowY="auto"
            className="animate-slide-in-left"
          >
            <Flex direction="column" height="100%">
              {/* Header del sidebar */}
              <HStack 
                p={4} 
                justify="space-between" 
                borderBottom="1px" 
                borderColor={colors.border}
              >
                {!sidebarCollapsed && (
                  <Box className="animate-fade-in">
                    Editorial System
                  </Box>
                )}
                <IconButton
                  icon={sidebarCollapsed ? <FiMenu /> : <FiX />}
                  size="sm"
                  variant="ghost"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  aria-label={sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
                />
              </HStack>
              
              {/* Contenido del sidebar */}
              {!sidebarCollapsed && (
                <Box flex={1} className="animate-fade-in">
                  {sidebarContent}
                </Box>
              )}
            </Flex>
          </Box>
        )}
      </Show>

      {/* Drawer para mobile */}
      <Hide above="md">
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          size="sm"
        >
          <DrawerOverlay />
          <DrawerContent bg={colors.sidebar}>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px" borderColor={colors.border}>
              Editorial System
            </DrawerHeader>
            <DrawerBody p={0}>
              {sidebarContent}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Hide>

      {/* Contenido principal */}
      <Flex direction="column" flex={1} overflow="hidden">
        {/* Header responsive */}
        <Box
          bg={colors.navbar}
          borderBottom="1px"
          borderColor={colors.border}
          px={4}
          py={3}
          position="sticky"
          top={0}
          zIndex={10}
          className="animate-slide-in-top"
        >
          <HStack justify="space-between" align="center">
            {/* Botón menú mobile */}
            <Hide above="md">
              <IconButton
                icon={<FiMenu />}
                variant="ghost"
                onClick={onOpen}
                aria-label="Abrir menú"
                size="md"
              />
            </Hide>

            {/* Título responsive */}
            <Show above="md">
              <Box fontSize="lg" fontWeight="semibold" color={colors.text}>
                Sistema Editorial
              </Box>
            </Show>

            {/* Controles del header */}
            <HStack spacing={2}>
              <ThemeToggle variant="menu" />
            </HStack>
          </HStack>
        </Box>

        {/* Área de contenido */}
        <Box
          flex={1}
          overflow="auto"
          className="animate-fade-in"
        >
          <Container
            maxW={containerMaxW}
            py={6}
            px={4}
            className="animate-slide-in-bottom"
          >
            {children}
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
};

// Componente wrapper para páginas con diferentes layouts
export const PageWrapper = ({ 
  children, 
  title, 
  subtitle, 
  maxWidth = 'container.xl',
  padding = 6 
}) => {
  const { colors, cardStyle } = useTheme();

  return (
    <Container maxW={maxWidth} py={padding}>
      {title && (
        <VStack spacing={2} align="start" mb={6} className="animate-slide-in-top">
          <Box
            fontSize="2xl"
            fontWeight="bold"
            color={colors.text}
          >
            {title}
          </Box>
          {subtitle && (
            <Box
              fontSize="md"
              color={colors.textSecondary}
            >
              {subtitle}
            </Box>
          )}
        </VStack>
      )}
      
      <Box className="animate-slide-in-bottom">
        {children}
      </Box>
    </Container>
  );
};

// Componente para grids responsivos
export const ResponsiveGrid = ({ 
  children, 
  columns = { base: 1, md: 2, lg: 3 },
  spacing = 6 
}) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: `repeat(${columns.base}, 1fr)`,
        md: `repeat(${columns.md}, 1fr)`,
        lg: `repeat(${columns.lg}, 1fr)`,
        xl: columns.xl ? `repeat(${columns.xl}, 1fr)` : `repeat(${columns.lg}, 1fr)`
      }}
      gap={spacing}
      className="animate-fade-in"
    >
      {children}
    </Box>
  );
};

// Componente para cards responsivos
export const ResponsiveCard = ({ children, ...props }) => {
  const { cardStyle } = useTheme();
  
  return (
    <Box
      {...cardStyle}
      {...props}
      borderRadius={{ base: 'md', md: 'lg' }}
      p={{ base: 4, md: 6 }}
      className="card-enter hover-lift smooth-transition"
    >
      {children}
    </Box>
  );
};

export default ResponsiveLayout;
