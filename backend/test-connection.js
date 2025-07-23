// Script para probar conexión a PostgreSQL remoto
const { Pool } = require('pg');
require('dotenv').config();

async function probarConexion(host, port = 5432) {
  console.log(`🔍 Probando conexión a ${host}:${port}...`);
  
  const pool = new Pool({
    user: process.env.DB_USER,
    host: host,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: port,
    // Configuraciones adicionales para conexión remota
    connectionTimeoutMillis: 5000, // 5 segundos timeout
    idleTimeoutMillis: 30000,
    max: 10
  });

  try {
    const client = await pool.connect();
    console.log(`✅ Conexión exitosa a PostgreSQL en ${host}:${port}`);
    
    // Probar una consulta simple
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('📊 Información del servidor:');
    console.log(`   Hora: ${result.rows[0].current_time}`);
    console.log(`   Versión: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}`);
    
    // Verificar si la base de datos existe
    const dbCheck = await client.query(`
      SELECT datname FROM pg_database WHERE datname = $1
    `, [process.env.DB_NAME]);
    
    if (dbCheck.rows.length > 0) {
      console.log(`✅ Base de datos '${process.env.DB_NAME}' existe`);
    } else {
      console.log(`❌ Base de datos '${process.env.DB_NAME}' NO existe`);
    }
    
    client.release();
    await pool.end();
    return true;
    
  } catch (error) {
    console.error(`❌ Error de conexión a ${host}:${port}`);
    console.error(`   Mensaje: ${error.message}`);
    console.error(`   Código: ${error.code}`);
    
    // Sugerencias específicas según el tipo de error
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 El servidor rechaza la conexión:');
      console.log('   - Verifica que PostgreSQL esté corriendo en el servidor Debian');
      console.log('   - Verifica que esté escuchando en la IP correcta (no solo localhost)');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n💡 Timeout de conexión:');
      console.log('   - Verifica firewall en el servidor Debian');
      console.log('   - Verifica que el puerto 5432 esté abierto');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Error de autenticación:');
      console.log('   - Verifica las credenciales en .env');
      console.log('   - Verifica pg_hba.conf en el servidor');
    }
    
    await pool.end();
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando pruebas de conexión a PostgreSQL...\n');
  
  // Obtener configuración actual
  console.log('📋 Configuración actual:');
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Puerto: ${process.env.DB_PORT}`);
  console.log(`   Base de datos: ${process.env.DB_NAME}`);
  console.log(`   Usuario: ${process.env.DB_USER}`);
  console.log(`   Password: ${'*'.repeat(process.env.DB_PASSWORD.length)}\n`);
  
  // Probar conexión actual
  const exito = await probarConexion(process.env.DB_HOST, process.env.DB_PORT);
  
  if (!exito) {
    console.log('\n🔧 Si la conexión falló, aquí hay algunas cosas que verificar en el servidor Debian:');
    console.log('\n1. Verificar que PostgreSQL esté corriendo:');
    console.log('   sudo systemctl status postgresql');
    console.log('\n2. Verificar configuración de escucha en postgresql.conf:');
    console.log('   sudo nano /etc/postgresql/*/main/postgresql.conf');
    console.log('   Buscar: listen_addresses = \'*\'  # o la IP específica');
    console.log('\n3. Verificar pg_hba.conf para permitir conexiones remotas:');
    console.log('   sudo nano /etc/postgresql/*/main/pg_hba.conf');
    console.log('   Agregar: host all all 0.0.0.0/0 md5');
    console.log('\n4. Reiniciar PostgreSQL después de cambios:');
    console.log('   sudo systemctl restart postgresql');
    console.log('\n5. Verificar firewall:');
    console.log('   sudo ufw allow 5432');
  }
}

main().catch(console.error);
