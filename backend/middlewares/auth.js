// middlewares/auth.js
const jwt = require('jsonwebtoken');
const pool = require('../db/index.js');

// Clave secreta para JWT (en producción debe estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'editorial_app_secret_key_2025';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Middleware para verificar token JWT
const verificarToken = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        mensaje: 'Acceso denegado. No se proporcionó token de autenticación.' 
      });
    }

    // Verificar formato: "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({ 
        mensaje: 'Acceso denegado. Token de autenticación inválido.' 
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verificar que el usuario aún existe en la base de datos
    const usuario = await pool.query(
      'SELECT id, nombre, email, rol, activo FROM usuarios WHERE id = $1',
      [decoded.id]
    );

    if (usuario.rows.length === 0) {
      return res.status(401).json({ 
        mensaje: 'Token inválido. Usuario no encontrado.' 
      });
    }

    if (!usuario.rows[0].activo) {
      return res.status(401).json({ 
        mensaje: 'Cuenta de usuario desactivada.' 
      });
    }

    // Agregar información del usuario al request
    req.usuario = {
      id: usuario.rows[0].id,
      nombre: usuario.rows[0].nombre,
      email: usuario.rows[0].email,
      rol: usuario.rows[0].rol
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        mensaje: 'Token de autenticación inválido.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        mensaje: 'Token de autenticación expirado.' 
      });
    }

    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({ 
      mensaje: 'Error interno del servidor en autenticación.' 
    });
  }
};

// Middleware para verificar roles específicos
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ 
        mensaje: 'Acceso denegado. Usuario no autenticado.' 
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ 
        mensaje: `Acceso denegado. Se requiere uno de estos roles: ${rolesPermitidos.join(', ')}` 
      });
    }

    next();
  };
};

// Middleware opcional (no requiere autenticación pero agrega info si está presente)
const autenticacionOpcional = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader;

      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          const usuario = await pool.query(
            'SELECT id, nombre, email, rol FROM usuarios WHERE id = $1 AND activo = true',
            [decoded.id]
          );

          if (usuario.rows.length > 0) {
            req.usuario = {
              id: usuario.rows[0].id,
              nombre: usuario.rows[0].nombre,
              email: usuario.rows[0].email,
              rol: usuario.rows[0].rol
            };
          }
        } catch (error) {
          // Token inválido o expirado, pero no interrumpimos el flujo
          // Solo continuamos sin usuario autenticado
        }
      }
    }
    
    next();
  } catch (error) {
    // En caso de error, continuamos sin autenticación
    next();
  }
};

// Función para generar token JWT
const generarToken = (usuario) => {
  const payload = {
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol
  };

  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN 
  });
};

// Función para verificar token sin middleware (para uso interno)
const verificarTokenInterno = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  verificarToken,
  verificarRol,
  autenticacionOpcional,
  generarToken,
  verificarTokenInterno,
  JWT_SECRET
};
