// Script para verificar la conexión a la base de datos y la estructura de la tabla
const pool = require('./db');

async function verificarBaseDatos() {
  try {
    console.log('🔍 Verificando conexión a la base de datos...');
    
    // Test de conexión
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Verificar si la tabla usuarios existe
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'usuarios'
      );
    `);
    
    if (!checkTable.rows[0].exists) {
      console.log('❌ La tabla "usuarios" no existe');
      console.log('💡 Ejecuta el script setup-database.sql para crear la tabla');
      client.release();
      return;
    }
    
    console.log('✅ La tabla "usuarios" existe');
    
    // Verificar estructura de la tabla
    const structure = await client.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_default 
      FROM information_schema.columns 
      WHERE table_name = 'usuarios' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Estructura de la tabla usuarios:');
    console.table(structure.rows);
    
    // Verificar datos existentes
    const usuarios = await client.query('SELECT id, nombre, email, rol FROM usuarios LIMIT 5');
    console.log(`\n👥 Usuarios existentes (${usuarios.rows.length}):`);
    if (usuarios.rows.length > 0) {
      console.table(usuarios.rows);
    } else {
      console.log('No hay usuarios en la base de datos');
    }
    
    // Test de inserción
    console.log('\n🧪 Probando inserción de usuario de prueba...');
    const testUser = {
      nombre: `Test User ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      contrasena: 'test123',
      rol: 'editor'  // Cambiar de 'test' a 'editor'
    };
    
    const insertResult = await client.query(
      'INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [testUser.nombre, testUser.email, testUser.contrasena, testUser.rol]
    );
    
    console.log('✅ Usuario de prueba insertado:');
    console.log(insertResult.rows[0]);
    
    // Limpiar usuario de prueba
    await client.query('DELETE FROM usuarios WHERE email = $1', [testUser.email]);
    console.log('🧹 Usuario de prueba eliminado');
    
    client.release();
    console.log('\n🎉 Verificación completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('   1. Verifica que PostgreSQL esté corriendo');
    console.log('   2. Verifica las credenciales en el archivo .env');
    console.log('   3. Verifica que la base de datos "editorial_app" exista');
    console.log('   4. Ejecuta el script setup-database.sql');
  } finally {
    await pool.end();
  }
}

verificarBaseDatos();
