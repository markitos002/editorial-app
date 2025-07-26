// controllers/revisionDocumentosController.js - Sistema de revisión de documentos
const pool = require('../db');
const path = require('path');
const fs = require('fs');

// Obtener revisiones asignadas a un revisor específico
const getRevisionesAsignadas = async (req, res) => {
  try {
    console.log('📋 Obteniendo revisiones asignadas...');
    const revisor_id = req.usuario.id;

    const revisiones = await pool.query(`
      SELECT 
        r.id as revision_id,
        r.estado as revision_estado,
        r.observaciones,
        r.recomendacion,
        r.calificacion,
        r.fecha_asignacion,
        r.fecha_completado,
        a.id as articulo_id,
        a.titulo,
        a.resumen,
        a.palabras_clave,
        a.archivo_nombre,
        a.archivo_path,
        a.archivo_mimetype,
        a.archivo_size,
        a.fecha_creacion as articulo_fecha,
        u_autor.nombre as autor_nombre,
        u_autor.email as autor_email
      FROM revisiones r
      JOIN articulos a ON r.articulo_id = a.id
      JOIN usuarios u_autor ON a.usuario_id = u_autor.id
      WHERE r.revisor_id = $1
      ORDER BY 
        CASE WHEN r.estado = 'pendiente' THEN 1 ELSE 2 END,
        r.fecha_asignacion DESC
    `, [revisor_id]);

    res.json({
      success: true,
      data: revisiones.rows,
      mensaje: `${revisiones.rows.length} revisiones encontradas`
    });

  } catch (error) {
    console.error('Error al obtener revisiones asignadas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener revisiones asignadas',
      error: error.message
    });
  }
};

// Obtener detalles de una revisión específica
const getRevisionDetalle = async (req, res) => {
  try {
    const { revision_id } = req.params;
    const revisor_id = req.usuario.id;

    console.log(`📄 Obteniendo detalles de revisión ${revision_id}...`);

    // Verificar que la revisión pertenece al revisor (o es admin/editor)
    let whereClause = 'r.id = $1';
    let queryParams = [revision_id];
    
    if (!['admin', 'editor'].includes(req.usuario.rol)) {
      whereClause += ' AND r.revisor_id = $2';
      queryParams.push(revisor_id);
    }

    const revision = await pool.query(`
      SELECT 
        r.*,
        a.id as articulo_id,
        a.titulo,
        a.resumen,
        a.palabras_clave,
        a.archivo_nombre,
        a.archivo_path,
        a.archivo_mimetype,
        a.archivo_size,
        a.estado as articulo_estado,
        a.fecha_creacion as articulo_fecha,
        u_autor.nombre as autor_nombre,
        u_autor.email as autor_email,
        u_revisor.nombre as revisor_nombre,
        u_revisor.email as revisor_email
      FROM revisiones r
      JOIN articulos a ON r.articulo_id = a.id
      JOIN usuarios u_autor ON a.usuario_id = u_autor.id
      JOIN usuarios u_revisor ON r.revisor_id = u_revisor.id
      WHERE ${whereClause}
    `, queryParams);

    if (revision.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Revisión no encontrada o sin permisos'
      });
    }

    res.json({
      success: true,
      data: revision.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener detalles de revisión:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener detalles de revisión',
      error: error.message
    });
  }
};

// Guardar progreso de revisión (borrador)
const guardarProgresoRevision = async (req, res) => {
  try {
    const { revision_id } = req.params;
    const { observaciones, calificacion } = req.body;
    const revisor_id = req.usuario.id;

    console.log(`💾 Guardando progreso de revisión ${revision_id}...`);

    // Verificar que la revisión pertenece al revisor y está pendiente
    const revision = await pool.query(
      'SELECT id, estado FROM revisiones WHERE id = $1 AND revisor_id = $2',
      [revision_id, revisor_id]
    );

    if (revision.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Revisión no encontrada'
      });
    }

    if (revision.rows[0].estado !== 'pendiente') {
      return res.status(400).json({
        success: false,
        mensaje: 'Solo se pueden editar revisiones pendientes'
      });
    }

    // Actualizar los campos de progreso disponibles
    await pool.query(`
      UPDATE revisiones 
      SET 
        observaciones = $1,
        calificacion = $2,
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [observaciones, calificacion, revision_id]);

    res.json({
      success: true,
      mensaje: 'Progreso guardado exitosamente'
    });

  } catch (error) {
    console.error('Error al guardar progreso:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al guardar progreso',
      error: error.message
    });
  }
};

// Completar revisión con recomendación final
const completarRevision = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { revision_id } = req.params;
    const { 
      recomendacion, 
      observaciones, 
      calificacion
    } = req.body;
    const revisor_id = req.usuario.id;

    console.log(`✅ Completando revisión ${revision_id}...`);

    // Validaciones
    if (!recomendacion || !['aceptar', 'revisar', 'rechazar'].includes(recomendacion)) {
      return res.status(400).json({
        success: false,
        mensaje: 'Recomendación requerida: aceptar, revisar o rechazar'
      });
    }

    if (!observaciones || observaciones.trim().length < 10) {
      return res.status(400).json({
        success: false,
        mensaje: 'Las observaciones deben tener al menos 10 caracteres'
      });
    }

    if (calificacion && (calificacion < 1 || calificacion > 10)) {
      return res.status(400).json({
        success: false,
        mensaje: 'La calificación debe estar entre 1 y 10'
      });
    }

    await client.query('BEGIN');

    // Verificar que la revisión pertenece al revisor y está pendiente
    const revision = await client.query(
      'SELECT id, articulo_id, estado FROM revisiones WHERE id = $1 AND revisor_id = $2',
      [revision_id, revisor_id]
    );

    if (revision.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        mensaje: 'Revisión no encontrada'
      });
    }

    if (revision.rows[0].estado !== 'pendiente') {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        mensaje: 'Solo se pueden completar revisiones pendientes'
      });
    }

    // Completar la revisión
    await client.query(`
      UPDATE revisiones 
      SET 
        estado = 'completado',
        recomendacion = $1,
        observaciones = $2,
        calificacion = $3,
        fecha_completado = CURRENT_TIMESTAMP,
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $4
    `, [recomendacion, observaciones, calificacion, revision_id]);

    // Actualizar estado del artículo basado en las recomendaciones
    const articulo_id = revision.rows[0].articulo_id;
    
    // Obtener todas las revisiones del artículo
    const todasRevisiones = await client.query(
      'SELECT recomendacion FROM revisiones WHERE articulo_id = $1 AND estado = $2',
      [articulo_id, 'completado']
    );

    // Lógica para determinar el nuevo estado del artículo
    let nuevoEstadoArticulo = 'en_revision';
    
    if (todasRevisiones.rows.length > 0) {
      const recomendaciones = todasRevisiones.rows.map(r => r.recomendacion);
      const tieneRechazos = recomendaciones.includes('rechazar');
      const tieneAceptaciones = recomendaciones.includes('aceptar');
      const todasSonAceptar = recomendaciones.every(r => r === 'aceptar');
      
      if (tieneRechazos) {
        nuevoEstadoArticulo = 'rechazado';
      } else if (todasSonAceptar && recomendaciones.length >= 2) {
        nuevoEstadoArticulo = 'aprobado';
      } else if (tieneAceptaciones) {
        nuevoEstadoArticulo = 'revision_menor';
      }
    }

    await client.query(
      'UPDATE articulos SET estado = $1, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = $2',
      [nuevoEstadoArticulo, articulo_id]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      mensaje: 'Revisión completada exitosamente',
      data: {
        revision_id: revision_id,
        recomendacion: recomendacion,
        nuevo_estado_articulo: nuevoEstadoArticulo
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al completar revisión:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al completar revisión',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// Descargar documento para revisión
const descargarDocumento = async (req, res) => {
  try {
    const { revision_id } = req.params;
    const revisor_id = req.usuario.id;

    console.log(`📥 Descargando documento de revisión ${revision_id}...`);

    // Verificar permisos y obtener datos del archivo
    let whereClause = 'r.id = $1';
    let queryParams = [revision_id];
    
    if (!['admin', 'editor'].includes(req.usuario.rol)) {
      whereClause += ' AND r.revisor_id = $2';
      queryParams.push(revisor_id);
    }

    const resultado = await pool.query(`
      SELECT 
        a.archivo_nombre,
        a.archivo_path,
        a.archivo_mimetype,
        a.titulo
      FROM revisiones r
      JOIN articulos a ON r.articulo_id = a.id
      WHERE ${whereClause}
    `, queryParams);

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Documento no encontrado o sin permisos'
      });
    }

    const archivo = resultado.rows[0];
    const rutaArchivo = path.resolve(archivo.archivo_path);

    // Verificar que el archivo existe físicamente
    if (!fs.existsSync(rutaArchivo)) {
      return res.status(404).json({
        success: false,
        mensaje: 'Archivo no encontrado en el servidor'
      });
    }

    // Configurar headers para descarga
    res.setHeader('Content-Disposition', `attachment; filename="${archivo.archivo_nombre}"`);
    res.setHeader('Content-Type', archivo.archivo_mimetype);

    // Enviar el archivo
    res.sendFile(rutaArchivo);

  } catch (error) {
    console.error('Error al descargar documento:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al descargar documento',
      error: error.message
    });
  }
};

// Obtener historial de comentarios de una revisión
const getHistorialComentarios = async (req, res) => {
  try {
    const { revision_id } = req.params;

    console.log(`💬 Obteniendo historial de comentarios para revisión ${revision_id}...`);

    // Obtener los comentarios almacenados en la revisión
    const revision = await pool.query(
      'SELECT observaciones, fecha_actualizacion FROM revisiones WHERE id = $1',
      [revision_id]
    );

    if (revision.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Revisión no encontrada'
      });
    }

    res.json({
      success: true,
      data: {
        comentarios_publicos: revision.rows[0].observaciones || '',
        ultima_actualizacion: revision.rows[0].fecha_actualizacion
      }
    });

  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener historial de comentarios',
      error: error.message
    });
  }
};

module.exports = {
  getRevisionesAsignadas,
  getRevisionDetalle,
  guardarProgresoRevision,
  completarRevision,
  descargarDocumento,
  getHistorialComentarios
};
