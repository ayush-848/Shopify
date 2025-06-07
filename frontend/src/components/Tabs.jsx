import React from 'react';
import { getTabStyle } from '../utils/styleUtils'; // Import helper

function Tabs({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="flex bg-gray-100 border-b border-gray-200 rounded-t-xl overflow-hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={getTabStyle(tab.id, activeTab)}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;