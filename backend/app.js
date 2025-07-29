const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db'); // Esto importa y ejecuta la conexión automáticamente

const app = express();

// Middlewares
app.use(cors());
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