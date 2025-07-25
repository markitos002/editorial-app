// routes/revisionDocumentosRoutes.js - Rutas para revisión de documentos
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const {
  getRevisionesAsignadas,
  getRevisionDetalle,
  guardarProgresoRevision,
  completarRevision,
  descargarDocumento,
  getHistorialComentarios
} = require('../controllers/revisionDocumentosController');

// Middleware de autenticación para todas las rutas
router.use(verificarToken);

// Middleware para verificar que el usuario es revisor, editor o admin
const verificarRolRevisor = (req, res, next) => {
  if (!['admin', 'editor', 'revisor'].includes(req.usuario.rol)) {
    return res.status(403).json({ 
      success: false,
      mensaje: 'Acceso denegado. Se requiere rol de revisor, editor o administrador.' 
    });
  }
  next();
};

// Rutas principales
router.get('/mis-revisiones', verificarRolRevisor, getRevisionesAsignadas);
router.get('/revision/:revision_id', verificarRolRevisor, getRevisionDetalle);
router.put('/revision/:revision_id/progreso', verificarRolRevisor, guardarProgresoRevision);
router.put('/revision/:revision_id/completar', verificarRolRevisor, completarRevision);
router.get('/revision/:revision_id/documento', verificarRolRevisor, descargarDocumento);
router.get('/revision/:revision_id/comentarios', verificarRolRevisor, getHistorialComentarios);

module.exports = router;
