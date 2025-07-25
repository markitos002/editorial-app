-- Script para otorgar permisos al usuario markitos
-- Conectar a la base de datos editorialdata

\c editorialdata;

-- Otorgar todos los permisos al usuario markitos en todas las tablas
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO markitos;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO markitos;
GRANT ALL PRIVILEGES ON SCHEMA public TO markitos;

-- Otorgar permisos específicos en cada tabla
GRANT SELECT, INSERT, UPDATE, DELETE ON usuarios TO markitos;
GRANT SELECT, INSERT, UPDATE, DELETE ON articulos TO markitos;
GRANT SELECT, INSERT, UPDATE, DELETE ON revisiones TO markitos;
GRANT SELECT, INSERT, UPDATE, DELETE ON notificaciones TO markitos;

-- Otorgar permisos en las secuencias (para AUTO_INCREMENT)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO markitos;

-- Mostrar los permisos otorgados
\dp usuarios;
\dp articulos;
\dp revisiones;
\dp notificaciones;

\echo 'Permisos otorgados correctamente al usuario markitos'
