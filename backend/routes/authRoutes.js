// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const { verificarToken } = require('../middlewares/auth.js');

// Rutas públicas (no requieren autenticación)
router.post('/registro', authController.registro);
router.post('/login', authController.login);

// Rutas protegidas (requieren autenticación)
router.get('/perfil', verificarToken, authController.obtenerPerfil);
router.put('/cambiar-contrasena', verificarToken, authController.cambiarContrasena);
router.post('/logout', verificarToken, authController.logout);
router.get('/verificar-token', verificarToken, authController.verificarToken);

module.exports = router;
