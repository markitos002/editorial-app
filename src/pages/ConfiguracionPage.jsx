// pages/ConfiguracionPage.jsx
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Switch,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardHeader,
  CardBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Avatar,
  Badge,
  Divider,
  Select,
  Textarea
} from '@chakra-ui/react';
import { SettingsIcon, LockIcon, BellIcon, UserIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

const ConfiguracionPage = () => {
  const { user, usuario } = useAuth();
  const toast = useToast();
  
  // Estados para configuración de perfil
  const [perfilData, setPerfilData] = useState({
    nombre: usuario?.nombre || '',
    email: usuario?.email || '',
    afiliacion: usuario?.afiliacion || '',
    orcid: usuario?.orcid || '',
    biografia: usuario?.biografia || '',
    especialidades: usuario?.especialidades || ''
  });
  
  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    contrasenaActual: '',
    contrasenaNueva: '',
    confirmarContrasena: ''
  });
  
  // Estados para notificaciones
  const [notificaciones, setNotificaciones] = useState({
    emailNuevoArticulo: true,
    emailCambioEstado: true,
    emailAsignacionRevision: true,
    emailMensajesEditor: true,
    pushNotificaciones: false,
    frecuenciaResumen: 'diario'
  });
  
  // Estados de validación
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePerfilChange = (field, value) => {
    setPerfilData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };
  
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };
  
  const handleNotificacionChange = (field, value) => {
    setNotificaciones(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const validatePerfil = () => {
    const newErrors = {};
    
    if (!perfilData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!perfilData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(perfilData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (perfilData.orcid && !/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(perfilData.orcid)) {
      newErrors.orcid = 'El formato ORCID debe ser 0000-0000-0000-0000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.contrasenaActual) {
      newErrors.contrasenaActual = 'La contraseña actual es obligatoria';
    }
    
    if (!passwordData.contrasenaNueva) {
      newErrors.contrasenaNueva = 'La nueva contraseña es obligatoria';
    } else if (passwordData.contrasenaNueva.length < 6) {
      newErrors.contrasenaNueva = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (passwordData.contrasenaNueva !== passwordData.confirmarContrasena) {
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleUpdatePerfil = async () => {
    if (!validatePerfil()) return;
    
    setIsLoading(true);
    
    try {
      // Aquí iría la lógica para actualizar el perfil
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Perfil actualizado',
        description: 'Su información de perfil ha sido actualizada exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
    } catch (error) {
      toast({
        title: 'Error al actualizar perfil',
        description: 'Hubo un problema al actualizar su perfil. Inténtelo de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChangePassword = async () => {
    if (!validatePassword()) return;
    
    setIsLoading(true);
    
    try {
      // Aquí iría la lógica para cambiar la contraseña
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Contraseña actualizada',
        description: 'Su contraseña ha sido cambiada exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Limpiar campos
      setPasswordData({
        contrasenaActual: '',
        contrasenaNueva: '',
        confirmarContrasena: ''
      });
      
    } catch (error) {
      toast({
        title: 'Error al cambiar contraseña',
        description: 'Hubo un problema al cambiar su contraseña. Verifique su contraseña actual.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateNotificaciones = async () => {
    setIsLoading(true);
    
    try {
      // Aquí iría la lógica para actualizar las preferencias de notificación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Preferencias guardadas',
        description: 'Sus preferencias de notificación han sido actualizadas.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
    } catch (error) {
      toast({
        title: 'Error al guardar preferencias',
        description: 'Hubo un problema al guardar sus preferencias.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Box maxW="4xl" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <HStack spacing={4} mb={4}>
            <Avatar size="lg" name={usuario?.nombre} />
            <VStack align="start" spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                ⚙️ Configuración de Usuario
              </Text>
              <HStack>
                <Text color="gray.600">{usuario?.nombre}</Text>
                <Badge colorScheme="purple">{user?.rol}</Badge>
              </HStack>
              <Text fontSize="sm" color="gray.500">{usuario?.email}</Text>
            </VStack>
          </HStack>
        </Box>
        
        {/* Tabs de Configuración */}
        <Tabs colorScheme="purple" variant="line">
          <TabList>
            <Tab>
              <HStack>
                <UserIcon />
                <Text>Perfil</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <LockIcon />
                <Text>Seguridad</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <BellIcon />
                <Text>Notificaciones</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <SettingsIcon />
                <Text>General</Text>
              </HStack>
            </Tab>
          </TabList>
          
          <TabPanels>
            {/* Panel de Perfil */}
            <TabPanel>
              <Card>
                <CardHeader>
                  <Text fontSize="lg" fontWeight="bold">Información Personal</Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack spacing={4}>
                      <FormControl isRequired isInvalid={errors.nombre}>
                        <FormLabel>Nombre Completo</FormLabel>
                        <Input
                          value={perfilData.nombre}
                          onChange={(e) => handlePerfilChange('nombre', e.target.value)}
                          placeholder="Su nombre completo"
                        />
                        <FormErrorMessage>{errors.nombre}</FormErrorMessage>
                      </FormControl>
                      
                      <FormControl isRequired isInvalid={errors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          value={perfilData.email}
                          onChange={(e) => handlePerfilChange('email', e.target.value)}
                          placeholder="su@email.com"
                        />
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                      </FormControl>
                    </HStack>
                    
                    <FormControl>
                      <FormLabel>Afiliación Institucional</FormLabel>
                      <Input
                        value={perfilData.afiliacion}
                        onChange={(e) => handlePerfilChange('afiliacion', e.target.value)}
                        placeholder="Universidad, Hospital, Instituto, etc."
                      />
                    </FormControl>
                    
                    <FormControl isInvalid={errors.orcid}>
                      <FormLabel>ORCID ID (opcional)</FormLabel>
                      <Input
                        value={perfilData.orcid}
                        onChange={(e) => handlePerfilChange('orcid', e.target.value)}
                        placeholder="0000-0000-0000-0000"
                      />
                      <FormErrorMessage>{errors.orcid}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Especialidades/Áreas de Interés</FormLabel>
                      <Input
                        value={perfilData.especialidades}
                        onChange={(e) => handlePerfilChange('especialidades', e.target.value)}
                        placeholder="Enfermería, Medicina, Salud Pública, etc."
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Biografía Breve</FormLabel>
                      <Textarea
                        value={perfilData.biografia}
                        onChange={(e) => handlePerfilChange('biografia', e.target.value)}
                        placeholder="Breve descripción profesional (opcional)"
                        rows={4}
                      />
                    </FormControl>
                    
                    <Button
                      colorScheme="purple"
                      onClick={handleUpdatePerfil}
                      isLoading={isLoading}
                      loadingText="Actualizando..."
                    >
                      Actualizar Perfil
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Panel de Seguridad */}
            <TabPanel>
              <Card>
                <CardHeader>
                  <Text fontSize="lg" fontWeight="bold">Cambiar Contraseña</Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Alert status="info">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>Seguridad de la Cuenta</AlertTitle>
                        <AlertDescription>
                          Use una contraseña fuerte con al menos 6 caracteres, incluyendo letras y números.
                        </AlertDescription>
                      </Box>
                    </Alert>
                    
                    <FormControl isRequired isInvalid={errors.contrasenaActual}>
                      <FormLabel>Contraseña Actual</FormLabel>
                      <Input
                        type="password"
                        value={passwordData.contrasenaActual}
                        onChange={(e) => handlePasswordChange('contrasenaActual', e.target.value)}
                        placeholder="Ingrese su contraseña actual"
                      />
                      <FormErrorMessage>{errors.contrasenaActual}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isRequired isInvalid={errors.contrasenaNueva}>
                      <FormLabel>Nueva Contraseña</FormLabel>
                      <Input
                        type="password"
                        value={passwordData.contrasenaNueva}
                        onChange={(e) => handlePasswordChange('contrasenaNueva', e.target.value)}
                        placeholder="Ingrese la nueva contraseña"
                      />
                      <FormErrorMessage>{errors.contrasenaNueva}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isRequired isInvalid={errors.confirmarContrasena}>
                      <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                      <Input
                        type="password"
                        value={passwordData.confirmarContrasena}
                        onChange={(e) => handlePasswordChange('confirmarContrasena', e.target.value)}
                        placeholder="Confirme la nueva contraseña"
                      />
                      <FormErrorMessage>{errors.confirmarContrasena}</FormErrorMessage>
                    </FormControl>
                    
                    <Button
                      colorScheme="red"
                      onClick={handleChangePassword}
                      isLoading={isLoading}
                      loadingText="Cambiando..."
                    >
                      Cambiar Contraseña
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Panel de Notificaciones */}
            <TabPanel>
              <Card>
                <CardHeader>
                  <Text fontSize="lg" fontWeight="bold">Preferencias de Notificación</Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Text fontWeight="medium" mb={3}>Notificaciones por Email</Text>
                      <VStack spacing={3} align="stretch">
                        <HStack justify="space-between">
                          <Text>Nuevos artículos asignados</Text>
                          <Switch
                            isChecked={notificaciones.emailNuevoArticulo}
                            onChange={(e) => handleNotificacionChange('emailNuevoArticulo', e.target.checked)}
                          />
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text>Cambios de estado en artículos</Text>
                          <Switch
                            isChecked={notificaciones.emailCambioEstado}
                            onChange={(e) => handleNotificacionChange('emailCambioEstado', e.target.checked)}
                          />
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text>Asignación de revisiones</Text>
                          <Switch
                            isChecked={notificaciones.emailAsignacionRevision}
                            onChange={(e) => handleNotificacionChange('emailAsignacionRevision', e.target.checked)}
                          />
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text>Mensajes del editor</Text>
                          <Switch
                            isChecked={notificaciones.emailMensajesEditor}
                            onChange={(e) => handleNotificacionChange('emailMensajesEditor', e.target.checked)}
                          />
                        </HStack>
                      </VStack>
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Text fontWeight="medium" mb={3}>Notificaciones Push</Text>
                      <HStack justify="space-between">
                        <Text>Habilitar notificaciones push del navegador</Text>
                        <Switch
                          isChecked={notificaciones.pushNotificaciones}
                          onChange={(e) => handleNotificacionChange('pushNotificaciones', e.target.checked)}
                        />
                      </HStack>
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Text fontWeight="medium" mb={3}>Resumen de Actividad</Text>
                      <FormControl>
                        <FormLabel>Frecuencia del resumen por email</FormLabel>
                        <Select
                          value={notificaciones.frecuenciaResumen}
                          onChange={(e) => handleNotificacionChange('frecuenciaResumen', e.target.value)}
                        >
                          <option value="inmediato">Inmediato</option>
                          <option value="diario">Diario</option>
                          <option value="semanal">Semanal</option>
                          <option value="nunca">Nunca</option>
                        </Select>
                      </FormControl>
                    </Box>
                    
                    <Button
                      colorScheme="purple"
                      onClick={handleUpdateNotificaciones}
                      isLoading={isLoading}
                      loadingText="Guardando..."
                    >
                      Guardar Preferencias
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Panel General */}
            <TabPanel>
              <Card>
                <CardHeader>
                  <Text fontSize="lg" fontWeight="bold">Configuración General</Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Alert status="info">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>Información de la Cuenta</AlertTitle>
                        <AlertDescription>
                          Rol actual: <strong>{user?.rol}</strong><br />
                          Miembro desde: <strong>Agosto 2025</strong><br />
                          Última actividad: <strong>Hoy</strong>
                        </AlertDescription>
                      </Box>
                    </Alert>
                    
                    <Divider />
                    
                    <Box>
                      <Text fontWeight="medium" mb={2}>Acciones de Cuenta</Text>
                      <VStack spacing={3} align="stretch">
                        <Button variant="outline" size="sm">
                          Descargar Mis Datos
                        </Button>
                        <Button variant="outline" size="sm">
                          Exportar Historial de Artículos
                        </Button>
                        <Button colorScheme="red" variant="outline" size="sm">
                          Cerrar Sesión en Todos los Dispositivos
                        </Button>
                      </VStack>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default ConfiguracionPage;
