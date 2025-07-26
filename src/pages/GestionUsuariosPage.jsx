// pages/GestionUsuariosPage.jsx - Página para que admins gestionen usuarios
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormHelperText
} from '@chakra-ui/react';
import { FiPlus, FiUsers, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const GestionUsuariosPage = () => {
  const { usuario } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creandoUsuario, setCreandoUsuario] = useState(false);
  
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    rol: 'autor'
  });

  useEffect(() => {
    if (usuario?.rol === 'admin') {
      cargarUsuarios();
    }
  }, [usuario]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const crearUsuario = async () => {
    try {
      setCreandoUsuario(true);
      
      // Validaciones básicas
      if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.contrasena) {
        toast({
          title: 'Campos requeridos',
          description: 'Por favor completa todos los campos',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (nuevoUsuario.contrasena.length < 6) {
        toast({
          title: 'Contraseña muy corta',
          description: 'La contraseña debe tener al menos 6 caracteres',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const response = await api.post('/usuarios/admin/crear', nuevoUsuario);
      
      if (response.data.success) {
        toast({
          title: 'Usuario creado',
          description: `${nuevoUsuario.nombre} ha sido creado exitosamente`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Limpiar formulario
        setNuevoUsuario({
          nombre: '',
          email: '',
          contrasena: '',
          rol: 'autor'
        });
        
        // Cerrar modal y recargar usuarios
        onClose();
        await cargarUsuarios();
      } else {
        toast({
          title: 'Error',
          description: response.data.mensaje || 'No se pudo crear el usuario',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.mensaje || 'Error al crear usuario',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setCreandoUsuario(false);
    }
  };

  const getRolBadge = (rol) => {
    const configs = {
      'admin': { colorScheme: 'red', text: 'Administrador' },
      'editor': { colorScheme: 'purple', text: 'Editor' },
      'revisor': { colorScheme: 'blue', text: 'Revisor' },
      'autor': { colorScheme: 'green', text: 'Autor' }
    };
    
    const config = configs[rol] || { colorScheme: 'gray', text: rol };
    
    return (
      <Badge colorScheme={config.colorScheme}>
        {config.text}
      </Badge>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Verificar permisos
  if (usuario?.rol !== 'admin') {
    return (
      <Container maxW="7xl" py={8}>
        <Card>
          <CardBody textAlign="center">
            <VStack spacing={4}>
              <FiShield size={48} color="#E53E3E" />
              <Heading size="lg" color="red.500">Acceso Denegado</Heading>
              <Text color="gray.600">
                No tienes permisos para acceder a esta sección.
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxW="7xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Cargando usuarios...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <HStack>
                <FiUsers size={24} />
                <Heading size="lg">Gestión de Usuarios</Heading>
              </HStack>
              <Button
                leftIcon={<FiPlus />}
                colorScheme="blue"
                onClick={onOpen}
              >
                Crear Usuario
              </Button>
            </HStack>
          </CardHeader>
        </Card>

        {/* Tabla de usuarios */}
        <Card>
          <CardBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nombre</Th>
                  <Th>Email</Th>
                  <Th>Rol</Th>
                  <Th>Fecha de Registro</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {usuarios.map((user) => (
                  <Tr key={user.id}>
                    <Td>{user.nombre}</Td>
                    <Td>{user.email}</Td>
                    <Td>{getRolBadge(user.rol)}</Td>
                    <Td>
                      {new Date(user.fecha_creacion).toLocaleDateString('es-ES')}
                    </Td>
                    <Td>
                      <Button size="sm" variant="outline" disabled>
                        Editar
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            
            {usuarios.length === 0 && (
              <Box textAlign="center" py={8}>
                <Text color="gray.500">No hay usuarios registrados</Text>
              </Box>
            )}
          </CardBody>
        </Card>
      </VStack>

      {/* Modal para crear usuario */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Nuevo Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nombre Completo</FormLabel>
                <Input
                  name="nombre"
                  value={nuevoUsuario.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre del usuario"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={nuevoUsuario.email}
                  onChange={handleInputChange}
                  placeholder="email@universidad.com"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Contraseña</FormLabel>
                <Input
                  type="password"
                  name="contrasena"
                  value={nuevoUsuario.contrasena}
                  onChange={handleInputChange}
                  placeholder="Contraseña temporal"
                />
                <FormHelperText>
                  Mínimo 6 caracteres. El usuario podrá cambiarla después.
                </FormHelperText>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Rol del Usuario</FormLabel>
                <Select
                  name="rol"
                  value={nuevoUsuario.rol}
                  onChange={handleInputChange}
                >
                  <option value="autor">Autor</option>
                  <option value="revisor">Revisor</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                </Select>
                <FormHelperText>
                  {nuevoUsuario.rol === 'editor' && 'Los editores pueden gestionar el proceso editorial completo.'}
                  {nuevoUsuario.rol === 'admin' && 'Los administradores tienen acceso total al sistema.'}
                </FormHelperText>
              </FormControl>

              <HStack spacing={3} justify="flex-end" w="100%">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={crearUsuario}
                  isLoading={creandoUsuario}
                  loadingText="Creando..."
                >
                  Crear Usuario
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default GestionUsuariosPage;
