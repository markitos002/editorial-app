// Script para identificar y eliminar archivos vacíos no críticos
const fs = require('fs');
const path = require('path');

function encontrarArchivosVacios(dirPath, archivosVacios = []) {
  try {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recursivo para subdirectorios, pero evitar algunas carpetas
        if (!['node_modules', '.git', 'dist', 'build', 'uploads'].includes(item)) {
          encontrarArchivosVacios(fullPath, archivosVacios);
        }
      } else if (stat.isFile() && stat.size === 0) {
        archivosVacios.push(fullPath);
      }
    });
  } catch (error) {
    console.error(`Error leyendo directorio ${dirPath}:`, error.message);
  }
  
  return archivosVacios;
}

function esArchivoCritico(filePath) {
  const fileName = path.basename(filePath);
  const extension = path.extname(fileName).toLowerCase();
  const dirName = path.dirname(filePath);
  
  // Archivos críticos que NO deben eliminarse aunque estén vacíos
  const archivosCriticos = [
    // Archivos de configuración importantes
    '.env', '.env.local', '.env.production', '.env.development',
    '.gitignore', '.gitkeep', 
    'package.json', 'package-lock.json',
    'tsconfig.json', 'jsconfig.json',
    'vite.config.js', 'webpack.config.js',
    'tailwind.config.js', 'postcss.config.js',
    
    // Archivos de aplicación importantes
    'app.js', 'server.js', 'index.js', 'main.js',
    'App.jsx', 'index.jsx', 'main.jsx',
    
    // Archivos README
    'README.md', 'readme.md'
  ];
  
  // Extensiones críticas
  const extensionesCriticas = ['.js', '.jsx', '.ts', '.tsx', '.json'];
  
  // Directorios donde los archivos vacíos pueden ser críticos
  const directoriosCriticos = ['src', 'backend', 'controllers', 'routes', 'services', 'middlewares'];
  
  // Verificar si es un archivo crítico por nombre
  if (archivosCriticos.includes(fileName)) {
    return true;
  }
  
  // Verificar si está en un directorio crítico y tiene extensión crítica
  const esDirCritico = directoriosCriticos.some(dir => dirName.includes(dir));
  if (esDirCritico && extensionesCriticas.includes(extension)) {
    return true;
  }
  
  return false;
}

function limpiarArchivosVacios() {
  console.log('🔍 Buscando archivos vacíos...\n');
  
  const archivosVacios = encontrarArchivosVacios('.');
  
  console.log(`📊 Encontrados ${archivosVacios.length} archivos vacíos\n`);
  
  if (archivosVacios.length === 0) {
    console.log('✅ No se encontraron archivos vacíos');
    return;
  }
  
  let eliminados = 0;
  let preservados = 0;
  
  console.log('📋 ANÁLISIS DE ARCHIVOS VACÍOS:\n');
  
  archivosVacios.forEach(archivo => {
    const relativePath = path.relative('.', archivo);
    const esCritico = esArchivoCritico(archivo);
    
    if (esCritico) {
      console.log(`⚠️  PRESERVADO (crítico): ${relativePath}`);
      preservados++;
    } else {
      try {
        // Verificar que el archivo aún existe y está vacío antes de eliminar
        if (fs.existsSync(archivo) && fs.statSync(archivo).size === 0) {
          fs.unlinkSync(archivo);
          console.log(`🗑️  ELIMINADO: ${relativePath}`);
          eliminados++;
        }
      } catch (error) {
        console.error(`❌ Error eliminando ${relativePath}:`, error.message);
      }
    }
  });
  
  console.log('\n📊 RESUMEN:');
  console.log(`   🗑️  Archivos eliminados: ${eliminados}`);
  console.log(`   ⚠️  Archivos preservados (críticos): ${preservados}`);
  console.log(`   📁 Total procesados: ${archivosVacios.length}`);
  
  if (eliminados > 0) {
    console.log('\n🎉 Limpieza de archivos vacíos completada!');
    console.log('💡 Se eliminaron archivos vacíos no críticos para optimizar el workspace');
  }
}

if (require.main === module) {
  limpiarArchivosVacios();
}

module.exports = { limpiarArchivosVacios, encontrarArchivosVacios };
