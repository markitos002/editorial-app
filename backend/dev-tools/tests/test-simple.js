// Script simple para probar la conexión
const { Pool } = require('pg');

// Configuración manual (sin .env)
const config = {
  user: 'markitos',
  host: '192.168.18.5',
  database: 'editorialdata',
  password: 'AjedreZ22',
  port: 5432,
  connectionTimeoutMillis: 10000,
};

console.log('Configuración de conexión:');
console.log(config);
console.log('\n🔍 Intentando conectar...');

const pool = new Pool(config);

pool.connect()
  .then(client => {
    console.log('✅ ¡Conexión exitosa!');
    return client.query('SELECT NOW()');
  })
  .then(result => {
    console.log('📅 Hora del servidor:', result.rows[0].now);
    return pool.end();
  })
  .then(() => {
    console.log('🔚 Conexión cerrada');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error de conexión:');
    console.error('Código:', err.code);
    console.error('Mensaje:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  });
