// controllers/estadisticasController.js - Controlador para estadísticas de dashboards
const db = require('../db');

const estadisticasController = {
  // Estadísticas generales para admin
  async getEstadisticasGenerales(req, res) {
    try {
      const estadisticas = {};

      // Total usuarios
      const usuariosResult = await db.query('SELECT COUNT(*) as total FROM usuarios');
      estadisticas.totalUsuarios = parseInt(usuariosResult.rows[0].total);

      // Total artículos
      const articulosResult = await db.query('SELECT COUNT(*) as total FROM articulos');
      estadisticas.totalArticulos = parseInt(articulosResult.rows[0].total);

      // Artículos pendientes de revisión
      const pendientesResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE estado IN ('enviado', 'en_revision')"
      );
      estadisticas.articulosPendientes = parseInt(pendientesResult.rows[0].total);

      // Revisiones completadas
      const revisionesResult = await db.query('SELECT COUNT(*) as total FROM revisiones WHERE estado = $1', ['completada']);
      estadisticas.revisionesCompletas = parseInt(revisionesResult.rows[0].total);

      // Usuarios activos (últimas 24 horas - simulado por ahora)
      estadisticas.usuariosActivos = Math.floor(estadisticas.totalUsuarios * 0.3);

      // Usuarios por rol
      const rolesResult = await db.query(
        'SELECT rol, COUNT(*) as total FROM usuarios GROUP BY rol'
      );
      estadisticas.usuariosPorRol = rolesResult.rows.reduce((acc, row) => {
        acc[row.rol] = parseInt(row.total);
        return acc;
      }, {});

      // Artículos por estado
      const estadosResult = await db.query(
        'SELECT estado, COUNT(*) as total FROM articulos GROUP BY estado'
      );
      estadisticas.articulosPorEstado = estadosResult.rows.reduce((acc, row) => {
        acc[row.estado] = parseInt(row.total);
        return acc;
      }, {});

      res.json({
        success: true,
        data: estadisticas,
        mensaje: 'Estadísticas generales obtenidas correctamente'
      });

    } catch (error) {
      console.error('Error al obtener estadísticas generales:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Estadísticas para editor
  async getEstadisticasEditor(req, res) {
    try {
      const estadisticas = {};

      // Artículos en revisión (usando estados reales)
      const enRevisionResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE estado IN ('en_revision', 'enviado')"
      );
      estadisticas.articulosEnRevision = parseInt(enRevisionResult.rows[0].total);

      // Artículos aprobados este mes (puede estar vacío)
      const aprobadosResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE estado = 'aprobado' AND DATE_TRUNC('month', fecha_actualizacion) = DATE_TRUNC('month', CURRENT_DATE)"
      );
      estadisticas.articulosAprobados = parseInt(aprobadosResult.rows[0].total);

      // Artículos rechazados este mes
      const rechazadosResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE estado = 'rechazado' AND DATE_TRUNC('month', fecha_actualizacion) = DATE_TRUNC('month', CURRENT_DATE)"
      );
      estadisticas.articulosRechazados = parseInt(rechazadosResult.rows[0].total);

      // Revisores activos (usando estados reales de revisiones)
      const revisoresResult = await db.query(
        "SELECT COUNT(DISTINCT u.id) as total FROM usuarios u INNER JOIN revisiones r ON u.id = r.revisor_id WHERE r.estado IN ('pendiente', 'en_progreso')"
      );
      estadisticas.revisoresPendientes = parseInt(revisoresResult.rows[0].total);

      // Artículos listos para publicar
      const listosResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE estado = 'aprobado'"
      );
      estadisticas.articulosListos = parseInt(listosResult.rows[0].total);

      // Artículos por asignar (enviados sin revisor)
      const sinAsignarResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos a LEFT JOIN revisiones r ON a.id = r.articulo_id WHERE a.estado = 'enviado' AND r.id IS NULL"
      );
      estadisticas.articulosSinAsignar = parseInt(sinAsignarResult.rows[0].total);

      res.json({
        success: true,
        data: estadisticas,
        mensaje: 'Estadísticas de editor obtenidas correctamente'
      });

    } catch (error) {
      console.error('Error al obtener estadísticas de editor:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Estadísticas para revisor
  async getEstadisticasRevisor(req, res) {
    try {
      const revisorId = req.usuario.id;
      const estadisticas = {};

      // Artículos asignados pendientes (usando estados reales)
      const pendientesResult = await db.query(
        "SELECT COUNT(*) as total FROM revisiones WHERE revisor_id = $1 AND estado IN ('pendiente', 'en_progreso')",
        [revisorId]
      );
      estadisticas.articulosPendientes = parseInt(pendientesResult.rows[0].total);

      // Revisiones completadas (usando campo correcto)
      const completadasResult = await db.query(
        "SELECT COUNT(*) as total FROM revisiones WHERE revisor_id = $1 AND estado = 'completada'",
        [revisorId]
      );
      estadisticas.revisionesCompletadas = parseInt(completadasResult.rows[0].total);

      // Tiempo promedio de revisión (usando campo correcto fecha_completado)
      const tiempoResult = await db.query(
        `SELECT AVG(EXTRACT(DAY FROM (fecha_completado - fecha_asignacion))) as promedio 
         FROM revisiones 
         WHERE revisor_id = $1 AND estado = 'completada' AND fecha_completado IS NOT NULL`,
        [revisorId]
      );
      estadisticas.tiempoPromedioRevision = tiempoResult.rows[0].promedio ? 
        parseFloat(tiempoResult.rows[0].promedio).toFixed(1) : 0;

      // Puntuación media (simulada por ahora)
      estadisticas.puntuacionMedia = 4.2;

      // Artículos asignados con detalles (usando usuario_id correcto)
      const asignadosResult = await db.query(
        `SELECT a.id, a.titulo, a.resumen, u.nombre as autor_nombre, 
                r.fecha_asignacion, r.estado as revision_estado
         FROM articulos a
         INNER JOIN revisiones r ON a.id = r.articulo_id
         INNER JOIN usuarios u ON a.usuario_id = u.id
         WHERE r.revisor_id = $1 AND r.estado IN ('pendiente', 'en_progreso')
         ORDER BY r.fecha_asignacion ASC`,
        [revisorId]
      );
      estadisticas.articulosAsignados = asignadosResult.rows;

      res.json({
        success: true,
        data: estadisticas,
        mensaje: 'Estadísticas de revisor obtenidas correctamente'
      });

    } catch (error) {
      console.error('Error al obtener estadísticas de revisor:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Estadísticas para autor
  async getEstadisticasAutor(req, res) {
    try {
      const autorId = req.usuario.id;
      const estadisticas = {};

      // Artículos enviados (usando usuario_id correcto)
      const enviadosResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE usuario_id = $1",
        [autorId]
      );
      estadisticas.articulosEnviados = parseInt(enviadosResult.rows[0].total);

      // Artículos publicados
      const publicadosResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE usuario_id = $1 AND estado = 'publicado'",
        [autorId]
      );
      estadisticas.articulosPublicados = parseInt(publicadosResult.rows[0].total);

      // Artículos en borrador
      const borradorResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE usuario_id = $1 AND estado = 'borrador'",
        [autorId]
      );
      estadisticas.articulosBorrador = parseInt(borradorResult.rows[0].total);

      // Artículos en revisión (usando estados reales)
      const revisionResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE usuario_id = $1 AND estado IN ('enviado', 'en_revision')",
        [autorId]
      );
      estadisticas.enRevision = parseInt(revisionResult.rows[0].total);

      // Tasa de aceptación
      const aprobadosResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE usuario_id = $1 AND estado IN ('aprobado', 'publicado')",
        [autorId]
      );
      const aprobados = parseInt(aprobadosResult.rows[0].total);
      estadisticas.tasaAceptacion = estadisticas.articulosEnviados > 0 ? 
        ((aprobados / estadisticas.articulosEnviados) * 100).toFixed(1) : 0;

      // Artículos con detalles (usando usuario_id y fecha_completado correcto)
      const articulosResult = await db.query(
        `SELECT a.*, r.estado as revision_estado, r.observaciones as comentarios, 
                r.fecha_completado, u.nombre as revisor_nombre
         FROM articulos a
         LEFT JOIN revisiones r ON a.id = r.articulo_id
         LEFT JOIN usuarios u ON r.revisor_id = u.id
         WHERE a.usuario_id = $1
         ORDER BY a.fecha_creacion DESC`,
        [autorId]
      );
      estadisticas.detalleArticulos = articulosResult.rows;

      res.json({
        success: true,
        data: estadisticas,
        mensaje: 'Estadísticas de autor obtenidas correctamente'
      });

    } catch (error) {
      console.error('Error al obtener estadísticas de autor:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Actividad reciente para admin
  async getActividadReciente(req, res) {
    try {
      const actividades = [];

      // Artículos recientes (usando usuario_id correcto)
      const articulosRecientes = await db.query(
        `SELECT a.titulo, u.nombre as autor, a.fecha_creacion as fecha, a.estado, 'articulo' as tipo
         FROM articulos a
         INNER JOIN usuarios u ON a.usuario_id = u.id
         ORDER BY a.fecha_creacion DESC
         LIMIT 5`
      );

      // Revisiones recientes (usando fecha_completado correcto)
      const revisionesRecientes = await db.query(
        `SELECT a.titulo, u.nombre as revisor, r.fecha_completado as fecha, r.estado, 'revision' as tipo
         FROM revisiones r
         INNER JOIN articulos a ON r.articulo_id = a.id
         INNER JOIN usuarios u ON r.revisor_id = u.id
         WHERE r.fecha_completado IS NOT NULL
         ORDER BY r.fecha_completado DESC
         LIMIT 5`
      );

      // Usuarios recientes
      const usuariosRecientes = await db.query(
        `SELECT nombre, email, fecha_creacion as fecha, rol, 'usuario' as tipo
         FROM usuarios
         ORDER BY fecha_creacion DESC
         LIMIT 3`
      );

      // Combinar y ordenar
      const todasActividades = [
        ...articulosRecientes.rows,
        ...revisionesRecientes.rows,
        ...usuariosRecientes.rows
      ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 10);

      res.json({
        success: true,
        data: todasActividades,
        mensaje: 'Actividad reciente obtenida correctamente'
      });

    } catch (error) {
      console.error('Error al obtener actividad reciente:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Métricas de archivos y almacenamiento
  async getMetricasArchivos(req, res) {
    try {
      const metricas = {};

      // Total de archivos
      const totalArchivosResult = await db.query(
        'SELECT COUNT(*) as total FROM articulos WHERE archivo_nombre IS NOT NULL'
      );
      metricas.totalArchivos = parseInt(totalArchivosResult.rows[0].total);

      // Espacio total utilizado (en bytes y MB)
      const espacioResult = await db.query(
        'SELECT SUM(archivo_size) as total_bytes FROM articulos WHERE archivo_size IS NOT NULL'
      );
      const totalBytes = parseInt(espacioResult.rows[0].total_bytes) || 0;
      metricas.espacioTotalBytes = totalBytes;
      metricas.espacioTotalMB = Math.round(totalBytes / 1024 / 1024 * 100) / 100; // Redondeado a 2 decimales

      // Distribución por tipo de archivo
      const tiposResult = await db.query(`
        SELECT 
          CASE 
            WHEN archivo_mimetype LIKE '%pdf%' THEN 'PDF'
            WHEN archivo_mimetype LIKE '%word%' OR archivo_mimetype LIKE '%document%' THEN 'Word'
            WHEN archivo_mimetype LIKE '%text%' THEN 'Texto'
            ELSE 'Otros'
          END as tipo_archivo,
          COUNT(*) as cantidad,
          SUM(archivo_size) as espacio_total
        FROM articulos 
        WHERE archivo_mimetype IS NOT NULL AND archivo_size IS NOT NULL
        GROUP BY 
          CASE 
            WHEN archivo_mimetype LIKE '%pdf%' THEN 'PDF'
            WHEN archivo_mimetype LIKE '%word%' OR archivo_mimetype LIKE '%document%' THEN 'Word'
            WHEN archivo_mimetype LIKE '%text%' THEN 'Texto'
            ELSE 'Otros'
          END
        ORDER BY cantidad DESC
      `);
      
      metricas.distribucionTipos = tiposResult.rows.map(row => ({
        tipo: row.tipo_archivo,
        cantidad: parseInt(row.cantidad),
        espacioBytes: parseInt(row.espacio_total) || 0,
        espacioMB: Math.round((parseInt(row.espacio_total) || 0) / 1024 / 1024 * 100) / 100
      }));

      // Archivos más grandes (top 5)
      const archivosGrandesResult = await db.query(`
        SELECT 
          a.titulo,
          a.archivo_nombre,
          a.archivo_size,
          a.fecha_creacion,
          u.nombre as autor
        FROM articulos a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.archivo_size IS NOT NULL
        ORDER BY a.archivo_size DESC
        LIMIT 5
      `);
      
      metricas.archivosGrandes = archivosGrandesResult.rows.map(row => ({
        titulo: row.titulo,
        archivo: row.archivo_nombre,
        tamanoBytes: parseInt(row.archivo_size),
        tamanoMB: Math.round(parseInt(row.archivo_size) / 1024 / 1024 * 100) / 100,
        fecha: row.fecha_creacion,
        autor: row.autor
      }));

      // Estadísticas de archivos por fecha (últimos 7 días)
      const archivosPorFechaResult = await db.query(`
        SELECT 
          DATE(a.fecha_creacion) as fecha,
          COUNT(*) as archivos_subidos,
          SUM(a.archivo_size) as espacio_usado
        FROM articulos a
        WHERE a.archivo_nombre IS NOT NULL 
          AND a.fecha_creacion >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(a.fecha_creacion)
        ORDER BY fecha DESC
      `);
      
      metricas.actividadReciente = archivosPorFechaResult.rows.map(row => ({
        fecha: row.fecha,
        archivos: parseInt(row.archivos_subidos),
        espacioBytes: parseInt(row.espacio_usado) || 0,
        espacioMB: Math.round((parseInt(row.espacio_usado) || 0) / 1024 / 1024 * 100) / 100
      }));

      // Promedio de tamaño de archivos
      const promedioResult = await db.query(
        'SELECT AVG(archivo_size) as promedio FROM articulos WHERE archivo_size IS NOT NULL'
      );
      const promedioBytes = parseFloat(promedioResult.rows[0].promedio) || 0;
      metricas.tamanoPromedio = {
        bytes: Math.round(promedioBytes),
        mb: Math.round(promedioBytes / 1024 / 1024 * 100) / 100
      };

      res.json({
        success: true,
        data: metricas,
        mensaje: 'Métricas de archivos obtenidas correctamente'
      });

    } catch (error) {
      console.error('Error al obtener métricas de archivos:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Estadísticas de descarga de documentos
  async getEstadisticasDescargas(req, res) {
    try {
      // Por ahora simulamos las estadísticas de descarga
      // En una implementación real, necesitaríamos una tabla de logs de descarga
      const estadisticas = {
        totalDescargas: 0,
        descargasHoy: 0,
        descargasSemana: 0,
        descargasMes: 0,
        documentosMasDescargados: [],
        descargasPorDia: [],
        nota: 'Sistema de tracking de descargas pendiente de implementación'
      };

      // Podemos obtener información básica de los archivos disponibles para descarga
      const archivosDisponiblesResult = await db.query(`
        SELECT 
          COUNT(*) as total_disponibles,
          COUNT(CASE WHEN estado = 'publicado' THEN 1 END) as publicados_disponibles
        FROM articulos 
        WHERE archivo_nombre IS NOT NULL
      `);

      estadisticas.archivosDisponibles = parseInt(archivosDisponiblesResult.rows[0].total_disponibles);
      estadisticas.archivosPublicados = parseInt(archivosDisponiblesResult.rows[0].publicados_disponibles);

      res.json({
        success: true,
        data: estadisticas,
        mensaje: 'Estadísticas de descarga obtenidas (simuladas)'
      });

    } catch (error) {
      console.error('Error al obtener estadísticas de descarga:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = estadisticasController;
