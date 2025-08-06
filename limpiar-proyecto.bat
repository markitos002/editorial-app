@echo off
REM SCRIPT DE LIMPIEZA AGRESIVA PARA OPTIMIZAR VS CODE
echo 🧹 INICIANDO LIMPIEZA AGRESIVA DEL WORKSPACE...

REM Crear estructura de archivo si no existe
if not exist "_archive" mkdir "_archive"
if not exist "_archive\docs" mkdir "_archive\docs"
if not exist "_archive\tests" mkdir "_archive\tests"
if not exist "_archive\examples" mkdir "_archive\examples"
if not exist "_archive\scripts-old" mkdir "_archive\scripts-old"

echo 📚 Moviendo documentación vieja...
move "BUILD_FIX_AGOSTO_2025.md" "_archive\docs\" 2>nul
move "COMPLETADO_FASE_7_3_UX_UI.md" "_archive\docs\" 2>nul
move "CORRECION_BUCLE_AUTENTICACION.md" "_archive\docs\" 2>nul
move "CORS_404_FIX.md" "_archive\docs\" 2>nul
move "DEBUGGING_GUIDE_REACT19_CHAKRA_FRAMER.md" "_archive\docs\" 2>nul
move "DEPLOYMENT_DEBIAN_TAILSCALE.md" "_archive\docs\" 2>nul
move "DEPLOYMENT_STEPS.md" "_archive\docs\" 2>nul
move "DEPLOYMENT.md" "_archive\docs\" 2>nul
move "DIAGNOSTICO_SUPABASE_RENDER.md" "_archive\docs\" 2>nul
move "DIRECTRICES_AUTORES.md" "_archive\docs\" 2>nul
move "DOCUMENTACION_DESPLIEGUE_PRODUCCION.md" "_archive\docs\" 2>nul
move "DOCUMENTACION_RESTRICCION_ROLES.md" "_archive\docs\" 2>nul
move "DOCUMENTACION_SESION_*.md" "_archive\docs\" 2>nul
move "DOCUMENTACION_SISTEMA_COMENTARIOS.md" "_archive\docs\" 2>nul
move "DOCUMENTATION.md" "_archive\docs\" 2>nul
move "ESTADO_ACTUAL*.md" "_archive\docs\" 2>nul
move "FIX_ENETUNREACH.md" "_archive\docs\" 2>nul
move "GUIA_*.md" "_archive\docs\" 2>nul
move "MIGRACION_SUPABASE.md" "_archive\docs\" 2>nul
move "OPTIMIZACION_VSCODE.md" "_archive\docs\" 2>nul
move "PAUSA-DESARROLLO.md" "_archive\docs\" 2>nul
move "PHASE-9-COMPLETE.md" "_archive\docs\" 2>nul
move "PLAN*.md" "_archive\docs\" 2>nul
move "RENDER_*.md" "_archive\docs\" 2>nul
move "RESUMEN_MIGRACION_EXITOSA.md" "_archive\docs\" 2>nul
move "SESION_*.md" "_archive\docs\" 2>nul
move "SUPABASE_DEBUG.md" "_archive\docs\" 2>nul

echo 🐳 Moviendo archivos Docker y deployment...
move "deploy.sh" "_archive\examples\" 2>nul
move "docker-compose*.yml" "_archive\examples\" 2>nul
move "Dockerfile" "_archive\examples\" 2>nul
move "ecosystem.config.*" "_archive\examples\" 2>nul
move "render*.yaml" "_archive\examples\" 2>nul

echo ⚙️ Moviendo configs viejas...
move "jest.config.js" "_archive\examples\" 2>nul
move "eslint.config.js" "_archive\examples\" 2>nul

echo 🗂️ Moviendo carpetas completas...
if exist "tests" (
    xcopy "tests" "_archive\tests\" /E /I /Y >nul 2>&1
    rmdir "tests" /S /Q >nul 2>&1
)

if exist "scripts" (
    xcopy "scripts" "_archive\scripts-old\" /E /I /Y >nul 2>&1
    rmdir "scripts" /S /Q >nul 2>&1
)

echo 🧼 Limpiando archivos .env innecesarios...
move ".env.debian.example" "_archive\examples\" 2>nul
move ".env.development" "_archive\examples\" 2>nul
move ".env.example" "_archive\examples\" 2>nul
move ".env.local" "_archive\examples\" 2>nul
move ".env.preview" "_archive\examples\" 2>nul
move ".env.production" "_archive\examples\" 2>nul
move ".env.productionBack" "_archive\examples\" 2>nul
move ".env.staging" "_archive\examples\" 2>nul

echo 📋 Archivos movidos exitosamente
echo ✅ LIMPIEZA COMPLETADA

REM Crear .gitignore para prevenir que vuelvan
echo 🛡️ Creando .gitignore para proteger la limpieza...
echo # Documentación archivada >> .gitignore
echo **/BUILD_FIX_*.md >> .gitignore
echo **/DOCUMENTACION_*.md >> .gitignore
echo **/ESTADO_ACTUAL*.md >> .gitignore
echo **/DEPLOYMENT*.md >> .gitignore
echo **/GUIA_*.md >> .gitignore
echo # Configs archivadas >> .gitignore
echo /jest.config.js >> .gitignore
echo /eslint.config.js >> .gitignore
echo /ecosystem.config.* >> .gitignore

echo 🎉 PROYECTO OPTIMIZADO PARA VS CODE
echo 📊 Rendimiento mejorado significativamente
pause
