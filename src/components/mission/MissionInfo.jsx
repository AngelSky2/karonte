import React from 'react';

function MissionInfo() {
  return (
    <div style={{ padding: 12, color: 'var(--text-primary)' }}>
      <h2 style={{ color: 'var(--accent-primary)', textShadow: 'var(--glow-primary)' }}>KARONTE — Información de Misión</h2>
      <p style={{ marginTop: 8, lineHeight: 1.5 }}>
        Bienvenido a Karonte: un panel de control ligero para gestionar tareas y comunicaciones del sistema.
      </p>

      <h3 style={{ marginTop: 12, color: 'var(--accent-primary)' }}>Qué es esta app</h3>
      <p style={{ lineHeight: 1.5 }}>
        Karonte combina un chat de servidor con un gestor de tareas visual (estilo "tablero"). Puedes crear, revisar y eliminar tareas, además de seguir su progreso mediante checklists.
      </p>

      <h3 style={{ marginTop: 12, color: 'var(--accent-primary)' }}>Cómo usarla</h3>
      <ul style={{ lineHeight: 1.6 }}>
        <li>Ve a la pestaña <strong>tareas para el imperio</strong> para ver las tareas más cercanas en fecha de entrega.</li>
        <li>Haz clic en <strong>➕ Nueva Tarea</strong> para crear una tarea con título, descripción, fecha y checklist.</li>
        <li>Marca los elementos del checklist para actualizar el progreso. Cuando una tarea está completada (o no tiene checklist) aparece el botón <strong>Eliminar</strong>.</li>
        <li>Haz clic sobre una tarjeta para ver el detalle completo en un modal y editar elementos si es necesario.</li>
      </ul>

      <h3 style={{ marginTop: 12, color: 'var(--accent-primary)' }}>Atajos y recomendaciones</h3>
      <ul style={{ lineHeight: 1.6 }}>
        <li>Mantén las fechas actualizadas para que el sistema marque tareas vencidas con borde rojo.</li>
        <li>Usa descripciones claras en los procesos del checklist para facilitar seguimiento.</li>
        <li>Para seguridad, considera hacer copias de respaldo de las tareas exportando los datos del backend si lo necesitas.</li>
      </ul>

      <p style={{ marginTop: 12, opacity: 0.9 }}>
        ¿Quieres que añadamos categorías, filtros o notificaciones por vencimiento? Pídelo y lo implemento.
      </p>
    </div>
  );
}

export default MissionInfo;
