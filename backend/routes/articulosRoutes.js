const express = require('express');
const router = express.Router();
const articulosController = require('../controllers/articulosController');
const { verificarToken, verificarRol, autenticacionOpcional } = require('../middlewares/auth');

// Rutas públicas (solo lectura)
router.get('/', autenticacionOpcional, articulosController.obtenerArticulos);
router.get('/mis-articulos', verificarToken, articulosController.obtenerMisArticulos);
router.get('/:id', autenticacionOpcional, articulosController.obtenerArticuloPorId);

// Rutas protegidas (requieren autenticación)
router.post('/', verificarToken, verificarRol('autor', 'editor', 'admin'), articulosController.crearArticulo);
router.put('/:id', verificarToken, verificarRol('autor', 'editor', 'admin'), articulosController.actualizarArticulo);
router.delete('/:id', verificarToken, verificarRol('autor', 'editor', 'admin'), articulosController.eliminarArticulo);

// Ruta específica para cambiar estado (solo editores y admins)
router.patch('/:id/estado', verificarToken, verificarRol('editor', 'admin'), articulosController.cambiarEstadoArticulo);

module.exports = router;
