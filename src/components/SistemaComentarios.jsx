// components/SistemaComentarios.jsx - Componente principal para gestión de comentarios
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { comentariosService } from '../services/comentariosService';
import './SistemaComentarios.css';

const SistemaComentarios = ({ revisionId, onComentarioAdded }) => {
  const { usuario } = useAuth();
  const [comentarios, setComentarios] = useState([]);
  const [permisos, setPermisos] = useState({});
  const [tiposPermitidos, setTiposPermitidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({});
  
  // Estados para el formulario de nuevo comentario
  const [nuevoComentario, setNuevoComentario] = useState({
    tipo: 'publico',
    contenido: '',
    respuesta_a: null
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [respondiendo, setRespondiendo] = useState(null);

  // Estados para edición
  const [editando, setEditando] = useState(null);
  const [contenidoEditado, setContenidoEditado] = useState('');

  useEffect(() => {
    if (revisionId) {
      cargarComentarios();
      cargarEstadisticas();
    }
  }, [revisionId]);

  const cargarComentarios = async () => {
    try {
      setLoading(true);
      const response = await comentariosService.obtenerComentarios(revisionId);
      
      if (response.success) {
        setComentarios(response.data.comentarios);
        setPermisos(response.data.permisos);
        setTiposPermitidos(response.data.tipos_permitidos);
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await comentariosService.obtenerEstadisticas(revisionId);
      if (response.success) {
        setEstadisticas(response.data);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleSubmitComentario = async (e) => {
    e.preventDefault();
    
    if (!nuevoComentario.contenido.trim()) {
      alert('Por favor, ingrese el contenido del comentario');
      return;
    }

    try {
      const datosComentario = {
        ...nuevoComentario,
        respuesta_a: respondiendo?.id || null
      };

      const response = await comentariosService.crearComentario(revisionId, datosComentario);
      
      if (response.success) {
        // Resetear formulario
        setNuevoComentario({
          tipo: 'publico',
          contenido: '',
          respuesta_a: null
        });
        setMostrarFormulario(false);
        setRespondiendo(null);
        
        // Recargar comentarios
        await cargarComentarios();
        await cargarEstadisticas();
        
        if (onComentarioAdded) {
          onComentarioAdded();
        }
      } else {
        alert('Error al crear comentario: ' + response.mensaje);
      }
    } catch (error) {
      console.error('Error al crear comentario:', error);
      alert('Error al crear comentario');
    }
  };

  const handleToggleEstado = async (comentarioId) => {
    try {
      const response = await comentariosService.toggleEstado(comentarioId);
      
      if (response.success) {
        await cargarComentarios();
        await cargarEstadisticas();
      } else {
        alert('Error al cambiar estado: ' + response.mensaje);
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar estado');
    }
  };

  const handleActualizarComentario = async (comentarioId) => {
    try {
      const response = await comentariosService.actualizarComentario(comentarioId, {
        contenido: contenidoEditado
      });
      
      if (response.success) {
        setEditando(null);
        setContenidoEditado('');
        await cargarComentarios();
      } else {
        alert('Error al actualizar comentario: ' + response.mensaje);
      }
    } catch (error) {
      console.error('Error al actualizar comentario:', error);
      alert('Error al actualizar comentario');
    }
  };

  const iniciarEdicion = (comentario) => {
    setEditando(comentario.id);
    setContenidoEditado(comentario.contenido);
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setContenidoEditado('');
  };

  const iniciarRespuesta = (comentario) => {
    setRespondiendo(comentario);
    setMostrarFormulario(true);
    setNuevoComentario({
      ...nuevoComentario,
      tipo: comentario.tipo === 'interno' ? 'interno' : 'publico'
    });
  };

  const cancelarRespuesta = () => {
    setRespondiendo(null);
    setMostrarFormulario(false);
    setNuevoComentario({
      tipo: 'publico',
      contenido: '',
      respuesta_a: null
    });
  };

  const renderComentario = (comentario, nivel = 0) => {
    const esAutor = comentario.autor_id === usuario?.id;
    const puedeEditar = esAutor && permisos.puede_comentar;
    const puedeResolver = permisos.puede_resolver;

    return (
      <div 
        key={comentario.id} 
        className={`comentario comentario-${comentario.tipo} comentario-${comentario.estado} nivel-${nivel}`}
      >
        <div className="comentario-header">
          <div className="comentario-info">
            <span className="autor">{comentario.autor_nombre}</span>
            <span className="rol">({comentario.autor_rol})</span>
            <span className={`tipo tipo-${comentario.tipo}`}>
              {comentario.tipo.toUpperCase()}
            </span>
            <span className="fecha">
              {new Date(comentario.fecha_creacion).toLocaleString()}
            </span>
            {comentario.estado === 'resuelto' && (
              <span className="estado-resuelto">✅ RESUELTO</span>
            )}
          </div>
          
          <div className="comentario-acciones">
            {puedeResolver && (
              <button
                className={`btn-estado ${comentario.estado}`}
                onClick={() => handleToggleEstado(comentario.id)}
                title={comentario.estado === 'activo' ? 'Marcar como resuelto' : 'Marcar como activo'}
              >
                {comentario.estado === 'activo' ? '✓' : '↻'}
              </button>
            )}
            
            {puedeEditar && (
              <button
                className="btn-editar"
                onClick={() => iniciarEdicion(comentario)}
                title="Editar comentario"
              >
                ✏️
              </button>
            )}
            
            {permisos.puede_comentar && (
              <button
                className="btn-responder"
                onClick={() => iniciarRespuesta(comentario)}
                title="Responder"
              >
                💬
              </button>
            )}
          </div>
        </div>

        <div className="comentario-contenido">
          {editando === comentario.id ? (
            <div className="edicion-form">
              <textarea
                value={contenidoEditado}
                onChange={(e) => setContenidoEditado(e.target.value)}
                className="textarea-edicion"
                rows="4"
              />
              <div className="edicion-acciones">
                <button
                  className="btn btn-primary"
                  onClick={() => handleActualizarComentario(comentario.id)}
                >
                  Guardar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={cancelarEdicion}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p>{comentario.contenido}</p>
          )}
          
          {comentario.fecha_actualizacion && comentario.fecha_actualizacion !== comentario.fecha_creacion && (
            <small className="editado">
              Editado: {new Date(comentario.fecha_actualizacion).toLocaleString()}
            </small>
          )}
        </div>

        {/* Renderizar respuestas */}
        {comentario.respuestas && comentario.respuestas.length > 0 && (
          <div className="respuestas">
            {comentario.respuestas.map(respuesta => renderComentario(respuesta, nivel + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Cargando comentarios...</div>;
  }

  return (
    <div className="sistema-comentarios">
      <div className="comentarios-header">
        <h3>Comentarios y Observaciones</h3>
        
        {Object.keys(estadisticas).length > 0 && (
          <div className="estadisticas-resumen">
            <span>Total: {estadisticas.total_comentarios}</span>
            <span>Activos: {estadisticas.comentarios_activos}</span>
            <span>Resueltos: {estadisticas.comentarios_resueltos}</span>
          </div>
        )}
        
        {permisos.puede_comentar && (
          <button
            className="btn btn-primary"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? 'Cancelar' : 'Nuevo Comentario'}
          </button>
        )}
      </div>

      {/* Formulario para nuevo comentario */}
      {mostrarFormulario && (
        <div className="formulario-comentario">
          {respondiendo && (
            <div className="respondiendo-a">
              <strong>Respondiendo a:</strong>
              <div className="comentario-referencia">
                <em>{respondiendo.autor_nombre}:</em> "{respondiendo.contenido.substring(0, 100)}..."
              </div>
              <button className="btn-cancelar-respuesta" onClick={cancelarRespuesta}>
                ✕ Cancelar respuesta
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmitComentario}>
            <div className="form-group">
              <label htmlFor="tipo">Tipo de comentario:</label>
              <select
                id="tipo"
                value={nuevoComentario.tipo}
                onChange={(e) => setNuevoComentario({...nuevoComentario, tipo: e.target.value})}
                className="form-control"
              >
                {tiposPermitidos.map(tipo => (
                  <option key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="contenido">Contenido:</label>
              <textarea
                id="contenido"
                value={nuevoComentario.contenido}
                onChange={(e) => setNuevoComentario({...nuevoComentario, contenido: e.target.value})}
                className="form-control"
                rows="4"
                placeholder="Escriba su comentario u observación..."
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {respondiendo ? 'Enviar Respuesta' : 'Publicar Comentario'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setMostrarFormulario(false);
                  cancelarRespuesta();
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="comentarios-lista">
        {comentarios.length === 0 ? (
          <div className="sin-comentarios">
            <p>No hay comentarios aún.</p>
            {permisos.puede_comentar && (
              <p>¡Sé el primero en agregar un comentario!</p>
            )}
          </div>
        ) : (
          comentarios.map(comentario => renderComentario(comentario))
        )}
      </div>
    </div>
  );
};

export default SistemaComentarios;
