module.exports = {
  apps: [
    {
      name: 'editorial-app-backend',
      script: './app.js',
      instances: 1,
      exec_mode: 'fork',
      cwd: './backend',
      env_file: './.env',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_NAME: 'editorialdata',
        DB_USER: 'markitos',
        DB_PASSWORD: '123456',
        JWT_SECRET: '$%^Tdasd9529841#$&*9dascaseASDeqQQasdcEasdc$##@33',
        JWT_EXPIRES_IN: '24h'
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
      args: 'run dev -- --host 0.0.0.0 --port 5173',
      cwd: './',
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
