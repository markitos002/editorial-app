-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
    categoria VARCHAR(50) NOT NULL DEFAULT 'general', -- 'asignacion', 'revision', 'comentario', 'articulo', 'general'
    leida BOOLEAN DEFAULT FALSE,
    data JSONB, -- Datos adicionales (id de artículo, id de revisión, etc.)
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_leida TIMESTAMP NULL
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario_id ON notificaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones(leida);
CREATE INDEX IF NOT EXISTS idx_notificaciones_fecha ON notificaciones(fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_notificaciones_tipo ON notificaciones(tipo);
CREATE INDEX IF NOT EXISTS idx_notificaciones_categoria ON notificaciones(categoria);

-- Índice compuesto para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario_leida ON notificaciones(usuario_id, leida);

COMMENT ON TABLE notificaciones IS 'Tabla para almacenar notificaciones del sistema';
COMMENT ON COLUMN notificaciones.tipo IS 'Tipo de notificación: info, success, warning, error';
COMMENT ON COLUMN notificaciones.categoria IS 'Categoría: asignacion, revision, comentario, articulo, general';
COMMENT ON COLUMN notificaciones.data IS 'Datos adicionales en formato JSON';
