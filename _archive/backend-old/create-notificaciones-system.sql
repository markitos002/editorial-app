-- Sistema de Notificaciones - Base de Datos
-- Archivo: create-notificaciones-system.sql
-- Fecha: 26 Julio 2025

-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- 'asignacion', 'comentario', 'estado_articulo', 'sistema'
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    datos_adicionales JSONB, -- Para datos específicos del tipo de notificación
    articulo_id INTEGER REFERENCES articulos(id) ON DELETE SET NULL,
    comentario_id INTEGER REFERENCES comentarios(id) ON DELETE SET NULL,
    revision_id INTEGER REFERENCES revisiones(id) ON DELETE SET NULL,
    creado_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario_id ON notificaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_tipo ON notificaciones(tipo);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leido ON notificaciones(leido);
CREATE INDEX IF NOT EXISTS idx_notificaciones_fecha_creacion ON notificaciones(fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_notificaciones_articulo_id ON notificaciones(articulo_id);

-- Comentarios para documentar la estructura
COMMENT ON TABLE notificaciones IS 'Sistema de notificaciones internas del sistema editorial';
COMMENT ON COLUMN notificaciones.tipo IS 'Tipo de notificación: asignacion, comentario, estado_articulo, sistema';
COMMENT ON COLUMN notificaciones.datos_adicionales IS 'JSON con datos específicos según el tipo de notificación';
COMMENT ON COLUMN notificaciones.leido IS 'Indica si la notificación ha sido leída por el usuario';
COMMENT ON COLUMN notificaciones.fecha_lectura IS 'Timestamp de cuando se marcó como leída';

-- Datos de ejemplo para testing
INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, articulo_id, creado_por, datos_adicionales) VALUES
(2, 'asignacion', 'Nueva revisión asignada', 'Se te ha asignado la revisión del artículo "Inteligencia Artificial en la Medicina"', 1, 1, '{"urgencia": "media", "plazo": "2025-08-10"}'),
(3, 'comentario', 'Nuevo comentario en tu artículo', 'El revisor ha agregado un comentario a tu artículo', 1, 2, '{"comentario_tipo": "observacion"}'),
(4, 'estado_articulo', 'Artículo aprobado', 'Tu artículo "Blockchain y Seguridad" ha sido aprobado para publicación', 2, 1, '{"estado_anterior": "en_revision", "estado_nuevo": "aprobado"}'),
(1, 'sistema', 'Mantenimiento programado', 'El sistema estará en mantenimiento el 1 de agosto de 2025 de 2:00 AM a 4:00 AM', NULL, NULL, '{"fecha_mantenimiento": "2025-08-01T02:00:00Z", "duracion": "2 horas"}')
