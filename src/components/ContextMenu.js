// File: AuraDrive/frontend/src/components/ContextMenu.js

import React from 'react';

const ContextMenu = ({ x, y, show, children }) => {
  if (!show) {
    return null;
  }

  const style = {
    position: 'absolute',
    top: `${y}px`,
    left: `${x}px`,
    zIndex: 1000,
    backgroundColor: 'white',
    border: '1px solid var(--border-gray)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '0.5rem',
    listStyle: 'none',
    margin: 0
  };

  return <ul style={style}>{children}</ul>;
};

export const ContextMenuItem = ({ children, onClick, danger = false }) => {
  const style = {
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    borderRadius: '6px',
    color: danger ? '#c53030' : 'var(--text-slate)',
    backgroundColor: 'transparent',
    width: '100%',
    textAlign: 'left',
    border: 'none',
    fontSize: '0.9rem'
  };
  
  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = danger ? '#fff5f5' : 'var(--background-light)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button style={style} onClick={onClick}>{children}</button>
    </li>
  );
};

export default ContextMenu;