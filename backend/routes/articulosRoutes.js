const express = require('express');
const router = express.Router();
const articulosController = require('../controllers/articulosController');

// Rutas CRUD básicas
router.get('/', articulosController.obtenerArticulos);
router.get('/:id', articulosController.obtenerArticuloPorId);
router.post('/', articulosController.crearArticulo);
router.put('/:id', articulosController.actualizarArticulo);
router.delete('/:id', articulosController.eliminarArticulo);

// Ruta específica para cambiar estado
router.patch('/:id/estado', articulosController.cambiarEstadoArticulo);

module.exports = router;
