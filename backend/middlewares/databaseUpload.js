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
        console.log('🔍 processFilesToDatabase - Verificando archivos...');
        console.log('req.files:', req.files);
        console.log('req.file:', req.file);
        
        // Manejar tanto req.files (array) como req.file (single)
        let files = [];
        if (req.files && Array.isArray(req.files)) {
            files = req.files;
        } else if (req.file) {
            files = [req.file];
        }
        
        console.log('📁 Archivos encontrados:', files.length);
        
        if (files.length === 0) {
            console.log('⚠️ No se encontraron archivos');
            return res.status(400).json({
                success: false,
                mensaje: 'No se recibieron archivos',
                error: 'NO_FILES_RECEIVED'
            });
        }

        // Pre-validar tamaño total
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        console.log('📏 Tamaño total de archivos:', totalSize, 'bytes');
        
        if (totalSize > 15 * 1024 * 1024) { // 15MB total máximo
            return res.status(413).json({
                success: false,
                mensaje: 'Tamaño total de archivos excede el límite (15MB máximo)',
                error: 'PAYLOAD_TOO_LARGE'
            });
        }

        // Array optimizado para archivos procesados
        req.processedFiles = [];

        // Procesar archivos de forma más eficiente
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            console.log(`📄 Procesando archivo ${i + 1}:`, {
                name: file.originalname,
                size: file.size,
                type: file.mimetype
            });
            
            // Validaciones adicionales de seguridad
            if (!file.buffer || file.size === 0) {
                console.log('⚠️ Saltando archivo vacío');
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
                mensaje: 'No se recibieron archivos válidos',
                error: 'NO_VALID_FILES'
            });
        }

        console.log(`✅ ${req.processedFiles.length} archivos procesados exitosamente`);
        next();

    } catch (error) {
        console.error('❌ Error en processFilesToDatabase:', error);
        console.error('Error stack:', error.stack);
        
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
            mensaje: 'Error al procesar archivos: ' + error.message,
            error: error.message
        });
    }
};

module.exports = {
    upload: upload.array('archivos', 5),
    processFilesToDatabase
};
