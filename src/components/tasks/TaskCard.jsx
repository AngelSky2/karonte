import '../../css/tasks/task-card.css';

function TaskCard({ task, onCardClick, onChecklistChange, onDelete }) {
  const handleCheckToggle = (index) => {
    const checklist = JSON.parse(task.checklist || '[]');
    checklist[index].done = !checklist[index].done;
    onChecklistChange(task.id, checklist);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(task.id);
    }
  };

  const parseChecklist = () => {
    try {
      return JSON.parse(task.checklist || '[]');
    } catch {
      return [];
    }
  };

  const checklist = parseChecklist();
  const completedCount = checklist.filter(c => c.done).length;
  // consider a task complete if it has items and all are done
  const isComplete = checklist.length > 0 && completedCount === checklist.length;
  // if checklist is empty (0 / 0) allow deletion as well
  const allowDeleteWhenEmpty = checklist.length === 0;

  // overdue detection
  let isOverdue = false;
  try {
    const due = new Date(task.due_date);
    if (task.due_date && !isNaN(due)) {
      const now = new Date();
      // ignore time part by comparing dates only
      isOverdue = due < now && !isComplete;
    }
  } catch (e) {
    isOverdue = false;
  }

  const dueDate = new Date(task.due_date).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={"task-card" + (isOverdue ? ' overdue' : '')} onClick={() => onCardClick(task)}>
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <span className="task-date">{dueDate}</span>
      </div>

      <div className="task-checklist-preview">
        {checklist.length > 0 && checklist.map((item, idx) => (
          <div key={idx} className="checklist-item-preview">
            <input
              type="checkbox"
              checked={item.done || false}
              onChange={(e) => {
                e.stopPropagation();
                handleCheckToggle(idx);
              }}
              className="checklist-checkbox"
            />
            <span className={item.done ? 'done' : ''}>{item.text}</span>
          </div>
        ))}
      </div>

      <div className="task-footer">
        <span className="task-status">
          {completedCount} / {checklist.length}
        </span>
        {(isComplete || allowDeleteWhenEmpty) && (
          <button 
            className="btn-delete-task" 
            onClick={handleDelete}
            title="Eliminar tarea"
            aria-label="Eliminar tarea"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
