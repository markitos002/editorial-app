# Herramientas de Desarrollo

Esta carpeta contiene archivos de desarrollo, testing y mantenimiento para el sistema editorial.

## 📁 Estructura

### `/tests`
Archivos de prueba y testing del sistema:
- `test-*.js` - Scripts de prueba para diferentes módulos
- `test-*.http` - Archivos de prueba HTTP para endpoints
- `test-*.ps1` - Scripts PowerShell para testing
- `test-server.js` - Servidor de prueba simplificado

### `/database`
Scripts y herramientas relacionadas con la base de datos:
- `restore-database.sql` - Script principal de restauración de BD
- `setup-database.sql` - Script de configuración inicial
- `grant-permissions.sql` - Script de permisos de usuario
- `add-article-columns.sql` - Migración para columnas de archivos
- `update-estados.sql` - Actualización de estados
- `debug-db.js` - Herramienta de debug de BD
- `verify-*.js` - Scripts de verificación de BD
- `check-*.js` - Scripts de verificación de constraints

### `/scripts`
Scripts de mantenimiento y utilidades:
- `investigar-tabla.js` - Herramienta de análisis de tablas
- `migrate-columns.js` - Script de migración de columnas
- `revisar-bd.js` - Herramienta de revisión de BD
- `update-articles-for-files.js` - Actualización de artículos para sistema de archivos

## 🚀 Uso

Desde la carpeta backend:

```bash
# Ejecutar pruebas
node dev-tools/tests/test-api.js

# Verificar base de datos
node dev-tools/database/debug-db.js

# Restaurar base de datos
psql -U markitos -d editorial_db -f dev-tools/database/restore-database.sql
```

## 📝 Notas

- Estos archivos son solo para desarrollo y no deben incluirse en producción
- Los scripts SQL deben ejecutarse con precaución en entornos de producción
- Los archivos de test pueden requerir configuración específica del entorno
