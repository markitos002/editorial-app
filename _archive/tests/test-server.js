const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint simple de prueba sin middlewares
app.get('/test-articulos', async (req, res) => {
  try {
    console.log('=== TEST ARTICULOS DIRECTO ===');
    
    const query = `
      SELECT 
        a.*,
        u.nombre as autor_nombre,
        u.email as autor_email,
        COUNT(*) OVER() as total_count
      FROM articulos a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      ORDER BY a.fecha_creacion DESC 
      LIMIT 10 OFFSET 0
    `;
    
    console.log('Ejecutando query...');
    const resultado = await pool.query(query);
    
    console.log('Query exitosa, filas:', resultado.rows.length);
    
    res.json({
      success: true,
      articulos: resultado.rows,
      count: resultado.rows.length
    });
  } catch (error) {
    console.error('Error en test directo:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Endpoint usando el controlador exacto
app.get('/test-controller', async (req, res) => {
  try {
    console.log('=== TEST USANDO CONTROLADOR ===');
    
    const { estado, usuario_id, page = 1, limit = 10 } = req.query;
    let query = `
      SELECT 
        a.*,
        u.nombre as autor_nombre,
        u.email as autor_email,
        COUNT(*) OVER() as total_count
      FROM articulos a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
    `;
    const params = [];
    const whereConditions = [];

    if (estado) {
      whereConditions.push(`a.estado = $${params.length + 1}`);
      params.push(estado);
    }

    if (usuario_id) {
      whereConditions.push(`a.usuario_id = $${params.length + 1}`);
      params.push(usuario_id);
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    const offset = (page - 1) * limit;
    query += ` ORDER BY a.fecha_creacion DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    console.log('Query:', query);
    console.log('Params:', params);

    const resultado = await pool.query(query, params);
    
    console.log('Controlador exitoso, filas:', resultado.rows.length);
    
    const totalCount = resultado.rows.length > 0 ? resultado.rows[0].total_count : 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      articulos: resultado.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_count: parseInt(totalCount),
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error en test controlador:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener artículos', 
      error: error.message,
      stack: error.stack 
    });
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🧪 Servidor de pruebas corriendo en puerto ${PORT}`);
});
