// components/ErrorBoundary.jsx - Error boundary para capturar errores React
import React from 'react';
import { Box, Alert, AlertIcon, AlertTitle, AlertDescription, Button, VStack } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el state para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log del error para debugging
    console.error('🚨 ErrorBoundary caught an error:', {
      error: error.toString(),
      errorInfo,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    // Detectar específicamente el error #31
    if (error.message && error.message.includes('react.dev/errors/31')) {
      console.error('🚨 React Error #31 detected - Object with keys rendered as child:', {
        error,
        errorInfo,
        location: this.props.location || 'Unknown'
      });
    }

    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert status="error" flexDirection="column" p={6}>
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Error en {this.props.location || 'el componente'}
          </AlertTitle>
          <AlertDescription maxWidth="sm" textAlign="center">
            <VStack spacing={3}>
              <Box>
                Se produjo un error inesperado. Por favor, recarga la página.
              </Box>
              
              {process.env.NODE_ENV === 'development' && (
                <Box fontSize="sm" color="red.600" textAlign="left" w="full">
                  <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                  <br />
                  <strong>Stack:</strong>
                  <pre style={{ fontSize: '10px', marginTop: '8px' }}>
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </Box>
              )}
              
              <Button 
                colorScheme="red" 
                size="sm" 
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.reload();
                }}
              >
                Recargar página
              </Button>
            </VStack>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
