// test-supabase-storage.js - Script para probar Supabase Storage
require('dotenv').config();
const { supabaseAdmin } = require('./config/supabase');
const fs = require('fs');

async function testSupabaseStorage() {
    try {
        console.log('🔧 Probando Supabase Storage...');

        // Listar buckets existentes
        console.log('📋 Listando buckets...');
        const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
        
        if (listError) {
            console.error('❌ Error al listar buckets:', listError);
            return;
        }

        console.log('✅ Buckets disponibles:', buckets.map(b => b.name));

        // Si no hay buckets, mostrar error
        if (buckets.length === 0) {
            console.log('⚠️ No hay buckets disponibles. Necesitas crear uno desde la consola de Supabase:');
            console.log('1. Ve a https://supabase.com/dashboard/project/[tu-proyecto]/storage/buckets');
            console.log('2. Crea un bucket llamado "editorial-files"');
            console.log('3. Haz el bucket público');
            return;
        }

        // Buscar el bucket editorial-files
        const editorialBucket = buckets.find(bucket => bucket.name === 'editorial-files');
        
        if (!editorialBucket) {
            console.log('⚠️ El bucket "editorial-files" no existe.');
            console.log('Por favor créalo desde la consola de Supabase y haz que sea público.');
            return;
        }

        console.log('✅ Bucket "editorial-files" encontrado y disponible');

        // Probar subir un archivo de prueba (crear un archivo temporal)
        const testContent = 'Este es un archivo de prueba para verificar Supabase Storage';
        const testFileName = `test_${Date.now()}.txt`;
        
        console.log(`📤 Probando subida de archivo: ${testFileName}`);
        
        const { data, error } = await supabaseAdmin.storage
            .from('editorial-files')
            .upload(`pruebas/${testFileName}`, Buffer.from(testContent), {
                contentType: 'text/plain',
                upsert: false
            });

        if (error) {
            console.error('❌ Error al subir archivo:', error);
            return;
        }

        console.log('✅ Archivo subido exitosamente:', data.path);

        // Obtener URL pública
        const { data: publicUrlData } = supabaseAdmin.storage
            .from('editorial-files')
            .getPublicUrl(`pruebas/${testFileName}`);

        console.log('🔗 URL pública:', publicUrlData.publicUrl);

        // Limpiar - eliminar archivo de prueba
        const { error: deleteError } = await supabaseAdmin.storage
            .from('editorial-files')
            .remove([`pruebas/${testFileName}`]);

        if (deleteError) {
            console.log('⚠️ No se pudo eliminar el archivo de prueba:', deleteError);
        } else {
            console.log('🧹 Archivo de prueba eliminado');
        }

        console.log('🎉 Supabase Storage funcionando correctamente!');

    } catch (error) {
        console.error('💥 Error en prueba de Storage:', error);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    testSupabaseStorage().then(() => {
        console.log('✅ Prueba completada');
        process.exit(0);
    }).catch(error => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
}

module.exports = testSupabaseStorage;
