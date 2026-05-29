const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DB_DIR, 'karonte.db');

// Crear carpeta si no existe
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error conectando a SQLite:', err);
  } else {
    console.log('✓ Conectado a SQLite:', DB_PATH);
    initializeDatabase();
  }
});

const initializeDatabase = () => {
  // Tabla de mensajes
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT NOT NULL,
      text TEXT NOT NULL,
      tab TEXT DEFAULT 'chat',
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creando tabla messages:', err);
    } else {
      console.log('✓ Tabla messages lista');
    }
  });

  // Tabla de tareas (actualizada con campos completos)
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      due_date DATETIME,
      checklist TEXT DEFAULT '[]',
      completed BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creando tabla tasks:', err);
    } else {
      console.log('✓ Tabla tasks lista');
    }
  });

  // Limpiar historial de mensajes al reiniciar (con delay para asegurar que la tabla existe)
  setTimeout(() => {
    db.run(`DELETE FROM messages`, (err) => {
      if (err) {
        console.error('Error limpiando mensajes:', err);
      } else {
        console.log('✓ Historial de chat reiniciado');
      }
    });
  }, 500);

  console.log('✓ Tablas inicializadas');
};

module.exports = db;
