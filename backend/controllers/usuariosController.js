const pool = require('../db');

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
      'INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING *',
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
      'UPDATE usuarios SET nombre = $1, email = $2, contrasena = $3, rol = $4 WHERE id = $5 RETURNING *',
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
  actualizarUsuario,
  eliminarUsuario,
};