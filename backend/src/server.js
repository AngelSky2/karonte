const express = require('express');
const cors = require('cors');
require('dotenv').config();
const chatRoutes = require('./routes/chatRoutes');
const voiceRoutes = require('./routes/voiceRoutes');
const aiRoutes = require('./routes/aiRoutes');
const tasksRoutes = require('./routes/tasksRoutes');
const financesRoutes = require('./routes/financesRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/chat', chatRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/finances', financesRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend Karonte activo [OK]' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  Backend Karonte Iniciado              ║
║  Puerto: ${PORT}                       ║
║  URL: http://localhost:${PORT}         ║
╚════════════════════════════════════════╝
  `);
});
