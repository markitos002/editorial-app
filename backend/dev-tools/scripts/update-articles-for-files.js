// update-articles-for-files.js
const pool = require('./db');

async function updateArticlesTable() {
  try {
    console.log('Actualizando tabla articulos para soportar archivos...');
    
    // Agregar columnas para archivos
    await pool.query(`
      ALTER TABLE articulos 
      ADD COLUMN IF NOT EXISTS archivo_nombre VARCHAR(255),
      ADD COLUMN IF NOT EXISTS archivo_path VARCHAR(500),
      ADD COLUMN IF NOT EXISTS archivo_mimetype VARCHAR(100),
      ADD COLUMN IF NOT EXISTS archivo_size INTEGER
    `);
    
    // Hacer que el contenido sea opcional (ya que ahora puede ser un archivo)
    await pool.query(`
      ALTER TABLE articulos 
      ALTER COLUMN contenido DROP NOT NULL
    `);
    
    console.log('✅ Tabla actualizada exitosamente');
    
    // Verificar las columnas
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'articulos' 
      ORDER BY ordinal_position
    `);
    
    console.log('\nEstructura actualizada de la tabla articulos:');
    result.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateArticlesTable();
