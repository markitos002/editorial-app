// pages/NuevoArticuloPage.jsx - VERSIÓN SIMPLIFICADA PARA ESTABILIDAD
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { articulosAPI } from '../services/api';

const NuevoArticuloPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Se eliminó Chakra UI toast
  
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

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo.trim());
      formDataToSend.append('resumen', formData.resumen.trim());
      const palabrasClaveArray = formData.palabras_clave.trim().split(',').map(p => p.trim()).filter(p => p.length > 0);
      formDataToSend.append('palabras_clave', JSON.stringify(palabrasClaveArray));
      formDataToSend.append('area_tematica', formData.categoria);
      formDataToSend.append('archivos', formData.archivo);

      await articulosAPI.crearConArchivo(formDataToSend);
      alert(`Artículo creado exitosamente: Tu artículo "${formData.titulo}" ha sido enviado y está en revisión.`);
      navigate('/articulos');

    } catch (error) {
      console.error('Error creando artículo:', error);
      const errorMessage = error.response?.data?.mensaje || error.message || 'Error desconocido';
      alert('Error al crear artículo: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>Nuevo Artículo</h1>
      <p>Enviado por: {user?.nombre || 'Usuario'} ({user?.email})</p>
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
