// routes/revisionesRoutes.js
const express = require('express');
const router = express.Router();
const {
  obtenerRevisiones,
  obtenerRevisionPorId,
  crearRevision,
  actualizarRevision,
  eliminarRevision,
  obtenerRevisionesPorArticulo
} = require('../controllers/revisionesController');

// Rutas para revisiones
router.get('/', obtenerRevisiones);                    // GET /api/revisiones - Obtener todas las revisiones con filtros
router.get('/:id', obtenerRevisionPorId);              // GET /api/revisiones/:id - Obtener revisión específica
router.post('/', crearRevision);                       // POST /api/revisiones - Crear nueva revisión
router.put('/:id', actualizarRevision);                // PUT /api/revisiones/:id - Actualizar revisión
router.delete('/:id', eliminarRevision);               // DELETE /api/revisiones/:id - Eliminar revisión

// Ruta especial para obtener revisiones de un artículo específico
router.get('/articulo/:articulo_id', obtenerRevisionesPorArticulo); // GET /api/revisiones/articulo/:articulo_id

module.exports = router;
