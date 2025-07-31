const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db'); // Esto importa y ejecuta la conexión automáticamente

const app = express();

// Middlewares
// Configurar CORS para permitir acceso desde Tailscale y localhost
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (aplicaciones móviles, postman, etc.)
    if (!origin) return callback(null, true);
    
    // Permitir localhost
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

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});