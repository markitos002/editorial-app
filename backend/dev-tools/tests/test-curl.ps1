# Comandos curl para probar la API de Editorial
# Ejecuta estos comandos en PowerShell

# Variables
$BASE_URL = "http://localhost:4000"
$API_URL = "$BASE_URL/api"

# 1. Probar conexión al servidor
Write-Host "1. Probando conexión..." -ForegroundColor Yellow
curl $BASE_URL

# 2. Obtener todos los usuarios
Write-Host "`n2. Obteniendo todos los usuarios..." -ForegroundColor Yellow
curl -X GET "$API_URL/usuarios" -H "Content-Type: application/json"

# 3. Crear un nuevo usuario
Write-Host "`n3. Creando nuevo usuario..." -ForegroundColor Yellow
curl -X POST "$API_URL/usuarios" `
  -H "Content-Type: application/json" `
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan.perez@example.com",
    "contrasena": "123456",
    "rol": "editor"
  }'

# 4. Crear otro usuario
Write-Host "`n4. Creando segundo usuario..." -ForegroundColor Yellow
curl -X POST "$API_URL/usuarios" `
  -H "Content-Type: application/json" `
  -d '{
    "nombre": "María García",
    "email": "maria.garcia@example.com",
    "contrasena": "password123",
    "rol": "admin"
  }'

# 5. Obtener usuario por ID (cambiar ID según necesites)
Write-Host "`n5. Obteniendo usuario por ID..." -ForegroundColor Yellow
curl -X GET "$API_URL/usuarios/1" -H "Content-Type: application/json"

# 6. Actualizar usuario
Write-Host "`n6. Actualizando usuario..." -ForegroundColor Yellow
curl -X PUT "$API_URL/usuarios/1" `
  -H "Content-Type: application/json" `
  -d '{
    "nombre": "Juan Carlos Pérez Actualizado",
    "email": "juan.actualizado@example.com",
    "contrasena": "nuevacontrasena",
    "rol": "admin"
  }'

# 7. Eliminar usuario
Write-Host "`n7. Eliminando usuario..." -ForegroundColor Yellow
curl -X DELETE "$API_URL/usuarios/2" -H "Content-Type: application/json"

# 8. Intentar obtener usuario eliminado
Write-Host "`n8. Intentando obtener usuario eliminado..." -ForegroundColor Yellow
curl -X GET "$API_URL/usuarios/2" -H "Content-Type: application/json"

Write-Host "`nPruebas completadas!" -ForegroundColor Green
