-- add-article-columns.sql
-- Agregar columnas faltantes a la tabla articulos

ALTER TABLE articulos 
ADD COLUMN IF NOT EXISTS palabras_clave TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS area_tematica VARCHAR(100) DEFAULT 'cuidados-enfermeria';

-- Verificar las columnas agregadas
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'articulos' 
ORDER BY ordinal_position;
