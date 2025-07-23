// routes/notificacionesRoutes.js
const express = require('express');
const router = express.Router();
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

// Rutas para notificaciones
router.get('/', obtenerNotificaciones);                           // GET /api/notificaciones - Obtener todas las notificaciones con filtros
router.get('/:id', obtenerNotificacionPorId);                     // GET /api/notificaciones/:id - Obtener notificación específica
router.post('/', crearNotificacion);                              // POST /api/notificaciones - Crear nueva notificación
router.delete('/:id', eliminarNotificacion);                      // DELETE /api/notificaciones/:id - Eliminar notificación

// Rutas para manejo de estado de lectura
router.patch('/:id/marcar-leida', marcarComoLeida);               // PATCH /api/notificaciones/:id/marcar-leida
router.patch('/:id/marcar-no-leida', marcarComoNoLeida);          // PATCH /api/notificaciones/:id/marcar-no-leida

// Rutas específicas por usuario
router.get('/usuario/:usuario_id', obtenerNotificacionesPorUsuario);       // GET /api/notificaciones/usuario/:usuario_id
router.patch('/usuario/:usuario_id/marcar-todas-leidas', marcarTodasComoLeidas); // PATCH /api/notificaciones/usuario/:usuario_id/marcar-todas-leidas

module.exports = router;
