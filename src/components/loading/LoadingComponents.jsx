// components/loading/LoadingComponents.jsx - Componentes de loading mejorados
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Spinner,
  Text,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Progress,
  useBreakpointValue
} from '@chakra-ui/react';
import { useTheme } from '../../context/ThemeContext';

// Loading spinner personalizado
export const CustomSpinner = ({ 
  size = 'lg', 
  message = 'Cargando...', 
  showMessage = true,
  color 
}) => {
  const { colors, animationsEnabled } = useTheme();
  const spinnerColor = color || colors.primary;
  
  return (
    <VStack spacing={4} className={animationsEnabled ? 'animate-fade-in' : ''}>
      <Spinner 
        size={size} 
        color={spinnerColor}
        thickness="3px"
        speed="0.8s"
        className={animationsEnabled ? 'animate-spin' : ''}
      />
      {showMessage && (
        <Text 
          fontSize="sm" 
          color={colors.textSecondary}
          className={animationsEnabled ? 'animate-pulse' : ''}
        >
          {message}
        </Text>
      )}
    </VStack>
  );
};

// Loading de página completa
export const PageLoader = ({ message = 'Cargando página...' }) => {
  const { colors } = useTheme();
  
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg={colors.bg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={9999}
      className="animate-fade-in"
    >
      <CustomSpinner size="xl" message={message} />
    </Box>
  );
};

// Skeletons personalizados para diferentes componentes
export const CardSkeleton = ({ lines = 3, hasAvatar = false }) => {
  const { colors } = useTheme();
  const height = useBreakpointValue({ base: '200px', md: '250px' });
  
  return (
    <Box 
      p={6} 
      bg={colors.cardBg} 
      borderRadius="lg" 
      border="1px" 
      borderColor={colors.border}
      className="skeleton-loading"
    >
      <VStack spacing={4} align="stretch">
        {hasAvatar && (
          <HStack spacing={4}>
            <SkeletonCircle size="12" />
            <VStack align="start" spacing={2} flex={1}>
              <Skeleton height="20px" width="60%" />
              <Skeleton height="16px" width="40%" />
            </VStack>
          </HStack>
        )}
        
        {!hasAvatar && <Skeleton height="24px" width="70%" />}
        
        <SkeletonText 
          noOfLines={lines} 
          spacing={3}
          skeletonHeight="16px"
        />
      </VStack>
    </Box>
  );
};

// Skeleton para tabla
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  const { colors } = useTheme();
  
  return (
    <Box 
      bg={colors.cardBg} 
      borderRadius="lg" 
      border="1px" 
      borderColor={colors.border}
      overflow="hidden"
    >
      {/* Header */}
      <HStack p={4} bg={colors.secondary} spacing={4}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} height="20px" flex={1} />
        ))}
      </HStack>
      
      {/* Rows */}
      <VStack spacing={0} divider={<Box borderBottom="1px" borderColor={colors.border} />}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <HStack key={rowIndex} p={4} spacing={4} width="100%">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} height="16px" flex={1} />
            ))}
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

// Skeleton para dashboard
export const DashboardSkeleton = () => {
  return (
    <VStack spacing={6} align="stretch">
      {/* Stats cards */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={4}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeleton key={index} lines={1} />
        ))}
      </Box>
      
      {/* Main content */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', lg: '2fr 1fr' }}
        gap={6}
      >
        <CardSkeleton lines={8} />
        <CardSkeleton lines={6} />
      </Box>
    </VStack>
  );
};

// Loading con progreso
export const ProgressLoader = ({ 
  progress = 0, 
  message = 'Procesando...', 
  isIndeterminate = false 
}) => {
  const { colors, animationsEnabled } = useTheme();
  
  return (
    <VStack spacing={4} className={animationsEnabled ? 'animate-fade-in' : ''}>
      <Progress
        value={progress}
        size="lg"
        colorScheme="blue"
        width="300px"
        borderRadius="full"
        isIndeterminate={isIndeterminate}
        className={animationsEnabled ? 'smooth-transition' : ''}
      />
      <VStack spacing={1}>
        <Text fontSize="sm" color={colors.text} fontWeight="medium">
          {message}
        </Text>
        {!isIndeterminate && (
          <Text fontSize="xs" color={colors.textSecondary}>
            {progress}% completado
          </Text>
        )}
      </VStack>
    </VStack>
  );
};

// Loading para botones
export const ButtonLoader = ({ size = 'sm', color = 'white' }) => {
  return (
    <Spinner
      size={size}
      color={color}
      thickness="2px"
    />
  );
};

// Loading overlay para componentes
export const LoadingOverlay = ({ 
  isLoading, 
  children, 
  message = 'Cargando...',
  blur = true 
}) => {
  const { colors } = useTheme();
  
  return (
    <Box position="relative">
      <Box filter={isLoading && blur ? 'blur(2px)' : 'none'}>
        {children}
      </Box>
      
      {isLoading && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={`${colors.bg}CC`} // Semi-transparente
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="lg"
          className="animate-fade-in"
        >
          <CustomSpinner message={message} />
        </Box>
      )}
    </Box>
  );
};

// Loading para listas
export const ListLoader = ({ items = 3, hasAvatar = true }) => {
  return (
    <VStack spacing={3} align="stretch">
      {Array.from({ length: items }).map((_, index) => (
        <CardSkeleton key={index} lines={2} hasAvatar={hasAvatar} />
      ))}
    </VStack>
  );
};

export default {
  CustomSpinner,
  PageLoader,
  CardSkeleton,
  TableSkeleton,
  DashboardSkeleton,
  ProgressLoader,
  ButtonLoader,
  LoadingOverlay,
  ListLoader
};
