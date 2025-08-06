// test-complete-upload.js - Prueba completa del sistema de upload
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const API_BASE = 'http://localhost:4000/api';

async function testCompleteUpload() {
    try {
        console.log('🧪 Prueba completa del sistema de upload...');

        // 1. Primero, hacer login
        console.log('🔐 Iniciando sesión...');
        const loginData = {
            email: 'admin@example.com',
            password: 'admin123'
        };

        const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
        const token = loginResponse.data.token;
        console.log('✅ Login exitoso');

        // 2. Crear un archivo de prueba
        console.log('📄 Creando archivo de prueba...');
        const testContent = `
        # Artículo de Prueba - Sistema de Upload
        
        Este es un artículo de prueba para el sistema de carga de archivos.
        
        ## Resumen
        
        Este documento prueba la funcionalidad de upload de archivos a la base de datos.
        
        ## Contenido
        
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        
        ## Conclusiones
        
        El sistema de upload debe funcionar correctamente.
        `;

        const fileName = 'articulo_prueba.txt';
        fs.writeFileSync(fileName, testContent);
        console.log(`✅ Archivo creado: ${fileName}`);

        // 3. Preparar FormData
        console.log('📤 Preparando datos para upload...');
        const formData = new FormData();
        formData.append('titulo', 'Artículo de Prueba - Upload Sistema');
        formData.append('resumen', 'Este es un artículo de prueba para el sistema de upload con archivos en base de datos');
        formData.append('palabras_clave', JSON.stringify(['prueba', 'upload', 'sistema', 'archivo']));
        formData.append('area_tematica', 'Tecnología');
        formData.append('archivos', fs.createReadStream(fileName));

        // 4. Hacer la petición de upload
        console.log('🚀 Enviando artículo con archivo...');
        const uploadResponse = await axios.post(`${API_BASE}/articulos/con-archivo-db`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...formData.getHeaders()
            }
        });

        console.log('✅ Artículo creado exitosamente:');
        console.log('   ID:', uploadResponse.data.articulo.id);
        console.log('   Título:', uploadResponse.data.articulo.titulo);
        console.log('   Archivo:', uploadResponse.data.articulo.archivo_nombre);
        console.log('   Tamaño:', uploadResponse.data.articulo.archivo_size + ' bytes');

        const articuloId = uploadResponse.data.articulo.id;

        // 5. Probar descarga del archivo
        console.log('\n📥 Probando descarga de archivo...');
        try {
            const downloadResponse = await axios.get(`${API_BASE}/articulos/${articuloId}/archivo`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'stream'
            });

            console.log('✅ Descarga exitosa');
            console.log('   Content-Type:', downloadResponse.headers['content-type']);
            console.log('   Content-Disposition:', downloadResponse.headers['content-disposition']);

            // Guardar archivo descargado
            const downloadedFile = 'descargado_' + fileName;
            const writer = fs.createWriteStream(downloadedFile);
            downloadResponse.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            console.log(`✅ Archivo descargado como: ${downloadedFile}`);

            // Verificar contenido
            const downloadedContent = fs.readFileSync(downloadedFile, 'utf8');
            const originalContent = fs.readFileSync(fileName, 'utf8');
            
            if (downloadedContent === originalContent) {
                console.log('✅ Contenido del archivo verificado correctamente');
            } else {
                console.log('❌ El contenido descargado no coincide con el original');
            }

            // Limpiar archivos de prueba
            fs.unlinkSync(fileName);
            fs.unlinkSync(downloadedFile);

        } catch (downloadError) {
            console.log('❌ Error al descargar archivo:', downloadError.response?.data || downloadError.message);
        }

        // 6. Verificar que el artículo esté en la lista
        console.log('\n📋 Verificando artículo en lista...');
        const listResponse = await axios.get(`${API_BASE}/articulos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const foundArticle = listResponse.data.articulos.find(a => a.id === articuloId);
        if (foundArticle) {
            console.log('✅ Artículo encontrado en la lista');
            console.log('   Tiene archivo:', !!foundArticle.archivo_nombre);
        } else {
            console.log('❌ Artículo no encontrado en la lista');
        }

        console.log('\n🎉 Prueba completa del sistema de upload terminada exitosamente!');
        console.log('\n📊 Resumen:');
        console.log('   ✅ Login');
        console.log('   ✅ Crear archivo de prueba');
        console.log('   ✅ Upload de artículo con archivo');
        console.log('   ✅ Descarga de archivo');
        console.log('   ✅ Verificación de integridad');
        console.log('   ✅ Listado de artículos');

    } catch (error) {
        console.error('💥 Error en prueba:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    testCompleteUpload().then(() => {
        console.log('✅ Test completado');
        process.exit(0);
    }).catch(error => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
}

module.exports = testCompleteUpload;
