// backend/routes/debug.js - Endpoint para diagnosticar conexión DB
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Endpoint para verificar conexión a la base de datos
router.get('/db-status', async (req, res) => {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test básico de conexión
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    
    // Test de query simple
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Query executed successfully');
    
    // Verificar tablas existentes
    const tablesResult = await client.query(`
      SELECT schemaname, tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);
    
    client.release();
    
    res.json({
      status: 'success',
      message: 'Database connection working',
      timestamp: result.rows[0].current_time,
      postgres_version: result.rows[0].pg_version,
      tables_count: tablesResult.rows.length,
      tables: tablesResult.rows.map(row => row.tablename),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL_exists: !!process.env.DATABASE_URL,
        DB_HOST: process.env.DB_HOST
      }
    });
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      code: error.code,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL_exists: !!process.env.DATABASE_URL,
        DB_HOST: process.env.DB_HOST
      }
    });
  }
});

// Endpoint para verificar variables de entorno
router.get('/env-check', (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL_exists: !!process.env.DATABASE_URL,
    DATABASE_URL_preview: process.env.DATABASE_URL ? 
      process.env.DATABASE_URL.substring(0, 30) + '...' : 'Not set',
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD_exists: !!process.env.DB_PASSWORD,
    JWT_SECRET_exists: !!process.env.JWT_SECRET
  });
});

module.exports = router;
