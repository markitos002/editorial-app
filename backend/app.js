const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db'); // Esto importa y ejecuta la conexión automáticamente

const app = express();

const usuariosRoutes = require('./routes/usuariosRoutes');
app.use('/api/usuarios', usuariosRoutes);

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});