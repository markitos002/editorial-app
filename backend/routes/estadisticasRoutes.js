// routes/estadisticasRoutes.js - Rutas para estadísticas de dashboards
const express = require('express');
const router = express.Router();
const estadisticasController = require('../controllers/estadisticasController');
const authMiddleware = require('../middlewares/auth');

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Ruta para estadísticas generales (solo admin)
router.get('/generales', (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      mensaje: 'Acceso denegado. Solo administradores pueden ver estadísticas generales.'
    });
  }
  next();
}, estadisticasController.getEstadisticasGenerales);

// Ruta para estadísticas de editor (solo editores y admin)
router.get('/editor', (req, res, next) => {
  if (!['editor', 'admin'].includes(req.usuario.rol)) {
    return res.status(403).json({
      success: false,
      mensaje: 'Acceso denegado. Solo editores y administradores pueden ver estas estadísticas.'
    });
  }
  next();
}, estadisticasController.getEstadisticasEditor);

// Ruta para estadísticas de revisor (solo revisores y admin)
router.get('/revisor', (req, res, next) => {
  if (!['revisor', 'admin'].includes(req.usuario.rol)) {
    return res.status(403).json({
      success: false,
      mensaje: 'Acceso denegado. Solo revisores y administradores pueden ver estas estadísticas.'
    });
  }
  next();
}, estadisticasController.getEstadisticasRevisor);

// Ruta para estadísticas de autor (todos los usuarios autenticados)
router.get('/autor', estadisticasController.getEstadisticasAutor);

// Ruta para actividad reciente (solo admin)
router.get('/actividad-reciente', (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      mensaje: 'Acceso denegado. Solo administradores pueden ver la actividad reciente.'
    });
  }
  next();
}, estadisticasController.getActividadReciente);

module.exports = router;
