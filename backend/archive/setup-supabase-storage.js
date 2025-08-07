// setup-supabase-storage.js - Script para configurar el bucket de Supabase Storage
require('dotenv').config();
const supabase = require('./config/supabase');

async function setupStorage() {
    try {
        console.log('🔧 Configurando Supabase Storage...');

        // Verificar si el bucket ya existe
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
            console.error('❌ Error al listar buckets:', listError);
            return;
        }

        const bucketName = 'editorial-files';
        const existingBucket = buckets.find(bucket => bucket.name === bucketName);

        if (existingBucket) {
            console.log(`✅ El bucket "${bucketName}" ya existe`);
        } else {
            // Crear el bucket
            const { data, error } = await supabase.storage.createBucket(bucketName, {
                public: true, // Hacer el bucket público
                allowedMimeTypes: [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'text/plain',
                    'application/rtf'
                ],
                fileSizeLimit: 10485760 // 10MB
            });

            if (error) {
                console.error('❌ Error al crear bucket:', error);
                return;
            }

            console.log(`✅ Bucket "${bucketName}" creado exitosamente`);
        }

        // Verificar permisos del bucket
        console.log('📋 Buckets disponibles:');
        buckets.forEach(bucket => {
            console.log(`  - ${bucket.name} (Público: ${bucket.public})`);
        });

        console.log('🎉 Configuración de Storage completada');

    } catch (error) {
        console.error('💥 Error en setupStorage:', error);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    setupStorage().then(() => {
        console.log('✅ Script completado');
        process.exit(0);
    }).catch(error => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
}

module.exports = setupStorage;
