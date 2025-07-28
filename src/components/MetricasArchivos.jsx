// components/MetricasArchivos.jsx - Componente para mostrar métricas de archivos y almacenamiento
import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Alert,
  AlertIcon,
  Spinner,
  useColorModeValue,
  Progress,
  Divider
} from '@chakra-ui/react';
import { FiHardDrive, FiFile, FiDownload, FiPieChart } from 'react-icons/fi';
import { estadisticasAPI } from '../services/estadisticasAPI';

const MetricasArchivos = () => {
  const [metricas, setMetricas] = useState(null);
  const [descargas, setDescargas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [metricasResponse, descargasResponse] = await Promise.all([
        estadisticasAPI.getMetricasArchivos(),
        estadisticasAPI.getEstadisticasDescargas()
      ]);

      setMetricas(metricasResponse.data);
      setDescargas(descargasResponse.data);
    } catch (error) {
      console.error('Error al cargar métricas:', error);
      setError('Error al cargar las métricas de archivos');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const obtenerColorTipo = (tipo) => {
    const colores = {
      'PDF': 'red',
      'Word': 'blue',
      'Texto': 'green',
      'Otros': 'gray'
    };
    return colores[tipo] || 'gray';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <VStack>
          <Spinner size="xl" color="blue.500" />
          <Text>Cargando métricas de archivos...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Encabezado */}
        <Box>
          <Heading size="lg" mb={2} display="flex" alignItems="center">
            <FiHardDrive style={{ margin: '0 8px 0 0' }} />
            Métricas de Archivos y Almacenamiento
          </Heading>
          <Text color="gray.600">
            Estadísticas detalladas sobre archivos subidos y uso del almacenamiento
          </Text>
        </Box>

        {/* Estadísticas generales */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
          <GridItem>
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel>Total de Archivos</StatLabel>
                  <StatNumber color="blue.500">{metricas.totalArchivos}</StatNumber>
                  <StatHelpText>Archivos subidos</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel>Espacio Total</StatLabel>
                  <StatNumber color="purple.500">{metricas.espacioTotalMB} MB</StatNumber>
                  <StatHelpText>{metricas.espacioTotalBytes.toLocaleString()} bytes</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel>Tamaño Promedio</StatLabel>
                  <StatNumber color="green.500">{metricas.tamanoPromedio.mb} MB</StatNumber>
                  <StatHelpText>{metricas.tamanoPromedio.bytes.toLocaleString()} bytes</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel>Archivos Disponibles</StatLabel>
                  <StatNumber color="orange.500">{descargas.archivosDisponibles}</StatNumber>
                  <StatHelpText>{descargas.archivosPublicados} publicados</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
          {/* Distribución por tipos */}
          <GridItem>
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardHeader>
                <Heading size="md" display="flex" alignItems="center">
                  <FiPieChart style={{ margin: '0 8px 0 0' }} />
                  Distribución por Tipos
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {metricas.distribucionTipos.map((tipo, index) => (
                    <Box key={index}>
                      <HStack justify="space-between" mb={2}>
                        <HStack>
                          <Badge colorScheme={obtenerColorTipo(tipo.tipo)} variant="subtle">
                            {tipo.tipo}
                          </Badge>
                          <Text fontSize="sm">{tipo.cantidad} archivos</Text>
                        </HStack>
                        <Text fontSize="sm" fontWeight="semibold">
                          {tipo.espacioMB} MB
                        </Text>
                      </HStack>
                      <Progress
                        value={(tipo.cantidad / metricas.totalArchivos) * 100}
                        colorScheme={obtenerColorTipo(tipo.tipo)}
                        size="sm"
                        borderRadius="md"
                      />
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Archivos más grandes */}
          <GridItem>
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardHeader>
                <Heading size="md" display="flex" alignItems="center">
                  <FiFile style={{ margin: '0 8px 0 0' }} />
                  Archivos Más Grandes
                </Heading>
              </CardHeader>
              <CardBody>
                <Table size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Título</Th>
                      <Th>Tamaño</Th>
                      <Th>Autor</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {metricas.archivosGrandes.map((archivo, index) => (
                      <Tr key={index}>
                        <Td>
                          <Text fontSize="sm" fontWeight="semibold" isTruncated maxW="150px">
                            {archivo.titulo}
                          </Text>
                        </Td>
                        <Td>
                          <Badge colorScheme="purple" variant="subtle">
                            {archivo.tamanoMB} MB
                          </Badge>
                        </Td>
                        <Td>
                          <Text fontSize="sm">{archivo.autor || 'N/A'}</Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Actividad reciente */}
        {metricas.actividadReciente.length > 0 && (
          <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
            <CardHeader>
              <Heading size="md" display="flex" alignItems="center">
                <FiDownload style={{ margin: '0 8px 0 0' }} />
                Actividad Reciente (Últimos 7 días)
              </Heading>
            </CardHeader>
            <CardBody>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Fecha</Th>
                    <Th isNumeric>Archivos Subidos</Th>
                    <Th isNumeric>Espacio Usado</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {metricas.actividadReciente.map((dia, index) => (
                    <Tr key={index}>
                      <Td>{formatearFecha(dia.fecha)}</Td>
                      <Td isNumeric>
                        <Badge colorScheme="blue" variant="subtle">
                          {dia.archivos}
                        </Badge>
                      </Td>
                      <Td isNumeric>
                        <Text fontWeight="semibold">
                          {dia.espacioMB} MB
                        </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        )}

        {/* Nota sobre descargas */}
        {descargas.nota && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">{descargas.nota}</Text>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default MetricasArchivos;
