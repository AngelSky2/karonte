const db = require('../database/db');

// Obtener todas las tareas
const getTasks = (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY due_date ASC', (err, rows) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ error: 'Error fetching tasks' });
    }
    res.json(rows || []);
  });
};

// Crear nueva tarea
const createTask = (req, res) => {
  const { title, description, due_date, checklist } = req.body;

  if (!title || !due_date) {
    return res.status(400).json({ error: 'Title and due_date are required' });
  }

  const query = `
    INSERT INTO tasks (title, description, due_date, checklist, created_at, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
  `;

  db.run(query, [title, description || null, due_date, checklist || '[]'], function(err) {
    if (err) {
      console.error('Error creating task:', err);
      return res.status(500).json({ error: 'Error creating task' });
    }

    // Retornar la tarea creada
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching created task' });
      }
      res.json(row);
    });
  });
};

// Actualizar checklist de una tarea
const updateChecklist = (req, res) => {
  const { id } = req.params;
  const { checklist } = req.body;

  if (!checklist) {
    return res.status(400).json({ error: 'Checklist is required' });
  }

  const query = 'UPDATE tasks SET checklist = ?, updated_at = datetime("now") WHERE id = ?';

  db.run(query, [checklist, id], function(err) {
    if (err) {
      console.error('Error updating checklist:', err);
      return res.status(500).json({ error: 'Error updating checklist' });
    }

    db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching updated task' });
      }
      res.json(row);
    });
  });
};

// Actualizar tarea completa
const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, completed } = req.body;

  if (!title || !due_date) {
    return res.status(400).json({ error: 'Title and due_date are required' });
  }

  const query = `
    UPDATE tasks 
    SET title = ?, description = ?, due_date = ?, completed = ?, updated_at = datetime('now')
    WHERE id = ?
  `;

  db.run(query, [title, description || null, due_date, completed ? 1 : 0, id], function(err) {
    if (err) {
      console.error('Error updating task:', err);
      return res.status(500).json({ error: 'Error updating task' });
    }

    db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching updated task' });
      }
      res.json(row);
    });
  });
};

// Eliminar tarea
const deleteTask = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM tasks WHERE id = ?';

  db.run(query, [id], function(err) {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).json({ error: 'Error deleting task' });
    }
    res.json({ success: true, message: 'Task deleted' });
  });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  updateChecklist,
  deleteTask
};
