// components/AppNavigation.jsx
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  useDisclosure,
  IconButton,
  useColorModeValue,
  Badge,
  CloseButton
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import IndicadorNotificaciones from './notificaciones/IndicadorNotificaciones';
import BusquedaRapida from './busqueda/BusquedaRapida';

const AppNavigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, usuario, isAdmin, isEditor, isReviewer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: '🏠',
      roles: ['admin', 'editor', 'revisor', 'autor']
    },
    {
      label: 'Mis Artículos',
      path: '/articulos',
      icon: '📝',
      roles: ['admin', 'editor', 'revisor', 'autor'],
      disabled: false
    },
    {
      label: 'Búsqueda',
      path: '/busqueda',
      icon: '🔍',
      roles: ['admin', 'editor', 'revisor', 'autor'],
      disabled: false
    },
    {
      label: 'Notificaciones',
      path: '/notificaciones',
      icon: '🔔',
      roles: ['admin', 'editor', 'revisor', 'autor'],
      disabled: false
    },
    // FUNCIONALIDAD "NUEVO ARTÍCULO" TEMPORALMENTE REMOVIDA
    // {
    //   label: 'Nuevo Artículo',
    //   path: '/articles/new',
    //   icon: '➕',
    //   roles: ['autor'],
    //   disabled: false
    // },
    {
      label: 'Mis Revisiones',
      path: '/revision',
      icon: '📝',
      roles: ['revisor'],
      disabled: false
    },
    {
      label: 'Revisar Artículos',
      path: '/reviews',
      icon: '🔍',
      roles: ['admin', 'editor'],
      disabled: false
    },
    {
      label: 'Asignar Revisores',
      path: '/asignaciones',
      icon: '👨‍⚖️',
      roles: ['admin', 'editor'],
      disabled: false
    },
    {
      label: 'Usuarios',
      path: '/users',
      icon: '👥',
      roles: ['admin', 'editor'],
      disabled: true
    },
    {
      label: 'Configuración',
      path: '/settings',
      icon: '⚙️',
      roles: ['admin', 'editor', 'revisor', 'autor'],
      disabled: false
    }
  ];

  const isItemVisible = (item) => {
    return item.roles.includes(user?.rol);
  };

  const isItemActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigate = (path, disabled) => {
    if (!disabled) {
      navigate(path);
      onClose();
    }
  };

  const NavigationContent = () => (
    <VStack spacing={2} align="stretch">
      <Box mb={4}>
        <HStack justify="space-between" align="center" mb={2}>
          <VStack align="start" spacing={0}>
            <Text fontSize="lg" fontWeight="bold" color="purple.600">
              Revista Manos al Cuidado
            </Text>
            <Text fontSize="sm" color="gray.500">
              {usuario?.nombre}
            </Text>
          </VStack>
          <IndicadorNotificaciones />
        </HStack>
      </Box>

      {/* Búsqueda rápida */}
      <Box mb={4}>
        <BusquedaRapida size="sm" />
      </Box>

      {menuItems
        .filter(isItemVisible)
        .map((item) => (
          <Button
            key={item.path}
            variant={isItemActive(item.path) ? "solid" : "ghost"}
            colorScheme={isItemActive(item.path) ? "blue" : "gray"}
            justifyContent="flex-start"
            leftIcon={<Text>{item.icon}</Text>}
            onClick={() => handleNavigate(item.path, item.disabled)}
            isDisabled={item.disabled}
            size="sm"
            w="100%"
          >
            <HStack w="100%" justify="space-between">
              <Text>{item.label}</Text>
              {item.disabled && (
                <Badge colorScheme="yellow" size="sm">
                  Próximamente
                </Badge>
              )}
            </HStack>
          </Button>
        ))}
    </VStack>
  );

  return (
    <>
      {/* Botón del menú hamburguesa - Solo visible en móviles */}
      <IconButton
        icon={<HamburgerIcon />}
        aria-label="Abrir menú"
        onClick={onOpen}
        variant="ghost"
        display={{ base: 'flex', md: 'none' }}
        position="fixed"
        top="150px" /* Posicionar debajo del header más grande */
        left="4"
        zIndex="docked"
      />

      {/* Navegación lateral para desktop */}
      <Box
        w="250px"
        bg={bgColor}
        borderRight="1px"
        borderColor={borderColor}
        p={4}
        pt="160px" /* Padding top extra para el header más grande */
        display={{ base: 'none', md: 'block' }}
        position="fixed"
        h="100vh"
        overflowY="auto"
      >
        <NavigationContent />
      </Box>

      {/* Panel móvil overlay */}
      {isOpen && (
        <Box
          position="fixed"
          top="140px" /* Debajo del header más grande */
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.5)"
          zIndex="overlay"
          display={{ base: 'block', md: 'none' }}
          onClick={onClose}
        >
          <Box
            w="250px"
            h="calc(100vh - 140px)" /* Altura ajustada para header más grande */
            bg={bgColor}
            p={4}
            onClick={(e) => e.stopPropagation()}
          >
            <HStack justify="space-between" mb={4}>
              <Text fontSize="lg" fontWeight="bold">Menú</Text>
              <CloseButton onClick={onClose} />
            </HStack>
            <NavigationContent />
          </Box>
        </Box>
      )}
    </>
  );
};

export default AppNavigation;
