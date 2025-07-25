const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// Ruta de prueba de registro simple
app.post('/test-registro', async (req, res) => {
  try {
    console.log('=== TEST REGISTRO ===');
    console.log('Body:', req.body);
    
    const { nombre, email, contrasena, rol = 'autor' } = req.body;
    
    console.log('Datos:', { nombre, email, rol });
    
    // Simulamos el hash de contraseña
    const passwordHash = 'fake_hash_' + contrasena;
    
    console.log('Ejecutando query SQL...');
    const result = await pool.query(`
      INSERT INTO usuarios (nombre, email, password, rol) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, nombre, email, rol, fecha_creacion
    `, [nombre, email.toLowerCase(), passwordHash, rol]);
    
    console.log('Resultado:', result.rows[0]);
    
    res.json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de prueba corriendo en el puerto ${PORT}`);
});
