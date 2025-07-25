// update-admin-password.js - Actualizar contraseña del admin
const pool = require('./db');
const bcrypt = require('bcrypt');

async function updateAdminPassword() {
  try {
    console.log('🔄 Actualizando contraseña del admin...\n');
    
    const newPassword = 'admin123';
    const saltRounds = 12;
    
    console.log('🔐 Generando hash para la nueva contraseña...');
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    
    console.log('💾 Actualizando en la base de datos...');
    const result = await pool.query(
      'UPDATE usuarios SET password = $1 WHERE email = $2 RETURNING id, nombre, email, rol',
      [passwordHash, 'admin@editorial.com']
    );
    
    if (result.rows.length > 0) {
      const admin = result.rows[0];
      console.log('✅ Contraseña actualizada exitosamente:');
      console.log(`   - Usuario: ${admin.nombre}`);
      console.log(`   - Email: ${admin.email}`);
      console.log(`   - Rol: ${admin.rol}`);
      console.log(`   - Nueva contraseña: ${newPassword}`);
    } else {
      console.log('❌ No se encontró el usuario admin para actualizar');
    }
    
    // Verificar que la nueva contraseña funciona
    console.log('\n🧪 Verificando nueva contraseña...');
    const userResult = await pool.query(
      'SELECT password FROM usuarios WHERE email = $1',
      ['admin@editorial.com']
    );
    
    if (userResult.rows.length > 0) {
      const isValid = await bcrypt.compare(newPassword, userResult.rows[0].password);
      console.log(`   - Contraseña "${newPassword}": ${isValid ? '✅ VÁLIDA' : '❌ inválida'}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pool.end();
  }
}

updateAdminPassword();
