// File: AuraDrive/frontend/src/components/ContextMenu.js (Themed Version)

import React from 'react';
import './ContextMenu.css'; // We will create this file next

const ContextMenu = ({ x, y, show, children }) => {
  if (!show) {
    return null;
  }

  const style = {
    top: `${y}px`,
    left: `${x}px`,
  };

  return <ul style={style} className="context-menu">{children}</ul>;
};

export const ContextMenuItem = ({ children, onClick, danger = false }) => {
  const className = `context-menu-item ${danger ? 'danger' : ''}`;
  return (
    <li>
      <button className={className} onClick={onClick}>{children}</button>
    </li>
  );
};

export default ContextMenu;