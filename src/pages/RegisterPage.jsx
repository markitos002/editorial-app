// pages/RegisterPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Alert,
  AlertIcon,
  Link,
  Text,
  useColorModeValue,
  Card,
  CardBody,
  FormHelperText
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    confirmarContrasena: '',
    rol: 'autor'
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  
  const { register, isLoading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  
  // Colores para modo claro/oscuro
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Limpiar errores al montar el componente
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, []); // Sin dependencias para evitar bucles

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al escribir
    if (error) {
      clearError();
    }
    
    // Limpiar errores de validación específicos
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [error, validationErrors, clearError]);

  const validateForm = useCallback(() => {
    const errors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Formato de email inválido';
    }

    // Validar contraseña
    if (!formData.contrasena) {
      errors.contrasena = 'La contraseña es requerida';
    } else if (formData.contrasena.length < 6) {
      errors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmarContrasena) {
      errors.confirmarContrasena = 'Debes confirmar la contraseña';
    } else if (formData.contrasena !== formData.confirmarContrasena) {
      errors.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    // Validar rol
    const rolesValidos = ['autor', 'revisor', 'editor'];
    if (!rolesValidos.includes(formData.rol)) {
      errors.rol = 'Selecciona un rol válido';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const { confirmarContrasena, ...registrationData } = formData;
    const result = await register(registrationData);
    
    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
  }, [formData, validateForm, register, navigate]);

  const roles = [
    { value: 'autor', label: 'Autor', description: 'Puedo enviar artículos para revisión' },
    { value: 'revisor', label: 'Revisor', description: 'Puedo revisar artículos enviados' },
    { value: 'editor', label: 'Editor', description: 'Puedo gestionar el proceso editorial' }
  ];

  return (
    <Box bg={bgColor} minH="100vh" py={12} px={4}>
      <Container maxW="md">
        <VStack spacing={8}>
          <VStack spacing={2} textAlign="center">
            <Heading size="xl" color="blue.500">
              Revista Manos al Cuidado
            </Heading>
            <Text color="gray.600">
              Crear nueva cuenta
            </Text>
          </VStack>

          <Card bg={cardBg} shadow="xl" w="100%">
            <CardBody p={8}>
              <VStack spacing={6}>
                <Heading size="lg" textAlign="center">
                  Registro
                </Heading>

                {error && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                  <VStack spacing={4}>
                    <FormControl isRequired isInvalid={validationErrors.nombre}>
                      <FormLabel>Nombre completo</FormLabel>
                      <Input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Dr. Juan Pérez"
                        focusBorderColor="blue.500"
                      />
                      {validationErrors.nombre && (
                        <Text color="red.500" fontSize="sm">
                          {validationErrors.nombre}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isRequired isInvalid={validationErrors.email}>
                      <FormLabel>Email institucional</FormLabel>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="usuario@universidad.com"
                        focusBorderColor="blue.500"
                      />
                      {validationErrors.email && (
                        <Text color="red.500" fontSize="sm">
                          {validationErrors.email}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isRequired isInvalid={validationErrors.rol}>
                      <FormLabel>Rol en el sistema</FormLabel>
                      <Select
                        name="rol"
                        value={formData.rol}
                        onChange={handleInputChange}
                        focusBorderColor="blue.500"
                      >
                        {roles.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </Select>
                      <FormHelperText>
                        {roles.find(r => r.value === formData.rol)?.description}
                      </FormHelperText>
                      {validationErrors.rol && (
                        <Text color="red.500" fontSize="sm">
                          {validationErrors.rol}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isRequired isInvalid={validationErrors.contrasena}>
                      <FormLabel>Contraseña</FormLabel>
                      <Input
                        type="password"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleInputChange}
                        placeholder="Mínimo 6 caracteres"
                        focusBorderColor="blue.500"
                      />
                      {validationErrors.contrasena && (
                        <Text color="red.500" fontSize="sm">
                          {validationErrors.contrasena}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isRequired isInvalid={validationErrors.confirmarContrasena}>
                      <FormLabel>Confirmar contraseña</FormLabel>
                      <Input
                        type="password"
                        name="confirmarContrasena"
                        value={formData.confirmarContrasena}
                        onChange={handleInputChange}
                        placeholder="Repite tu contraseña"
                        focusBorderColor="blue.500"
                      />
                      {validationErrors.confirmarContrasena && (
                        <Text color="red.500" fontSize="sm">
                          {validationErrors.confirmarContrasena}
                        </Text>
                      )}
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      w="100%"
                      isLoading={isLoading}
                      loadingText="Creando cuenta..."
                    >
                      Crear Cuenta
                    </Button>
                  </VStack>
                </form>

                <VStack spacing={2}>
                  <Text color="gray.600">
                    ¿Ya tienes una cuenta?{' '}
                    <Link 
                      as={RouterLink} 
                      to="/login" 
                      color="blue.500"
                      fontWeight="medium"
                    >
                      Inicia sesión aquí
                    </Link>
                  </Text>
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          <Text textAlign="center" color="gray.500" fontSize="sm">
            © 2025 Editorial App. Sistema de gestión académica.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default RegisterPage;
