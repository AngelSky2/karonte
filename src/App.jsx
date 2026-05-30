import { useState } from 'react';
import './App.css'
import Navbar from './components/navbar';
import Title from './components/title';
import Chat from './components/terminal/chat';
import Input from './components/input';
import TasksView from './components/tasks/TasksView';
import MissionInfo from './components/mission/MissionInfo';
import FinanceView from './components/finance/FinanceView';
import LoadingScreen from './components/LoadingScreen';
import AIAnimation from './components/AIAnimation';

const TABS = [
  { id: 'chat', label: 'chat del servidor' },
  { id: 'tasks', label: 'tareas para el imperio' },
  { id: 'ahorros', label: 'administracion de logistica' },
  { id: 'mission', label: 'informacion de mision' },
];

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [messageRefresh, setMessageRefresh] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  const [userMessage, setUserMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMessageSent = (messageText) => {
    setUserMessage(messageText);
    // No incrementar refreshTrigger aquí, dejar que se actualice cuando la respuesta llegue
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <>
      {showLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <div className="layaout">
        <div className="grid-container-AI-navbar">
          <div className="IAbox">
            <AIAnimation />
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
            {activeTab === 'tasks' ? (
              <TasksView />
            ) : activeTab === 'mission' ? (
              <MissionInfo />
            ) : activeTab === 'ahorros' ? (
              <FinanceView />
            ) : (
              <Chat activeTab={activeTab} refreshTrigger={messageRefresh} userMessage={userMessage} onMessageDisplayed={() => setUserMessage(null)} isLoading={isLoading} onLoadingComplete={() => setIsLoading(false)} />
            )}
          </div>
          {activeTab !== 'tasks' && (
            <div className="input">
              <Input 
                activeTab={activeTab} 
                onMessageSent={handleMessageSent} 
                onLoadingChange={setIsLoading}
                onResponseReceived={() => setMessageRefresh(prev => prev + 1)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
