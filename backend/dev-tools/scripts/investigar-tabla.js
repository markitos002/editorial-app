// Script para investigar la estructura de la tabla usuarios
const { Pool } = require('pg');

const config = {
  user: 'markitos',
  host: '192.168.18.5',
  database: 'editorialdata',
  password: 'AjedreZ22',
  port: 5432,
};

async function investigarTabla() {
  const pool = new Pool(config);
  
  try {
    const client = await pool.connect();
    
    console.log('🔍 Investigando la tabla usuarios...\n');
    
    // 1. Ver todos los constraints de la tabla usuarios
    const constraints = await client.query(`
      SELECT 
        conname as constraint_name,
        contype as constraint_type,
        pg_get_constraintdef(oid) as constraint_definition
      FROM pg_constraint 
      WHERE conrelid = (SELECT oid FROM pg_class WHERE relname = 'usuarios')
    `);
    
    console.log('📋 Constraints de la tabla usuarios:');
    constraints.rows.forEach(row => {
      console.log(`  ${row.constraint_name} (${row.constraint_type}): ${row.constraint_definition}`);
    });
    
    // 2. Ver la estructura de la tabla
    const estructura = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'usuarios' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📊 Estructura de la tabla usuarios:');
    console.table(estructura.rows);
    
    // 3. Ver datos existentes (solo algunos campos)
    const datos = await client.query('SELECT id, nombre, email, rol FROM usuarios LIMIT 3');
    console.log('\n👥 Usuarios existentes (muestra):');
    if (datos.rows.length > 0) {
      console.table(datos.rows);
    } else {
      console.log('No hay usuarios en la tabla');
    }
    
    // 4. Intentar insertar un usuario con diferentes roles para ver cuáles funcionan
    const rolesParaProbar = ['admin', 'editor', 'autor', 'usuario', 'administrador'];
    
    console.log('\n🧪 Probando diferentes valores de rol...');
    
    for (const rol of rolesParaProbar) {
      try {
        const testEmail = `test_${rol}_${Date.now()}@example.com`;
        await client.query(`
          INSERT INTO usuarios (nombre, email, contrasena, rol) 
          VALUES ($1, $2, $3, $4)
        `, [`Test ${rol}`, testEmail, 'test123', rol]);
        
        console.log(`✅ Rol '${rol}' es válido`);
        
        // Limpiar el usuario de prueba
        await client.query('DELETE FROM usuarios WHERE email = $1', [testEmail]);
        
      } catch (error) {
        console.log(`❌ Rol '${rol}' NO es válido: ${error.message}`);
      }
    }
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

investigarTabla();
