const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

// GET todas las tareas
router.get('/', tasksController.getTasks);

// POST crear nueva tarea
router.post('/create', tasksController.createTask);

// PUT actualizar checklist
router.put('/:id/checklist', tasksController.updateChecklist);

// PUT actualizar tarea completa
router.put('/:id', tasksController.updateTask);

// DELETE eliminar tarea
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
