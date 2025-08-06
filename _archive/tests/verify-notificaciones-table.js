// verify-notificaciones-table.js - Verificar tabla de notificaciones
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '192.168.18.5',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Chajoma24',
  database: process.env.DB_NAME || 'revista_db',
  port: process.env.DB_PORT || 5432,
});

async function verifyNotificacionesTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verificando tabla de notificaciones...');
    
    // Verificar si existe la tabla
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'notificaciones'
      );
    `;
    
    const existsResult = await client.query(tableExistsQuery);
    const tableExists = existsResult.rows[0].exists;
    
    if (!tableExists) {
      console.log('❌ La tabla notificaciones no existe. Creándola...');
      
      const createTableQuery = `
        CREATE TABLE notificaciones (
            id SERIAL PRIMARY KEY,
            usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
            titulo VARCHAR(255) NOT NULL,
            mensaje TEXT NOT NULL,
            tipo VARCHAR(50) NOT NULL DEFAULT 'info',
            categoria VARCHAR(50) NOT NULL DEFAULT 'general',
            leida BOOLEAN DEFAULT FALSE,
            data JSONB,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fecha_leida TIMESTAMP NULL
        );
        
        CREATE INDEX idx_notificaciones_usuario_id ON notificaciones(usuario_id);
        CREATE INDEX idx_notificaciones_leida ON notificaciones(leida);
        CREATE INDEX idx_notificaciones_fecha ON notificaciones(fecha_creacion DESC);
      `;
      
      await client.query(createTableQuery);
      console.log('✅ Tabla notificaciones creada exitosamente');
    } else {
      console.log('✅ La tabla notificaciones ya existe');
    }
    
    // Verificar estructura
    const columnsQuery = `
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'notificaciones' 
      ORDER BY ordinal_position;
    `;
    
    const columnsResult = await client.query(columnsQuery);
    console.log('\n📋 Estructura de la tabla:');
    console.table(columnsResult.rows);
    
    // Contar registros
    const countResult = await client.query('SELECT COUNT(*) as total FROM notificaciones');
    console.log(`\n📊 Total de notificaciones: ${countResult.rows[0].total}`);
    
    // Si no hay notificaciones, insertar algunas de prueba
    if (parseInt(countResult.rows[0].total) === 0) {
      console.log('\n🧪 Insertando notificaciones de prueba...');
      
      const insertQuery = `
        INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, categoria, data) VALUES
        (1, 'Bienvenido al sistema', 'Tu cuenta ha sido creada exitosamente en la Revista Manos al Cuidado', 'success', 'general', '{"welcome": true}'),
        (1, 'Nueva asignación disponible', 'Se te ha asignado un nuevo artículo para revisar', 'info', 'asignacion', '{"articulo_id": 1}'),
        (1, 'Comentario recibido', 'Has recibido un nuevo comentario en tu artículo', 'info', 'comentario', '{"articulo_id": 1, "comentario_id": 1}')
      `;
      
      await client.query(insertQuery);
      console.log('✅ Notificaciones de prueba insertadas');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

verifyNotificacionesTable();
