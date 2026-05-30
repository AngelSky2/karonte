import { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import TaskFormModal from './TaskFormModal';
import '../../css/tasks/tasks-view.css';

function TasksView() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/tasks');
      if (response.ok) {
        const data = await response.json();
        // Ordenar por fecha de entrega (próximas primero)
        const sorted = data.sort((a, b) => 
          new Date(a.due_date) - new Date(b.due_date)
        );
        setTasks(sorted);
      }
    } catch (err) {
      console.error('Error cargando tareas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const handleChecklistChange = async (taskId, newChecklist) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/checklist`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checklist: JSON.stringify(newChecklist) })
      });

      if (response.ok) {
        // Actualizar localmente
        setTasks(tasks.map(t => 
          t.id === taskId 
            ? { ...t, checklist: JSON.stringify(newChecklist) }
            : t
        ));
        // Actualizar modal si está abierto
        if (selectedTask?.id === taskId) {
          setSelectedTask({ ...selectedTask, checklist: JSON.stringify(newChecklist) });
        }
      }
    } catch (err) {
      console.error('Error actualizando checklist:', err);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask].sort((a, b) => 
      new Date(a.due_date) - new Date(b.due_date)
    ));
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        // Eliminar de la lista local
        setTasks(tasks.filter(t => t.id !== taskId));
        // Cerrar modal si está abierto
        if (selectedTask?.id === taskId) {
          setShowDetailModal(false);
          setSelectedTask(null);
        }
      }
    } catch (err) {
      console.error('Error eliminando tarea:', err);
    }
  };

  if (loading) {
    return <div className="tasks-view loading">Cargando tareas...</div>;
  }

  return (
    <div className="tasks-view">
      <div className="tasks-header">
        <h2>Tareas del Imperio</h2>
        <button 
          className="btn-new-task"
          onClick={() => setShowFormModal(true)}
        >
          + Nueva Tarea
        </button>
      </div>

      <div className="tasks-grid">
        {tasks.length > 0 ? (
          tasks.slice(0, 20).map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onCardClick={handleCardClick}
              onChecklistChange={handleChecklistChange}
              onDelete={handleDeleteTask}
            />
          ))
        ) : (
          <div className="no-tasks">
            <p>Sin tareas registradas</p>
            <p className="hint">Crea una nueva tarea para comenzar</p>
          </div>
        )}
      </div>

      {tasks.length === 0 && (
        <div className="empty-state">
          <button 
            className="btn-create-first"
            onClick={() => setShowFormModal(true)}
          >
            Crear Primera Tarea
          </button>
        </div>
      )}

      {/* Modales */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onChecklistChange={handleChecklistChange}
        />
      )}

      <TaskFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSave={handleTaskCreated}
      />
    </div>
  );
}

export default TasksView;
