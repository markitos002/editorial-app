# 🚀 Guía de Optimización: VS Code - Alto Consumo de Recursos

## 🎯 Diagnóstico Inicial

### **1. Verificar Procesos de VS Code**
```powershell
# En PowerShell (Windows)
Get-Process | Where-Object {$_.ProcessName -like "*Code*"} | Select-Object ProcessName, CPU, WorkingSet64 | Sort-Object WorkingSet64 -Descending

# En Task Manager busca:
# - Code.exe (proceso principal)
# - Code - extensionHost (extensiones)
# - Code - node (Language Servers)
```

### **2. Identificar Extensiones Problemáticas**
1. **Abrir Command Palette**: `Ctrl+Shift+P`
2. **Ejecutar**: `Developer: Reload Window With Extensions Disabled`
3. **Comparar rendimiento** sin extensiones

## ⚡ **Soluciones Inmediatas**

### **A. Configuración de Performance**

```json
// settings.json - Agregar estas configuraciones
{
  // Limitar búsquedas
  "search.followSymlinks": false,
  "search.useIgnoreFiles": true,
  "search.useParentIgnoreFiles": true,
  
  // Optimizar file watching
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/tmp/**": true,
    "**/dist/**": true,
    "**/build/**": true,
    "**/.vscode/**": true,
    "**/coverage/**": true,
    "**/.nyc_output/**": true
  },
  
  // Reducir procesamiento de archivos
  "files.exclude": {
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.vscode": false
  },
  
  // Optimizar IntelliSense
  "typescript.disableAutomaticTypeAcquisition": true,
  "typescript.suggest.autoImports": false,
  "javascript.suggest.autoImports": false,
  
  // Limitar procesos en segundo plano
  "extensions.autoUpdate": false,
  "update.mode": "manual",
  
  // Optimizar renderizado
  "editor.minimap.enabled": false,
  "editor.renderControlCharacters": false,
  "editor.renderWhitespace": "none",
  "workbench.enableExperiments": false
}
```

### **B. Exclusiones Específicas para tu Proyecto**

```json
// .vscode/settings.json - Configuración local del proyecto
{
  "search.exclude": {
    "**/node_modules": true,
    "**/backend/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.git": true,
    "**/coverage": true,
    "**/cypress/videos": true,
    "**/cypress/screenshots": true,
    "**/uploads": true,
    "**/*.log": true
  },
  
  "files.watcherExclude": {
    "**/backend/dev-tools/**": true,
    "**/scripts/**": true,
    "**/*.md": true,
    "**/test-*.js": true,
    "**/debug-*.js": true
  }
}
```

## 🧪 **Extensiones Críticas a Revisar**

### **Extensiones que suelen consumir muchos recursos:**
1. **ESLint** - Puede ser pesado en proyectos grandes
2. **Prettier** - Formateo en tiempo real
3. **GitLens** - Procesa mucho historial de Git
4. **IntelliCode** - IA en tiempo real
5. **Auto Import** - Indexa constantemente
6. **Bracket Pair Colorizer** - Reemplazado por función nativa

### **Configuración optimizada para extensiones:**

```json
{
  // ESLint - Solo validar en guardado
  "eslint.run": "onSave",
  "eslint.validate": ["javascript", "javascriptreact"],
  
  // Prettier - Solo manual
  "editor.formatOnSave": false,
  "editor.formatOnType": false,
  
  // GitLens - Reducir features
  "gitlens.codeLens.enabled": false,
  "gitlens.currentLine.enabled": false,
  "gitlens.hovers.enabled": false,
  
  // IntelliCode - Deshabilitar
  "vsintellicode.modify.editor.suggestSelection": "disabled"
}
```

## 🔧 **Acciones Específicas**

### **1. Limpiar Caché de VS Code**
```powershell
# Cerrar VS Code completamente
# Eliminar caché (Windows)
Remove-Item -Recurse -Force "$env:APPDATA\Code\User\workspaceStorage"
Remove-Item -Recurse -Force "$env:APPDATA\Code\logs"
Remove-Item -Recurse -Force "$env:APPDATA\Code\CachedExtensions"
```

### **2. Reiniciar Language Servers**
```
Ctrl+Shift+P → "Developer: Restart Extension Host"
```

### **3. Verificar Workspace específico**
```
Ctrl+Shift+P → "Developer: Show Running Extensions"
```

## 📊 **Monitoreo Continuo**

### **Comando para ver performance:**
```
Ctrl+Shift+P → "Developer: Open Process Explorer"
```

### **Ver logs de extensiones:**
```
Ctrl+Shift+P → "Developer: Toggle Developer Tools"
Console → Buscar errores/warnings
```

## 🎯 **Plan de Optimización Inmediato**

1. **Deshabilitar extensiones no esenciales**
2. **Aplicar configuraciones de performance**
3. **Limpiar caché**
4. **Reiniciar VS Code**
5. **Monitorear mejora**

¿Quieres que creemos estos archivos de configuración optimizada para tu proyecto?
