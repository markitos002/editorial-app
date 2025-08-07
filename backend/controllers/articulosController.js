const pool = require('../db');

// Función para crear artículo con archivos almacenados en base de datos
const crearConArchivoDB = async (req, res) => {
  try {
    console.log('=== CREAR ARTÍCULO CON ARCHIVO EN BASE DE DATOS ===');
    console.log('Headers:', req.headers);
    console.log('Datos recibidos (body):', req.body);
    console.log('Archivos procesados:', req.processedFiles?.length || 0);
    console.log('Usuario autenticado:', req.usuario);
    
    const { titulo, resumen, palabras_clave, categoria } = req.body; // Cambiado de 'area_tematica' a 'categoria'
    const usuarioId = req.usuario.id;
    const archivos = req.processedFiles || [];

    // Validaciones optimizadas
    if (!titulo?.trim() || !resumen?.trim()) {
      console.log('❌ Validación fallida: campos requeridos');
      return res.status(400).json({ 
        success: false,
        mensaje: 'Título y resumen son campos requeridos',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Validar que se haya subido al menos un archivo
    if (archivos.length === 0) {
      console.log('❌ Validación fallida: no hay archivos');
      return res.status(400).json({ 
        success: false,
        mensaje: 'Es necesario adjuntar al menos un archivo con el contenido del artículo',
        code: 'NO_FILES_UPLOADED'
      });
    }

    // Procesar palabras clave
    let palabrasClaveArray = [];
    if (palabras_clave) {
      try {
        palabrasClaveArray = JSON.parse(palabras_clave);
      } catch (error) {
        console.log('⚠️ Error parseando palabras clave, usando como string:', error);
        palabrasClaveArray = typeof palabras_clave === 'string' ? [palabras_clave] : [];
      }
    }

    // Usar el primer archivo como principal
    const archivoPrincipal = archivos[0];
    
    console.log('💾 Insertando artículo en base de datos...');
    const query = `
      INSERT INTO articulos (
        titulo, resumen, palabras_clave, usuario_id, estado, categoria,
        archivo_nombre, archivo_mimetype, archivo_size, archivo_data
      ) 
      VALUES ($1, $2, $3, $4, 'enviado', $5, $6, $7, $8, $9) 
      RETURNING *
    `;
    
    const parametros = [
      titulo, 
      resumen, 
      palabrasClaveArray, 
      usuarioId,
      categoria || null, // Usar la variable 'categoria'
      archivoPrincipal.originalName,
      archivoPrincipal.mimetype,
      archivoPrincipal.size,
      archivoPrincipal.buffer // Guardar como BYTEA
    ];
    
    console.log('📋 Parámetros query (archivo como buffer):', [
      parametros[0],
      parametros[1], 
      parametros[2],
      parametros[3],
      parametros[4],
      parametros[5],
      parametros[6],
      parametros[7],
      `Buffer(${parametros[8].length} bytes)`
    ]);
    
    const resultado = await pool.query(query, parametros);
    
    if (!resultado.rows || resultado.rows.length === 0) {
      console.log('❌ No se pudo insertar el artículo');
      return res.status(500).json({ 
        success: false,
        mensaje: 'Error al crear artículo: no se pudo insertar' 
      });
    }
    
    console.log('✅ Artículo insertado con ID:', resultado.rows[0].id);
    
    // Obtener el artículo completo con información del autor (sin el archivo)
    const articuloCompleto = await pool.query(`
      SELECT 
        a.id, a.titulo, a.resumen, a.palabras_clave, a.estado, a.area_tematica,
        a.archivo_nombre, a.archivo_mimetype, a.archivo_size,
        a.fecha_creacion, a.fecha_actualizacion,
        u.nombre as autor_nombre,
        u.email as autor_email
      FROM articulos a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.id = $1
    `, [resultado.rows[0].id]);

    console.log('🎉 Artículo creado exitosamente');

    res.status(201).json({
      success: true,
      mensaje: 'Artículo creado exitosamente',
      articulo: articuloCompleto.rows[0]
    });
  } catch (error) {
    console.error('💥 Error al crear artículo:', error);
    console.error('Error stack completo:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    
    // Manejo específico de errores de base de datos
    if (error.code) {
      console.error('Error code específico de PostgreSQL:', error.code);
    }
    
    res.status(500).json({ 
      success: false,
      mensaje: 'Error interno del servidor al crear artículo', 
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    });
  }
};

// Obtener todos los artículos
const obtenerArticulos = async (req, res) => {
  try {
    console.log('=== OBTENER ARTICULOS ===');
    console.log('Query params:', req.query);
    
    const { estado, usuario_id, page = 1, limit = 10 } = req.query;
    let query = `
      SELECT 
        a.id, a.titulo, a.resumen, a.palabras_clave, a.usuario_id, a.estado, 
        a.area_tematica, a.archivo_nombre, a.archivo_mimetype, a.archivo_size,
        a.fecha_creacion, a.fecha_actualizacion,
        u.nombre as autor_nombre,
        u.email as autor_email,
        COUNT(*) OVER() as total_count
      FROM articulos a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
    `;
    const params = [];
    const whereConditions = [];

    // Filtros opcionales
    if (estado) {
      whereConditions.push(`a.estado = $${params.length + 1}`);
      params.push(estado);
    }

    if (usuario_id) {
      whereConditions.push(`a.usuario_id = $${params.length + 1}`);
      params.push(usuario_id);
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    // Paginación
    const offset = (page - 1) * limit;
    query += ` ORDER BY a.fecha_creacion DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    console.log('Ejecutando query:', query);
    console.log('Parámetros:', params);

    const resultado = await pool.query(query, params);
    
    console.log('Query exitosa, filas encontradas:', resultado.rows.length);
    
    const totalCount = resultado.rows.length > 0 ? resultado.rows[0].total_count : 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      articulos: resultado.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_count: parseInt(totalCount),
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener artículos:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ mensaje: 'Error al obtener artículos', error: error.message });
  }
};

// Obtener mis artículos (del usuario autenticado)
const obtenerMisArticulos = async (req, res) => {
  try {
    const autorId = req.usuario.id; // Del middleware de autenticación
    
    const query = `
      SELECT 
        a.*,
        u.nombre as autor_nombre,
        u.email as autor_email
      FROM articulos a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.usuario_id = $1
      ORDER BY a.fecha_creacion DESC
    `;
    
    const resultado = await pool.query(query, [autorId]);

    res.json({
      articulos: resultado.rows
    });
  } catch (error) {
    console.error('Error al obtener mis artículos:', error);
    res.status(500).json({ mensaje: 'Error al obtener mis artículos', error: error.message });
  }
};

// Obtener un artículo por ID
const obtenerArticuloPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        a.*,
        u.nombre as autor_nombre,
        u.email as autor_email
      FROM articulos a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.id = $1
    `;
    
    const resultado = await pool.query(query, [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Artículo no encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al obtener artículo:', error);
    res.status(500).json({ mensaje: 'Error al obtener artículo', error: error.message });
  }
};

// Crear un nuevo artículo
const crearArticulo = async (req, res) => {
  try {
    console.log('=== CREAR ARTÍCULO ===');
    console.log('Datos recibidos:', req.body);
    console.log('Archivo recibido:', req.file);
    console.log('Usuario autenticado:', req.usuario);
    
    const { titulo, resumen, palabras_clave, area_tematica } = req.body;
    const usuarioId = req.usuario.id; // Del middleware de autenticación
    const archivo = req.file; // Del middleware de multer

    // Validaciones
    if (!titulo || !resumen) {
      console.log('Faltan campos requeridos');
      return res.status(400).json({ 
        mensaje: 'Título y resumen son campos requeridos' 
      });
    }

    // Validar que se haya subido un archivo
    if (!archivo) {
      console.log('No se recibió archivo');
      return res.status(400).json({ 
        mensaje: 'Es necesario adjuntar un archivo con el contenido del artículo' 
      });
    }

    // Procesar palabras clave
    let palabrasClaveArray = [];
    if (palabras_clave) {
      try {
        palabrasClaveArray = JSON.parse(palabras_clave);
      } catch (error) {
        console.log('Error parseando palabras clave, usando como string:', error);
        palabrasClaveArray = typeof palabras_clave === 'string' ? [palabras_clave] : [];
      }
    }

    console.log('Procesando palabras clave...');
    const query = `
      INSERT INTO articulos (
        titulo, resumen, palabras_clave, usuario_id, estado,
        archivo_nombre, archivo_path, archivo_mimetype, archivo_size
      ) 
      VALUES ($1, $2, $3, $4, 'enviado', $5, $6, $7, $8) 
      RETURNING *
    `;
    
    console.log('Ejecutando query SQL...');
    console.log('Parámetros:', [
      titulo, 
      resumen, 
      palabrasClaveArray, 
      usuarioId,
      archivo.originalname,
      archivo.path,
      archivo.mimetype,
      archivo.size
    ]);
    
    const resultado = await pool.query(query, [
      titulo, 
      resumen, 
      palabrasClaveArray, 
      usuarioId,
      archivo.originalname,
      archivo.path,
      archivo.mimetype,
      archivo.size
    ]);
    
    if (!resultado.rows || resultado.rows.length === 0) {
      return res.status(500).json({ mensaje: 'Error al crear artículo: no se pudo insertar' });
    }
    
    // Obtener el artículo completo con información del autor
    const articuloCompleto = await pool.query(`
      SELECT 
        a.*,
        u.nombre as autor_nombre,
        u.email as autor_email
      FROM articulos a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.id = $1
    `, [resultado.rows[0].id]);

    res.status(201).json({
      mensaje: 'Artículo creado exitosamente',
      articulo: articuloCompleto.rows[0]
    });
  } catch (error) {
    console.error('Error al crear artículo:', error);
    res.status(500).json({ mensaje: 'Error al crear artículo', error: error.message });
  }
};

// Actualizar un artículo
const actualizarArticulo = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, resumen, contenido, estado } = req.body;

    // Verificar que el artículo existe
    const articuloExiste = await pool.query('SELECT id FROM articulos WHERE id = $1', [id]);
    if (articuloExiste.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Artículo no encontrado' });
    }

    // Validar estados permitidos
    const estadosValidos = ['enviado', 'en_revision', 'revisado', 'aprobado', 'rechazado', 'publicado'];
    if (estado && !estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        mensaje: 'Estado no válido. Estados permitidos: ' + estadosValidos.join(', ')
      });
    }

    // Construir query dinámicamente
    const campos = [];
    const valores = [];
    let contador = 1;

    if (titulo) {
      campos.push(`titulo = $${contador}`);
      valores.push(titulo);
      contador++;
    }

    if (resumen) {
      campos.push(`resumen = $${contador}`);
      valores.push(resumen);
      contador++;
    }

    if (contenido) {
      campos.push(`contenido = $${contador}`);
      valores.push(contenido);
      contador++;
    }

    if (estado) {
      campos.push(`estado = $${contador}`);
      valores.push(estado);
      contador++;
    }

    if (campos.length === 0) {
      return res.status(400).json({ mensaje: 'No se proporcionaron campos para actualizar' });
    }

    valores.push(id);
    const query = `UPDATE articulos SET ${campos.join(', ')} WHERE id = $${contador} RETURNING *`;
    
    const resultado = await pool.query(query, valores);

    // Obtener el artículo completo con información del autor
    const articuloCompleto = await pool.query(`
      SELECT 
        a.*,
        u.nombre as autor_nombre,
        u.email as autor_email
      FROM articulos a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.id = $1
    `, [id]);

    res.json(articuloCompleto.rows[0]);
  } catch (error) {
    console.error('Error al actualizar artículo:', error);
    res.status(500).json({ mensaje: 'Error al actualizar artículo', error: error.message });
  }
};

// Eliminar un artículo
const eliminarArticulo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el artículo existe
    const articuloExiste = await pool.query('SELECT id FROM articulos WHERE id = $1', [id]);
    if (articuloExiste.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Artículo no encontrado' });
    }

    // Eliminar revisiones asociadas primero (por la relación)
    await pool.query('DELETE FROM revisiones WHERE articulo_id = $1', [id]);
    
    // Eliminar el artículo
    const resultado = await pool.query('DELETE FROM articulos WHERE id = $1 RETURNING *', [id]);

    res.json({ 
      mensaje: 'Artículo eliminado correctamente',
      articulo_eliminado: resultado.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar artículo:', error);
    res.status(500).json({ mensaje: 'Error al eliminar artículo', error: error.message });
  }
};

// Cambiar estado de un artículo
const cambiarEstadoArticulo = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, observaciones } = req.body;

    const estadosValidos = ['enviado', 'en_revision', 'revisado', 'aprobado', 'rechazado', 'publicado'];
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        mensaje: 'Estado requerido. Estados permitidos: ' + estadosValidos.join(', ')
      });
    }

    // Verificar que el artículo existe
    const articuloExiste = await pool.query('SELECT id FROM articulos WHERE id = $1', [id]);
    if (articuloExiste.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Artículo no encontrado' });
    }

    const query = 'UPDATE articulos SET estado = $1 WHERE id = $2 RETURNING *';
    const resultado = await pool.query(query, [estado, id]);

    // Si hay observaciones, crearlas como una revisión
    if (observaciones) {
      await pool.query(`
        INSERT INTO revisiones (articulo_id, observaciones, recomendacion) 
        VALUES ($1, $2, $3)
      `, [id, observaciones, estado]);
    }

    // Obtener el artículo completo actualizado
    const articuloCompleto = await pool.query(`
      SELECT 
        a.*,
        u.nombre as autor_nombre,
        u.email as autor_email
      FROM articulos a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.id = $1
    `, [id]);

    res.json({
      mensaje: `Estado del artículo cambiado a: ${estado}`,
      articulo: articuloCompleto.rows[0]
    });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ mensaje: 'Error al cambiar estado del artículo', error: error.message });
  }
};

module.exports = {
  obtenerArticulos,
  obtenerMisArticulos,
  obtenerArticuloPorId,
  crearArticulo,
  crearConArchivoDB,
  actualizarArticulo,
  eliminarArticulo,
  cambiarEstadoArticulo,
};
