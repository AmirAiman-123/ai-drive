// File: AuraDrive/frontend/src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. Import useNavigate
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false); // State for the animation

  const navigate = useNavigate(); // <-- 2. Initialize navigate hook

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await api.get('/auth/session');
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setShowWelcome(true); // Trigger the animation
    setTimeout(() => {
    setShowWelcome(false);
    }, 2500); // 2.5 seconds
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      navigate('/login'); // <-- 3. Add this line to force redirect after logout
    } catch (error) {
      console.error("Logout failed", error);
      // Even if API fails, log them out on the frontend
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, showWelcome }}>
      {children}
    </AuthContext.Provider>

  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};