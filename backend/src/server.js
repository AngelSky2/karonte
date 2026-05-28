const express = require('express');
const cors = require('cors');
require('dotenv').config();
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/chat', chatRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend Karonte activo ✓' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🔧 Backend Karonte Iniciado           ║
║  Puerto: ${PORT}                            ║
║  URL: http://localhost:${PORT}           ║
╚════════════════════════════════════════╝
  `);
});
