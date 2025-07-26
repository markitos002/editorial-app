// routes/busquedaRoutes.js - Rutas para sistema de búsqueda y filtros
const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const {
  busquedaGlobal,
  busquedaArticulos,
  obtenerSugerencias,
  obtenerOpcionesFiltros
} = require('../controllers/busquedaController');

// Rutas de búsqueda (todas requieren autenticación)

// Búsqueda global en todo el sistema
router.get('/global', verificarToken, busquedaGlobal);
// GET /api/busqueda/global?q=termino&tipo=todos&limite=50&usuario_id=1

// Búsqueda avanzada de artículos con filtros
router.get('/articulos', verificarToken, busquedaArticulos);
// GET /api/busqueda/articulos?q=termino&estado=enviado&autor_id=1&fecha_desde=2025-01-01&page=1&limit=20

// Autocompletado y sugerencias
router.get('/sugerencias', verificarToken, obtenerSugerencias);
// GET /api/busqueda/sugerencias?q=term&tipo=articulos&limite=10

// Opciones para filtros (estados, autores, revisores)
router.get('/opciones-filtros', verificarToken, obtenerOpcionesFiltros);
// GET /api/busqueda/opciones-filtros

module.exports = router;
