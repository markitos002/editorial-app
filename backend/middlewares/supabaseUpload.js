// middlewares/supabaseUpload.js
const multer = require('multer');
const { supabaseAdmin } = require('../config/supabase');
const path = require('path');

// Configurar multer para usar memoria en lugar de disco
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB límite
        files: 5 // máximo 5 archivos
    },
    fileFilter: (req, file, cb) => {
        // Permitir solo ciertos tipos de archivos
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'application/rtf'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido. Solo se aceptan PDF, DOC, DOCX, TXT, RTF'), false);
        }
    }
});

// Middleware para subir archivos a Supabase Storage
const uploadToSupabase = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return next();
        }

        // Array para almacenar información de archivos subidos
        req.supabaseFiles = [];

        for (const file of req.files) {
            // Generar nombre único para el archivo
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const extension = path.extname(file.originalname);
            const fileName = `${timestamp}_${randomString}${extension}`;
            const filePath = `articulos/${fileName}`;

            console.log(`Subiendo archivo: ${fileName}`);
            console.log(`Tamaño: ${file.size} bytes`);
            console.log(`Tipo: ${file.mimetype}`);

            // Subir archivo a Supabase Storage
            const { data, error } = await supabaseAdmin.storage
                .from('editorial-files') // nombre del bucket
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (error) {
                console.error('Error al subir archivo a Supabase:', error);
                throw new Error(`Error al subir archivo: ${error.message}`);
            }

            console.log('Archivo subido exitosamente:', data.path);

            // Obtener URL pública del archivo
            const { data: publicUrlData } = supabaseAdmin.storage
                .from('editorial-files')
                .getPublicUrl(filePath);

            // Agregar información del archivo subido
            req.supabaseFiles.push({
                originalName: file.originalname,
                fileName: fileName,
                filePath: filePath,
                publicUrl: publicUrlData.publicUrl,
                size: file.size,
                mimetype: file.mimetype
            });
        }

        console.log(`${req.supabaseFiles.length} archivos subidos exitosamente`);
        next();

    } catch (error) {
        console.error('Error en uploadToSupabase:', error);
        res.status(500).json({
            success: false,
            message: 'Error al subir archivos',
            error: error.message
        });
    }
};

module.exports = {
    upload: upload.array('archivos', 5),
    uploadToSupabase
};
