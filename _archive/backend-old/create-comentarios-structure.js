// create-comentarios-structure.js - Script para crear estructura de comentarios
const pool = require('./db');

async function crearEstructuraComentarios() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Creando estructura de comentarios...');
    
    // Crear tabla de comentarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS comentarios (
          id SERIAL PRIMARY KEY,
          revision_id INTEGER NOT NULL REFERENCES revisiones(id) ON DELETE CASCADE,
          usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
          tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('publico', 'privado', 'interno')),
          contenido TEXT NOT NULL,
          respuesta_a INTEGER REFERENCES comentarios(id) ON DELETE CASCADE,
          estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'resuelto', 'eliminado')),
          fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Tabla comentarios creada');

    // Crear índices
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_comentarios_revision ON comentarios(revision_id);
      CREATE INDEX IF NOT EXISTS idx_comentarios_usuario ON comentarios(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_comentarios_tipo ON comentarios(tipo);
      CREATE INDEX IF NOT EXISTS idx_comentarios_respuesta ON comentarios(respuesta_a);
    `);
    
    console.log('✅ Índices creados');

    // Crear función de trigger para timestamp
    await client.query(`
      CREATE OR REPLACE FUNCTION update_comentarios_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Crear trigger
    await client.query(`
      DROP TRIGGER IF EXISTS trigger_update_comentarios_timestamp ON comentarios;
      CREATE TRIGGER trigger_update_comentarios_timestamp
          BEFORE UPDATE ON comentarios
          FOR EACH ROW
          EXECUTE FUNCTION update_comentarios_timestamp();
    `);
    
    console.log('✅ Trigger de timestamp creado');

    // Insertar comentarios de ejemplo
    await client.query(`
      INSERT INTO comentarios (revision_id, usuario_id, tipo, contenido) VALUES 
      (3, 3, 'publico', 'El resumen del artículo es muy claro, pero considero que la metodología necesita más detalle en la sección de recolección de datos.'),
      (3, 3, 'publico', 'Las referencias bibliográficas están incompletas. Por favor, incluir los números de página para todas las citas directas.'),
      (3, 3, 'privado', 'Nota personal: Este es un trabajo prometedor, pero el autor parece ser principiante. Recomiendo ser constructivo en los comentarios.'),
      (3, 1, 'interno', 'Este revisor está siendo muy minucioso. Considerar asignarle más artículos de alta complejidad.')
      ON CONFLICT DO NOTHING
    `);
    
    console.log('✅ Comentarios de ejemplo insertados');

    // Verificar estructura creada
    const result = await client.query(`
      SELECT 
          c.id,
          c.tipo,
          c.contenido,
          c.estado,
          c.fecha_creacion,
          u.nombre as autor_comentario,
          r.id as revision_id
      FROM comentarios c
      JOIN usuarios u ON c.usuario_id = u.id  
      JOIN revisiones r ON c.revision_id = r.id
      ORDER BY c.fecha_creacion ASC
    `);

    console.log('📊 Comentarios creados:');
    result.rows.forEach((comentario, index) => {
      console.log(`   ${index + 1}. [${comentario.tipo.toUpperCase()}] ${comentario.autor_comentario}`);
      console.log(`      "${comentario.contenido.substring(0, 60)}..."`);
      console.log(`      Estado: ${comentario.estado} | ${comentario.fecha_creacion.toLocaleDateString()}`);
    });

    console.log('\n🎉 Estructura de comentarios creada exitosamente');
    
  } catch (error) {
    console.error('❌ Error al crear estructura de comentarios:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  crearEstructuraComentarios()
    .then(() => {
      console.log('✅ Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en script:', error);
      process.exit(1);
    });
}

module.exports = { crearEstructuraComentarios };
