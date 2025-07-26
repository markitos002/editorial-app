// controllers/busquedaController.js - Controlador para búsquedas y filtros avanzados
const pool = require('../db/index.js');

const busquedaController = {
  
  // Búsqueda global en artículos, comentarios y usuarios
  async busquedaGlobal(req, res) {
    try {
      const { 
        q: termino, 
        tipo = 'todos', // 'articulos', 'comentarios', 'usuarios', 'todos'
        limite = 50,
        usuario_id = null 
      } = req.query;
      
      if (!termino || termino.trim().length < 2) {
        return res.status(400).json({
          success: false,
          mensaje: 'El término de búsqueda debe tener al menos 2 caracteres'
        });
      }
      
      const terminoBusqueda = `%${termino.toLowerCase()}%`;
      const resultados = {};
      
      // Búsqueda en artículos
      if (tipo === 'todos' || tipo === 'articulos') {
        const queryArticulos = `
          SELECT 
            'articulo' as tipo_resultado,
            a.id,
            a.titulo,
            a.resumen,
            a.estado,
            a.fecha_creacion,
            u.nombre as autor,
            u.email as autor_email,
            u.nombre as autor_usuario_nombre,
            CASE 
              WHEN LOWER(a.titulo) LIKE $1 THEN 3
              WHEN LOWER(a.resumen) LIKE $1 THEN 2
              WHEN LOWER(u.nombre) LIKE $1 THEN 1
              ELSE 0
            END as relevancia
          FROM articulos a
          LEFT JOIN usuarios u ON a.usuario_id = u.id
          WHERE (
            LOWER(a.titulo) LIKE $1 OR 
            LOWER(a.resumen) LIKE $1 OR 
            LOWER(u.nombre) LIKE $1 OR
            LOWER(u.email) LIKE $1
          )
          ${usuario_id ? 'AND a.usuario_id = $3' : ''}
          ORDER BY relevancia DESC, a.fecha_creacion DESC
          LIMIT $2
        `;
        
        const paramsArticulos = usuario_id 
          ? [terminoBusqueda, limite, usuario_id]
          : [terminoBusqueda, limite];
          
        const articulosResult = await pool.query(queryArticulos, paramsArticulos);
        resultados.articulos = articulosResult.rows;
      }
      
      // Búsqueda en comentarios
      if (tipo === 'todos' || tipo === 'comentarios') {
        const queryComentarios = `
          SELECT 
            'comentario' as tipo_resultado,
            c.id,
            c.contenido,
            c.tipo as tipo_comentario,
            c.estado,
            c.fecha_creacion,
            c.revision_id,
            r.articulo_id,
            a.titulo as articulo_titulo,
            u.nombre as autor_comentario,
            CASE 
              WHEN LOWER(c.contenido) LIKE $1 THEN 2
              WHEN LOWER(a.titulo) LIKE $1 THEN 1
              ELSE 0
            END as relevancia
          FROM comentarios c
          LEFT JOIN revisiones r ON c.revision_id = r.id
          LEFT JOIN articulos a ON r.articulo_id = a.id
          LEFT JOIN usuarios u ON c.usuario_id = u.id
          WHERE LOWER(c.contenido) LIKE $1
          ${usuario_id ? 'AND c.usuario_id = $3' : ''}
          ORDER BY relevancia DESC, c.fecha_creacion DESC
          LIMIT $2
        `;
        
        const paramsComentarios = usuario_id 
          ? [terminoBusqueda, limite, usuario_id]
          : [terminoBusqueda, limite];
          
        const comentariosResult = await pool.query(queryComentarios, paramsComentarios);
        resultados.comentarios = comentariosResult.rows;
      }
      
      // Búsqueda en usuarios (solo para admins/editores)
      if ((tipo === 'todos' || tipo === 'usuarios') && 
          ['admin', 'editor'].includes(req.usuario.rol)) {
        const queryUsuarios = `
          SELECT 
            'usuario' as tipo_resultado,
            u.id,
            u.nombre,
            u.email,
            u.rol,
            u.fecha_creacion,
            CASE 
              WHEN LOWER(u.nombre) LIKE $1 THEN 2
              WHEN LOWER(u.email) LIKE $1 THEN 1
              ELSE 0
            END as relevancia
          FROM usuarios u
          WHERE (
            LOWER(u.nombre) LIKE $1 OR 
            LOWER(u.email) LIKE $1
          ) AND u.activo = true
          ORDER BY relevancia DESC, u.nombre ASC
          LIMIT $2
        `;
        
        const usuariosResult = await pool.query(queryUsuarios, [terminoBusqueda, limite]);
        resultados.usuarios = usuariosResult.rows;
      }
      
      // Calcular totales
      const totales = {
        articulos: resultados.articulos?.length || 0,
        comentarios: resultados.comentarios?.length || 0,
        usuarios: resultados.usuarios?.length || 0
      };
      
      res.json({
        success: true,
        termino_busqueda: termino,
        tipo_busqueda: tipo,
        resultados,
        totales,
        total_general: Object.values(totales).reduce((sum, count) => sum + count, 0)
      });
      
    } catch (error) {
      console.error('Error en búsqueda global:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error en la búsqueda',
        error: error.message
      });
    }
  },

  // Búsqueda avanzada de artículos con filtros
  async busquedaArticulos(req, res) {
    try {
      const { 
        q: termino = '',
        estado,
        usuario_id: autor_usuario_id,
        fecha_desde,
        fecha_hasta,
        revisor_id,
        page = 1,
        limit = 20,
        ordenar_por = 'fecha_creacion',
        orden = 'DESC' // ASC o DESC
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      // Construir filtros dinámicos
      let whereConditions = ['1=1']; // Condición base siempre verdadera
      let queryParams = [];
      let paramCount = 1;
      
      // Filtro por término de búsqueda
      if (termino && termino.trim().length >= 2) {
        const terminoBusqueda = `%${termino.toLowerCase()}%`;
        whereConditions.push(`(
          LOWER(a.titulo) LIKE $${paramCount} OR 
          LOWER(a.resumen) LIKE $${paramCount} OR 
          LOWER(u.nombre) LIKE $${paramCount}
        )`);
        queryParams.push(terminoBusqueda);
        paramCount++;
      }
      
      // Filtro por estado
      if (estado) {
        whereConditions.push(`a.estado = $${paramCount}`);
        queryParams.push(estado);
        paramCount++;
      }
      
      // Filtro por autor
      if (autor_usuario_id) {
        whereConditions.push(`a.usuario_id = $${paramCount}`);
        queryParams.push(autor_usuario_id);
        paramCount++;
      }
      
      // Filtro por fecha desde
      if (fecha_desde) {
        whereConditions.push(`a.fecha_creacion >= $${paramCount}`);
        queryParams.push(fecha_desde);
        paramCount++;
      }
      
      // Filtro por fecha hasta
      if (fecha_hasta) {
        whereConditions.push(`a.fecha_creacion <= $${paramCount}`);
        queryParams.push(fecha_hasta);
        paramCount++;
      }
      
      // Filtro por revisor asignado - Removido porque no hay tabla de asignaciones
      // if (revisor_id) {
      //   whereConditions.push(`EXISTS (
      //     SELECT 1 FROM asignaciones_revision ar 
      //     WHERE ar.articulo_id = a.id AND ar.revisor_id = $${paramCount}
      //   )`);
      //   queryParams.push(revisor_id);
      //   paramCount++;
      // }
      
      // Validar campo de ordenamiento
      const camposPermitidos = ['fecha_creacion', 'titulo', 'estado'];
      const campoOrden = camposPermitidos.includes(ordenar_por) ? ordenar_por : 'fecha_creacion';
      const direccionOrden = orden.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      
      const whereClause = whereConditions.join(' AND ');
      
      // Consulta principal
      const query = `
        SELECT 
          a.*,
          u.nombre as autor,
          u.email as autor_email,
          COUNT(DISTINCT c.id) as total_comentarios,
          COUNT(DISTINCT CASE WHEN c.estado = 'activo' THEN c.id END) as comentarios_activos
        FROM articulos a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        LEFT JOIN revisiones r ON a.id = r.articulo_id
        LEFT JOIN comentarios c ON r.id = c.revision_id
        WHERE ${whereClause}
        GROUP BY a.id, u.nombre, u.email
        ORDER BY a.${campoOrden} ${direccionOrden}
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;
      
      queryParams.push(limit, offset);
      const resultado = await pool.query(query, queryParams);
      
      // Consulta para contar total
      const countQuery = `
        SELECT COUNT(DISTINCT a.id) as total
        FROM articulos a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE ${whereClause}
      `;
      
      const countParams = queryParams.slice(0, -2); // Quitar limit y offset
      const totalResult = await pool.query(countQuery, countParams);
      const total = parseInt(totalResult.rows[0].total);
      
      res.json({
        success: true,
        articulos: resultado.rows,
        filtros_aplicados: {
          termino,
          estado,
          autor_usuario_id,
          fecha_desde,
          fecha_hasta,
          revisor_id,
          ordenar_por: campoOrden,
          orden: direccionOrden
        },
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_count: total,
          per_page: parseInt(limit)
        }
      });
      
    } catch (error) {
      console.error('Error en búsqueda de artículos:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error en la búsqueda de artículos',
        error: error.message
      });
    }
  },

  // Sugerencias de autocompletado
  async obtenerSugerencias(req, res) {
    try {
      const { q: termino, tipo = 'articulos', limite = 10 } = req.query;
      
      if (!termino || termino.trim().length < 2) {
        return res.json({
          success: true,
          sugerencias: []
        });
      }
      
      const terminoBusqueda = `${termino.toLowerCase()}%`;
      let query = '';
      let params = [terminoBusqueda, limite];
      
      switch (tipo) {
        case 'articulos':
          query = `
            SELECT DISTINCT titulo as sugerencia, 'articulo' as tipo
            FROM articulos 
            WHERE LOWER(titulo) LIKE $1 
            ORDER BY titulo ASC 
            LIMIT $2
          `;
          break;
          
        case 'autores':
          query = `
            SELECT DISTINCT u.nombre as sugerencia, 'autor' as tipo
            FROM articulos a
            LEFT JOIN usuarios u ON a.usuario_id = u.id 
            WHERE LOWER(u.nombre) LIKE $1 AND u.nombre IS NOT NULL
            ORDER BY u.nombre ASC 
            LIMIT $2
          `;
          break;
          
        case 'usuarios':
          if (['admin', 'editor'].includes(req.usuario.rol)) {
            query = `
              SELECT DISTINCT nombre as sugerencia, 'usuario' as tipo
              FROM usuarios 
              WHERE LOWER(nombre) LIKE $1 AND activo = true
              ORDER BY nombre ASC 
              LIMIT $2
            `;
          }
          break;
      }
      
      if (!query) {
        return res.json({
          success: true,
          sugerencias: []
        });
      }
      
      const resultado = await pool.query(query, params);
      
      res.json({
        success: true,
        sugerencias: resultado.rows
      });
      
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error al obtener sugerencias',
        error: error.message
      });
    }
  },

  // Obtener opciones para filtros (estados, autores, etc.)
  async obtenerOpcionesFiltros(req, res) {
    try {
      const opciones = {};
      
      // Estados de artículos
      const estadosQuery = `
        SELECT DISTINCT estado, COUNT(*) as count
        FROM articulos 
        GROUP BY estado 
        ORDER BY count DESC
      `;
      const estadosResult = await pool.query(estadosQuery);
      opciones.estados = estadosResult.rows;
      
      // Autores (top 20)
      const autoresQuery = `
        SELECT DISTINCT 
          u.id, 
          u.nombre, 
          COUNT(*) as articulos_count
        FROM articulos a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE u.id IS NOT NULL AND u.nombre IS NOT NULL
        GROUP BY u.id, u.nombre 
        ORDER BY articulos_count DESC 
        LIMIT 20
      `;
      const autoresResult = await pool.query(autoresQuery);
      opciones.autores = autoresResult.rows;
      
      // Revisores activos - Removido porque no hay tabla de asignaciones
      // if (['admin', 'editor'].includes(req.usuario.rol)) {
      //   const revisoresQuery = `
      //     SELECT DISTINCT 
      //       u.id, 
      //       u.nombre, 
      //       COUNT(ar.id) as revisiones_count
      //     FROM usuarios u
      //     LEFT JOIN asignaciones_revision ar ON u.id = ar.revisor_id
      //     WHERE u.rol IN ('revisor', 'editor', 'admin') AND u.activo = true
      //     GROUP BY u.id, u.nombre
      //     ORDER BY revisiones_count DESC
      //     LIMIT 20
      //   `;
      //   const revisoresResult = await pool.query(revisoresQuery);
      //   opciones.revisores = revisoresResult.rows;
      // }
      
      res.json({
        success: true,
        opciones
      });
      
    } catch (error) {
      console.error('Error al obtener opciones de filtros:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error al obtener opciones de filtros',
        error: error.message
      });
    }
  }
};

module.exports = busquedaController;
