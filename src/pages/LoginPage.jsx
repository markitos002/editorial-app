// pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Link,
  Text,
  useColorModeValue,
  Card,
  CardBody
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    contrasena: ''
  });
  
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Colores para modo claro/oscuro
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Limpiar errores al montar el componente
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al escribir
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.contrasena) {
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" py={12} px={4}>
      <Container maxW="md">
        <VStack spacing={8}>
          <VStack spacing={2} textAlign="center">
            <Heading size="xl" color="purple.600">
              Revista Manos al Cuidado
            </Heading>
            <Text color="gray.700">
              Sistema de Gestión Editorial
            </Text>
          </VStack>

          <Card bg={cardBg} shadow="xl" w="100%">
            <CardBody p={8}>
              <VStack spacing={6}>
                <Heading size="lg" textAlign="center">
                  Iniciar Sesión
                </Heading>

                {error && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="usuario@universidad.com"
                        focusBorderColor="blue.500"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Contraseña</FormLabel>
                      <Input
                        type="password"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleInputChange}
                        placeholder="Tu contraseña"
                        focusBorderColor="blue.500"
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      w="100%"
                      isLoading={isLoading}
                      loadingText="Iniciando sesión..."
                    >
                      Iniciar Sesión
                    </Button>
                  </VStack>
                </form>

                <VStack spacing={2}>
                  <Text color="gray.600">
                    ¿No tienes una cuenta?{' '}
                    <Link 
                      as={RouterLink} 
                      to="/register" 
                      color="blue.500"
                      fontWeight="medium"
                    >
                      Regístrate aquí
                    </Link>
                  </Text>
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          <Text textAlign="center" color="gray.500" fontSize="sm">
            © 2025 Manos al Cuidado. Sistema de gestión académica.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default LoginPage;
