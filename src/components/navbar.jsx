import { useState } from 'react';
import '../css/navbar.css';

function Navbar({ onTabChange }) {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', label: 'chat del servidor' },
    { id: 'tasks', label: 'tareas para el imperio' },
    { id: 'mission', label: 'informacion de mision' },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="navbar">
      <ul className="navbar-list">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              className={`navbar-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Navbar;

