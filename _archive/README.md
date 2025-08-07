# 📦 Archivo de Proyecto - Editorial App

Esta carpeta contiene todos los archivos que fueron movidos para optimizar el workspace y reducir el consumo de recursos de cómputo.

## 📂 Estructura

### `/docs` - Documentación Histórica
- Análisis de deployment y configuración
- Guías de debugging y solución de problemas
- Documentación de sesiones de desarrollo
- Estados del proyecto y planes de desarrollo

### `/docs-raiz` - Documentos de la Raíz
- ANALISIS_RENDER_TAILSCALE.md
- BACKEND_VERIFICATION.md
- LIMPIEZA_COMPLETADA.md
- SISTEMA_UPLOAD_COMPLETADO.md
- README-LIMPIO.md

### `/scripts-raiz` - Scripts de Organización
- Scripts de archivado: archivar-tests.cjs, limpieza-final.cjs
- Scripts de limpieza: limpiar-cache.cjs, limpiar-proyecto.bat
- Scripts PowerShell: limpiar-vscode.ps1, optimizar-vscode.ps1
- Configuraciones: .gitignore-optimized

### `/duplicados` - Archivos Duplicados
- Versiones .js cuando existe .cjs
- archivar-tests.js, limpiar-cache.js

### `/tests-old` - Archivos de Testing Backend
- Scripts de test HTTP y verificación
- Archivos de debug y check

### `/debug-old` - Scripts de Debug
- debug-admin.js, debug-api.js, debug-articulos.js
- debug-autor.js, debug-database-structure.js
- debug-db.js, debug-query.js

### `/sql-old` - Scripts SQL de Migración
- Scripts de estructura y migración de BD
- add-*, create-*, grant-*, update-*

### `/dev-old` - Herramientas de Desarrollo
- Scripts de investigación y verificación
- revisar-bd.js, investigar-tabla.js

### `/backend-old` - Scripts de BD Viejos (anteriores)
- Scripts SQL de migración históricos
- Archivos de configuración de columnas
- Scripts de setup y actualización

### `/examples` - Configuraciones y Ejemplos
- Archivos Docker y docker-compose
- Scripts de deployment
- Configuraciones de PM2 (ecosystem.config)
- Archivos .env de ejemplo
- Configuraciones de Render, Jest, ESLint

### `/tests` (carpeta completa) - Suite de Testing
- Tests unitarios completos
- Mocks y fixtures
- Configuraciones de testing

### `/scripts` (carpeta completa) - Scripts de Utilidad
- Scripts de automatización
- Herramientas de desarrollo

## 🎯 Propósito

Estos archivos fueron archivados para:
- ✅ Reducir carga computacional en VS Code
- ✅ Mejorar performance de búsquedas
- ✅ Simplificar navegación del proyecto
- ✅ Mantener historial para referencia futura

## 🔄 Restauración

Si necesitas algún archivo, simplemente muévelo de vuelta a su ubicación original:

```bash
# Ejemplo: restaurar un test específico
move _archive\tests\test-complete-upload.js backend\
```

---
**Archivado el**: 6 de agosto de 2025
**Proyecto**: Editorial App - Sistema de Gestión Editorial
**Estado**: Archivos preservados para referencia histórica
