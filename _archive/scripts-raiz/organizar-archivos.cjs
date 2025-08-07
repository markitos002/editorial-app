// Script para organizar archivos en la raíz del proyecto
const fs = require('fs');
const path = require('path');

function organizarArchivos() {
  console.log('📁 Organizando archivos en la raíz del proyecto...\n');

  // Crear directorios específicos en _archive
  const archiveDirs = {
    docs: './_archive/docs-raiz',
    scripts: './_archive/scripts-raiz', 
    duplicates: './_archive/duplicados'
  };

  Object.values(archiveDirs).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Creado: ${dir}`);
    }
  });

  // Archivos a mover categorizados
  const archivosAMover = [
    // Documentos de análisis y verificación
    { file: 'ANALISIS_RENDER_TAILSCALE.md', dest: archiveDirs.docs, type: 'Documento de análisis' },
    { file: 'BACKEND_VERIFICATION.md', dest: archiveDirs.docs, type: 'Documento de verificación' },
    { file: 'LIMPIEZA_COMPLETADA.md', dest: archiveDirs.docs, type: 'Documento de proceso' },
    { file: 'SISTEMA_UPLOAD_COMPLETADO.md', dest: archiveDirs.docs, type: 'Documento de sistema' },
    { file: 'README-LIMPIO.md', dest: archiveDirs.docs, type: 'Documento README alternativo' },

    // Scripts de limpieza y organización
    { file: 'archivar-tests.cjs', dest: archiveDirs.scripts, type: 'Script de archivado' },
    { file: 'limpiar-cache.cjs', dest: archiveDirs.scripts, type: 'Script de limpieza' },
    { file: 'limpieza-final.cjs', dest: archiveDirs.scripts, type: 'Script de limpieza' },
    { file: 'limpiar-proyecto.bat', dest: archiveDirs.scripts, type: 'Script batch' },
    { file: 'limpiar-vscode.ps1', dest: archiveDirs.scripts, type: 'Script PowerShell' },
    { file: 'optimizar-vscode.ps1', dest: archiveDirs.scripts, type: 'Script PowerShell' },

    // Archivos duplicados (versiones .js cuando existe .cjs)
    { file: 'archivar-tests.js', dest: archiveDirs.duplicates, type: 'Archivo duplicado' },
    { file: 'limpiar-cache.js', dest: archiveDirs.duplicates, type: 'Archivo duplicado' },

    // Configuraciones optimizadas alternativas
    { file: '.gitignore-optimized', dest: archiveDirs.scripts, type: 'Configuración alternativa' }
  ];

  let moved = 0;
  let errors = 0;

  archivosAMover.forEach(({ file, dest, type }) => {
    const srcPath = `./${file}`;
    const destPath = path.join(dest, file);

    try {
      if (fs.existsSync(srcPath) && fs.statSync(srcPath).isFile()) {
        fs.renameSync(srcPath, destPath);
        console.log(`✅ ${type}: ${file}`);
        moved++;
      } else {
        console.log(`⚠️  No encontrado: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error moviendo ${file}:`, error.message);
      errors++;
    }
  });

  // Mostrar resumen
  console.log('\n📊 RESUMEN DE ORGANIZACIÓN:');
  console.log(`   📄 Documentos archivados: ${archivosAMover.filter(a => a.dest === archiveDirs.docs).length}`);
  console.log(`   🔧 Scripts archivados: ${archivosAMover.filter(a => a.dest === archiveDirs.scripts).length}`);
  console.log(`   📋 Duplicados archivados: ${archivosAMover.filter(a => a.dest === archiveDirs.duplicates).length}`);
  console.log(`   ✅ Total movido: ${moved}`);
  if (errors > 0) console.log(`   ❌ Errores: ${errors}`);

  console.log('\n🧹 ARCHIVOS MANTENIDOS EN RAÍZ:');
  console.log('   ✓ package.json, vite.config.js, jsconfig.json');
  console.log('   ✓ README.md, ARCHIVADO_COMPLETADO.md');
  console.log('   ✓ index.html, .env, .gitignore');
  console.log('   ✓ Carpetas: src/, backend/, public/, _archive/');

  console.log('\n🎉 Organización completada!');
}

if (require.main === module) {
  organizarArchivos();
}

module.exports = { organizarArchivos };
