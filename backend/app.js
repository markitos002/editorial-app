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

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/articulos', articulosRoutes);
app.use('/api/revisiones', revisionesRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});