// File: AuraDrive/frontend/src/App.js (Definitive Final Version)

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';

// Page and Component Imports
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import DriveViewPage from './pages/DriveViewPage';
import WelcomeAnimation from './components/WelcomeAnimation';
// Make sure you have deleted the WelcomePage.js file and remove the import if it exists.

import './App.css'; 

function App() {
  const { showWelcome } = useAuth();

  return (
    <>
      <AnimatePresence>
        {showWelcome && <WelcomeAnimation />}
      </AnimatePresence>

      <Routes>
        {/* --- THIS IS THE CORRECTED ROUTING LOGIC --- */}
        {/* The root path now automatically redirects to /login.
            The LoginPage component itself will handle redirecting logged-in users to the dashboard. */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/drive/:scope" element={<ProtectedRoute><DriveViewPage /></ProtectedRoute>} />
      </Routes>
      
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;