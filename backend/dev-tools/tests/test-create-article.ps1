# Test de crear artículo con curl

# Obtener token primero
$loginBody = @{
    email = "test2@test.com"
    contrasena = "123456"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token

Write-Host "Token obtenido exitosamente"

# Crear artículo usando curl
$curlCommand = @"
curl -X POST http://localhost:4000/api/articulos `
  -H "Authorization: Bearer $token" `
  -F "titulo=Artículo de Prueba" `
  -F "resumen=Este es un resumen de prueba para el artículo" `
  -F "area_tematica=cuidados-enfermeria" `
  -F "palabras_clave=[`"prueba`",`"test`",`"artículo`"]" `
  -F "archivo=@dev-tools/tests/test-article.md"
"@

Write-Host "Ejecutando comando curl..."
Write-Host $curlCommand

# Ejecutar el comando
Invoke-Expression $curlCommand
