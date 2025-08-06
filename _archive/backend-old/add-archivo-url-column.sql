-- add-archivo-url-column.sql
-- Agregar columna archivo_url para almacenar la URL pública del archivo en Supabase Storage

-- Verificar si la columna ya existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='articulos' and column_name='archivo_url'
    ) THEN
        ALTER TABLE articulos ADD COLUMN archivo_url TEXT;
        RAISE NOTICE 'Columna archivo_url agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna archivo_url ya existe';
    END IF;
END $$;
