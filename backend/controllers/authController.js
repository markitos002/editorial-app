// controllers/authController.js
const bcrypt = require('bcryptjs');
const pool = require('../db/index.js');
const { generarToken } = require('../middlewares/auth.js');

// Registro de nuevo usuario
const registro = async (req, res) => {
  try {
    console.log('=== INICIO REGISTRO ===');
    console.log('Body recibido:', req.body);
    
    const { nombre, email, contrasena, rol = 'autor' } = req.body;
    
    console.log('Datos extraídos:', { nombre, email, contrasena: '***', rol });

    // Validaciones básicas
    if (!nombre || !email || !contrasena) {
      console.log('Faltan campos requeridos');
      return res.status(400).json({
        mensaje: 'Todos los campos son requeridos: nombre, email, contrasena'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        mensaje: 'Formato de email inválido'
      });
    }

    // Validar longitud de contraseña
    if (contrasena.length < 6) {
      return res.status(400).json({
        mensaje: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Validar rol - Solo autor y revisor permitidos para registro público
    const rolesPermitidosRegistro = ['autor', 'revisor'];
    if (!rolesPermitidosRegistro.includes(rol)) {
      return res.status(400).json({
        mensaje: `Rol no permitido para registro público. Solo se permiten: ${rolesPermitidosRegistro.join(', ')}`
      });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email.toLowerCase()]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({
        mensaje: 'Ya existe un usuario con este email'
      });
    }

    // Hash de la contraseña
    const saltRounds = 12;
    console.log('Hasheando contraseña...'); 
    const passwordHash = await bcrypt.hash(contrasena, saltRounds);

    // Crear usuario
    console.log('Creando usuario con query SQL...');
    const nuevoUsuario = await pool.query(`
      INSERT INTO usuarios (nombre, email, password, rol) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, nombre, email, rol, fecha_creacion
    `, [nombre, email.toLowerCase(), passwordHash, rol]);

    const usuario = nuevoUsuario.rows[0];

    // Generar token JWT
    const token = generarToken(usuario);

    // Respuesta sin la contraseña
    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        fecha_creacion: usuario.fecha_creacion
      },
      token
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    // Validaciones básicas
    if (!email || !contrasena) {
      return res.status(400).json({
        mensaje: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email
    const resultado = await pool.query(
      'SELECT id, nombre, email, password, rol, activo FROM usuarios WHERE email = $1',
      [email.toLowerCase()]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        mensaje: 'Credenciales inválidas'
      });
    }

    const usuario = resultado.rows[0];

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({
        mensaje: 'Cuenta de usuario desactivada'
      });
    }

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.password);
    
    if (!contrasenaValida) {
      return res.status(401).json({
        mensaje: 'Credenciales inválidas'
      });
    }

    // Actualizar última conexión (comentado temporalmente)
    // await pool.query(
    //   'UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = $1',
    //   [usuario.id]
    // );

    // Generar token JWT
    const token = generarToken(usuario);

    // Respuesta sin la contraseña
    res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Garantizar columnas adicionales de perfil (ejecuta ALTER solo si faltan)
async function asegurarColumnasPerfil() {
  try {
    await pool.query('ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS afiliacion TEXT');
    await pool.query('ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS orcid VARCHAR(50)');
    await pool.query('ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS biografia TEXT');
    await pool.query('ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS especialidades TEXT');
  } catch (e) {
    console.error('No se pudieron asegurar columnas de perfil (puede ser benigno en entornos sin permisos):', e.message);
  }
}

// Obtener perfil del usuario autenticado (incluye campos extendidos)
const obtenerPerfil = async (req, res) => {
  try {
    const { id } = req.usuario;

    await asegurarColumnasPerfil();

    const resultado = await pool.query(`
      SELECT 
        id, nombre, email, rol, activo, fecha_creacion,
        afiliacion, orcid, biografia, especialidades,
        (SELECT COUNT(*) FROM articulos WHERE usuario_id = $1) as total_articulos,
        (SELECT COUNT(*) FROM revisiones WHERE revisor_id = $1) as total_revisiones
      FROM usuarios 
      WHERE id = $1
    `, [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuario = resultado.rows[0];

    res.json({
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo,
        fecha_creacion: usuario.fecha_creacion,
        afiliacion: usuario.afiliacion,
        orcid: usuario.orcid,
        biografia: usuario.biografia,
        especialidades: usuario.especialidades,
        estadisticas: {
          total_articulos: parseInt(usuario.total_articulos),
            total_revisiones: parseInt(usuario.total_revisiones)
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar perfil del usuario autenticado
const actualizarPerfil = async (req, res) => {
  try {
    const { id } = req.usuario;
    const { nombre, email, afiliacion, orcid, biografia, especialidades } = req.body;

    await asegurarColumnasPerfil();

    if (!nombre || !email) {
      return res.status(400).json({ mensaje: 'Nombre y email son requeridos' });
    }

    // Validar formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ mensaje: 'Formato de email inválido' });
    }

    // Validar ORCID si viene
    if (orcid && !/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(orcid)) {
      return res.status(400).json({ mensaje: 'Formato ORCID inválido (0000-0000-0000-0000)' });
    }

    // Evitar colisión de email con otros usuarios
    const emailExistente = await pool.query('SELECT id FROM usuarios WHERE email = $1 AND id <> $2', [email.toLowerCase(), id]);
    if (emailExistente.rows.length > 0) {
      return res.status(400).json({ mensaje: 'El email ya está en uso por otro usuario' });
    }

    const update = await pool.query(`
      UPDATE usuarios
      SET nombre = $1, email = $2, afiliacion = $3, orcid = $4, biografia = $5, especialidades = $6
      WHERE id = $7
      RETURNING id, nombre, email, rol, afiliacion, orcid, biografia, especialidades
    `, [nombre, email.toLowerCase(), afiliacion || null, orcid || null, biografia || null, especialidades || null, id]);

    res.json({
      success: true,
      mensaje: 'Perfil actualizado',
      usuario: update.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// Preferencias de notificaciones
async function asegurarTablaNotificaciones() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuario_notificaciones (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
        email_nuevo_articulo BOOLEAN DEFAULT TRUE,
        email_cambio_estado BOOLEAN DEFAULT TRUE,
        email_asignacion_revision BOOLEAN DEFAULT TRUE,
        email_mensajes_editor BOOLEAN DEFAULT TRUE,
        push_notificaciones BOOLEAN DEFAULT FALSE,
        frecuencia_resumen VARCHAR(20) DEFAULT 'diario',
        creado_en TIMESTAMP DEFAULT NOW(),
        actualizado_en TIMESTAMP DEFAULT NOW()
      );
    `);
  } catch (e) {
    console.error('Error asegurando tabla notificaciones:', e.message);
  }
}

const obtenerPreferenciasNotificaciones = async (req, res) => {
  try {
    const { id } = req.usuario;
    await asegurarTablaNotificaciones();
    let pref = await pool.query('SELECT * FROM usuario_notificaciones WHERE usuario_id = $1', [id]);
    if (pref.rows.length === 0) {
      // Crear registro por defecto
      const insert = await pool.query(`
        INSERT INTO usuario_notificaciones (usuario_id) VALUES ($1)
        RETURNING *
      `, [id]);
      pref = { rows: [insert.rows[0]] };
    }
    const p = pref.rows[0];
    res.json({
      success: true,
      preferencias: {
        emailNuevoArticulo: p.email_nuevo_articulo,
        emailCambioEstado: p.email_cambio_estado,
        emailAsignacionRevision: p.email_asignacion_revision,
        emailMensajesEditor: p.email_mensajes_editor,
        pushNotificaciones: p.push_notificaciones,
        frecuenciaResumen: p.frecuencia_resumen
      }
    });
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

const actualizarPreferenciasNotificaciones = async (req, res) => {
  try {
    const { id } = req.usuario;
    const {
      emailNuevoArticulo = true,
      emailCambioEstado = true,
      emailAsignacionRevision = true,
      emailMensajesEditor = true,
      pushNotificaciones = false,
      frecuenciaResumen = 'diario'
    } = req.body;

    await asegurarTablaNotificaciones();
    const upsert = await pool.query(`
      INSERT INTO usuario_notificaciones (
        usuario_id, email_nuevo_articulo, email_cambio_estado, email_asignacion_revision, email_mensajes_editor, push_notificaciones, frecuencia_resumen, actualizado_en
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
      ON CONFLICT (usuario_id) DO UPDATE SET
        email_nuevo_articulo = EXCLUDED.email_nuevo_articulo,
        email_cambio_estado = EXCLUDED.email_cambio_estado,
        email_asignacion_revision = EXCLUDED.email_asignacion_revision,
        email_mensajes_editor = EXCLUDED.email_mensajes_editor,
        push_notificaciones = EXCLUDED.push_notificaciones,
        frecuencia_resumen = EXCLUDED.frecuencia_resumen,
        actualizado_en = NOW()
      RETURNING *;
    `, [id, emailNuevoArticulo, emailCambioEstado, emailAsignacionRevision, emailMensajesEditor, pushNotificaciones, frecuenciaResumen]);

    const p = upsert.rows[0];
    res.json({
      success: true,
      mensaje: 'Preferencias de notificación guardadas',
      preferencias: {
        emailNuevoArticulo: p.email_nuevo_articulo,
        emailCambioEstado: p.email_cambio_estado,
        emailAsignacionRevision: p.email_asignacion_revision,
        emailMensajesEditor: p.email_mensajes_editor,
        pushNotificaciones: p.push_notificaciones,
        frecuenciaResumen: p.frecuencia_resumen
      }
    });
  } catch (error) {
    console.error('Error actualizando notificaciones:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// Cambiar contraseña
const cambiarContrasena = async (req, res) => {
  try {
    const { id } = req.usuario;
    const { contrasena_actual, contrasena_nueva } = req.body;

    // Validaciones
    if (!contrasena_actual || !contrasena_nueva) {
      return res.status(400).json({
        mensaje: 'Contraseña actual y nueva son requeridas'
      });
    }

    if (contrasena_nueva.length < 6) {
      return res.status(400).json({
        mensaje: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Obtener usuario actual
    const resultado = await pool.query(
      'SELECT password FROM usuarios WHERE id = $1',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const contrasenaValida = await bcrypt.compare(
      contrasena_actual, 
      resultado.rows[0].password
    );

    if (!contrasenaValida) {
      return res.status(400).json({
        mensaje: 'Contraseña actual incorrecta'
      });
    }

    // Hash de la nueva contraseña
    const saltRounds = 12;
    const nuevaContrasenaHash = await bcrypt.hash(contrasena_nueva, saltRounds);

    // Actualizar contraseña
    await pool.query(
      'UPDATE usuarios SET password = $1 WHERE id = $2',
      [nuevaContrasenaHash, id]
    );

    res.json({
      mensaje: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Logout (invalidar token - aquí solo enviamos respuesta, el frontend debe eliminar el token)
const logout = async (req, res) => {
  try {
    // En esta implementación simple, el logout es manejado por el frontend
    // eliminando el token del almacenamiento local
    
    // Opcional: actualizar última actividad (comentado temporalmente)
    // if (req.usuario) {
    //   await pool.query(
    //     'UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = $1',
    //     [req.usuario.id]
    //   );
    // }

    res.json({
      mensaje: 'Logout exitoso'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Verificar token (endpoint para validar si un token sigue siendo válido)
const verificarToken = async (req, res) => {
  try {
    // Si llegamos aquí, el middleware verificarToken ya validó el token
    res.json({
      valido: true,
      usuario: req.usuario
    });
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

module.exports = {
  registro,
  login,
  obtenerPerfil,
  actualizarPerfil,
  cambiarContrasena,
  logout,
  verificarToken,
  obtenerPreferenciasNotificaciones,
  actualizarPreferenciasNotificaciones
};
