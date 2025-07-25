-- Script SQL para crear la tabla usuarios con estructura correcta
-- Ejecutar en PostgreSQL

-- Eliminar tabla si existe (¡CUIDADO! Esto borrará todos los datos)
-- DROP TABLE IF EXISTS usuarios;

-- Crear tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'usuario',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar algunos datos de prueba
INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES
    ('Admin Sistema', 'admin@editorial.com', 'admin123', 'admin'),
    ('Editor Principal', 'editor@editorial.com', 'editor123', 'editor'),
    ('Autor Ejemplo', 'autor@editorial.com', 'autor123', 'autor')
ON CONFLICT (email) DO NOTHING;

-- Verificar la estructura de la tabla
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- Verificar datos existentes
SELECT * FROM usuarios;
