const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db'); // Esto importa y ejecuta la conexión automáticamente

const app = express();

// Middlewares
// Configurar CORS para permitir acceso desde Tailscale, localhost y Render
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (aplicaciones móviles, postman, etc.)
    if (!origin) return callback(null, true);
    
    // Permitir localhost y 127.0.0.1
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Permitir IPs de Tailscale (100.x.x.x)
    if (origin.match(/100\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
      return callback(null, true);
    }
    
    // Permitir cualquier IP local (192.168.x.x, 10.x.x.x, etc.)
    if (origin.match(/192\.168\.\d{1,3}\.\d{1,3}/) || origin.match(/10\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
      return callback(null, true);
    }
    
    // Permitir dominios de Render (.onrender.com)
    if (origin.includes('.onrender.com')) {
      return callback(null, true);
    }
    
    // Permitir dominios de Render preview (.render.com)
    if (origin.includes('.render.com')) {
      return callback(null, true);
    }
    
    console.log('🔍 CORS origin check:', origin);
    return callback(null, true); // Permitir todos los orígenes para desarrollo
  },
  credentials: true
}));
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// Rutas
const usuariosRoutes = require('./routes/usuariosRoutes');
const articulosRoutes = require('./routes/articulosRoutes');
const revisionesRoutes = require('./routes/revisionesRoutes');
const notificacionesRoutes = require('./routes/notificacionesRoutes');
const authRoutes = require('./routes/authRoutes');
const estadisticasRoutes = require('./routes/estadisticasRoutes');
const asignacionesRoutes = require('./routes/asignacionesRoutes');
const revisionDocumentosRoutes = require('./routes/revisionDocumentosRoutes');
const comentariosRoutes = require('./routes/comentariosRoutes');
const busquedaRoutes = require('./routes/busquedaRoutes');
const debugRoutes = require('./routes/debug');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/articulos', articulosRoutes);
app.use('/api/revisiones', revisionesRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/asignaciones', asignacionesRoutes);
app.use('/api/revision-documentos', revisionDocumentosRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/busqueda', busquedaRoutes);
app.use('/api/debug', debugRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'editorial-app-backend'
  });
});

// Database health check endpoint
app.get('/api/health/db', (req, res) => {
  const pool = require('./db');
  
  pool.query('SELECT NOW() as timestamp', (err, result) => {
    if (err) {
      console.error('Database health check failed:', err);
      return res.status(500).json({
        status: 'unhealthy',
        error: 'Database connection failed',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      status: 'healthy',
      database: 'connected',
      timestamp: result.rows[0].timestamp,
      service: 'editorial-app-database'
    });
  });
});

// Network info endpoint
app.get('/api/network-info', (req, res) => {
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  
  res.status(200).json({
    host: req.get('host'),
    ip: req.ip,
    ips: req.ips,
    originalUrl: req.originalUrl,
    networkInterfaces: networkInterfaces,
    headers: req.headers
  });
});

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0'; // Escuchar en todas las interfaces

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor backend corriendo en ${HOST}:${PORT}`);
  console.log(`📡 Accesible desde:`);
  console.log(`   - Local: http://localhost:${PORT}`);
  console.log(`   - Red: http://0.0.0.0:${PORT}`);
  console.log(`   - Tailscale: http://[TAILSCALE-IP]:${PORT}`);
});