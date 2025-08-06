const express = require('express');
const router = express.Router();
const articulosController = require('../controllers/articulosController');
const { verificarToken, verificarRol, autenticacionOpcional } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
// const { upload: supabaseUpload, uploadToSupabase } = require('../middlewares/supabaseUpload');
const { upload: dbUpload, processFilesToDatabase } = require('../middlewares/databaseUpload');

// Rutas públicas (solo lectura)
router.get('/', autenticacionOpcional, articulosController.obtenerArticulos);
router.get('/mis-articulos', verificarToken, articulosController.obtenerMisArticulos);
router.get('/:id', autenticacionOpcional, articulosController.obtenerArticuloPorId);

// Rutas protegidas (requieren autenticación)
router.post('/', verificarToken, verificarRol('autor', 'editor', 'admin'), upload.single('archivo'), articulosController.crearArticulo);
router.post('/con-archivo-db', verificarToken, verificarRol('autor', 'editor', 'admin'), dbUpload, processFilesToDatabase, articulosController.crearConArchivoDB);
router.put('/:id', verificarToken, verificarRol('autor', 'editor', 'admin'), articulosController.actualizarArticulo);
router.delete('/:id', verificarToken, verificarRol('autor', 'editor', 'admin'), articulosController.eliminarArticulo);

// Ruta específica para cambiar estado (solo editores y admins)
router.patch('/:id/estado', verificarToken, verificarRol('editor', 'admin'), articulosController.cambiarEstadoArticulo);

// Ruta para descargar archivos
router.get('/:id/archivo', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = require('../db');
    
    // Buscar primero en la nueva estructura (archivo_data)
    let resultado = await pool.query(
      'SELECT archivo_data, archivo_nombre, archivo_mimetype FROM articulos WHERE id = $1', 
      [id]
    );
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Artículo no encontrado' });
    }
    
    const articulo = resultado.rows[0];
    
    // Si tiene archivo_data (almacenado como BLOB)
    if (articulo.archivo_data) {
      res.set({
        'Content-Type': articulo.archivo_mimetype || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${articulo.archivo_nombre}"`,
      });
      return res.send(articulo.archivo_data);
    }
    
    // Fallback: buscar en la estructura antigua (archivo_path)
    resultado = await pool.query(
      'SELECT archivo_path, archivo_nombre FROM articulos WHERE id = $1', 
      [id]
    );
    
    if (resultado.rows.length === 0 || !resultado.rows[0].archivo_path) {
      return res.status(404).json({ mensaje: 'Archivo no encontrado' });
    }
    
    const path = require('path');
    const fs = require('fs');
    const archivoPath = path.resolve(resultado.rows[0].archivo_path);
    
    if (!fs.existsSync(archivoPath)) {
      return res.status(404).json({ mensaje: 'Archivo no encontrado en el servidor' });
    }
    
    res.download(archivoPath, resultado.rows[0].archivo_nombre);
    
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    res.status(500).json({ mensaje: 'Error al descargar archivo' });
  }
});

module.exports = router;
