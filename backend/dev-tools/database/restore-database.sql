-- ESQUEMA COMPLETO DE BASE DE DATOS EDITORIAL
-- Incluye sistema de archivos implementado el 23 Julio 2025

-- Conectar a la base de datos
\c editorialdata;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'autor' CHECK (rol IN ('autor', 'revisor', 'editor', 'admin')),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de artículos (con sistema de archivos)
CREATE TABLE articulos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    resumen TEXT NOT NULL,
    palabras_clave TEXT[],
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    estado VARCHAR(20) DEFAULT 'enviado' CHECK (estado IN ('enviado', 'en_revision', 'aprobado', 'rechazado', 'publicado')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- CAMPOS DE ARCHIVO (implementados 23 Julio 2025)
    archivo_nombre VARCHAR(255),
    archivo_path VARCHAR(500),
    archivo_mimetype VARCHAR(100),
    archivo_size INTEGER
);

-- Tabla de revisiones
CREATE TABLE revisiones (
    id SERIAL PRIMARY KEY,
    articulo_id INTEGER REFERENCES articulos(id) ON DELETE CASCADE,
    revisor_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_progreso', 'completada')),
    recomendacion VARCHAR(20) CHECK (recomendacion IN ('aceptar', 'revisar', 'rechazar')),
    observaciones TEXT,
    calificacion INTEGER CHECK (calificacion >= 1 AND calificacion <= 5),
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_completado TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de notificaciones
CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'info' CHECK (tipo IN ('info', 'success', 'warning', 'error')),
    leida BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    articulo_id INTEGER REFERENCES articulos(id) ON DELETE SET NULL,
    revision_id INTEGER REFERENCES revisiones(id) ON DELETE SET NULL
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_articulos_usuario_id ON articulos(usuario_id);
CREATE INDEX idx_articulos_estado ON articulos(estado);
CREATE INDEX idx_articulos_fecha_creacion ON articulos(fecha_creacion);
CREATE INDEX idx_revisiones_articulo_id ON revisiones(articulo_id);
CREATE INDEX idx_revisiones_revisor_id ON revisiones(revisor_id);
CREATE INDEX idx_revisiones_estado ON revisiones(estado);
CREATE INDEX idx_notificaciones_usuario_id ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leida ON notificaciones(leida);

-- Función para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar fecha_actualizacion
CREATE TRIGGER trigger_usuarios_fecha_actualizacion
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trigger_articulos_fecha_actualizacion
    BEFORE UPDATE ON articulos
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trigger_revisiones_fecha_actualizacion
    BEFORE UPDATE ON revisiones
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

-- DATOS DE PRUEBA

-- Usuario administrador para testing
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Administrador', 'admin@editorial.com', '$2b$10$rGQX8QXJrQJJqJQZJZGZJe7QJQZJJQZJJQZJJQZJJQZJJQZJJQZJJe', 'admin');

-- Usuario autor para testing
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Juan Pérez', 'juan@editorial.com', '$2b$10$rGQX8QXJrQJJqJQZJZGZJe7QJQZJJQZJJQZJJQZJJQZJJQZJJQZJJe', 'autor');

-- Usuario revisor para testing
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('María García', 'maria@editorial.com', '$2b$10$rGQX8QXJrQJJqJQZJZGZJe7QJQZJJQZJJQZJJQZJJQZJJQZJJQZJJe', 'revisor');

-- Usuario editor para testing
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Carlos López', 'carlos@editorial.com', '$2b$10$rGQX8QXJrQJJqJQZJJQZJJQZJJQZJJQZJJQZJJQZJJQZJJQZJJe', 'editor');

-- Artículo de ejemplo con archivo
INSERT INTO articulos (titulo, resumen, palabras_clave, usuario_id, estado, archivo_nombre, archivo_mimetype, archivo_size) VALUES 
(
    'Ejemplo de Artículo Académico',
    'Este es un artículo de ejemplo para probar el sistema de gestión editorial con carga de archivos.',
    ARRAY['ejemplo', 'academico', 'investigacion'],
    2,
    'enviado',
    'articulo_ejemplo.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    25600
);

-- Revisión de ejemplo
INSERT INTO revisiones (articulo_id, revisor_id, estado) VALUES (1, 3, 'pendiente');

-- Notificación de ejemplo
INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, articulo_id) VALUES 
(2, 'Artículo Enviado', 'Tu artículo "Ejemplo de Artículo Académico" ha sido enviado correctamente y está pendiente de revisión.', 'success', 1);

-- Mostrar resumen de la base de datos creada
\echo '=== ESQUEMA EDITORIAL RESTAURADO ==='
\echo 'Tablas creadas:'
\dt
\echo ''
\echo 'Usuarios de prueba creados:'
SELECT nombre, email, rol FROM usuarios;
\echo ''
\echo 'Artículos de ejemplo:'
SELECT id, titulo, estado, archivo_nombre FROM articulos;
