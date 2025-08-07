// limpiar-cache.js - Script para limpiar archivos temporales y optimizar rendimiento
const fs = require('fs');
const path = require('path');

function limpiarDirectorio(dirPath, extensions = []) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`📂 Directorio no existe: ${dirPath}`);
      return;
    }

    const files = fs.readdirSync(dirPath);
    let eliminados = 0;

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        if (extensions.length === 0 || extensions.includes(ext)) {
          fs.unlinkSync(filePath);
          eliminados++;
          console.log(`🗑️  Eliminado: ${file}`);
        }
      }
    });

    console.log(`✅ ${eliminados} archivos eliminados de ${dirPath}`);
  } catch (error) {
    console.error(`❌ Error limpiando ${dirPath}:`, error.message);
  }
}

function limpiarProyecto() {
  console.log('🧹 Iniciando limpieza de archivos temporales...\n');

  // Limpiar logs
  console.log('📝 Limpiando archivos de log...');
  limpiarDirectorio('.', ['.log']);
  limpiarDirectorio('./backend', ['.log']);
  
  // Limpiar archivos temporales de Node
  console.log('\n🔧 Limpiando archivos temporales de Node...');
  limpiarDirectorio('.', ['.tmp', '.temp']);
  limpiarDirectorio('./backend', ['.tmp', '.temp']);
  
  // Limpiar caché de npm si existe
  console.log('\n📦 Limpiando información de caché...');
  if (fs.existsSync('.npm')) {
    console.log('🗑️  Directorio .npm encontrado (se puede eliminar manualmente)');
  }
  
  // Estadísticas de archivos grandes en uploads
  console.log('\n📁 Verificando directorio uploads...');
  const uploadsDir = './backend/uploads';
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    let totalSize = 0;
    
    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          totalSize += stat.size;
        }
      } catch (error) {
        // Ignorar errores de archivos individuales
      }
    });
    
    console.log(`📊 ${files.length} archivos en uploads (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
    
    if (totalSize > 50 * 1024 * 1024) { // Más de 50MB
      console.log('⚠️  Directorio uploads es grande, considera mover archivos viejos');
    }
  }
  
  console.log('\n🎉 Limpieza completada!');
  console.log('\n💡 Para mejor rendimiento:');
  console.log('   - Reinicia VS Code después de esta limpieza');
  console.log('   - Considera cerrar pestañas innecesarias');
  console.log('   - Usa Ctrl+Shift+P > "Developer: Restart Extension Host"');
}

// Ejecutar limpieza
if (require.main === module) {
  limpiarProyecto();
}

module.exports = { limpiarProyecto, limpiarDirectorio };
