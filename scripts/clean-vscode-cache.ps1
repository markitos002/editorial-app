# scripts/clean-vscode-cache.ps1 - Limpiar caché de VS Code

Write-Host "🧹 Limpiando caché de VS Code..." -ForegroundColor Yellow

# Verificar que VS Code esté cerrado
$codeProcesses = Get-Process | Where-Object {$_.ProcessName -like "*Code*"}
if ($codeProcesses) {
    Write-Host "⚠️  VS Code está ejecutándose. Cerrando procesos..." -ForegroundColor Yellow
    $codeProcesses | Stop-Process -Force
    Start-Sleep -Seconds 3
}

# Rutas de caché de VS Code
$userProfile = $env:USERPROFILE
$appData = $env:APPDATA

$cachePaths = @(
    "$appData\Code\User\workspaceStorage",
    "$appData\Code\logs",
    "$appData\Code\CachedExtensions",
    "$appData\Code\CachedExtensionVSIXs",
    "$userProfile\.vscode\extensions\.obsolete"
)

foreach ($path in $cachePaths) {
    if (Test-Path $path) {
        Write-Host "🗑️  Eliminando: $path" -ForegroundColor Cyan
        Remove-Item -Recurse -Force $path -ErrorAction SilentlyContinue
    }
}

# Limpiar archivos temporales del proyecto
Write-Host "🧹 Limpiando archivos temporales del proyecto..." -ForegroundColor Yellow

$projectTempPaths = @(
    "node_modules\.cache",
    "backend\node_modules\.cache",
    ".eslintcache",
    "cypress\videos",
    "cypress\screenshots",
    "dist",
    "build"
)

foreach ($path in $projectTempPaths) {
    if (Test-Path $path) {
        Write-Host "🗑️  Eliminando: $path" -ForegroundColor Cyan
        Remove-Item -Recurse -Force $path -ErrorAction SilentlyContinue
    }
}

Write-Host "✅ Limpieza completada!" -ForegroundColor Green
Write-Host "🔄 Reinicia VS Code para aplicar cambios" -ForegroundColor Yellow
