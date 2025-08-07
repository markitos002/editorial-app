// Script para archivar archivos de test, debug y SQL no necesarios
const fs = require('fs');
const path = require('path');

function moverArchivos() {
  console.log('🗂️  Iniciando archivado de archivos de desarrollo...\n');

  // Crear directorios de destino
  const archiveDirs = {
    tests: './_archive/tests-old',
    debug: './_archive/debug-old', 
    sql: './_archive/sql-old'
  };

  Object.values(archiveDirs).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Creado directorio: ${dir}`);
    }
  });

  const backendDir = './backend';
  const files = fs.readdirSync(backendDir);
  let stats = { tests: 0, debug: 0, sql: 0, check: 0 };

  files.forEach(file => {
    const srcPath = path.join(backendDir, file);
    let destPath = null;
    let category = null;

    // Clasificar archivos
    if (file.startsWith('test-') && file.endsWith('.js')) {
      destPath = path.join(archiveDirs.tests, file);
      category = 'tests';
    }
    else if (file.startsWith('debug-') && file.endsWith('.js')) {
      destPath = path.join(archiveDirs.debug, file);
      category = 'debug';
    }
    else if (file.startsWith('check-') && file.endsWith('.js')) {
      destPath = path.join(archiveDirs.tests, file);
      category = 'check';
    }
    else if (file.endsWith('.sql')) {
      // Solo mover algunos SQL específicos, no todos
      const sqlsToMove = [
        'add-archivo-blob-column.sql',
        'add-archivo-url-column.sql', 
        'add-article-columns.sql',
        'add-revision-columns.sql',
        'create-comentarios-table.sql',
        'create-notificaciones-table.sql',
        'create-notificaciones-system.sql',
        'grant-permissions.sql',
        'update-estados.sql'
      ];
      
      if (sqlsToMove.includes(file)) {
        destPath = path.join(archiveDirs.sql, file);
        category = 'sql';
      }
    }

    // Mover archivo si aplica
    if (destPath && category) {
      try {
        if (fs.existsSync(srcPath) && fs.statSync(srcPath).isFile()) {
          fs.renameSync(srcPath, destPath);
          console.log(`✅ ${category.toUpperCase()}: ${file}`);
          stats[category]++;
        }
      } catch (error) {
        console.error(`❌ Error moviendo ${file}:`, error.message);
      }
    }
  });

  // Mostrar resumen
  console.log('\n📊 RESUMEN DE ARCHIVADO:');
  console.log(`   🧪 Tests archivados: ${stats.tests}`);
  console.log(`   🔍 Debug archivados: ${stats.debug}`);
  console.log(`   🗃️  Check archivados: ${stats.check}`);
  console.log(`   💾 SQL archivados: ${stats.sql}`);
  console.log(`   📦 Total archivado: ${Object.values(stats).reduce((a,b) => a+b, 0)}`);

  console.log('\n🎉 Archivado completado!');
  console.log('💡 Archivos movidos a _archive/ para mejor rendimiento de VS Code');
}

// Ejecutar
if (require.main === module) {
  moverArchivos();
}

module.exports = { moverArchivos };
