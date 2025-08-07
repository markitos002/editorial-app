// middlewares/databaseUpload.js - Optimizado para mejor rendimiento
const multer = require('multer');
const path = require('path');

// Configurar multer para usar memoria con límites estrictos
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Reducido a 5MB para mejor rendimiento
        files: 3, // Reducido a 3 archivos máximo
        fieldSize: 1 * 1024 * 1024, // 1MB por campo
        fieldNameSize: 100, // Límite nombre de campo
        fields: 10 // Máximo 10 campos
    },
    fileFilter: (req, file, cb) => {
        // Validación más estricta y rápida
        const allowedTypes = new Set([
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'application/rtf'
        ]);
        
        const allowedExtensions = new Set(['.pdf', '.doc', '.docx', '.txt', '.rtf']);
        const fileExt = path.extname(file.originalname).toLowerCase();
        
        if (allowedTypes.has(file.mimetype) && allowedExtensions.has(fileExt)) {
            cb(null, true);
        } else {
            cb(new Error(`Archivo no permitido: ${file.originalname}. Solo PDF, DOC, DOCX, TXT, RTF`), false);
        }
    }
});

// Middleware optimizado para procesar archivos
const processFilesToDatabase = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return next();
        }

        // Pre-validar tamaño total
        const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);
        if (totalSize > 15 * 1024 * 1024) { // 15MB total máximo
            return res.status(413).json({
                success: false,
                message: 'Tamaño total de archivos excede el límite (15MB máximo)',
                error: 'PAYLOAD_TOO_LARGE'
            });
        }

        // Array optimizado para archivos procesados
        req.processedFiles = [];

        // Procesar archivos de forma más eficiente
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            
            // Validaciones adicionales de seguridad
            if (!file.buffer || file.size === 0) {
                continue; // Saltar archivos vacíos
            }

            // Agregar información del archivo (sin Base64 innecesario)
            req.processedFiles.push({
                originalName: file.originalname.substring(0, 255), // Limitar longitud
                size: file.size,
                mimetype: file.mimetype,
                buffer: file.buffer // Mantener buffer para inserción directa en DB
            });
        }

        if (req.processedFiles.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No se recibieron archivos válidos',
                error: 'NO_VALID_FILES'
            });
        }

        console.log(`✅ ${req.processedFiles.length} archivos procesados exitosamente`);
        next();

    } catch (error) {
        console.error('❌ Error en processFilesToDatabase:', error);
        
        // Limpiar memoria en caso de error
        if (req.files) {
            req.files.forEach(file => {
                if (file.buffer) {
                    file.buffer = null;
                }
            });
        }
        
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
