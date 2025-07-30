module.exports = {
  apps: [
    {
      name: 'editorial-app-backend',
      script: './backend/app.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_file: './logs/backend.log',
      out_file: './logs/backend-out.log',
      error_file: './logs/backend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'editorial-app-frontend',
      script: 'npm',
      args: 'run dev -- --host 0.0.0.0 --port 3000',
      cwd: '/home/markitos/projects/editorial-app',
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      log_file: './logs/frontend.log',
      out_file: './logs/frontend-out.log',
      error_file: './logs/frontend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
