import { useState, useEffect } from 'react';
import '../css/input.css';

const API_URL = 'http://localhost:5000/api/chat';

function Input({ activeTab = 'chat', onMessageSent, onLoadingChange, onResponseReceived }) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [buttonText, setButtonText] = useState('>');

  // Animación del botón parpadeante
  useEffect(() => {
    const interval = setInterval(() => {
      setButtonText((prev) => {
        if (prev === '>') return '>>';
        if (prev === '>>') return '>>>';
        if (prev === '>>>') return '>';
        return '>';
      });
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const messageText = input.trim();
    setInput(''); // Limpiar input inmediatamente
    setSending(true);
    if (onLoadingChange) onLoadingChange(true);
    
    // Mostrar el mensaje inmediatamente
    if (onMessageSent) {
      onMessageSent(messageText);
    }
    
    try {
      // Si es el chat, usar AI; si es tareas, usar chat normal
      const endpoint = activeTab === 'chat' ? '/api/ai/message' : '/api/chat/message';
      const url = `http://localhost:5000${endpoint}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: activeTab === 'chat' ? 'user' : 'user',
          text: messageText,
          tab: activeTab,
          message: messageText // Para AI endpoint
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Notificar que la respuesta llegó para recargar los mensajes
        if (onResponseReceived) {
          onResponseReceived();
        }
      } else {
        console.error('Error sending message:', response.status);
        if (onLoadingChange) onLoadingChange(false);
      }
    } catch (error) {
      console.error('Error:', error);
      if (onLoadingChange) onLoadingChange(false);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="input-container">
      <input
        type="text"
        className="input-field"
        placeholder="Ingresa tu comando..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={sending}
      />
      <button
        className="send-button"
        onClick={sendMessage}
        disabled={sending || !input.trim()}
        title="Enviar (Enter)"
      >
        {buttonText}
      </button>
    </div>
  );
}

export default Input;
