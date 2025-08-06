#!/usr/bin/env node

/**
 * Post-build validation script
 * Verifies that the production build is ready for deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_PATH = path.join(__dirname, '../dist');
const REQUIRED_FILES = [
  'index.html',
  'assets',
  'vite.svg'
];

const REQUIRED_ASSETS = [
  'index.css',
  'index.js'
];

/**
 * Check if build directory exists
 */
function checkBuildDirectory() {
  console.log('🔍 Checking build directory...');
  
  if (!fs.existsSync(DIST_PATH)) {
    console.error('❌ Build directory not found: dist/');
    return false;
  }
  
  console.log('✅ Build directory exists');
  return true;
}

/**
 * Check required files
 */
function checkRequiredFiles() {
  console.log('🔍 Checking required files...');
  
  for (const file of REQUIRED_FILES) {
    const filePath = path.join(DIST_PATH, file);
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Required file missing: ${file}`);
      return false;
    }
  }
  
  console.log('✅ All required files present');
  return true;
}

/**
 * Check assets directory
 */
function checkAssetsDirectory() {
  console.log('🔍 Checking assets directory...');
  
  const assetsPath = path.join(DIST_PATH, 'assets');
  
  if (!fs.existsSync(assetsPath)) {
    console.error('❌ Assets directory not found');
    return false;
  }
  
  const assetFiles = fs.readdirSync(assetsPath);
  
  // Check for CSS files
  const cssFiles = assetFiles.filter(file => file.endsWith('.css'));
  if (cssFiles.length === 0) {
    console.error('❌ No CSS files found in assets');
    return false;
  }
  
  // Check for JS files
  const jsFiles = assetFiles.filter(file => file.endsWith('.js'));
  if (jsFiles.length === 0) {
    console.error('❌ No JavaScript files found in assets');
    return false;
  }
  
  console.log(`✅ Assets directory contains ${cssFiles.length} CSS and ${jsFiles.length} JS files`);
  return true;
}

/**
 * Check file sizes
 */
function checkFileSizes() {
  console.log('🔍 Checking file sizes...');
  
  const assetsPath = path.join(DIST_PATH, 'assets');
  const assetFiles = fs.readdirSync(assetsPath);
  
  let totalSize = 0;
  let warnings = [];
  
  for (const file of assetFiles) {
    const filePath = path.join(assetsPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = Math.round(stats.size / 1024);
    
    totalSize += sizeKB;
    
    // Warn about large files
    if (sizeKB > 500) {
      warnings.push(`⚠️ Large file: ${file} (${sizeKB}KB)`);
    }
    
    console.log(`  ${file}: ${sizeKB}KB`);
  }
  
  console.log(`📊 Total asset size: ${totalSize}KB`);
  
  if (warnings.length > 0) {
    console.log('\n⚠️ Size warnings:');
    warnings.forEach(warning => console.log(warning));
  }
  
  // Alert if total size is very large
  if (totalSize > 2000) {
    console.log(`⚠️ Total asset size is large (${totalSize}KB). Consider code splitting.`);
  }
  
  return true;
}

/**
 * Check index.html content
 */
function checkIndexHtml() {
  console.log('🔍 Checking index.html...');
  
  const indexPath = path.join(DIST_PATH, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf8');
  
  // Check for essential elements
  const checks = [
    { name: 'DOCTYPE', pattern: /<!DOCTYPE html>/i },
    { name: 'root div', pattern: /<div id="root">/i },
    { name: 'CSS link', pattern: /<link[^>]*\.css/i },
    { name: 'JS script', pattern: /<script[^>]*\.js/i }
  ];
  
  for (const check of checks) {
    if (!check.pattern.test(content)) {
      console.error(`❌ Missing ${check.name} in index.html`);
      return false;
    }
  }
  
  console.log('✅ index.html structure is valid');
  return true;
}

/**
 * Generate build report
 */
function generateBuildReport() {
  console.log('\n📊 Build Report');
  console.log('===============');
  
  const assetsPath = path.join(DIST_PATH, 'assets');
  const assetFiles = fs.readdirSync(assetsPath);
  
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: assetFiles.length,
    cssFiles: assetFiles.filter(f => f.endsWith('.css')).length,
    jsFiles: assetFiles.filter(f => f.endsWith('.js')).length,
    mapFiles: assetFiles.filter(f => f.endsWith('.map')).length,
    totalSize: 0
  };
  
  // Calculate total size
  for (const file of assetFiles) {
    const filePath = path.join(assetsPath, file);
    const stats = fs.statSync(filePath);
    report.totalSize += stats.size;
  }
  
  report.totalSizeKB = Math.round(report.totalSize / 1024);
  
  // Save report
  const reportPath = path.join(DIST_PATH, 'build-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`Files: ${report.totalFiles} (${report.cssFiles} CSS, ${report.jsFiles} JS)`);
  console.log(`Size: ${report.totalSizeKB}KB`);
  console.log(`Report saved: ${reportPath}`);
}

/**
 * Main validation function
 */
async function validateBuild() {
  console.log('🏗️ Post-build Validation for Editorial App');
  console.log('==========================================\n');
  
  const checks = [
    checkBuildDirectory,
    checkRequiredFiles,
    checkAssetsDirectory,
    checkFileSizes,
    checkIndexHtml
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    if (!check()) {
      allPassed = false;
      break;
    }
    console.log('');
  }
  
  if (allPassed) {
    generateBuildReport();
    console.log('\n🎉 Build validation passed! Ready for deployment.');
    process.exit(0);
  } else {
    console.log('\n❌ Build validation failed. Please fix the issues above.');
    process.exit(1);
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateBuild().catch((error) => {
    console.error('❌ Validation failed with error:', error);
    process.exit(1);
  });
}
