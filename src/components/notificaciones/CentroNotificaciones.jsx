// components/notificaciones/CentroNotificaciones.jsx - Versión simplificada sin Menu
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  Heading,
  Card,
  CardBody,
  useColorModeValue
} from '@chakra-ui/react';
import { FiBell, FiSettings } from 'react-icons/fi';

const CentroNotificaciones = () => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box maxW="4xl" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          <HStack spacing={3}>
            <FiBell size={24} />
            <Heading size="lg">Centro de Notificaciones</Heading>
            <Badge colorScheme="blue" variant="subtle">
              Versión Simplificada
            </Badge>
          </HStack>
          <IconButton
            icon={<FiSettings />}
            variant="ghost"
            size="sm"
            aria-label="Configuración"
          />
        </HStack>

        <Card bg={bg} borderColor={borderColor} borderWidth={1}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="lg" fontWeight="semibold">
                Notificaciones del Sistema
              </Text>
              <Text color="gray.500">
                El centro de notificaciones se ha simplificado temporalmente para resolver problemas de compatibilidad.
              </Text>
              <Text fontSize="sm" color="gray.400">
                Funcionalidad completa estará disponible después de la corrección.
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default CentroNotificaciones;
