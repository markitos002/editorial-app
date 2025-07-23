// controllers/revisionesController.js
const pool = require('../db/index.js');

// Obtener todas las revisiones con filtros y paginación
const obtenerRevisiones = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      articulo_id, 
      revisor_id, 
      recomendacion,
      fecha_desde,
      fecha_hasta 
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Construir la consulta con filtros dinámicos
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (articulo_id) {
      whereConditions.push(`r.articulo_id = $${paramCount}`);
      queryParams.push(articulo_id);
      paramCount++;
    }

    if (revisor_id) {
      whereConditions.push(`r.revisor_id = $${paramCount}`);
      queryParams.push(revisor_id);
      paramCount++;
    }

    if (recomendacion) {
      whereConditions.push(`r.recomendacion = $${paramCount}`);
      queryParams.push(recomendacion);
      paramCount++;
    }

    if (fecha_desde) {
      whereConditions.push(`r.creado_en >= $${paramCount}`);
      queryParams.push(fecha_desde);
      paramCount++;
    }

    if (fecha_hasta) {
      whereConditions.push(`r.creado_en <= $${paramCount}`);
      queryParams.push(fecha_hasta);
      paramCount++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Consulta principal con información completa
    const query = `
      SELECT 
        r.*,
        a.titulo as articulo_titulo,
        a.estado as articulo_estado,
        autor.nombre as autor_nombre,
        autor.email as autor_email,
        revisor.nombre as revisor_nombre,
        revisor.email as revisor_email
      FROM revisiones r
      LEFT JOIN articulos a ON r.articulo_id = a.id
      LEFT JOIN usuarios autor ON a.autor_id = autor.id
      LEFT JOIN usuarios revisor ON r.revisor_id = revisor.id
      ${whereClause}
      ORDER BY r.creado_en DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);
    const resultado = await pool.query(query, queryParams);

    // Consulta para contar total de registros
    const countQuery = `
      SELECT COUNT(*) as total
      FROM revisiones r
      LEFT JOIN articulos a ON r.articulo_id = a.id
      ${whereClause}
    `;

    const countParams = queryParams.slice(0, -2); // Quitar limit y offset
    const totalResult = await pool.query(countQuery, countParams);
    const total = parseInt(totalResult.rows[0].total);

    res.json({
      revisiones: resultado.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_count: total,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener revisiones:', error);
    res.status(500).json({ mensaje: 'Error al obtener revisiones', error: error.message });
  }
};

// Obtener una revisión específica por ID
const obtenerRevisionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        r.*,
        a.titulo as articulo_titulo,
        a.estado as articulo_estado,
        a.resumen as articulo_resumen,
        autor.nombre as autor_nombre,
        autor.email as autor_email,
        revisor.nombre as revisor_nombre,
        revisor.email as revisor_email
      FROM revisiones r
      LEFT JOIN articulos a ON r.articulo_id = a.id
      LEFT JOIN usuarios autor ON a.autor_id = autor.id
      LEFT JOIN usuarios revisor ON r.revisor_id = revisor.id
      WHERE r.id = $1
    `;

    const resultado = await pool.query(query, [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Revisión no encontrada' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al obtener revisión:', error);
    res.status(500).json({ mensaje: 'Error al obtener revisión', error: error.message });
  }
};

// Crear una nueva revisión
const crearRevision = async (req, res) => {
  try {
    const { articulo_id, revisor_id, observaciones, recomendacion } = req.body;

    // Validaciones
    if (!articulo_id || !revisor_id || !observaciones || !recomendacion) {
      return res.status(400).json({ 
        mensaje: 'Todos los campos son requeridos: articulo_id, revisor_id, observaciones, recomendacion' 
      });
    }

    // Verificar que el artículo existe
    const articuloExiste = await pool.query('SELECT id, estado FROM articulos WHERE id = $1', [articulo_id]);
    if (articuloExiste.rows.length === 0) {
      return res.status(400).json({ mensaje: 'El artículo especificado no existe' });
    }

    // Verificar que el revisor existe y tiene el rol correcto
    const revisorExiste = await pool.query('SELECT id, rol FROM usuarios WHERE id = $1', [revisor_id]);
    if (revisorExiste.rows.length === 0) {
      return res.status(400).json({ mensaje: 'El revisor especificado no existe' });
    }

    if (revisorExiste.rows[0].rol !== 'revisor' && revisorExiste.rows[0].rol !== 'editor') {
      return res.status(400).json({ mensaje: 'El usuario debe tener rol de revisor o editor' });
    }

    // Validar recomendación
    const recomendacionesValidas = ['aceptar', 'rechazar', 'revisar', 'aprobado', 'rechazado'];
    if (!recomendacionesValidas.includes(recomendacion)) {
      return res.status(400).json({ 
        mensaje: 'Recomendación no válida. Valores permitidos: ' + recomendacionesValidas.join(', ')
      });
    }

    // Verificar que no existe ya una revisión del mismo revisor para este artículo
    const revisionExiste = await pool.query(
      'SELECT id FROM revisiones WHERE articulo_id = $1 AND revisor_id = $2',
      [articulo_id, revisor_id]
    );

    if (revisionExiste.rows.length > 0) {
      return res.status(400).json({ 
        mensaje: 'Ya existe una revisión de este revisor para este artículo' 
      });
    }

    const query = `
      INSERT INTO revisiones (articulo_id, revisor_id, observaciones, recomendacion) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    
    const resultado = await pool.query(query, [articulo_id, revisor_id, observaciones, recomendacion]);
    
    // Obtener la revisión completa con información relacionada
    const revisionCompleta = await pool.query(`
      SELECT 
        r.*,
        a.titulo as articulo_titulo,
        a.estado as articulo_estado,
        autor.nombre as autor_nombre,
        revisor.nombre as revisor_nombre,
        revisor.email as revisor_email
      FROM revisiones r
      LEFT JOIN articulos a ON r.articulo_id = a.id
      LEFT JOIN usuarios autor ON a.autor_id = autor.id
      LEFT JOIN usuarios revisor ON r.revisor_id = revisor.id
      WHERE r.id = $1
    `, [resultado.rows[0].id]);

    res.status(201).json({
      mensaje: 'Revisión creada exitosamente',
      revision: revisionCompleta.rows[0]
    });
  } catch (error) {
    console.error('Error al crear revisión:', error);
    res.status(500).json({ mensaje: 'Error al crear revisión', error: error.message });
  }
};

// Actualizar una revisión
const actualizarRevision = async (req, res) => {
  try {
    const { id } = req.params;
    const { observaciones, recomendacion } = req.body;

    // Verificar que la revisión existe
    const revisionExiste = await pool.query('SELECT * FROM revisiones WHERE id = $1', [id]);
    if (revisionExiste.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Revisión no encontrada' });
    }

    // Validar recomendación si se proporciona
    if (recomendacion) {
      const recomendacionesValidas = ['aceptar', 'rechazar', 'revisar', 'aprobado', 'rechazado'];
      if (!recomendacionesValidas.includes(recomendacion)) {
        return res.status(400).json({ 
          mensaje: 'Recomendación no válida. Valores permitidos: ' + recomendacionesValidas.join(', ')
        });
      }
    }

    // Construir query dinámicamente
    const campos = [];
    const valores = [];
    let contador = 1;

    if (observaciones) {
      campos.push(`observaciones = $${contador}`);
      valores.push(observaciones);
      contador++;
    }

    if (recomendacion) {
      campos.push(`recomendacion = $${contador}`);
      valores.push(recomendacion);
      contador++;
    }

    if (campos.length === 0) {
      return res.status(400).json({ mensaje: 'No se proporcionaron campos para actualizar' });
    }

    // Agregar fecha de actualización
    campos.push(`creado_en = NOW()`);
    valores.push(id);

    const query = `UPDATE revisiones SET ${campos.join(', ')} WHERE id = $${contador} RETURNING *`;
    const resultado = await pool.query(query, valores);

    // Obtener la revisión completa actualizada
    const revisionCompleta = await pool.query(`
      SELECT 
        r.*,
        a.titulo as articulo_titulo,
        a.estado as articulo_estado,
        autor.nombre as autor_nombre,
        revisor.nombre as revisor_nombre,
        revisor.email as revisor_email
      FROM revisiones r
      LEFT JOIN articulos a ON r.articulo_id = a.id
      LEFT JOIN usuarios autor ON a.autor_id = autor.id
      LEFT JOIN usuarios revisor ON r.revisor_id = revisor.id
      WHERE r.id = $1
    `, [id]);

    res.json({
      mensaje: 'Revisión actualizada exitosamente',
      revision: revisionCompleta.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar revisión:', error);
    res.status(500).json({ mensaje: 'Error al actualizar revisión', error: error.message });
  }
};

// Eliminar una revisión
const eliminarRevision = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que la revisión existe
    const revisionExiste = await pool.query('SELECT id FROM revisiones WHERE id = $1', [id]);
    if (revisionExiste.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Revisión no encontrada' });
    }

    await pool.query('DELETE FROM revisiones WHERE id = $1', [id]);
    
    res.json({ mensaje: 'Revisión eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar revisión:', error);
    res.status(500).json({ mensaje: 'Error al eliminar revisión', error: error.message });
  }
};

// Obtener revisiones de un artículo específico
const obtenerRevisionesPorArticulo = async (req, res) => {
  try {
    const { articulo_id } = req.params;

    const query = `
      SELECT 
        r.*,
        revisor.nombre as revisor_nombre,
        revisor.email as revisor_email
      FROM revisiones r
      LEFT JOIN usuarios revisor ON r.revisor_id = revisor.id
      WHERE r.articulo_id = $1
      ORDER BY r.creado_en DESC
    `;

    const resultado = await pool.query(query, [articulo_id]);

    res.json({
      articulo_id: parseInt(articulo_id),
      total_revisiones: resultado.rows.length,
      revisiones: resultado.rows
    });
  } catch (error) {
    console.error('Error al obtener revisiones del artículo:', error);
    res.status(500).json({ mensaje: 'Error al obtener revisiones del artículo', error: error.message });
  }
};

module.exports = {
  obtenerRevisiones,
  obtenerRevisionPorId,
  crearRevision,
  actualizarRevision,
  eliminarRevision,
  obtenerRevisionesPorArticulo
};
