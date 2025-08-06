require('dotenv').config();
const pool = require('./db');

async function testController() {
  console.log('🧪 Simulando controlador...');
  
  try {
    // Simular la query exacta del controlador
    const { estado, usuario_id, page = 1, limit = 10 } = {}; // sin parámetros
    
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

    // Filtros opcionales
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

    // Paginación
    const offset = (page - 1) * limit;
    query += ` ORDER BY a.fecha_creacion DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    console.log('Query final:', query);
    console.log('Parámetros:', params);

    const resultado = await pool.query(query, params);
    
    console.log('✅ Query exitosa!');
    console.log('Filas encontradas:', resultado.rows.length);
    
    if (resultado.rows.length > 0) {
      console.log('Primera fila:', {
        id: resultado.rows[0].id,
        titulo: resultado.rows[0].titulo,
        total_count: resultado.rows[0].total_count
      });
    }

    const totalCount = resultado.rows.length > 0 ? resultado.rows[0].total_count : 0;
    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      articulos: resultado.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_count: parseInt(totalCount),
        per_page: parseInt(limit)
      }
    };

    console.log('✅ Respuesta simulada construida exitosamente');
    console.log('Total artículos:', response.articulos.length);
    console.log('Paginación:', response.pagination);

  } catch (error) {
    console.error('❌ Error en simulación de controlador:', error);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testController();
