module.exports = {
  apps: [
    {
      name: 'editorial-app-backend',
      script: './backend/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 4000
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 4000,
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET
      },
      // Logging
      log_file: './logs/app.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Process management
      min_uptime: '10s',
      max_restarts: 5,
      max_memory_restart: '500M',
      
      // Monitoring
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      
      // Health check
      health_check_http: {
        url: 'http://localhost:4000/health',
        interval: 30000,
        timeout: 5000
      }
    }
  ],

  deploy: {
    staging: {
      user: 'deployer',
      host: 'staging.editorial-app.com',
      ref: 'origin/develop',
      repo: 'git@github.com:markitos002/editorial-app.git',
      path: '/var/www/editorial-app-staging',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build:staging && pm2 reload ecosystem.config.js --env staging',
      'pre-setup': ''
    },
    
    production: {
      user: 'deployer',
      host: ['prod1.editorial-app.com', 'prod2.editorial-app.com'],
      ref: 'origin/main',
      repo: 'git@github.com:markitos002/editorial-app.git',
      path: '/var/www/editorial-app-production',
      'pre-deploy-local': 'npm run test:all',
      'post-deploy': 'npm ci --only=production && npm run build:production && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'mkdir -p /var/www/editorial-app-production/logs'
    }
  }
};
