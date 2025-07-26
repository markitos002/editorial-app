// routes/asignacionesRoutes.js - Rutas para asignación de revisores
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const {
  getRevisoresDisponibles,
  getArticulosSinAsignar,
  asignarRevisor,
  getAsignaciones,
  getAsignacionesActivas,
  cancelarAsignacion
} = require('../controllers/asignacionesController');

// Middleware de autenticación para todas las rutas
router.use(verificarToken);

// Middleware para verificar que el usuario es editor o admin
const verificarRolEditor = (req, res, next) => {
  if (!['admin', 'editor'].includes(req.usuario.rol)) {
    return res.status(403).json({ 
      success: false,
      mensaje: 'Acceso denegado. Se requiere rol de editor o administrador.' 
    });
  }
  next();
};

// Rutas principales
router.get('/revisores-disponibles', verificarRolEditor, getRevisoresDisponibles);
router.get('/articulos-sin-asignar', verificarRolEditor, getArticulosSinAsignar);
router.get('/asignaciones', verificarRolEditor, getAsignaciones);
router.get('/activas', verificarRolEditor, getAsignacionesActivas);
router.post('/asignar', verificarRolEditor, asignarRevisor);
router.put('/cancelar/:revision_id', verificarRolEditor, cancelarAsignacion);

module.exports = router;
