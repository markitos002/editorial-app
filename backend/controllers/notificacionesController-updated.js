// controllers/notificacionesController-updated.js - Controlador actualizado con la estructura correcta
const pool = require('../db/index.js');

// Obtener todas las notificaciones con filtros y paginación
const obtenerNotificaciones = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      usuario_id, 
      leida,
      fecha_desde,
      fecha_hasta 
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Construir la consulta con filtros dinámicos
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (usuario_id) {
      whereConditions.push(`n.usuario_id = $${paramCount}`);
      queryParams.push(usuario_id);
      paramCount++;
    }

    if (leida !== undefined) {
      whereConditions.push(`n.leida = $${paramCount}`);
      queryParams.push(leida === 'true');
      paramCount++;
    }

    if (fecha_desde) {
      whereConditions.push(`n.fecha_creacion >= $${paramCount}`);
      queryParams.push(fecha_desde);
      paramCount++;
    }

    if (fecha_hasta) {
      whereConditions.push(`n.fecha_creacion <= $${paramCount}`);
      queryParams.push(fecha_hasta);
      paramCount++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Consulta principal con información completa
    const query = `
      SELECT 
        n.*,
        u.nombre as usuario_nombre,
        u.email as usuario_email,
        a.titulo as articulo_titulo
      FROM notificaciones n
      LEFT JOIN usuarios u ON n.usuario_id = u.id
      LEFT JOIN articulos a ON n.articulo_id = a.id
      ${whereClause}
      ORDER BY n.fecha_creacion DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);
    const resultado = await pool.query(query, queryParams);

    // Consulta para contar total de registros
    const countQuery = `
      SELECT COUNT(*) as total
      FROM notificaciones n
      ${whereClause}
    `;

    const countParams = queryParams.slice(0, -2); // Quitar limit y offset
    const totalResult = await pool.query(countQuery, countParams);
    const total = parseInt(totalResult.rows[0].total);

    res.json({
      success: true,
      notificaciones: resultado.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_count: total,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al obtener notificaciones', 
      error: error.message 
    });
  }
};

// Obtener una notificación específica por ID
const obtenerNotificacionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        n.*,
        u.nombre as usuario_nombre,
        u.email as usuario_email,
        a.titulo as articulo_titulo
      FROM notificaciones n
      LEFT JOIN usuarios u ON n.usuario_id = u.id
      LEFT JOIN articulos a ON n.articulo_id = a.id
      WHERE n.id = $1
    `;

    const resultado = await pool.query(query, [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Notificación no encontrada' 
      });
    }

    res.json({
      success: true,
      notificacion: resultado.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener notificación:', error);
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al obtener notificación', 
      error: error.message 
    });
  }
};

// Crear una nueva notificación
const crearNotificacion = async (req, res) => {
  try {
    const { usuario_id, titulo, mensaje, tipo = 'info', articulo_id, revision_id } = req.body;

    // Validaciones
    if (!usuario_id || !titulo || !mensaje) {
      return res.status(400).json({ 
        success: false,
        mensaje: 'Todos los campos son requeridos: usuario_id, titulo, mensaje' 
      });
    }

    // Verificar que el usuario existe
    const usuarioExiste = await pool.query('SELECT id FROM usuarios WHERE id = $1', [usuario_id]);
    if (usuarioExiste.rows.length === 0) {
      return res.status(400).json({ 
        success: false,
        mensaje: 'El usuario especificado no existe' 
      });
    }

    const query = `
      INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, articulo_id, revision_id) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    
    const resultado = await pool.query(query, [
      usuario_id, 
      titulo,
      mensaje,
      tipo,
      articulo_id,
      revision_id
    ]);
    
    // Obtener la notificación completa con información del usuario
    const notificacionCompleta = await pool.query(`
      SELECT 
        n.*,
        u.nombre as usuario_nombre,
        u.email as usuario_email,
        a.titulo as articulo_titulo
      FROM notificaciones n
      LEFT JOIN usuarios u ON n.usuario_id = u.id
      LEFT JOIN articulos a ON n.articulo_id = a.id
      WHERE n.id = $1
    `, [resultado.rows[0].id]);

    res.status(201).json({
      success: true,
      mensaje: 'Notificación creada exitosamente',
      notificacion: notificacionCompleta.rows[0]
    });
  } catch (error) {
    console.error('Error al crear notificación:', error);
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al crear notificación', 
      error: error.message 
    });
  }
};

// Marcar notificación como leída
const marcarComoLeida = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la notificación existe
    const notificacionExiste = await pool.query('SELECT id FROM notificaciones WHERE id = $1', [id]);
    if (notificacionExiste.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Notificación no encontrada' 
      });
    }

    const query = 'UPDATE notificaciones SET leida = true WHERE id = $1 RETURNING *';
    const resultado = await pool.query(query, [id]);

    // Obtener la notificación completa actualizada
    const notificacionCompleta = await pool.query(`
      SELECT 
        n.*,
        u.nombre as usuario_nombre,
        u.email as usuario_email,
        a.titulo as articulo_titulo
      FROM notificaciones n
      LEFT JOIN usuarios u ON n.usuario_id = u.id
      LEFT JOIN articulos a ON n.articulo_id = a.id
      WHERE n.id = $1
    `, [id]);

    res.json({
      success: true,
      mensaje: 'Notificación marcada como leída',
      notificacion: notificacionCompleta.rows[0]
    });
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al marcar notificación como leída', 
      error: error.message 
    });
  }
};

// Marcar notificación como no leída
const marcarComoNoLeida = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la notificación existe
    const notificacionExiste = await pool.query('SELECT id FROM notificaciones WHERE id = $1', [id]);
    if (notificacionExiste.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Notificación no encontrada' 
      });
    }

    const query = 'UPDATE notificaciones SET leida = false WHERE id = $1 RETURNING *';
    const resultado = await pool.query(query, [id]);

    // Obtener la notificación completa actualizada
    const notificacionCompleta = await pool.query(`
      SELECT 
        n.*,
        u.nombre as usuario_nombre,
        u.email as usuario_email,
        a.titulo as articulo_titulo
      FROM notificaciones n
      LEFT JOIN usuarios u ON n.usuario_id = u.id
      LEFT JOIN articulos a ON n.articulo_id = a.id
      WHERE n.id = $1
    `, [id]);

    res.json({
      success: true,
      mensaje: 'Notificación marcada como no leída',
      notificacion: notificacionCompleta.rows[0]
    });
  } catch (error) {
    console.error('Error al marcar notificación como no leída:', error);
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al marcar notificación como no leída', 
      error: error.message 
    });
  }
};

// Marcar todas las notificaciones de un usuario como leídas
const marcarTodasComoLeidas = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    // Verificar que el usuario existe
    const usuarioExiste = await pool.query('SELECT id FROM usuarios WHERE id = $1', [usuario_id]);
    if (usuarioExiste.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Usuario no encontrado' 
      });
    }

    const query = 'UPDATE notificaciones SET leida = true WHERE usuario_id = $1 AND leida = false';
    const resultado = await pool.query(query, [usuario_id]);

    res.json({
      success: true,
      mensaje: `Se marcaron ${resultado.rowCount} notificaciones como leídas`,
      notificaciones_actualizadas: resultado.rowCount
    });
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error);
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al marcar todas las notificaciones como leídas', 
      error: error.message 
    });
  }
};

// Eliminar una notificación
const eliminarNotificacion = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que la notificación existe
    const notificacionExiste = await pool.query('SELECT id FROM notificaciones WHERE id = $1', [id]);
    if (notificacionExiste.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Notificación no encontrada' 
      });
    }

    await pool.query('DELETE FROM notificaciones WHERE id = $1', [id]);
    
    res.json({ 
      success: true,
      mensaje: 'Notificación eliminada correctamente' 
    });
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al eliminar notificación', 
      error: error.message 
    });
  }
};

// Obtener notificaciones de un usuario específico
const obtenerNotificacionesPorUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { page = 1, limit = 10, solo_no_leidas = false } = req.query;

    const offset = (page - 1) * limit;

    // Construir la consulta base
    let whereClause = 'WHERE n.usuario_id = $1';
    let queryParams = [usuario_id];
    let paramCount = 2;

    if (solo_no_leidas === 'true') {
      whereClause += ` AND n.leida = false`;
    }

    const query = `
      SELECT 
        n.*,
        u.nombre as usuario_nombre,
        a.titulo as articulo_titulo
      FROM notificaciones n
      LEFT JOIN usuarios u ON n.usuario_id = u.id
      LEFT JOIN articulos a ON n.articulo_id = a.id
      ${whereClause}
      ORDER BY n.fecha_creacion DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);
    const resultado = await pool.query(query, queryParams);

    // Contar total de notificaciones
    const countQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN leida = false THEN 1 END) as no_leidas
      FROM notificaciones 
      WHERE usuario_id = $1
    `;

    const totalResult = await pool.query(countQuery, [usuario_id]);
    const { total, no_leidas } = totalResult.rows[0];

    res.json({
      success: true,
      usuario_id: parseInt(usuario_id),
      notificaciones: resultado.rows,
      total_notificaciones: parseInt(total),
      notificaciones_no_leidas: parseInt(no_leidas),
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_count: parseInt(total),
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener notificaciones del usuario:', error);
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al obtener notificaciones del usuario', 
      error: error.message 
    });
  }
};

// Función helper para crear notificaciones automáticas del sistema
const crearNotificacionAutomatica = async (usuario_id, titulo, mensaje, tipo = 'info', articulo_id = null, revision_id = null) => {
  try {
    const query = `
      INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, articulo_id, revision_id) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    
    const resultado = await pool.query(query, [
      usuario_id, 
      titulo,
      mensaje,
      tipo,
      articulo_id,
      revision_id
    ]);

    return resultado.rows[0];
  } catch (error) {
    console.error('Error al crear notificación automática:', error);
    throw error;
  }
};

module.exports = {
  obtenerNotificaciones,
  obtenerNotificacionPorId,
  crearNotificacion,
  marcarComoLeida,
  marcarComoNoLeida,
  marcarTodasComoLeidas,
  eliminarNotificacion,
  obtenerNotificacionesPorUsuario,
  crearNotificacionAutomatica // Para uso interno del sistema
};
