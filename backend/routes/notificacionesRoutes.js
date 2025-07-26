// routes/notificacionesRoutes.js
const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const {
  obtenerNotificaciones,
  obtenerNotificacionPorId,
  crearNotificacion,
  marcarComoLeida,
  marcarComoNoLeida,
  marcarTodasComoLeidas,
  eliminarNotificacion,
  obtenerNotificacionesPorUsuario
} = require('../controllers/notificacionesController');

// Rutas protegidas para notificaciones (todas requieren autenticación)
router.get('/', verificarToken, verificarRol('editor', 'admin'), obtenerNotificaciones);                           // GET /api/notificaciones - Obtener todas las notificaciones con filtros
router.get('/:id', verificarToken, obtenerNotificacionPorId);                     // GET /api/notificaciones/:id - Obtener notificación específica
router.post('/', verificarToken, verificarRol('editor', 'admin'), crearNotificacion);                              // POST /api/notificaciones - Crear nueva notificación
router.delete('/:id', verificarToken, eliminarNotificacion);                      // DELETE /api/notificaciones/:id - Eliminar notificación

// Rutas para manejo de estado de lectura
router.patch('/:id/marcar-leida', verificarToken, marcarComoLeida);               // PATCH /api/notificaciones/:id/marcar-leida
router.patch('/:id/marcar-no-leida', verificarToken, marcarComoNoLeida);          // PATCH /api/notificaciones/:id/marcar-no-leida

// Rutas específicas por usuario
router.get('/usuario/me', verificarToken, (req, res) => {
  req.params.usuario_id = req.usuario.id;
  return obtenerNotificacionesPorUsuario(req, res);
});                                                                                 // GET /api/notificaciones/usuario/me - Notificaciones del usuario actual
router.get('/usuario/:usuario_id', verificarToken, obtenerNotificacionesPorUsuario);       // GET /api/notificaciones/usuario/:usuario_id
router.patch('/usuario/me/marcar-todas-leidas', verificarToken, (req, res) => {
  req.params.usuario_id = req.usuario.id;
  return marcarTodasComoLeidas(req, res);
});                                                                                 // PATCH /api/notificaciones/usuario/me/marcar-todas-leidas
router.patch('/usuario/:usuario_id/marcar-todas-leidas', verificarToken, marcarTodasComoLeidas); // PATCH /api/notificaciones/usuario/:usuario_id/marcar-todas-leidas

module.exports = router;
