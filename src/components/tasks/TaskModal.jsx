import '../../css/tasks/task-modal.css';
import { createPortal } from 'react-dom';

function TaskModal({ task, isOpen, onClose, onChecklistChange }) {
  if (!isOpen) return null;

  const handleCheckToggle = (index) => {
    const checklist = JSON.parse(task.checklist || '[]');
    checklist[index].done = !checklist[index].done;
    onChecklistChange(task.id, checklist);
  };

  const parseChecklist = () => {
    try {
      return JSON.parse(task.checklist || '[]');
    } catch {
      return [];
    }
  };

  const checklist = parseChecklist();
  const createdDate = new Date(task.created_at).toLocaleDateString('es-ES');
  const dueDate = new Date(task.due_date).toLocaleDateString('es-ES');

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task.title}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <h3>📋 Descripción</h3>
            <p>{task.description || 'Sin descripción'}</p>
          </section>

          <section className="modal-section">
            <h3>📅 Fechas</h3>
            <div className="dates-grid">
              <div>
                <span className="label">Creación:</span>
                <span>{createdDate}</span>
              </div>
              <div>
                <span className="label">Entrega:</span>
                <span>{dueDate}</span>
              </div>
            </div>
          </section>

          <section className="modal-section">
            <h3>✅ Checklist de Procesos</h3>
            <div className="checklist-full">
              {checklist.length > 0 ? (
                checklist.map((item, idx) => (
                  <div key={idx} className="checklist-item-full">
                    <input
                      type="checkbox"
                      checked={item.done || false}
                      onChange={() => handleCheckToggle(idx)}
                      className="checklist-checkbox-large"
                    />
                    <span className={item.done ? 'done' : ''}>{item.text}</span>
                  </div>
                ))
              ) : (
                <p className="no-items">Sin procesos registrados</p>
              )}
            </div>
            <div className="checklist-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${checklist.length > 0 ? (checklist.filter(c => c.done).length / checklist.length) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {checklist.filter(c => c.done).length} / {checklist.length}
              </span>
            </div>
          </section>
        </div>

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default TaskModal;
