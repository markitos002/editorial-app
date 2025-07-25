-- Script para actualizar los estados permitidos en la tabla articulos
-- Ejecutar este script en tu cliente PostgreSQL

-- 1. Eliminar la restricción existente
ALTER TABLE articulos DROP CONSTRAINT IF EXISTS articulos_estado_check;

-- 2. Crear la nueva restricción con estados más completos
ALTER TABLE articulos ADD CONSTRAINT articulos_estado_check 
CHECK (estado IN (
    'enviado',
    'en_revision',
    'revisado', 
    'aprobado',
    'rechazado',
    'publicado'
));

-- 3. Verificar que la restricción se aplicó correctamente
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'articulos_estado_check'
    AND conrelid = 'articulos'::regclass;

-- 4. Mostrar los estados actuales de los artículos existentes
SELECT id, titulo, estado, fecha_creacion 
FROM articulos 
ORDER BY fecha_creacion DESC;

-- Comentarios:
-- - Se eliminó 'en revisión' (con espacio) y se agregó 'en_revision' (con guión bajo)
-- - Se cambió 'aceptado' por 'aprobado' (más claro para el contexto editorial)
-- - Se agregaron los estados 'revisado' y 'publicado' para completar el flujo editorial
-- - Los artículos existentes mantendrán sus estados actuales si son válidos
