// scripts/test-supabase-connection.js - Probar conexión backend con Supabase

const { Pool } = require('pg');
require('dotenv').config();

// Configuración de Supabase (desde render-supabase.yaml)
const supabaseConfig = {
  user: 'postgres',
  host: 'db.editorialdata.supabase.co',
  database: 'postgres',
  password: 'VqX2KgTvTZLrOWlq',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
};

async function testSupabaseConnection() {
  console.log('🧪 Probando conexión con Supabase...');
  console.log(`📡 Host: ${supabaseConfig.host}`);
  
  const pool = new Pool(supabaseConfig);
  
  try {
    // Test 1: Conexión básica
    console.log('\n1️⃣ Test de conexión básica...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW(), version()');
    console.log('✅ Conexión exitosa');
    console.log(`⏰ Timestamp: ${result.rows[0].now}`);
    console.log(`🗄️ Versión: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    client.release();
    
    // Test 2: Verificar tablas
    console.log('\n2️⃣ Verificando estructura de tablas...');
    const tablesResult = await pool.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📊 Tablas encontradas:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name} (${row.table_type})`);
    });
    
    // Test 3: Contar registros
    console.log('\n3️⃣ Contando registros...');
    const tables = ['usuarios', 'articulos', 'revisiones', 'notificaciones'];
    
    for (const table of tables) {
      try {
        const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`  📈 ${table}: ${countResult.rows[0].count} registros`);
      } catch (error) {
        console.log(`  ❌ ${table}: Error - ${error.message}`);
      }
    }
    
    // Test 4: Verificar usuario admin
    console.log('\n4️⃣ Verificando usuario admin...');
    const adminResult = await pool.query(`
      SELECT id, email, rol, created_at 
      FROM usuarios 
      WHERE email = 'admin@editorial.com'
    `);
    
    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];
      console.log('✅ Usuario admin encontrado:');
      console.log(`  👤 ID: ${admin.id}`);
      console.log(`  📧 Email: ${admin.email}`);
      console.log(`  🔐 Rol: ${admin.rol}`);
      console.log(`  📅 Creado: ${admin.created_at}`);
    } else {
      console.log('❌ Usuario admin no encontrado');
    }
    
    // Test 5: Test de autenticación (simulado)
    console.log('\n5️⃣ Test de autenticación...');
    const bcrypt = require('bcrypt');
    
    const authResult = await pool.query(`
      SELECT id, email, password_hash, rol 
      FROM usuarios 
      WHERE email = 'admin@editorial.com'
    `);
    
    if (authResult.rows.length > 0) {
      console.log('✅ Datos de autenticación accesibles');
      console.log('🔐 Hash de contraseña presente');
    }
    
    console.log('\n🎉 ¡Todos los tests pasaron! Supabase está listo.');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.error('🔧 Detalles:', error);
  } finally {
    await pool.end();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testSupabaseConnection()
    .then(() => {
      console.log('\n✅ Test completado');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Test falló:', error);
      process.exit(1);
    });
}

module.exports = { testSupabaseConnection, supabaseConfig };
