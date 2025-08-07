Write-Host "INICIANDO OPTIMIZACION EXTREMA DE VS CODE..." -ForegroundColor Green

# Cerrar VS Code
Write-Host "Cerrando VS Code..." -ForegroundColor Yellow
Get-Process code -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep 3

# Limpiar cache
Write-Host "Limpiando cache de VS Code..." -ForegroundColor Yellow
$vscodeAppData = "$env:APPDATA\Code"
$vscodeCacheDir = "$vscodeAppData\CachedData"

if (Test-Path $vscodeCacheDir) {
    Remove-Item "$vscodeCacheDir\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Cache limpiado" -ForegroundColor Green
}

# Limpiar logs
$vscodeLogsDir = "$vscodeAppData\logs"
if (Test-Path $vscodeLogsDir) {
    Remove-Item "$vscodeLogsDir\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Logs limpiados" -ForegroundColor Green
}

# Limpiar workspace storage
$workspaceStorage = "$vscodeAppData\User\workspaceStorage"
if (Test-Path $workspaceStorage) {
    Get-ChildItem $workspaceStorage -Directory | ForEach-Object {
        $configFile = Join-Path $_.FullName "workspace.json"
        if (Test-Path $configFile) {
            $config = Get-Content $configFile | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($config.folder -like "*editorial-app*") {
                Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
                Write-Host "Workspace storage editorial-app limpiado" -ForegroundColor Green
            }
        }
    }
}

# Liberar memoria
Write-Host "Liberando memoria RAM..." -ForegroundColor Yellow
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()

# Estadisticas
Write-Host "ESTADISTICAS DEL SISTEMA:" -ForegroundColor Cyan
$memory = Get-WmiObject -Class Win32_OperatingSystem
$totalRAM = [math]::Round($memory.TotalVisibleMemorySize/1MB, 2)
$freeRAM = [math]::Round($memory.FreePhysicalMemory/1MB, 2)
$usedRAM = [math]::Round($totalRAM - $freeRAM, 2)

Write-Host "RAM Total: $totalRAM GB" -ForegroundColor White
Write-Host "RAM Libre: $freeRAM GB" -ForegroundColor Green
Write-Host "RAM Usada: $usedRAM GB" -ForegroundColor Yellow

Write-Host "OPTIMIZACION COMPLETADA!" -ForegroundColor Green
Write-Host "RECOMENDACIONES:" -ForegroundColor Cyan
Write-Host "1. Reinicia VS Code ahora" -ForegroundColor White
Write-Host "2. Abre SOLO el workspace editorial-app" -ForegroundColor White
Write-Host "3. No instales extensiones innecesarias" -ForegroundColor White

Write-Host "Presiona Enter para continuar..."
Read-Host
