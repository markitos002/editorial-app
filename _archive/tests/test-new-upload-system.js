// test-new-upload-system.js - Prueba del nuevo sistema de carga de archivos
require('dotenv').config();
const pool = require('./db');

async function testNewUploadSystem() {
    try {
        console.log('🧪 Probando nuevo sistema de carga de archivos...');

        // Verificar estructura de la tabla
        console.log('📊 Verificando estructura de la tabla articulos...');
        const estructura = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'articulos' 
            AND column_name IN ('archivo_data', 'archivo_base64', 'archivo_url')
            ORDER BY column_name;
        `);

        console.log('Columnas de archivos disponibles:');
        estructura.rows.forEach(col => {
            console.log(`  ✅ ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });

        if (estructura.rows.length === 0) {
            console.log('❌ No se encontraron las nuevas columnas de archivos');
            return;
        }

        // Simular inserción de un artículo de prueba con archivo
        console.log('\n🔬 Simulando inserción de artículo con archivo...');
        
        const testFileContent = Buffer.from('Este es un contenido de prueba para el archivo PDF', 'utf8');
        
        const query = `
            INSERT INTO articulos (
                titulo, resumen, palabras_clave, usuario_id, estado,
                archivo_nombre, archivo_mimetype, archivo_size, archivo_data
            ) 
            VALUES ($1, $2, $3, $4, 'enviado', $5, $6, $7, $8) 
            RETURNING id, titulo, archivo_nombre, archivo_size
        `;
        
        const parametros = [
            'Artículo de Prueba - Sistema Upload',
            'Este es un artículo de prueba para el sistema de upload',
            ['prueba', 'upload', 'sistema'],
            1, // Asumiendo que existe usuario con ID 1
            'documento_prueba.pdf',
            'application/pdf',
            testFileContent.length,
            testFileContent
        ];
        
        console.log('Insertando artículo de prueba...');
        const resultado = await pool.query(query, parametros);
        
        if (resultado.rows.length > 0) {
            const articulo = resultado.rows[0];
            console.log(`✅ Artículo creado exitosamente:`);
            console.log(`   ID: ${articulo.id}`);
            console.log(`   Título: ${articulo.titulo}`);
            console.log(`   Archivo: ${articulo.archivo_nombre}`);
            console.log(`   Tamaño: ${articulo.archivo_size} bytes`);

            // Verificar que se puede recuperar el archivo
            console.log('\n📥 Verificando recuperación de archivo...');
            const archivoQuery = await pool.query(
                'SELECT archivo_data, archivo_nombre, archivo_mimetype, archivo_size FROM articulos WHERE id = $1',
                [articulo.id]
            );

            if (archivoQuery.rows.length > 0) {
                const archivoData = archivoQuery.rows[0];
                console.log(`✅ Archivo recuperado exitosamente:`);
                console.log(`   Nombre: ${archivoData.archivo_nombre}`);
                console.log(`   Tipo: ${archivoData.archivo_mimetype}`);
                console.log(`   Tamaño: ${archivoData.archivo_size} bytes`);
                console.log(`   Contenido (preview): "${archivoData.archivo_data.toString('utf8').substring(0, 50)}..."`);
            }

            // Limpiar - eliminar artículo de prueba
            console.log('\n🧹 Limpiando artículo de prueba...');
            await pool.query('DELETE FROM articulos WHERE id = $1', [articulo.id]);
            console.log('✅ Artículo de prueba eliminado');
        }

        console.log('\n🎉 Sistema de upload con base de datos funciona correctamente!');

    } catch (error) {
        console.error('💥 Error en prueba del sistema:', error);
        
        // Si el error es por usuario no existente, crear uno de prueba
        if (error.message.includes('violates foreign key constraint')) {
            console.log('\n⚠️ Parece que no existe usuario con ID 1. Creando usuario de prueba...');
            try {
                await pool.query(`
                    INSERT INTO usuarios (nombre, email, password, rol) 
                    VALUES ('Usuario Prueba', 'prueba@test.com', '$2b$10$test', 'autor')
                    ON CONFLICT (email) DO NOTHING
                `);
                console.log('✅ Usuario de prueba creado. Intenta ejecutar el script nuevamente.');
            } catch (userError) {
                console.log('❌ Error creando usuario de prueba:', userError.message);
            }
        }
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    testNewUploadSystem().then(() => {
        console.log('✅ Prueba completada');
        process.exit(0);
    }).catch(error => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
}

module.exports = testNewUploadSystem;
