// components/cards/ResponsiveCard.jsx - Componente de card responsive mejorado
import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  HStack,
  VStack,
  IconButton,
  Badge,
  Divider,
  useBreakpointValue
} from '@chakra-ui/react';
import { FiMoreVertical } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const ResponsiveCard = ({
  title,
  subtitle,
  children,
  headerActions,
  footerContent,
  variant = 'default',
  status,
  statusColor = 'blue',
  isClickable = false,
  onClick,
  isLoading = false,
  ...props
}) => {
  const { colors, cardStyle, animationsEnabled } = useTheme();
  
  // Responsive sizing
  const headerPadding = useBreakpointValue({ base: 4, md: 6 });
  const bodyPadding = useBreakpointValue({ base: 4, md: 6 });
  const titleSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const subtitleSize = useBreakpointValue({ base: 'sm', md: 'md' });

  // Variantes de estilo
  const cardVariants = {
    default: {
      ...cardStyle,
    },
    elevated: {
      ...cardStyle,
      shadow: 'xl',
      border: 'none',
    },
    outlined: {
      ...cardStyle,
      shadow: 'none',
      borderWidth: '2px',
    },
    filled: {
      ...cardStyle,
      bg: colors.secondary,
    }
  };

  const cardProps = {
    ...cardVariants[variant],
    ...props,
    cursor: isClickable ? 'pointer' : 'default',
    className: `${animationsEnabled ? 'card-enter hover-lift smooth-transition' : ''} ${isLoading ? 'skeleton-loading' : ''}`,
    onClick: isClickable ? onClick : undefined,
    _hover: isClickable ? {
      transform: animationsEnabled ? 'translateY(-4px)' : 'none',
      shadow: 'xl',
      ...cardStyle._hover
    } : cardStyle._hover
  };

  return (
    <Card {...cardProps}>
      {/* Header */}
      {(title || subtitle || headerActions || status) && (
        <CardHeader pb={children ? 2 : headerPadding} px={headerPadding} pt={headerPadding}>
          <HStack justify="space-between" align="start" spacing={4}>
            <VStack align="start" spacing={1} flex={1}>
              <HStack spacing={3} align="center">
                {title && (
                  <Heading 
                    size={titleSize} 
                    color={colors.text}
                    className={animationsEnabled ? 'animate-fade-in' : ''}
                  >
                    {title}
                  </Heading>
                )}
                {status && (
                  <Badge 
                    colorScheme={statusColor} 
                    variant="subtle"
                    className={animationsEnabled ? 'animate-scale-in' : ''}
                  >
                    {status}
                  </Badge>
                )}
              </HStack>
              {subtitle && (
                <Text 
                  fontSize={subtitleSize} 
                  color={colors.textSecondary}
                  className={animationsEnabled ? 'animate-fade-in' : ''}
                >
                  {subtitle}
                </Text>
              )}
            </VStack>
            
            {headerActions && (
              <HStack spacing={2} className={animationsEnabled ? 'animate-slide-in-right' : ''}>
                {headerActions}
              </HStack>
            )}
          </HStack>
        </CardHeader>
      )}

      {/* Divider si hay header y contenido */}
      {(title || subtitle || headerActions || status) && children && (
        <Divider color={colors.border} />
      )}

      {/* Body */}
      {children && (
        <CardBody px={bodyPadding} py={bodyPadding}>
          <Box className={animationsEnabled ? 'animate-slide-in-bottom' : ''}>
            {children}
          </Box>
        </CardBody>
      )}

      {/* Footer */}
      {footerContent && (
        <>
          <Divider color={colors.border} />
          <CardFooter px={headerPadding} py={headerPadding}>
            <Box 
              width="100%" 
              className={animationsEnabled ? 'animate-slide-in-bottom' : ''}
            >
              {footerContent}
            </Box>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

// Componente de card especializado para estadísticas
export const StatCard = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  iconColor = 'blue.500',
  ...props
}) => {
  const { colors } = useTheme();
  
  const changeColors = {
    positive: 'green.500',
    negative: 'red.500',
    neutral: 'gray.500'
  };

  return (
    <ResponsiveCard variant="elevated" {...props}>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color={colors.textSecondary} fontWeight="medium">
              {title}
            </Text>
            <Heading size="xl" color={colors.text} className="stat-number">
              {value}
            </Heading>
          </VStack>
          {icon && (
            <Box color={iconColor} fontSize="2xl">
              {icon}
            </Box>
          )}
        </HStack>
        
        {change && (
          <HStack spacing={2}>
            <Text
              fontSize="sm"
              color={changeColors[changeType]}
              fontWeight="semibold"
            >
              {changeType === 'positive' ? '+' : ''}{change}
            </Text>
            <Text fontSize="sm" color={colors.textSecondary}>
              vs período anterior
            </Text>
          </HStack>
        )}
      </VStack>
    </ResponsiveCard>
  );
};

// Componente de card para items de lista
export const ListItemCard = ({
  title,
  description,
  metadata,
  actions,
  avatar,
  isNew = false,
  ...props
}) => {
  const { colors, animationsEnabled } = useTheme();

  return (
    <ResponsiveCard 
      variant="outlined" 
      isClickable={!!props.onClick}
      {...props}
    >
      <HStack spacing={4} align="start">
        {avatar && (
          <Box className={animationsEnabled ? 'animate-scale-in' : ''}>
            {avatar}
          </Box>
        )}
        
        <VStack align="start" spacing={2} flex={1}>
          <HStack spacing={3} align="center" width="100%">
            <Heading size="sm" color={colors.text} flex={1}>
              {title}
            </Heading>
            {isNew && (
              <Badge colorScheme="green" variant="solid" size="sm">
                Nuevo
              </Badge>
            )}
          </HStack>
          
          {description && (
            <Text fontSize="sm" color={colors.textSecondary} noOfLines={2}>
              {description}
            </Text>
          )}
          
          {metadata && (
            <HStack spacing={4} fontSize="xs" color={colors.textSecondary}>
              {metadata.map((item, index) => (
                <Text key={index}>{item}</Text>
              ))}
            </HStack>
          )}
        </VStack>
        
        {actions && (
          <VStack spacing={2} className={animationsEnabled ? 'animate-slide-in-right' : ''}>
            {actions}
          </VStack>
        )}
      </HStack>
    </ResponsiveCard>
  );
};

export default ResponsiveCard;
