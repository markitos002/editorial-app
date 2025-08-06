-- add-revision-columns.sql - Agregar campos para el sistema de revisión de documentos
-- Este script agrega campos faltantes a la tabla de revisiones

-- Agregar campos si no existen
DO $$ 
BEGIN
    -- Agregar campo comentarios_privados si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'revisiones' AND column_name = 'comentarios_privados') THEN
        ALTER TABLE revisiones ADD COLUMN comentarios_privados TEXT;
        RAISE NOTICE 'Campo comentarios_privados agregado';
    END IF;

    -- Agregar campo justificacion si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'revisiones' AND column_name = 'justificacion') THEN
        ALTER TABLE revisiones ADD COLUMN justificacion TEXT;
        RAISE NOTICE 'Campo justificacion agregado';
    END IF;

    -- Agregar campo fecha_actualizacion si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'revisiones' AND column_name = 'fecha_actualizacion') THEN
        ALTER TABLE revisiones ADD COLUMN fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Campo fecha_actualizacion agregado';
    END IF;

    -- Verificar y actualizar valores por defecto
    UPDATE revisiones SET fecha_actualizacion = fecha_asignacion 
    WHERE fecha_actualizacion IS NULL;

END $$;

-- Mostrar estructura actualizada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'revisiones' 
ORDER BY ordinal_position;
