import { useState, useEffect, useRef } from 'react';
import '../../css/terminal/chat.css';

const API_URL = 'http://localhost:5000/api/chat';

function Chat({ activeTab = 'chat', refreshTrigger = 0 }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Cargar mensajes al montar o cuando cambia de tab o se envía un mensaje
  useEffect(() => {
    fetchMessages();
  }, [activeTab, refreshTrigger]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/messages?tab=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Error fetching messages:', response.status);
      }
    } catch (error) {
      console.error('Error conectando con backend:', error);
      // Fallback: mostrar mensajes de prueba
      setMessages([
        { id: 1, sender: 'system', text: 'Error conectando con backend' },
        { id: 2, sender: 'system', text: 'Mostrando datos de prueba...' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {loading && (
          <div className="message message-system">
            <span className="sender-arrow">→</span>
            <span className="message-text">Cargando...</span>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`message message-${msg.sender}`}>
            {msg.sender === 'system' && <span className="sender-arrow">→</span>}
            <span className="message-text">{msg.text}</span>
          </div>
        ))}
        <div className="message message-input">
          <span className="cursor-blink">_</span>
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default Chat;