// File: AuraDrive/frontend/src/context/AuthContext.js (Definitive Final Version)

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // --- THIS IS THE KEY CHANGE ---
  // We introduce a new state: 'sessionChecked'. It starts as false.
  const [sessionChecked, setSessionChecked] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // This effect runs only once when the application starts.
    // Its only job is to check if a session cookie exists and validate it.
    const checkLoggedIn = async () => {
      try {
        const response = await api.get('/auth/session');
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        // Crucially, we mark the session as checked, regardless of the outcome.
        setSessionChecked(true);
      }
    };

    checkLoggedIn();
  }, []); // Empty dependency array means it runs only on mount

  const login = (userData) => {
    setUser(userData);
    setShowWelcome(true);
    setTimeout(() => {
      setShowWelcome(false);
    }, 2500);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout API call failed", error);
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  return (
    // We now pass 'sessionChecked' in the context value. 'loading' is removed.
    <AuthContext.Provider value={{ user, login, logout, sessionChecked, showWelcome }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};