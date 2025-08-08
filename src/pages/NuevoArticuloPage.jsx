// pages/NuevoArticuloPage.jsx - VERSIÓN MEJORADA PARA PRODUCCIÓN
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { articulosAPI } from '../services/api';

const NuevoArticuloPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
  const [acceptedChecklist, setAcceptedChecklist] = useState(false);

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
    if (!acceptedChecklist) newErrors.checklist = 'Debes aceptar la lista de comprobación';
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

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo.trim());
      formDataToSend.append('resumen', formData.resumen.trim());
      const palabrasClaveArray = formData.palabras_clave.trim().split(',').map(p => p.trim()).filter(p => p.length > 0);
      formDataToSend.append('palabras_clave', JSON.stringify(palabrasClaveArray));
      formDataToSend.append('archivos', formData.archivo);

      await articulosAPI.crearConArchivo(formDataToSend);
      alert(`Artículo creado exitosamente: Tu artículo "${formData.titulo}" ha sido enviado y está en revisión.`);
      navigate('/articulos');

    } catch (error) {
      console.error('Error creando artículo:', error);
      
      let errorMessage = 'Error desconocido';
      
      if (error.response?.status === 401) {
        alert('Error de autenticación: Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('editorial_token');
        localStorage.removeItem('editorial_user');
        navigate('/login');
        return;
      } else if (error.response?.status === 500) {
        errorMessage = `Error interno del servidor: ${error.response?.data?.mensaje || error.response?.data?.error || 'Problema en el backend'}`;
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
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '20px auto', 
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '10px',
        borderBottom: '3px solid #3498db',
        paddingBottom: '10px'
      }}>
        Nuevo Artículo
      </h1>
      <p style={{
        textAlign: 'center',
        color: '#7f8c8d',
        marginBottom: '30px',
        fontSize: '16px'
      }}>
        Enviado por: <strong>{user?.nombre || 'Usuario'}</strong> ({user?.email})
      </p>
      
      {/* Lista de Comprobación */}
      <div style={{
        backgroundColor: '#ecf0f1',
        padding: '20px',
        borderRadius: '5px',
        marginBottom: '30px',
        border: '1px solid #bdc3c7'
      }}>
        <h2 style={{
          color: '#2c3e50',
          marginBottom: '15px',
          fontSize: '18px'
        }}>
          Lista de Comprobación antes de Enviar
        </h2>
        <ul style={{ lineHeight: '1.8', color: '#34495e' }}>
          <li>El manuscrito está en formato Word (.doc o .docx)</li>
          <li>El título es claro y específico (máximo 15 palabras)</li>
          <li>El resumen no excede 250 palabras y incluye objetivos, métodos, resultados y conclusiones</li>
          <li>El artículo sigue la estructura: Introducción, Métodos, Resultados, Discusión, Conclusiones, Referencias</li>
          <li>Las referencias están en formato APA 7ª edición</li>
          <li>Las figuras y tablas tienen numeración consecutiva y títulos descriptivos</li>
          <li>El texto ha sido revisado por ortografía y gramática</li>
        </ul>
        <div style={{ marginTop: '15px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            <input
              type="checkbox"
              checked={acceptedChecklist}
              onChange={(e) => setAcceptedChecklist(e.target.checked)}
              style={{ 
                marginRight: '10px', 
                transform: 'scale(1.2)',
                accentColor: '#3498db'
              }}
            />
            Confirmo que mi artículo cumple con todos los requisitos anteriores
          </label>
          {errors.checklist && (
            <p style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>
              {errors.checklist}
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Título del Artículo *
          </label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => handleChange('titulo', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.titulo ? '2px solid #e74c3c' : '1px solid #bdc3c7',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          {errors.titulo && (
            <p style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>
              {errors.titulo}
            </p>
          )}
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Categoría *
          </label>
          <select
            value={formData.categoria}
            onChange={(e) => handleChange('categoria', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.categoria ? '2px solid #e74c3c' : '1px solid #bdc3c7',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box',
              backgroundColor: 'white'
            }}
          >
            <option value="">--Selecciona categoría--</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.categoria && (
            <p style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>
              {errors.categoria}
            </p>
          )}
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Palabras Clave
          </label>
          <input
            type="text"
            value={formData.palabras_clave}
            onChange={(e) => handleChange('palabras_clave', e.target.value)}
            placeholder="palabra1, palabra2, palabra3..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #bdc3c7',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          <p style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '5px' }}>
            Separa las palabras clave con comas
          </p>
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Resumen *
          </label>
          <textarea
            value={formData.resumen}
            onChange={(e) => handleChange('resumen', e.target.value)}
            rows={6}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.resumen ? '2px solid #e74c3c' : '1px solid #bdc3c7',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
          {errors.resumen && (
            <p style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>
              {errors.resumen}
            </p>
          )}
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Archivo del Artículo *
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.archivo ? '2px solid #e74c3c' : '1px solid #bdc3c7',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box',
              backgroundColor: 'white'
            }}
          />
          <p style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '5px' }}>
            Formatos permitidos: PDF, DOC, DOCX - Tamaño máximo: 10MB
          </p>
          {errors.archivo && (
            <p style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>
              {errors.archivo}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#95a5a6' : '#3498db',
            color: 'white',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            marginTop: '20px',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) e.target.style.backgroundColor = '#2980b9';
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) e.target.style.backgroundColor = '#3498db';
          }}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Artículo'}
        </button>
      </form>
    </div>
  );
};

export default NuevoArticuloPage;
