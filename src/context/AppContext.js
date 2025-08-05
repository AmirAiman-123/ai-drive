// File: AuraDrive/frontend/src/context/AppContext.js (Final Version)

import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [clipboard, setClipboard] = useState({
    itemIds: new Set(),
    operation: null, // 'copy' or 'cut'
  });

  const setClipboardContents = (itemIds, operation) => {
    setClipboard({ 
      itemIds: new Set(itemIds), 
      operation: operation 
    });
  };
  
  const clearClipboard = () => {
    setClipboard({ itemIds: new Set(), operation: null });
  };

  return (
    <AppContext.Provider value={{ clipboard, setClipboardContents, clearClipboard }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};