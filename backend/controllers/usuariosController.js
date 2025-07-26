const pool = require('../db');
const bcrypt = require('bcryptjs');

// Crear usuario por administrador (permite todos los roles)
const crearUsuarioPorAdmin = async (req, res) => {
  try {
    console.log('=== CREACIÓN DE USUARIO POR ADMIN ===');
    console.log('Body recibido:', req.body);
    console.log('Usuario autenticado:', req.usuario);

    // Verificar que el usuario sea admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        mensaje: 'No tienes permisos para crear usuarios con este rol'
      });
    }

    const { nombre, email, contrasena, rol } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !contrasena || !rol) {
      return res.status(400).json({
        success: false,
        mensaje: 'Todos los campos son requeridos: nombre, email, contrasena, rol'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        mensaje: 'Formato de email inválido'
      });
    }

    // Validar longitud de contraseña
    if (contrasena.length < 6) {
      return res.status(400).json({
        success: false,
        mensaje: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Validar rol - Todos los roles permitidos para admin
    const rolesValidos = ['autor', 'revisor', 'editor', 'admin'];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({
        success: false,
        mensaje: `Rol inválido. Roles permitidos: ${rolesValidos.join(', ')}`
      });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email.toLowerCase()]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'Ya existe un usuario con este email'
      });
    }

    // Hashear contraseña
    const saltRounds = 10;
    const contrasenaHasheada = await bcrypt.hash(contrasena, saltRounds);

    // Crear usuario
    const resultado = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol, fecha_creacion',
      [nombre, email.toLowerCase(), contrasenaHasheada, rol]
    );

    console.log('Usuario creado exitosamente:', resultado.rows[0]);

    res.status(201).json({
      success: true,
      mensaje: 'Usuario creado exitosamente',
      data: resultado.rows[0]
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM usuarios');
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener usuario' });
  }
};

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, contrasena, rol } = req.body;
    const resultado = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, contrasena, rol]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear usuario' });
  }
};

// Actualizar un usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, contrasena, rol } = req.body;
    const resultado = await pool.query(
      'UPDATE usuarios SET nombre = $1, email = $2, password = $3, rol = $4 WHERE id = $5 RETURNING *',
      [nombre, email, contrasena, rol, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
};

// Eliminar un usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  crearUsuarioPorAdmin,
  actualizarUsuario,
  eliminarUsuario,
};