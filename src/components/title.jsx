import React from 'react';
import '../css/title.css';

function Title({ activeTab = 'chat', tabs = [] }) {
  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const displayTitle = activeTabData?.label || 'Karonte';
  const dashes = '-'.repeat(Math.max(1, Math.floor((60 - displayTitle.length) / 2)));

  return (
    <div className="title-container">
      <div className="title-text">
        {dashes} {displayTitle} {dashes}
      </div>
    </div>
  );
}

export default Title;
