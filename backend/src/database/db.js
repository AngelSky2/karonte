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
    console.log('[OK] Conectado a SQLite:', DB_PATH);
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
      console.log('[OK] Tabla messages lista');
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
      console.log('[OK] Tabla tasks lista');
    }
  });

  // Tabla de finanzas (transacciones)
  db.run(`
    CREATE TABLE IF NOT EXISTS finances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kind TEXT NOT NULL, -- income | expense | debt
      amount REAL NOT NULL,
      date DATETIME NOT NULL,
      category TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creando tabla finances:', err);
    } else {
      console.log('[OK] Tabla finances lista');
    }
  });

  // Limpiar historial de mensajes al reiniciar (con delay para asegurar que la tabla existe)
  setTimeout(() => {
    db.run(`DELETE FROM messages`, (err) => {
      if (err) {
        console.error('Error limpiando mensajes:', err);
      } else {
        console.log('[OK] Historial de chat reiniciado');
      }
    });
  }, 500);

  console.log('[OK] Tablas inicializadas');
  // Seed sample data if tables empty
  setTimeout(() => {
    db.get('SELECT COUNT(*) as c FROM tasks', (err, row) => {
      if (err) return console.error('Error counting tasks:', err);
      if ((row && row.c) === 0) {
        console.log('Semilla: insertando tareas de ejemplo...');
        const sampleTasks = [
          ["Preparar informe Q1", "Revisar métricas y preparar presentación", '2026-06-10', JSON.stringify([{text:'Recolectar datos',done:false},{text:'Analizar',done:false},{text:'Preparar slides',done:false}])],
          ["Actualizar servidor", "Aplicar parches y reiniciar servicios", '2026-05-25', JSON.stringify([{text:'Backup',done:true},{text:'Aplicar parches',done:false}])],
          ["Diseñar demo", "Esqueleto del demo para stakeholders", '2026-07-01', JSON.stringify([{text:'Wireframes',done:true},{text:'Implementación',done:false}])],
          ["Documentar API", "Agregar ejemplos y endpoints", '2026-06-20', JSON.stringify([{text:'Escribir ejemplos',done:false}])],
          ["Pruebas unitarias", "Cobertura para componentes críticos", '2026-05-30', JSON.stringify([{text:'Configurar CI',done:true},{text:'Escribir tests',done:false}])],
          ["Optimizar DB", "Revisar índices y consultas", '2026-06-05', JSON.stringify([{text:'Analizar consultas',done:false},{text:'Agregar índices',done:false}])],
          ["Lanzamiento beta", "Checklist para release", '2026-06-25', JSON.stringify([{text:'QA',done:false},{text:'Feedback',done:false},{text:'Deploy',done:false}])],
          ["Plan marketing", "Estrategia para lanzamiento", '2026-07-15', JSON.stringify([{text:'Definir canales',done:false},{text:'Crear assets',done:false}])]
        ];
        const stmt = db.prepare('INSERT INTO tasks (title, description, due_date, checklist, created_at, updated_at) VALUES (?, ?, ?, ?, datetime("now"), datetime("now"))');
        sampleTasks.forEach(t => stmt.run(t, (e) => { if (e) console.error('Insert task seed error', e); }));
        stmt.finalize();
      }
    });

    db.get('SELECT COUNT(*) as c FROM finances', (err, row) => {
      if (err) return console.error('Error counting finances:', err);
      if ((row && row.c) === 0) {
        console.log('Semilla: insertando transacciones de ejemplo...');
        const sampleFinances = [
          ['income', 2500.00, '2026-05-01', 'Salario', 'Salario mensual'],
          ['expense', 120.45, '2026-05-02', 'Comida', 'Supermercado'],
          ['expense', 45.00, '2026-05-03', 'Transporte', 'Gasolina'],
          ['expense', 299.99, '2026-05-04', 'Tecnología', 'Hardware'],
          ['income', 150.00, '2026-05-06', 'Freelance', 'Proyecto X'],
          ['expense', 60.00, '2026-05-07', 'Ocio', 'Restaurante'],
          ['expense', 400.00, '2026-04-15', 'Renta', 'Alquiler mensual'],
          ['expense', 90.00, '2026-04-20', 'Servicios', 'Electricidad'],
          ['income', 500.00, '2026-03-28', 'Bono', 'Bono rendimiento'],
          ['debt', 1000.00, '2026-02-10', 'Préstamo', 'Cuota pendiente'],
          ['expense', 25.00, '2026-05-10', 'Comida', 'Café y snacks'],
          ['expense', 75.00, '2026-05-11', 'Ropa', 'Compra vestuario'],
          ['income', 60.00, '2026-05-12', 'Venta', 'Venta equipo usado'],
          ['expense', 20.00, '2026-05-13', 'Apps', 'Suscripción']
        ];
        const stmt2 = db.prepare('INSERT INTO finances (kind, amount, date, category, notes, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))');
        sampleFinances.forEach(f => stmt2.run(f, (e) => { if (e) console.error('Insert finance seed error', e); }));
        stmt2.finalize();
      }
    });
  }, 800);
};

module.exports = db;
