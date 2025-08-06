// debug-admin.js - Verificar datos del usuario admin
const pool = require('./db');
const bcrypt = require('bcrypt');

async function debugAdmin() {
  try {
    console.log('🔍 Verificando datos del usuario admin...\n');
    
    // Obtener datos del admin
    const result = await pool.query(
      'SELECT id, nombre, email, password, rol, activo FROM usuarios WHERE email = $1',
      ['admin@editorial.com']
    );
    
    if (result.rows.length === 0) {
      console.log('❌ No se encontró usuario admin con email admin@editorial.com');
      return;
    }
    
    const admin = result.rows[0];
    console.log('📋 Datos del admin:');
    console.log(`   - ID: ${admin.id}`);
    console.log(`   - Nombre: ${admin.nombre}`);
    console.log(`   - Email: ${admin.email}`);
    console.log(`   - Rol: ${admin.rol}`);
    console.log(`   - Activo: ${admin.activo}`);
    console.log(`   - Password hash: ${admin.password.substring(0, 20)}...`);
    
    // Probar contraseñas comunes
    const passwordsToTest = ['admin123', 'admin', '123456', 'password'];
    
    console.log('\n🧪 Probando contraseñas...');
    for (const password of passwordsToTest) {
      try {
        const isValid = await bcrypt.compare(password, admin.password);
        console.log(`   - "${password}": ${isValid ? '✅ VÁLIDA' : '❌ inválida'}`);
        if (isValid) break;
      } catch (error) {
        console.log(`   - "${password}": ❌ error al comparar - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pool.end();
  }
}

debugAdmin();
