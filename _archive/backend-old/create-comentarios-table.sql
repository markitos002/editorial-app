-- create-comentarios-table.sql - Crear tabla para sistema de comentarios
-- Ejecutar este script para crear la tabla de comentarios

CREATE TABLE IF NOT EXISTS comentarios (
    id SERIAL PRIMARY KEY,
    revision_id INTEGER NOT NULL REFERENCES revisiones(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('publico', 'privado', 'interno')),
    contenido TEXT NOT NULL,
    respuesta_a INTEGER REFERENCES comentarios(id) ON DELETE CASCADE,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'resuelto', 'eliminado')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices para optimización
    INDEX idx_comentarios_revision (revision_id),
    INDEX idx_comentarios_usuario (usuario_id),
    INDEX idx_comentarios_tipo (tipo),
    INDEX idx_comentarios_respuesta (respuesta_a)
);

-- Crear trigger para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION update_comentarios_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_comentarios_timestamp ON comentarios;
CREATE TRIGGER trigger_update_comentarios_timestamp
    BEFORE UPDATE ON comentarios
    FOR EACH ROW
    EXECUTE FUNCTION update_comentarios_timestamp();

-- Comentarios para documentar la tabla
COMMENT ON TABLE comentarios IS 'Tabla para gestionar comentarios y observaciones en el sistema de revisión';
COMMENT ON COLUMN comentarios.tipo IS 'Tipo de comentario: publico (visible para autor), privado (solo revisor), interno (solo editores/admin)';
COMMENT ON COLUMN comentarios.respuesta_a IS 'ID del comentario al que responde (para threading)';
COMMENT ON COLUMN comentarios.estado IS 'Estado del comentario: activo, resuelto, eliminado';

-- Insertar algunos comentarios de ejemplo para testing
INSERT INTO comentarios (revision_id, usuario_id, tipo, contenido) VALUES 
(3, 3, 'publico', 'El resumen del artículo es muy claro, pero considero que la metodología necesita más detalle en la sección de recolección de datos.'),
(3, 3, 'publico', 'Las referencias bibliográficas están incompletas. Por favor, incluir los números de página para todas las citas directas.'),
(3, 3, 'privado', 'Nota personal: Este es un trabajo prometedor, pero el autor parece ser principiante. Recomiendo ser constructivo en los comentarios.'),
(3, 1, 'interno', 'Este revisor está siendo muy minucioso. Considerar asignarle más artículos de alta complejidad.');

-- Verificar que se creó correctamente
SELECT 
    c.*,
    u.nombre as autor_comentario,
    r.id as revision_id
FROM comentarios c
JOIN usuarios u ON c.usuario_id = u.id  
JOIN revisiones r ON c.revision_id = r.id
ORDER BY c.fecha_creacion ASC;
