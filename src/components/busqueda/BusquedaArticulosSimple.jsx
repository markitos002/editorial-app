// components/busqueda/BusquedaArticulosSimple.jsx - Versión simplificada para debugging
import React from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  Alert,
  AlertIcon,
  Spinner
} from '@chakra-ui/react';
import { useState } from 'react';
import { busquedaAPI } from '../../services/busquedaAPI';

const BusquedaArticulosSimple = () => {
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleBuscar = async () => {
    setCargando(true);
    setError(null);
    
    try {
      console.log('🔍 Iniciando búsqueda simple...');
      const response = await busquedaAPI.busquedaArticulos({
        termino: '',
        page: 1,
        limit: 5
      });
      
      console.log('📋 Respuesta completa:', response);
      console.log('📝 Artículos recibidos:', response.articulos);
      
      // Analizar cada artículo
      if (response.articulos) {
        response.articulos.forEach((articulo, index) => {
          console.log(`📄 Artículo ${index + 1}:`, articulo);
          Object.entries(articulo).forEach(([key, value]) => {
            console.log(`  - ${key}: ${typeof value} | ${JSON.stringify(value)}`);
          });
        });
      }
      
      setResultados(response);
    } catch (err) {
      console.error('❌ Error en búsqueda:', err);
      setError('Error al buscar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box maxW="4xl" mx="auto" p={6}>
      <VStack spacing={6}>
        <Text fontSize="xl" fontWeight="bold">
          🔍 Búsqueda Simple (Debug)
        </Text>
        
        <Button onClick={handleBuscar} isLoading={cargando} colorScheme="blue">
          Buscar Artículos
        </Button>
        
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        {cargando && <Spinner size="xl" />}
        
        {resultados && !cargando && (
          <Box w="full">
            <Text fontWeight="bold" mb={4}>
              Resultados encontrados: {resultados.articulos?.length || 0}
            </Text>
            
            {/* Renderizado ultra simple - solo texto plano */}
            {resultados.articulos?.map((articulo, index) => (
              <Box key={index} p={4} border="1px solid gray" mb={2}>
                <Text>ID: {String(articulo.id || 'N/A')}</Text>
                <Text>Título: {String(articulo.titulo || 'N/A')}</Text>
                <Text>Estado: {String(articulo.estado || 'N/A')}</Text>
                <Text>Autor: {String(articulo.autor || 'N/A')}</Text>
                <Text>Palabras clave: {JSON.stringify(articulo.palabras_clave || [])}</Text>
              </Box>
            ))}
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default BusquedaArticulosSimple;
