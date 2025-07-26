const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { verificarToken, verificarRol } = require('../middlewares/auth');

router.get('/', usuariosController.obtenerUsuarios);
router.get('/:id', usuariosController.obtenerUsuarioPorId);
router.post('/', usuariosController.crearUsuario);
// Ruta especial para que administradores creen usuarios con cualquier rol
router.post('/admin/crear', verificarToken, verificarRol('admin'), usuariosController.crearUsuarioPorAdmin);
router.put('/:id', usuariosController.actualizarUsuario);
router.delete('/:id', usuariosController.eliminarUsuario);

module.exports = router;