import { useState, useEffect, useRef } from 'react';
import '../../css/terminal/chat.css';

const API_URL = 'http://localhost:5000/api/chat';

function Chat({ activeTab = 'chat', refreshTrigger = 0, userMessage = null, onMessageDisplayed = null, isLoading = false, onLoadingComplete = null }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDots, setLoadingDots] = useState('.');
  const messagesEndRef = useRef(null);

  // Mostrar el mensaje del usuario cuando se envía
  useEffect(() => {
    if (userMessage) {
      const userMsg = {
        id: 'temp-' + Date.now(),
        sender: 'user',
        text: userMessage,
        tab: activeTab
      };
      setMessages(prev => [userMsg, ...prev]);
      if (onMessageDisplayed) {
        onMessageDisplayed();
      }
    }
  }, [userMessage, activeTab, onMessageDisplayed]);

  // Animar los puntos de cargando
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setLoadingDots(prev => {
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [isLoading]);

  // Cargar mensajes al montar o cuando cambia de tab o se envía un mensaje
  useEffect(() => {
    fetchMessages();
  }, [activeTab, refreshTrigger]);

  const fetchMessages = async () => {
    try {
      // No mostrar el "Cargando..." si ya estamos esperando respuesta
      if (!isLoading) {
        setLoading(true);
      }
      
      const response = await fetch(`${API_URL}/messages?tab=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        if (onLoadingComplete) {
          onLoadingComplete();
        }
      } else {
        console.error('Error fetching messages:', response.status);
      }
    } catch (error) {
      console.error('Error conectando con backend:', error);
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
            {msg.sender === 'user' && <span className="sender-arrow">{'>>>>'}</span>}
            <span className="message-text">{msg.text}</span>
          </div>
        ))}
        {isLoading && (
          <div className="message message-system">
            <span className="sender-arrow">→</span>
            <span className="message-text">cargando{loadingDots}</span>
          </div>
        )}
        <div className="message message-input">
          <span className="cursor-blink">_</span>
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default Chat;