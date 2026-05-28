import { useState, useEffect } from 'react';
import '../css/input.css';

const API_URL = 'http://localhost:5000/api/chat';

function Input({ activeTab = 'chat', onMessageSent }) {
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

    setSending(true);
    try {
      const response = await fetch(`${API_URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'user',
          text: input.trim(),
          tab: activeTab,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInput('');
        // Notificar al padre que se envió un mensaje
        if (onMessageSent) {
          onMessageSent(data);
        }
      } else {
        console.error('Error sending message:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
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
