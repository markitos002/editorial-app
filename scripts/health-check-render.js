// Health check script for Render
const express = require('express');
const pool = require('../backend/db');

async function healthCheck() {
  try {
    console.log('🏥 Starting health check...');
    
    // Test database connection
    const dbResult = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Database connection OK:', dbResult.rows[0].current_time);
    
    // Test basic API endpoint
    const response = await fetch(`${process.env.BASE_URL || 'http://localhost:4000'}/health`);
    
    if (response.ok) {
      console.log('✅ API endpoint OK');
      return true;
    } else {
      console.log('❌ API endpoint failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

// Export for use in other scripts
module.exports = healthCheck;

// Run if called directly
if (require.main === module) {
  healthCheck()
    .then(result => {
      console.log(result ? '✅ All systems healthy' : '❌ System unhealthy');
      process.exit(result ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Health check crashed:', error);
      process.exit(1);
    });
}
