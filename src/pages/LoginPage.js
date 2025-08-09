// File: frontend/src/pages/LoginPage.js
// This is the new, definitive, and simplified version.

import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom'; // Make sure Navigate is imported
import api from '../api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login } = useAuth(); // Get user and login function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      toast.success(response.data.message);
      login(response.data.user); // This updates the context
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred during login.');
    }
  };

  // --- THIS IS THE RELIABLE REDIRECT LOGIC ---
  // If the 'user' object exists in our context, it means we are logged in.
  // This component's job is then to redirect away.
  // --- NEW SIMPLIFIED REDIRECT LOGIC ---
  // If a user object exists, it means we are logged in.
  // Send EVERYONE to the dashboard. The dashboard will handle showing the right content.
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If there is no user, we show the login form.
  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-header">
          <h2>Welcome Back to AI Drive</h2>
          <p>Sign in to access your intelligent cloud.</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {/* ... form inputs are the same ... */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g., your.name@example.com"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;