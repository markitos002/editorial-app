-- add-archivo-blob-column.sql
-- Agregar columna archivo_data para almacenar archivos como BLOB

DO $$ 
BEGIN
    -- Agregar columna para datos del archivo como BLOB
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='articulos' and column_name='archivo_data'
    ) THEN
        ALTER TABLE articulos ADD COLUMN archivo_data BYTEA;
        RAISE NOTICE 'Columna archivo_data agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna archivo_data ya existe';
    END IF;
    
    -- Agregar columna para almacenar el archivo como Base64 (alternativa)
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='articulos' and column_name='archivo_base64'
    ) THEN
        ALTER TABLE articulos ADD COLUMN archivo_base64 TEXT;
        RAISE NOTICE 'Columna archivo_base64 agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna archivo_base64 ya existe';
    END IF;
END $$;
