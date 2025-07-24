const express = require('express');
const router = express.Router();
const articulosController = require('../controllers/articulosController');
const { verificarToken, verificarRol, autenticacionOpcional } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Rutas públicas (solo lectura)
router.get('/', autenticacionOpcional, articulosController.obtenerArticulos);
router.get('/mis-articulos', verificarToken, articulosController.obtenerMisArticulos);
router.get('/:id', autenticacionOpcional, articulosController.obtenerArticuloPorId);

// Rutas protegidas (requieren autenticación)
router.post('/', verificarToken, verificarRol('autor', 'editor', 'admin'), upload.single('archivo'), articulosController.crearArticulo);
router.put('/:id', verificarToken, verificarRol('autor', 'editor', 'admin'), articulosController.actualizarArticulo);
router.delete('/:id', verificarToken, verificarRol('autor', 'editor', 'admin'), articulosController.eliminarArticulo);

// Ruta específica para cambiar estado (solo editores y admins)
router.patch('/:id/estado', verificarToken, verificarRol('editor', 'admin'), articulosController.cambiarEstadoArticulo);

// Ruta para descargar archivos
router.get('/:id/archivo', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = require('../db');
    
    const resultado = await pool.query('SELECT archivo_path, archivo_nombre FROM articulos WHERE id = $1', [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Artículo no encontrado' });
    }
    
    const articulo = resultado.rows[0];
    if (!articulo.archivo_path) {
      return res.status(404).json({ mensaje: 'Archivo no encontrado' });
    }
    
    const fs = require('fs');
    if (!fs.existsSync(articulo.archivo_path)) {
      return res.status(404).json({ mensaje: 'Archivo no existe en el sistema' });
    }
    
    res.download(articulo.archivo_path, articulo.archivo_nombre);
  } catch (error) {
    console.error('Error descargando archivo:', error);
    res.status(500).json({ mensaje: 'Error al descargar archivo' });
  }
});

module.exports = router;
