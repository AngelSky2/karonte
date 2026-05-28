const db = require('../database/db');

// Obtener historial de mensajes
exports.getMessages = (req, res) => {
  const tab = req.query.tab || 'chat';

  db.all(
    'SELECT * FROM messages WHERE tab = ? ORDER BY timestamp ASC LIMIT 50',
    [tab],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
};

// Enviar mensaje
exports.sendMessage = (req, res) => {
  const { sender, text, tab = 'chat' } = req.body;

  if (!sender || !text) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  db.run(
    'INSERT INTO messages (sender, text, tab) VALUES (?, ?, ?)',
    [sender, text, tab],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, sender, text, tab });
      }
    }
  );
};
