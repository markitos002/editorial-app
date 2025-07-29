#!/usr/bin/env node

/**
 * Health Check Script for Editorial App
 * Verifies that the application is running correctly
 */

import http from 'http';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
    timeout: 5000
  },
  backend: {
    url: process.env.BACKEND_URL || 'http://localhost:4000',
    timeout: 5000
  }
};

/**
 * Makes HTTP request and returns response status
 */
function makeRequest(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, { timeout }, (res) => {
      resolve({
        status: res.statusCode,
        headers: res.headers,
        url: url
      });
    });

    req.on('error', (error) => {
      reject({
        error: error.message,
        url: url
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        error: 'Request timeout',
        url: url
      });
    });
  });
}

/**
 * Check frontend health
 */
async function checkFrontend() {
  console.log('🔍 Checking Frontend...');
  try {
    const response = await makeRequest(CONFIG.frontend.url, CONFIG.frontend.timeout);
    
    if (response.status === 200) {
      console.log('✅ Frontend is healthy');
      return true;
    } else {
      console.log(`⚠️ Frontend returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Frontend check failed: ${error.error}`);
    return false;
  }
}

/**
 * Check backend health
 */
async function checkBackend() {
  console.log('🔍 Checking Backend...');
  try {
    const healthUrl = `${CONFIG.backend.url}/health`;
    const response = await makeRequest(healthUrl, CONFIG.backend.timeout);
    
    if (response.status === 200) {
      console.log('✅ Backend is healthy');
      return true;
    } else {
      console.log(`⚠️ Backend returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Backend check failed: ${error.error}`);
    return false;
  }
}

/**
 * Check database connectivity (via backend)
 */
async function checkDatabase() {
  console.log('🔍 Checking Database connectivity...');
  try {
    const dbUrl = `${CONFIG.backend.url}/api/health/db`;
    const response = await makeRequest(dbUrl, CONFIG.backend.timeout);
    
    if (response.status === 200) {
      console.log('✅ Database is accessible');
      return true;
    } else {
      console.log(`⚠️ Database check returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Database check failed: ${error.error}`);
    return false;
  }
}

/**
 * Main health check function
 */
async function runHealthCheck() {
  console.log('🏥 Starting Health Check for Editorial App');
  console.log('==========================================');
  
  const checks = {
    frontend: await checkFrontend(),
    backend: await checkBackend(),
    database: await checkDatabase()
  };

  console.log('\n📊 Health Check Results:');
  console.log('========================');
  console.log(`Frontend: ${checks.frontend ? '✅ Healthy' : '❌ Unhealthy'}`);
  console.log(`Backend:  ${checks.backend ? '✅ Healthy' : '❌ Unhealthy'}`);
  console.log(`Database: ${checks.database ? '✅ Healthy' : '❌ Unhealthy'}`);

  const allHealthy = Object.values(checks).every(check => check === true);
  
  if (allHealthy) {
    console.log('\n🎉 All systems are healthy!');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some systems are unhealthy. Please check the logs above.');
    process.exit(1);
  }
}

// Run health check if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runHealthCheck().catch((error) => {
    console.error('❌ Health check failed with error:', error);
    process.exit(1);
  });
}
