# 🧹 LIMPIEZA COMPLETA DE VS CODE - OPTIMIZACIÓN EXTREMA
# Script para resolver problemas de rendimiento de VS Code

Write-Host "🚀 INICIANDO OPTIMIZACIÓN EXTREMA DE VS CODE..." -ForegroundColor Green

# 1. Cerrar todas las instancias de VS Code
Write-Host "⏹️ Cerrando VS Code..." -ForegroundColor Yellow
Get-Process code -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep 3

# 2. Limpiar caché de VS Code
Write-Host "🧼 Limpiando caché de VS Code..." -ForegroundColor Yellow
$vscodeAppData = "$env:APPDATA\Code"
$vscodeCacheDir = "$vscodeAppData\CachedData"
$vscodeUserData = "$vscodeAppData\User"

if (Test-Path $vscodeCacheDir) {
    Remove-Item "$vscodeCacheDir\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✅ Cache limpiado" -ForegroundColor Green
}

# 3. Limpiar logs
$vscodeLogsDir = "$vscodeAppData\logs"
if (Test-Path $vscodeLogsDir) {
    Remove-Item "$vscodeLogsDir\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✅ Logs limpiados" -ForegroundColor Green
}

# 4. Limpiar workspace storage
$workspaceStorage = "$vscodeAppData\User\workspaceStorage"
if (Test-Path $workspaceStorage) {
    Get-ChildItem $workspaceStorage -Directory | ForEach-Object {
        $configFile = Join-Path $_.FullName "workspace.json"
        if (Test-Path $configFile) {
            $config = Get-Content $configFile | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($config.folder -like "*editorial-app*") {
                Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
                Write-Host "  ✅ Workspace storage editorial-app limpiado" -ForegroundColor Green
            }
        }
    }
}

# 5. Optimizar sistema operativo
Write-Host "🔧 Optimizando sistema..." -ForegroundColor Yellow

# Limpiar archivos temporales del sistema
$tempFolders = @(
    $env:TEMP,
    "$env:LOCALAPPDATA\Temp",
    "$env:SYSTEMROOT\Temp"
)

foreach ($folder in $tempFolders) {
    if (Test-Path $folder) {
        Get-ChildItem $folder -File | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-1) } | Remove-Item -Force -ErrorAction SilentlyContinue
    }
}

# 6. Liberar memoria RAM
Write-Host "💾 Liberando memoria RAM..." -ForegroundColor Yellow
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()

# 7. Configurar prioridades de proceso para VS Code
$processOptimization = @"
# Configuración para mejorar prioridad de VS Code
Get-Process code -ErrorAction SilentlyContinue | ForEach-Object { 
    `$_.PriorityClass = 'High' 
}
"@

$processOptimization | Out-File -FilePath "$PSScriptRoot\optimize-vscode-process.ps1" -Encoding UTF8

# 8. Mostrar estadísticas del sistema
Write-Host "📊 ESTADÍSTICAS DEL SISTEMA:" -ForegroundColor Cyan
$memory = Get-WmiObject -Class Win32_OperatingSystem
$totalRAM = [math]::Round($memory.TotalVisibleMemorySize/1MB, 2)
$freeRAM = [math]::Round($memory.FreePhysicalMemory/1MB, 2)
$usedRAM = [math]::Round($totalRAM - $freeRAM, 2)

Write-Host "  RAM Total: $totalRAM GB" -ForegroundColor White
Write-Host "  RAM Libre: $freeRAM GB" -ForegroundColor Green
Write-Host "  RAM Usada: $usedRAM GB" -ForegroundColor $(if($usedRAM -gt ($totalRAM * 0.8)) { "Red" } else { "Yellow" })

# 9. Verificar procesos de VS Code
$vscodeProcesses = Get-Process code -ErrorAction SilentlyContinue
if ($vscodeProcesses) {
    Write-Host "⚠️ Procesos de VS Code aún activos:" -ForegroundColor Red
    $vscodeProcesses | ForEach-Object {
        Write-Host "  PID: $($_.Id) | CPU: $($_.CPU) | RAM: $([math]::Round($_.WorkingSet/1MB, 2)) MB" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ No hay procesos de VS Code activos" -ForegroundColor Green
}

Write-Host "`n🎉 OPTIMIZACIÓN COMPLETADA!" -ForegroundColor Green
Write-Host "📋 RECOMENDACIONES:" -ForegroundColor Cyan
Write-Host "  1. Reinicia VS Code ahora" -ForegroundColor White
Write-Host "  2. Abre SOLO el workspace editorial-app" -ForegroundColor White
Write-Host "  3. No instales extensiones innecesarias" -ForegroundColor White
Write-Host "  4. Usa Ctrl+Shift+P y luego Reload Window si esta lento" -ForegroundColor White

Write-Host "`nPresiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
