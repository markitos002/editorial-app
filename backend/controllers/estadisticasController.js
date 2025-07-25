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

      // Artículos en revisión
      const enRevisionResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE estado = 'en_revision'"
      );
      estadisticas.articulosEnRevision = parseInt(enRevisionResult.rows[0].total);

      // Artículos aprobados este mes
      const aprobadosResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE estado = 'aprobado' AND DATE_TRUNC('month', fecha_actualizacion) = DATE_TRUNC('month', CURRENT_DATE)"
      );
      estadisticas.articulosAprobados = parseInt(aprobadosResult.rows[0].total);

      // Artículos rechazados este mes
      const rechazadosResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE estado = 'rechazado' AND DATE_TRUNC('month', fecha_actualizacion) = DATE_TRUNC('month', CURRENT_DATE)"
      );
      estadisticas.articulosRechazados = parseInt(rechazadosResult.rows[0].total);

      // Revisores activos
      const revisoresResult = await db.query(
        "SELECT COUNT(DISTINCT u.id) as total FROM usuarios u INNER JOIN revisiones r ON u.id = r.revisor_id WHERE r.estado IN ('asignada', 'en_progreso')"
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

      // Artículos asignados pendientes
      const pendientesResult = await db.query(
        "SELECT COUNT(*) as total FROM revisiones WHERE revisor_id = $1 AND estado IN ('asignada', 'en_progreso')",
        [revisorId]
      );
      estadisticas.articulosPendientes = parseInt(pendientesResult.rows[0].total);

      // Revisiones completadas
      const completadasResult = await db.query(
        "SELECT COUNT(*) as total FROM revisiones WHERE revisor_id = $1 AND estado = 'completada'",
        [revisorId]
      );
      estadisticas.revisionesCompletadas = parseInt(completadasResult.rows[0].total);

      // Tiempo promedio de revisión (en días)
      const tiempoResult = await db.query(
        `SELECT AVG(EXTRACT(DAY FROM (fecha_completada - fecha_asignacion))) as promedio 
         FROM revisiones 
         WHERE revisor_id = $1 AND estado = 'completada' AND fecha_completada IS NOT NULL`,
        [revisorId]
      );
      estadisticas.tiempoPromedioRevision = tiempoResult.rows[0].promedio ? 
        parseFloat(tiempoResult.rows[0].promedio).toFixed(1) : 0;

      // Puntuación media (simulada por ahora)
      estadisticas.puntuacionMedia = 4.2;

      // Artículos asignados con detalles
      const asignadosResult = await db.query(
        `SELECT a.id, a.titulo, a.resumen, u.nombre as autor_nombre, 
                r.fecha_asignacion, r.fecha_limite, r.estado as revision_estado
         FROM articulos a
         INNER JOIN revisiones r ON a.id = r.articulo_id
         INNER JOIN usuarios u ON a.autor_id = u.id
         WHERE r.revisor_id = $1 AND r.estado IN ('asignada', 'en_progreso')
         ORDER BY r.fecha_limite ASC`,
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

      // Artículos enviados
      const enviadosResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE autor_id = $1",
        [autorId]
      );
      estadisticas.articulosEnviados = parseInt(enviadosResult.rows[0].total);

      // Artículos publicados
      const publicadosResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE autor_id = $1 AND estado = 'publicado'",
        [autorId]
      );
      estadisticas.articulosPublicados = parseInt(publicadosResult.rows[0].total);

      // Artículos en borrador
      const borradorResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE autor_id = $1 AND estado = 'borrador'",
        [autorId]
      );
      estadisticas.articulosBorrador = parseInt(borradorResult.rows[0].total);

      // Artículos en revisión
      const revisionResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE autor_id = $1 AND estado IN ('enviado', 'en_revision')",
        [autorId]
      );
      estadisticas.enRevision = parseInt(revisionResult.rows[0].total);

      // Tasa de aceptación
      const aprobadosResult = await db.query(
        "SELECT COUNT(*) as total FROM articulos WHERE autor_id = $1 AND estado IN ('aprobado', 'publicado')",
        [autorId]
      );
      const aprobados = parseInt(aprobadosResult.rows[0].total);
      estadisticas.tasaAceptacion = estadisticas.articulosEnviados > 0 ? 
        ((aprobados / estadisticas.articulosEnviados) * 100).toFixed(1) : 0;

      // Artículos con detalles
      const articulosResult = await db.query(
        `SELECT a.*, r.estado as revision_estado, r.comentarios, 
                r.fecha_completada, u.nombre as revisor_nombre
         FROM articulos a
         LEFT JOIN revisiones r ON a.id = r.articulo_id
         LEFT JOIN usuarios u ON r.revisor_id = u.id
         WHERE a.autor_id = $1
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

      // Artículos recientes
      const articulosRecientes = await db.query(
        `SELECT a.titulo, u.nombre as autor, a.fecha_creacion, a.estado, 'articulo' as tipo
         FROM articulos a
         INNER JOIN usuarios u ON a.autor_id = u.id
         ORDER BY a.fecha_creacion DESC
         LIMIT 5`
      );

      // Revisiones recientes
      const revisionesRecientes = await db.query(
        `SELECT a.titulo, u.nombre as revisor, r.fecha_completada as fecha, r.estado, 'revision' as tipo
         FROM revisiones r
         INNER JOIN articulos a ON r.articulo_id = a.id
         INNER JOIN usuarios u ON r.revisor_id = u.id
         WHERE r.fecha_completada IS NOT NULL
         ORDER BY r.fecha_completada DESC
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
  }
};

module.exports = estadisticasController;
