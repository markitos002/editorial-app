// middlewares/databaseUpload.js
const multer = require('multer');
const path = require('path');

// Configurar multer para usar memoria
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

// Middleware para procesar archivos y convertirlos a Base64
const processFilesToDatabase = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return next();
        }

        // Array para almacenar información de archivos procesados
        req.processedFiles = [];

        for (const file of req.files) {
            console.log(`Procesando archivo: ${file.originalname}`);
            console.log(`Tamaño: ${file.size} bytes`);
            console.log(`Tipo: ${file.mimetype}`);

            // Convertir archivo a Base64
            const fileBase64 = file.buffer.toString('base64');

            // Agregar información del archivo procesado
            req.processedFiles.push({
                originalName: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                buffer: file.buffer,
                base64: fileBase64
            });
        }

        console.log(`${req.processedFiles.length} archivos procesados exitosamente`);
        next();

    } catch (error) {
        console.error('Error en processFilesToDatabase:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar archivos',
            error: error.message
        });
    }
};

module.exports = {
    upload: upload.array('archivos', 5),
    processFilesToDatabase
};
