// pages/NuevoArticuloPage.jsx - VERSIÓN SIMPLIFICADA PARA ESTABILIDAD
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { articulosAPI } from '../services/api';
import { logAuthStatus, isTokenExpired } from '../utils/authHelper';

const NuevoArticuloPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Se eliminó Chakra UI toast

  // Debug: Verificar estado inicial de autenticación
  React.useEffect(() => {
    const authStatus = logAuthStatus();
    
    if (!authStatus.hasToken) {
      console.warn('⚠️ No token found - user needs to login');
    } else if (authStatus.tokenExpired) {
      console.warn('⚠️ Token is expired - user needs to re-login');
    } else {
      console.log('✅ Token appears valid');
    }
  }, [user]);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    categoria: '',
    palabras_clave: '',
    archivo: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Categorías disponibles
  const categorias = [
    'Investigación',
    'Revisión',
    'Artículo Original',
    'Caso Clínico',
    'Editorial',
    'Carta al Editor'
  ];

  // Validación
  const validateForm = () => {
    const newErrors = {};
    if (!formData.titulo.trim()) newErrors.titulo = 'El título es obligatorio';
    if (!formData.resumen.trim()) newErrors.resumen = 'El resumen es obligatorio';
    if (!formData.archivo) newErrors.archivo = 'Debes cargar el archivo del artículo';
    if (!formData.categoria) newErrors.categoria = 'La categoría es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en campos de texto
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Manejar cambio de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      handleChange('archivo', null);
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de archivo no válido: Solo se permiten archivos PDF, DOC o DOCX.');
      e.target.value = null; // Limpiar input
      handleChange('archivo', null);
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Archivo muy grande: El archivo no puede superar los 10MB.');
      e.target.value = null; // Limpiar input
      handleChange('archivo', null);
      return;
    }

    handleChange('archivo', file);
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Error en el formulario: Por favor corrige los errores marcados.');
      return;
    }

    // DEBUG: Verificar estado de autenticación
    const authStatus = logAuthStatus();

    if (!authStatus.hasToken) {
      alert('Error: No hay token de autenticación. Por favor, inicia sesión nuevamente.');
      navigate('/login');
      return;
    }

    if (authStatus.tokenExpired) {
      alert('Error: Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo.trim());
      formDataToSend.append('resumen', formData.resumen.trim());
      const palabrasClaveArray = formData.palabras_clave.trim().split(',').map(p => p.trim()).filter(p => p.length > 0);
      formDataToSend.append('palabras_clave', JSON.stringify(palabrasClaveArray));
      formDataToSend.append('area_tematica', formData.categoria);
      formDataToSend.append('archivos', formData.archivo);

      console.log('📤 Enviando artículo con datos:', {
        titulo: formData.titulo,
        categoria: formData.categoria,
        archivoNombre: formData.archivo?.name,
        archivoTipo: formData.archivo?.type,
        archivoTamano: formData.archivo?.size
      });

      // DEBUG: Verificar FormData antes de enviar
      console.log('📋 FormData entries:');
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      await articulosAPI.crearConArchivo(formDataToSend);
      alert(`Artículo creado exitosamente: Tu artículo "${formData.titulo}" ha sido enviado y está en revisión.`);
      navigate('/articulos');

    } catch (error) {
      console.error('Error creando artículo:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        url: error.config?.url
      });
      
      let errorMessage = 'Error desconocido';
      
      // Manejo específico para diferentes tipos de errores
      if (error.response?.status === 401) {
        alert('Error de autenticación: Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('editorial_token');
        localStorage.removeItem('editorial_user');
        navigate('/login');
        return;
      } else if (error.response?.status === 500) {
        errorMessage = `Error interno del servidor: ${error.response?.data?.mensaje || error.response?.data?.error || 'Problema en el backend'}`;
        console.error('Server error details:', error.response?.data);
      } else if (error.response?.status === 413) {
        errorMessage = 'El archivo es demasiado grande. Reduce el tamaño e intenta de nuevo.';
      } else if (error.response?.status === 415) {
        errorMessage = 'Tipo de archivo no soportado. Usa PDF, DOC o DOCX.';
      } else if (error.response?.data?.mensaje) {
        errorMessage = error.response.data.mensaje;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert('Error al crear artículo: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>Nuevo Artículo</h1>
      <p>Enviado por: {user?.nombre || 'Usuario'} ({user?.email})</p>
      
      {/* DEBUG: Botón temporal para verificar autenticación */}
      <div style={{ backgroundColor: '#f0f0f0', padding: '10px', marginBottom: '20px', border: '1px solid #ccc' }}>
        <h3>🔧 DEBUG - Verificación de Autenticación</h3>
        <button 
          type="button" 
          onClick={() => {
            const status = logAuthStatus();
            alert(`Token válido: ${status.hasToken && !status.tokenExpired ? 'SÍ' : 'NO'}\n` +
                  `Detalles: ${JSON.stringify(status, null, 2)}`);
          }}
          style={{ marginRight: '10px' }}
        >
          Verificar Estado Auth
        </button>
        <button 
          type="button" 
          onClick={() => {
            localStorage.removeItem('editorial_token');
            localStorage.removeItem('editorial_user');
            alert('Auth data cleared - Recarga la página y vuelve a hacer login');
          }}
          style={{ marginRight: '10px' }}
        >
          Limpiar Auth Data
        </button>
        <button 
          type="button" 
          onClick={async () => {
            const testData = new FormData();
            testData.append('titulo', 'Test Article');
            testData.append('resumen', 'Test summary');
            testData.append('area_tematica', 'Investigación');
            testData.append('palabras_clave', JSON.stringify(['test', 'debug']));
            
            // Crear un archivo de prueba
            const testContent = 'Este es un archivo de prueba para debuggear el upload';
            const testFile = new Blob([testContent], { type: 'text/plain' });
            const file = new File([testFile], 'test.txt', { type: 'text/plain' });
            testData.append('archivos', file);
            
            try {
              console.log('🧪 Enviando datos de prueba...');
              await articulosAPI.crearConArchivo(testData);
              alert('Test exitoso!');
            } catch (error) {
              console.error('Test error:', error);
              alert('Test falló - revisa la consola');
            }
          }}
        >
          Test Upload
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Título del Artículo</label><br />
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => handleChange('titulo', e.target.value)}
          /><br />
          {errors.titulo && <span style={{ color: 'red' }}>{errors.titulo}</span>}
        </div>
        <div>
          <label>Categoría</label><br />
          <select
            value={formData.categoria}
            onChange={(e) => handleChange('categoria', e.target.value)}
          >
            <option value="">--Selecciona categoría--</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select><br />
          {errors.categoria && <span style={{ color: 'red' }}>{errors.categoria}</span>}
        </div>
        <div>
          <label>Palabras Clave</label><br />
          <input
            type="text"
            value={formData.palabras_clave}
            onChange={(e) => handleChange('palabras_clave', e.target.value)}
            placeholder="palabra1, palabra2, palabra3..."
          />
        </div>
        <div>
          <label>Resumen</label><br />
          <textarea
            value={formData.resumen}
            onChange={(e) => handleChange('resumen', e.target.value)}
            rows={4}
          /><br />
          {errors.resumen && <span style={{ color: 'red' }}>{errors.resumen}</span>}
        </div>
        <div>
          <label>Archivo del Artículo (PDF, DOC, DOCX - Máx 10MB)</label><br />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          /><br />
          {errors.archivo && <span style={{ color: 'red' }}>{errors.archivo}</span>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar Artículo'}
        </button>
      </form>
    </div>
  );
};

export default NuevoArticuloPage;
