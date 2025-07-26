// create-notificaciones-migration.js - Script para crear tabla de notificaciones
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '192.168.18.5',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Chajoma24',
  database: process.env.DB_NAME || 'revista_db',
  port: process.env.DB_PORT || 5432,
});

async function createNotificacionesTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔔 Creando tabla de notificaciones...');
    
    const createTableQuery = `
      -- Crear tabla de notificaciones
      CREATE TABLE IF NOT EXISTS notificaciones (
          id SERIAL PRIMARY KEY,
          usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
          titulo VARCHAR(255) NOT NULL,
          mensaje TEXT NOT NULL,
          tipo VARCHAR(50) NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
          categoria VARCHAR(50) NOT NULL DEFAULT 'general', -- 'asignacion', 'revision', 'comentario', 'articulo', 'general'
          leida BOOLEAN DEFAULT FALSE,
          data JSONB, -- Datos adicionales (id de artículo, id de revisión, etc.)
          fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          fecha_leida TIMESTAMP NULL
      );

      -- Índices para optimizar consultas
      CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario_id ON notificaciones(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones(leida);
      CREATE INDEX IF NOT EXISTS idx_notificaciones_fecha ON notificaciones(fecha_creacion DESC);
      CREATE INDEX IF NOT EXISTS idx_notificaciones_tipo ON notificaciones(tipo);
      CREATE INDEX IF NOT EXISTS idx_notificaciones_categoria ON notificaciones(categoria);

      -- Índice compuesto para consultas frecuentes
      CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario_leida ON notificaciones(usuario_id, leida);
    `;
    
    await client.query(createTableQuery);
    console.log('✅ Tabla de notificaciones creada exitosamente');
    
    // Verificar la estructura
    const checkQuery = `
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'notificaciones' 
      ORDER BY ordinal_position;
    `;
    
    const result = await client.query(checkQuery);
    console.log('\n📋 Estructura de la tabla notificaciones:');
    console.table(result.rows);
    
    // Insertar algunas notificaciones de prueba
    console.log('\n🧪 Insertando notificaciones de prueba...');
    
    const insertTestData = `
      INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, categoria, data) VALUES
      (1, 'Bienvenido al sistema', 'Tu cuenta ha sido creada exitosamente', 'success', 'general', '{"welcome": true}'),
      (1, 'Nueva asignación', 'Se te ha asignado un nuevo artículo para revisar', 'info', 'asignacion', '{"articulo_id": 1}'),
      (2, 'Comentario recibido', 'Has recibido un nuevo comentario en tu artículo', 'info', 'comentario', '{"articulo_id": 1, "comentario_id": 1}')
      ON CONFLICT DO NOTHING;
    `;
    
    await client.query(insertTestData);
    console.log('✅ Notificaciones de prueba insertadas');
    
    // Contar notificaciones
    const countResult = await client.query('SELECT COUNT(*) as total FROM notificaciones');
    console.log(`\n📊 Total de notificaciones: ${countResult.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Error al crear tabla de notificaciones:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar el script
createNotificacionesTable();
