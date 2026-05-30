const db = require('../database/db');

// Obtener todas las finanzas (transacciones)
const getFinances = (req, res) => {
  db.all('SELECT * FROM finances ORDER BY date DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching finances:', err);
      return res.status(500).json({ error: 'Error fetching finances' });
    }
    res.json(rows || []);
  });
};

// Crear transacción
const createFinance = (req, res) => {
  const { kind, amount, date, category, notes } = req.body;
  if (!kind || typeof amount === 'undefined' || !date) {
    return res.status(400).json({ error: 'kind, amount and date are required' });
  }

  const query = `INSERT INTO finances (kind, amount, date, category, notes, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`;
  db.run(query, [kind, amount, date, category || null, notes || null], function(err) {
    if (err) {
      console.error('Error creating finance:', err);
      return res.status(500).json({ error: 'Error creating finance' });
    }

    db.get('SELECT * FROM finances WHERE id = ?', [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: 'Error fetching created finance' });
      res.json(row);
    });
  });
};

// Actualizar transacción
const updateFinance = (req, res) => {
  const { id } = req.params;
  const { kind, amount, date, category, notes } = req.body;
  if (!kind || typeof amount === 'undefined' || !date) {
    return res.status(400).json({ error: 'kind, amount and date are required' });
  }

  const query = `UPDATE finances SET kind = ?, amount = ?, date = ?, category = ?, notes = ? WHERE id = ?`;
  db.run(query, [kind, amount, date, category || null, notes || null, id], function(err) {
    if (err) {
      console.error('Error updating finance:', err);
      return res.status(500).json({ error: 'Error updating finance' });
    }
    db.get('SELECT * FROM finances WHERE id = ?', [id], (err, row) => {
      if (err) return res.status(500).json({ error: 'Error fetching updated finance' });
      res.json(row);
    });
  });
};

// Eliminar transacción
const deleteFinance = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM finances WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting finance:', err);
      return res.status(500).json({ error: 'Error deleting finance' });
    }
    res.json({ success: true, message: 'Finance deleted' });
  });
};

// Borrar todas las finanzas (uso para limpieza / pruebas)
const clearFinances = (req, res) => {
  db.run('DELETE FROM finances', function(err) {
    if (err) {
      console.error('Error clearing finances:', err);
      return res.status(500).json({ error: 'Error clearing finances' });
    }
    res.json({ success: true, message: 'All finances cleared' });
  });
};

// Resumen simple: balance actual (ingresos - gastos)
const getSummary = (req, res) => {
  const incomesQ = `SELECT IFNULL(SUM(amount),0) as total FROM finances WHERE kind = 'income'`;
  const expensesQ = `SELECT IFNULL(SUM(amount),0) as total FROM finances WHERE kind = 'expense'`;

  db.get(incomesQ, [], (err, incRow) => {
    if (err) return res.status(500).json({ error: 'Error calculating incomes' });
    db.get(expensesQ, [], (err, expRow) => {
      if (err) return res.status(500).json({ error: 'Error calculating expenses' });
      const balance = (incRow.total || 0) - (expRow.total || 0);
      res.json({ incomes: incRow.total || 0, expenses: expRow.total || 0, balance });
    });
  });
};

module.exports = {
  getFinances,
  createFinance,
  updateFinance,
  deleteFinance,
  clearFinances,
  getSummary
};
