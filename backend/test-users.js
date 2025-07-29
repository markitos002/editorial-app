// test-users.js - Script para crear usuarios de prueba
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'editorialdata',
    password: 'postgres',
    port: 5432,
});

async function crearUsuariosPrueba() {
    try {
        console.log('🔧 Conectando a la base de datos...');
        
        // Verificar usuarios existentes
        const existingUsers = await pool.query('SELECT email, rol FROM usuarios ORDER BY id');
        console.log('👥 Usuarios existentes:', existingUsers.rows);
        
        if (existingUsers.rows.length > 0) {
            console.log('✅ Ya existen usuarios en la base de datos');
            return;
        }
        
        console.log('➕ Creando usuarios de prueba...');
        
        // Hash para password "123456"
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        const usuarios = [
            {
                nombre: 'Admin Usuario',
                email: 'admin@editorial.com',
                password: hashedPassword,
                rol: 'admin'
            },
            {
                nombre: 'Editor Usuario',
                email: 'editor@editorial.com',
                password: hashedPassword,
                rol: 'editor'
            },
            {
                nombre: 'Revisor Usuario',
                email: 'revisor@editorial.com',
                password: hashedPassword,
                rol: 'revisor'
            },
            {
                nombre: 'Autor Usuario',
                email: 'autor@editorial.com',
                password: hashedPassword,
                rol: 'autor'
            }
        ];
        
        for (const usuario of usuarios) {
            const result = await pool.query(
                'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, email, rol',
                [usuario.nombre, usuario.email, usuario.password, usuario.rol]
            );
            console.log(`✅ Usuario creado: ${result.rows[0].email} (${result.rows[0].rol})`);
        }
        
        console.log('🎉 Usuarios de prueba creados exitosamente!');
        console.log('📋 Credenciales de acceso:');
        console.log('   Email: admin@editorial.com | Password: 123456 | Rol: admin');
        console.log('   Email: editor@editorial.com | Password: 123456 | Rol: editor');
        console.log('   Email: revisor@editorial.com | Password: 123456 | Rol: revisor');
        console.log('   Email: autor@editorial.com | Password: 123456 | Rol: autor');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

crearUsuariosPrueba();
