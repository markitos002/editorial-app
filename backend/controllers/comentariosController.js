// controllers/comentariosController.js - Gestión de comentarios y observaciones
const pool = require('../db');

// Obtener comentarios de una revisión específica
const getComentariosRevision = async (req, res) => {
  try {
    const { revision_id } = req.params;
    const { tipo } = req.query; // Filtro opcional por tipo
    const usuario_id = req.usuario.id;
    const rol_usuario = req.usuario.rol;

    console.log(`💬 Obteniendo comentarios de revisión ${revision_id}...`);

    // Verificar que el usuario tiene acceso a esta revisión
    const revisionAccess = await pool.query(`
      SELECT r.*, a.usuario_id as autor_id 
      FROM revisiones r
      JOIN articulos a ON r.articulo_id = a.id
      WHERE r.id = $1
    `, [revision_id]);

    if (revisionAccess.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Revisión no encontrada'
      });
    }

    const revision = revisionAccess.rows[0];
    const esRevisor = revision.revisor_id === usuario_id;
    const esAutor = revision.autor_id === usuario_id;
    const esEditorAdmin = ['admin', 'editor'].includes(rol_usuario);

    // Determinar qué tipos de comentarios puede ver el usuario
    let tiposPermitidos = [];
    if (esEditorAdmin) {
      tiposPermitidos = ['publico', 'privado', 'interno'];
    } else if (esRevisor) {
      tiposPermitidos = ['publico', 'privado'];
    } else if (esAutor) {
      tiposPermitidos = ['publico'];
    } else {
      return res.status(403).json({
        success: false,
        mensaje: 'Sin permisos para ver comentarios de esta revisión'
      });
    }

    // Construir query con filtros
    let whereClause = 'c.revision_id = $1 AND c.estado != $2';
    let queryParams = [revision_id, 'eliminado'];
    let paramCount = 2;

    // Filtrar por tipos permitidos
    whereClause += ` AND c.tipo = ANY($${++paramCount})`;
    queryParams.push(tiposPermitidos);

    // Filtro opcional por tipo específico
    if (tipo && tiposPermitidos.includes(tipo)) {
      whereClause += ` AND c.tipo = $${++paramCount}`;
      queryParams.push(tipo);
    }

    const comentarios = await pool.query(`
      SELECT 
        c.*,
        u.nombre as autor_nombre,
        u.rol as autor_rol,
        -- Información del comentario padre si es respuesta
        cp.contenido as respuesta_a_contenido,
        up.nombre as respuesta_a_autor
      FROM comentarios c
      JOIN usuarios u ON c.usuario_id = u.id
      LEFT JOIN comentarios cp ON c.respuesta_a = cp.id
      LEFT JOIN usuarios up ON cp.usuario_id = up.id
      WHERE ${whereClause}
      ORDER BY c.fecha_creacion ASC
    `, queryParams);

    // Organizar comentarios en estructura de hilo
    const comentariosMap = new Map();
    const hilos = [];

    comentarios.rows.forEach(comentario => {
      comentariosMap.set(comentario.id, {
        ...comentario,
        respuestas: []
      });
    });

    comentarios.rows.forEach(comentario => {
      if (comentario.respuesta_a) {
        const padre = comentariosMap.get(comentario.respuesta_a);
        if (padre) {
          padre.respuestas.push(comentariosMap.get(comentario.id));
        }
      } else {
        hilos.push(comentariosMap.get(comentario.id));
      }
    });

    res.json({
      success: true,
      data: {
        comentarios: hilos,
        total: comentarios.rows.length,
        tipos_permitidos: tiposPermitidos,
        permisos: {
          puede_comentar: esRevisor || esAutor,
          puede_ver_privados: esRevisor || esEditorAdmin,
          puede_ver_internos: esEditorAdmin,
          puede_resolver: esRevisor || esEditorAdmin
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener comentarios',
      error: error.message
    });
  }
};

// Crear nuevo comentario
const crearComentario = async (req, res) => {
  try {
    const { revision_id } = req.params;
    const { tipo, contenido, respuesta_a } = req.body;
    const usuario_id = req.usuario.id;
    const rol_usuario = req.usuario.rol;

    console.log(`✍️ Creando comentario en revisión ${revision_id}...`);

    // Validaciones
    if (!contenido || contenido.trim().length < 5) {
      return res.status(400).json({
        success: false,
        mensaje: 'El comentario debe tener al menos 5 caracteres'
      });
    }

    if (!['publico', 'privado', 'interno'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        mensaje: 'Tipo de comentario inválido'
      });
    }

    // Verificar permisos según el tipo de comentario
    const revisionAccess = await pool.query(`
      SELECT r.*, a.usuario_id as autor_id 
      FROM revisiones r
      JOIN articulos a ON r.articulo_id = a.id
      WHERE r.id = $1
    `, [revision_id]);

    if (revisionAccess.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Revisión no encontrada'
      });
    }

    const revision = revisionAccess.rows[0];
    const esRevisor = revision.revisor_id === usuario_id;
    const esAutor = revision.autor_id === usuario_id;
    const esEditorAdmin = ['admin', 'editor'].includes(rol_usuario);

    // Verificar permisos para crear comentario del tipo solicitado
    if (tipo === 'interno' && !esEditorAdmin) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo editores y administradores pueden crear comentarios internos'
      });
    }

    if (tipo === 'privado' && !esRevisor && !esEditorAdmin) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo revisores pueden crear comentarios privados'
      });
    }

    if (!esRevisor && !esAutor && !esEditorAdmin) {
      return res.status(403).json({
        success: false,
        mensaje: 'Sin permisos para comentar en esta revisión'
      });
    }

    // Verificar que el comentario padre existe si es una respuesta
    if (respuesta_a) {
      const comentarioPadre = await pool.query(
        'SELECT id, revision_id FROM comentarios WHERE id = $1',
        [respuesta_a]
      );

      if (comentarioPadre.rows.length === 0 || 
          comentarioPadre.rows[0].revision_id !== parseInt(revision_id)) {
        return res.status(400).json({
          success: false,
          mensaje: 'Comentario padre no válido'
        });
      }
    }

    // Crear el comentario
    const nuevoComentario = await pool.query(`
      INSERT INTO comentarios (revision_id, usuario_id, tipo, contenido, respuesta_a)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [revision_id, usuario_id, tipo, contenido.trim(), respuesta_a || null]);

    // Obtener información completa del comentario creado
    const comentarioCompleto = await pool.query(`
      SELECT 
        c.*,
        u.nombre as autor_nombre,
        u.rol as autor_rol
      FROM comentarios c
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.id = $1
    `, [nuevoComentario.rows[0].id]);

    res.status(201).json({
      success: true,
      data: comentarioCompleto.rows[0],
      mensaje: 'Comentario creado exitosamente'
    });

  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear comentario',
      error: error.message
    });
  }
};

// Actualizar comentario existente
const actualizarComentario = async (req, res) => {
  try {
    const { comentario_id } = req.params;
    const { contenido, estado } = req.body;
    const usuario_id = req.usuario.id;
    const rol_usuario = req.usuario.rol;

    console.log(`📝 Actualizando comentario ${comentario_id}...`);

    // Obtener comentario actual
    const comentarioActual = await pool.query(`
      SELECT c.*, r.revisor_id, a.usuario_id as autor_id
      FROM comentarios c
      JOIN revisiones r ON c.revision_id = r.id
      JOIN articulos a ON r.articulo_id = a.id
      WHERE c.id = $1
    `, [comentario_id]);

    if (comentarioActual.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Comentario no encontrado'
      });
    }

    const comentario = comentarioActual.rows[0];
    const esAutorComentario = comentario.usuario_id === usuario_id;
    const esEditorAdmin = ['admin', 'editor'].includes(rol_usuario);

    // Verificar permisos
    if (!esAutorComentario && !esEditorAdmin) {
      return res.status(403).json({
        success: false,
        mensaje: 'Sin permisos para editar este comentario'
      });
    }

    // Preparar campos a actualizar
    let setClauses = [];
    let queryParams = [];
    let paramCount = 0;

    if (contenido !== undefined) {
      if (contenido.trim().length < 5) {
        return res.status(400).json({
          success: false,
          mensaje: 'El comentario debe tener al menos 5 caracteres'
        });
      }
      setClauses.push(`contenido = $${++paramCount}`);
      queryParams.push(contenido.trim());
    }

    if (estado !== undefined) {
      if (!['activo', 'resuelto', 'eliminado'].includes(estado)) {
        return res.status(400).json({
          success: false,
          mensaje: 'Estado inválido'
        });
      }
      setClauses.push(`estado = $${++paramCount}`);
      queryParams.push(estado);
    }

    if (setClauses.length === 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'No hay campos para actualizar'
      });
    }

    // Actualizar comentario
    queryParams.push(comentario_id);
    const comentarioActualizado = await pool.query(`
      UPDATE comentarios 
      SET ${setClauses.join(', ')}
      WHERE id = $${++paramCount}
      RETURNING *
    `, queryParams);

    // Obtener información completa del comentario actualizado
    const comentarioCompleto = await pool.query(`
      SELECT 
        c.*,
        u.nombre as autor_nombre,
        u.rol as autor_rol
      FROM comentarios c
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.id = $1
    `, [comentario_id]);

    res.json({
      success: true,
      data: comentarioCompleto.rows[0],
      mensaje: 'Comentario actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar comentario:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar comentario',
      error: error.message
    });
  }
};

// Eliminar comentario (soft delete)
const eliminarComentario = async (req, res) => {
  try {
    const { comentario_id } = req.params;
    const usuario_id = req.usuario.id;
    const rol_usuario = req.usuario.rol;

    console.log(`🗑️ Eliminando comentario ${comentario_id}...`);

    // Obtener comentario actual
    const comentarioActual = await pool.query(
      'SELECT * FROM comentarios WHERE id = $1',
      [comentario_id]
    );

    if (comentarioActual.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Comentario no encontrado'
      });
    }

    const comentario = comentarioActual.rows[0];
    const esAutorComentario = comentario.usuario_id === usuario_id;
    const esEditorAdmin = ['admin', 'editor'].includes(rol_usuario);

    // Verificar permisos
    if (!esAutorComentario && !esEditorAdmin) {
      return res.status(403).json({
        success: false,
        mensaje: 'Sin permisos para eliminar este comentario'
      });
    }

    // Soft delete
    await pool.query(
      'UPDATE comentarios SET estado = $1 WHERE id = $2',
      ['eliminado', comentario_id]
    );

    res.json({
      success: true,
      mensaje: 'Comentario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar comentario',
      error: error.message
    });
  }
};

// Marcar comentario como resuelto/no resuelto
const toggleEstadoComentario = async (req, res) => {
  try {
    const { comentario_id } = req.params;
    const usuario_id = req.usuario.id;
    const rol_usuario = req.usuario.rol;

    console.log(`🔄 Cambiando estado de comentario ${comentario_id}...`);

    // Obtener comentario con información de la revisión
    const comentarioActual = await pool.query(`
      SELECT c.*, r.revisor_id, a.usuario_id as autor_id
      FROM comentarios c
      JOIN revisiones r ON c.revision_id = r.id
      JOIN articulos a ON r.articulo_id = a.id
      WHERE c.id = $1
    `, [comentario_id]);

    if (comentarioActual.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Comentario no encontrado'
      });
    }

    const comentario = comentarioActual.rows[0];
    const esRevisor = comentario.revisor_id === usuario_id;
    const esAutor = comentario.autor_id === usuario_id;
    const esEditorAdmin = ['admin', 'editor'].includes(rol_usuario);

    // Solo revisores, autores y editores/admins pueden cambiar estado
    if (!esRevisor && !esAutor && !esEditorAdmin) {
      return res.status(403).json({
        success: false,
        mensaje: 'Sin permisos para cambiar el estado de este comentario'
      });
    }

    // Alternar entre activo y resuelto
    const nuevoEstado = comentario.estado === 'activo' ? 'resuelto' : 'activo';

    const comentarioActualizado = await pool.query(`
      UPDATE comentarios 
      SET estado = $1
      WHERE id = $2
      RETURNING *
    `, [nuevoEstado, comentario_id]);

    res.json({
      success: true,
      data: comentarioActualizado.rows[0],
      mensaje: `Comentario marcado como ${nuevoEstado}`
    });

  } catch (error) {
    console.error('Error al cambiar estado de comentario:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al cambiar estado de comentario',
      error: error.message
    });
  }
};

// Obtener estadísticas de comentarios de una revisión
const getEstadisticasComentarios = async (req, res) => {
  try {
    const { revision_id } = req.params;
    const usuario_id = req.usuario.id;
    const rol_usuario = req.usuario.rol;

    console.log(`📊 Obteniendo estadísticas de comentarios para revisión ${revision_id}...`);

    // Verificar acceso a la revisión
    const revisionAccess = await pool.query(`
      SELECT r.*, a.usuario_id as autor_id 
      FROM revisiones r
      JOIN articulos a ON r.articulo_id = a.id
      WHERE r.id = $1
    `, [revision_id]);

    if (revisionAccess.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Revisión no encontrada'
      });
    }

    const revision = revisionAccess.rows[0];
    const esRevisor = revision.revisor_id === usuario_id;
    const esAutor = revision.autor_id === usuario_id;
    const esEditorAdmin = ['admin', 'editor'].includes(rol_usuario);

    if (!esRevisor && !esAutor && !esEditorAdmin) {
      return res.status(403).json({
        success: false,
        mensaje: 'Sin permisos para ver estadísticas de esta revisión'
      });
    }

    // Obtener estadísticas
    const estadisticas = await pool.query(`
      SELECT 
        COUNT(*) as total_comentarios,
        COUNT(CASE WHEN tipo = 'publico' THEN 1 END) as comentarios_publicos,
        COUNT(CASE WHEN tipo = 'privado' THEN 1 END) as comentarios_privados,
        COUNT(CASE WHEN tipo = 'interno' THEN 1 END) as comentarios_internos,
        COUNT(CASE WHEN estado = 'activo' THEN 1 END) as comentarios_activos,
        COUNT(CASE WHEN estado = 'resuelto' THEN 1 END) as comentarios_resueltos,
        COUNT(CASE WHEN respuesta_a IS NOT NULL THEN 1 END) as respuestas,
        COUNT(CASE WHEN respuesta_a IS NULL THEN 1 END) as hilos_principales
      FROM comentarios 
      WHERE revision_id = $1 AND estado != 'eliminado'
    `, [revision_id]);

    res.json({
      success: true,
      data: estadisticas.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de comentarios:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener estadísticas de comentarios',
      error: error.message
    });
  }
};

module.exports = {
  getComentariosRevision,
  crearComentario,
  actualizarComentario,
  eliminarComentario,
  toggleEstadoComentario,
  getEstadisticasComentarios
};
