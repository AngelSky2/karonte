import '../css/navbar.css';

function Navbar({ tabs = [], activeTab = 'chat', onTabChange }) {
  const handleTabClick = (tabId) => {
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

