#!/bin/bash

# Script de inicialización de la base de datos para Render
# Este archivo se ejecuta automáticamente cuando se crea la base de datos

echo "🚀 Inicializando base de datos Editorial App..."

# Crear tablas principales
psql $DATABASE_URL << 'EOF'

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'autor',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de artículos
CREATE TABLE IF NOT EXISTS articulos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(500) NOT NULL,
    contenido TEXT,
    resumen TEXT,
    autor_id INTEGER REFERENCES usuarios(id),
    estado VARCHAR(50) DEFAULT 'borrador',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_publicacion TIMESTAMP,
    fecha_revision TIMESTAMP,
    revisor_id INTEGER REFERENCES usuarios(id),
    comentarios_revision TEXT,
    keywords TEXT,
    categoria VARCHAR(100),
    prioridad VARCHAR(20) DEFAULT 'media',
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS comentarios (
    id SERIAL PRIMARY KEY,
    articulo_id INTEGER REFERENCES articulos(id) ON DELETE CASCADE,
    usuario_id INTEGER REFERENCES usuarios(id),
    contenido TEXT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'general',
    estado VARCHAR(50) DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(100) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT false,
    datos_adicionales JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_articulos_autor ON articulos(autor_id);
CREATE INDEX IF NOT EXISTS idx_articulos_estado ON articulos(estado);
CREATE INDEX IF NOT EXISTS idx_articulos_fecha ON articulos(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_comentarios_articulo ON comentarios(articulo_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones(leida);

-- Crear usuario administrador por defecto
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Administrador', 'admin@editorial.com', '$2b$10$rKvtRGmhm3gThQh8n5q5DuWlzJmBZq8eZ2YOQjcn5Hq8eZ2YOQjcn5', 'administrador')
ON CONFLICT (email) DO NOTHING;

-- Crear usuario editor de prueba
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Editor Prueba', 'editor@editorial.com', '$2b$10$rKvtRGmhm3gThQh8n5q5DuWlzJmBZq8eZ2YOQjcn5Hq8eZ2YOQjcn5', 'editor')
ON CONFLICT (email) DO NOTHING;

-- Crear usuario autor de prueba
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Autor Prueba', 'autor@editorial.com', '$2b$10$rKvtRGmhm3gThQh8n5q5DuWlzJmBZq8eZ2YOQjcn5Hq8eZ2YOQjcn5', 'autor')
ON CONFLICT (email) DO NOTHING;

EOF

echo "✅ Base de datos inicializada correctamente"
