// controllers/asignacionesController.js - Gestión de asignación de revisores
const pool = require('../db');

// Obtener revisores disponibles para asignar
const getRevisoresDisponibles = async (req, res) => {
  try {
    console.log('📋 Obteniendo revisores disponibles...');
    
    // Obtener todos los revisores activos
    const revisores = await pool.query(`
      SELECT 
        id, 
        nombre, 
        email,
        (SELECT COUNT(*) FROM revisiones WHERE revisor_id = usuarios.id AND estado = 'pendiente') as revisiones_pendientes,
        (SELECT COUNT(*) FROM revisiones WHERE revisor_id = usuarios.id AND estado = 'completado') as revisiones_completadas
      FROM usuarios 
      WHERE rol = 'revisor' AND activo = true
      ORDER BY revisiones_pendientes ASC, nombre ASC
    `);

    res.json({
      success: true,
      data: revisores.rows,
      mensaje: `${revisores.rows.length} revisores disponibles`
    });

  } catch (error) {
    console.error('Error al obtener revisores disponibles:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener revisores disponibles',
      error: error.message
    });
  }
};

// Obtener artículos sin asignar
const getArticulosSinAsignar = async (req, res) => {
  try {
    console.log('📄 Obteniendo artículos sin asignar...');
    
    const articulos = await pool.query(`
      SELECT 
        a.id,
        a.titulo,
        a.resumen,
        a.estado,
        a.fecha_creacion,
        u.nombre as autor_nombre,
        u.email as autor_email,
        (SELECT COUNT(*) FROM revisiones WHERE articulo_id = a.id) as revisores_asignados
      FROM articulos a
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.estado IN ('enviado', 'en_revision')
      ORDER BY a.fecha_creacion ASC
    `);

    res.json({
      success: true,
      data: articulos.rows,
      mensaje: `${articulos.rows.length} artículos disponibles para asignación`
    });

  } catch (error) {
    console.error('Error al obtener artículos sin asignar:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener artículos sin asignar',
      error: error.message
    });
  }
};

// Asignar revisor a un artículo
const asignarRevisor = async (req, res) => {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Iniciando asignación de revisor...');
    console.log('Body recibido:', req.body);
    
    const { articulo_id, revisor_id, observaciones = '' } = req.body;
    const editor_id = req.usuario.id;

    // Validaciones básicas
    if (!articulo_id || !revisor_id) {
      return res.status(400).json({
        success: false,
        mensaje: 'articulo_id y revisor_id son requeridos'
      });
    }

    await client.query('BEGIN');

    // Verificar que el artículo existe y está en estado válido
    const articulo = await client.query(
      'SELECT id, titulo, estado FROM articulos WHERE id = $1',
      [articulo_id]
    );

    if (articulo.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        mensaje: 'Artículo no encontrado'
      });
    }

    if (!['enviado', 'en_revision'].includes(articulo.rows[0].estado)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        mensaje: 'El artículo no está en un estado válido para asignación'
      });
    }

    // Verificar que el revisor existe y está activo
    const revisor = await client.query(
      'SELECT id, nombre, email FROM usuarios WHERE id = $1 AND rol = $2 AND activo = true',
      [revisor_id, 'revisor']
    );

    if (revisor.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        mensaje: 'Revisor no encontrado o no está activo'
      });
    }

    // Verificar que no existe ya una asignación activa para este par artículo-revisor
    const asignacionExistente = await client.query(
      'SELECT id FROM revisiones WHERE articulo_id = $1 AND revisor_id = $2 AND estado != $3',
      [articulo_id, revisor_id, 'cancelado']
    );

    if (asignacionExistente.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        mensaje: 'Ya existe una asignación activa para este revisor y artículo'
      });
    }

    // Crear la asignación de revisión
    const nuevaRevision = await client.query(`
      INSERT INTO revisiones (
        articulo_id, 
        revisor_id, 
        estado, 
        observaciones, 
        fecha_asignacion
      ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING id, fecha_asignacion
    `, [articulo_id, revisor_id, 'pendiente', observaciones]);

    // Actualizar el estado del artículo a 'en_revision' si no lo está ya
    await client.query(
      "UPDATE articulos SET estado = 'en_revision', fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = $1",
      [articulo_id]
    );

    await client.query('COMMIT');

    // Respuesta de éxito
    res.status(201).json({
      success: true,
      mensaje: 'Revisor asignado exitosamente',
      data: {
        revision_id: nuevaRevision.rows[0].id,
        articulo: {
          id: articulo_id,
          titulo: articulo.rows[0].titulo
        },
        revisor: {
          id: revisor_id,
          nombre: revisor.rows[0].nombre,
          email: revisor.rows[0].email
        },
        fecha_asignacion: nuevaRevision.rows[0].fecha_asignacion,
        observaciones: observaciones
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al asignar revisor:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno al asignar revisor',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// Obtener asignaciones existentes
const getAsignaciones = async (req, res) => {
  try {
    console.log('📋 Obteniendo asignaciones existentes...');
    
    const asignaciones = await pool.query(`
      SELECT 
        r.id as revision_id,
        r.estado as revision_estado,
        r.fecha_asignacion,
        r.fecha_completado,
        r.observaciones,
        r.recomendacion,
        a.id as articulo_id,
        a.titulo as articulo_titulo,
        a.estado as articulo_estado,
        u_autor.nombre as autor_nombre,
        u_autor.email as autor_email,
        u_revisor.nombre as revisor_nombre,
        u_revisor.email as revisor_email
      FROM revisiones r
      JOIN articulos a ON r.articulo_id = a.id
      JOIN usuarios u_autor ON a.usuario_id = u_autor.id
      JOIN usuarios u_revisor ON r.revisor_id = u_revisor.id
      ORDER BY r.fecha_asignacion DESC
    `);

    res.json({
      success: true,
      data: asignaciones.rows,
      mensaje: `${asignaciones.rows.length} asignaciones encontradas`
    });

  } catch (error) {
    console.error('Error al obtener asignaciones:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener asignaciones',
      error: error.message
    });
  }
};

// Cancelar asignación
const cancelarAsignacion = async (req, res) => {
  try {
    const { revision_id } = req.params;
    const { motivo = 'Cancelado por editor' } = req.body;

    console.log(`🚫 Cancelando asignación ${revision_id}...`);

    // Verificar que la revisión existe y está pendiente
    const revision = await pool.query(
      'SELECT id, estado, articulo_id FROM revisiones WHERE id = $1',
      [revision_id]
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
        mensaje: 'Solo se pueden cancelar revisiones pendientes'
      });
    }

    // Actualizar la revisión a cancelado
    await pool.query(
      `UPDATE revisiones 
       SET estado = 'cancelado', 
           observaciones = $1, 
           fecha_actualizacion = CURRENT_TIMESTAMP 
       WHERE id = $2`,
      [motivo, revision_id]
    );

    res.json({
      success: true,
      mensaje: 'Asignación cancelada exitosamente'
    });

  } catch (error) {
    console.error('Error al cancelar asignación:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al cancelar asignación',
      error: error.message
    });
  }
};

module.exports = {
  getRevisoresDisponibles,
  getArticulosSinAsignar,
  asignarRevisor,
  getAsignaciones,
  cancelarAsignacion
};
