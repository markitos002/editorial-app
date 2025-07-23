// routes/revisionesRoutes.js
const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol, autenticacionOpcional } = require('../middlewares/auth');
const {
  obtenerRevisiones,
  obtenerRevisionPorId,
  crearRevision,
  actualizarRevision,
  eliminarRevision,
  obtenerRevisionesPorArticulo
} = require('../controllers/revisionesController');

// Rutas protegidas (todas las revisiones requieren autenticación)
router.get('/', verificarToken, obtenerRevisiones);                    // GET /api/revisiones - Obtener todas las revisiones con filtros
router.get('/:id', verificarToken, obtenerRevisionPorId);              // GET /api/revisiones/:id - Obtener revisión específica
router.post('/', verificarToken, verificarRol('revisor', 'editor', 'admin'), crearRevision);                       // POST /api/revisiones - Crear nueva revisión
router.put('/:id', verificarToken, verificarRol('revisor', 'editor', 'admin'), actualizarRevision);                // PUT /api/revisiones/:id - Actualizar revisión
router.delete('/:id', verificarToken, verificarRol('editor', 'admin'), eliminarRevision);               // DELETE /api/revisiones/:id - Eliminar revisión

// Ruta especial para obtener revisiones de un artículo específico
router.get('/articulo/:articulo_id', verificarToken, obtenerRevisionesPorArticulo); // GET /api/revisiones/articulo/:articulo_id

module.exports = router;
