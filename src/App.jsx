import { useState } from 'react';
import './App.css'
import Navbar from './components/navbar';
import Title from './components/title';

const TABS = [
  { id: 'chat', label: 'chat del servidor' },
  { id: 'tasks', label: 'tareas para el imperio' },
  { id: 'mission', label: 'informacion de mision' },
];

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="layaout">
      <div className="grid-container-AI-navbar">
        <div className="IAbox">

        </div>
        <div className="navbar">
          <Navbar tabs={TABS} onTabChange={setActiveTab} />
        </div>
      </div>
      <div className="grid-container-title-terminal-chat-input">
        <div className="title">
          <Title activeTab={activeTab} tabs={TABS} />
        </div>
        <div className="terminal-chat">

        </div>
        <div className="input">
          
        </div>
      </div>
    </div>
  )
}

export default App
