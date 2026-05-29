import { useState } from 'react';
import '../../css/tasks/task-form-modal.css';
import { createPortal } from 'react-dom';

function TaskFormModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [checklistItems, setChecklistItems] = useState(['']);
  const [error, setError] = useState('');

  const handleAddChecklistItem = () => {
    setChecklistItems([...checklistItems, '']);
  };

  const handleRemoveChecklistItem = (index) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  const handleChecklistChange = (index, value) => {
    const newItems = [...checklistItems];
    newItems[index] = value;
    setChecklistItems(newItems);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('El título es requerido');
      return;
    }
    if (!dueDate) {
      setError('La fecha de entrega es requerida');
      return;
    }

    const checklist = checklistItems
      .filter(item => item.trim())
      .map(text => ({ text, done: false }));

    try {
      const response = await fetch('http://localhost:5000/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          due_date: dueDate,
          checklist: JSON.stringify(checklist)
        })
      });

      if (response.ok) {
        const data = await response.json();
        onSave(data);
        resetForm();
      } else {
        setError('Error al crear la tarea');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setChecklistItems(['']);
    setError('');
    onClose();
  };

    if (!isOpen) return null;

    return createPortal(
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>➕ Nueva Tarea</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>

          <div className="modal-body form-body">
            {error && <div className="error-msg">{error}</div>}

            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la tarea"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalles de la tarea"
                className="form-textarea"
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Fecha de Entrega *</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Checklist de Procesos</label>
              <div className="checklist-form">
                {checklistItems.map((item, idx) => (
                  <div key={idx} className="checklist-input-row">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleChecklistChange(idx, e.target.value)}
                      placeholder={`Proceso ${idx + 1}`}
                      className="form-input-small"
                    />
                    {checklistItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveChecklistItem(idx)}
                        className="btn-remove"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddChecklistItem}
                  className="btn-add-item"
                >
                  + Agregar Proceso
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button className="btn-save" onClick={handleSubmit}>Guardar Tarea</button>
          </div>
        </div>
      </div>,
      document.body
    );
}

export default TaskFormModal;
