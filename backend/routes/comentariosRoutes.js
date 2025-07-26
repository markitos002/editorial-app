// routes/comentariosRoutes.js - Rutas para sistema de comentarios y observaciones
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const {
  getComentariosRevision,
  crearComentario,
  actualizarComentario,
  eliminarComentario,
  toggleEstadoComentario,
  getEstadisticasComentarios
} = require('../controllers/comentariosController');

// Middleware de autenticación para todas las rutas
router.use(verificarToken);

// Rutas para comentarios de revisión
router.get('/revision/:revision_id', getComentariosRevision);
router.post('/revision/:revision_id', crearComentario);
router.get('/revision/:revision_id/estadisticas', getEstadisticasComentarios);

// Rutas para comentarios específicos
router.put('/:comentario_id', actualizarComentario);
router.delete('/:comentario_id', eliminarComentario);
router.patch('/:comentario_id/toggle-estado', toggleEstadoComentario);

module.exports = router;
