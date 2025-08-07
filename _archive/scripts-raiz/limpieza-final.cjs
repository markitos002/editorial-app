// Script final para limpiar archivos de desarrollo restantes
const fs = require('fs');
const path = require('path');

function limpiezaFinal() {
  console.log('🧹 Limpieza final de archivos de desarrollo...\n');

  const archiveDirs = {
    tests: './_archive/tests-old',
    scripts: './_archive/scripts-old',
    dev: './_archive/dev-old'
  };

  // Crear directorios si no existen
  Object.values(archiveDirs).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const backendDir = './backend';
  const files = fs.readdirSync(backendDir);
  let moved = 0;

  // Archivos específicos a mover
  const filesToMove = [
    // Scripts de testing
    { file: 'test-articulos.http', dest: archiveDirs.tests, type: 'HTTP Test' },
    { file: 'test-endpoints.http', dest: archiveDirs.tests, type: 'HTTP Test' },
    { file: 'test-curl.ps1', dest: archiveDirs.tests, type: 'PowerShell Test' },
    
    // Scripts de desarrollo
    { file: 'investigar-tabla.js', dest: archiveDirs.dev, type: 'Dev Script' },
    { file: 'revisar-bd.js', dest: archiveDirs.dev, type: 'Dev Script' },
    { file: 'update-admin-password.js', dest: archiveDirs.scripts, type: 'Utility Script' },
    { file: 'update-articles-for-files.js', dest: archiveDirs.scripts, type: 'Utility Script' },
    { file: 'update-revision-table.js', dest: archiveDirs.scripts, type: 'Utility Script' },
    { file: 'migrate-columns.js', dest: archiveDirs.scripts, type: 'Migration Script' },
    { file: 'add-missing-columns.js', dest: archiveDirs.scripts, type: 'Migration Script' },
    { file: 'create-comentarios-structure.js', dest: archiveDirs.scripts, type: 'Structure Script' },
    { file: 'create-notificaciones-migration.js', dest: archiveDirs.scripts, type: 'Migration Script' },
    
    // Scripts de verificación
    { file: 'verify-database.js', dest: archiveDirs.dev, type: 'Verify Script' },
    { file: 'verify-notificaciones-table.js', dest: archiveDirs.dev, type: 'Verify Script' },
    { file: 'verify-usuarios-table.js', dest: archiveDirs.dev, type: 'Verify Script' },
    
    // Archivos SQL restantes
    { file: 'restore-database.sql', dest: archiveDirs.scripts, type: 'SQL Script' },
    { file: 'setup-database.sql', dest: archiveDirs.scripts, type: 'SQL Script' }
  ];

  filesToMove.forEach(({ file, dest, type }) => {
    const srcPath = path.join(backendDir, file);
    const destPath = path.join(dest, file);

    try {
      if (fs.existsSync(srcPath) && fs.statSync(srcPath).isFile()) {
        fs.renameSync(srcPath, destPath);
        console.log(`✅ ${type}: ${file}`);
        moved++;
      }
    } catch (error) {
      console.error(`❌ Error moviendo ${file}:`, error.message);
    }
  });

  console.log(`\n📦 Total archivos movidos: ${moved}`);
  console.log('🎉 Limpieza final completada!');
  console.log('\n💡 Archivos importantes mantenidos:');
  console.log('   ✓ app.js (servidor principal)');
  console.log('   ✓ package.json');
  console.log('   ✓ setup-supabase-storage.js');
  console.log('   ✓ Carpetas: controllers/, routes/, services/, etc.');
}

if (require.main === module) {
  limpiezaFinal();
}

module.exports = { limpiezaFinal };
