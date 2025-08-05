// File: frontend/src/pages/RegisterPage.js
// This is the final, corrected version.

import React, { useState } from 'react';
// 1. ADD 'Navigate' to the import line here
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { toast } from 'react-toastify';
import './AuthForm.css';

const RegisterPage = () => {
  // 2. All hooks are correctly declared at the top. This is great.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [matrickNumber, setMatrickNumber] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();
  const { user } = useAuth();

  // 3. This redirect logic is in the perfect spot.
  if (user) {
    // Don't let a logged-in user see the register page
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      password,
      matrickNumber: role === 'student' ? matrickNumber : null,
    };
    try {
      const response = await api.post('/auth/register', payload);
      toast.success(response.data.message + " Please log in.");
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred during registration.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-header">
          <h2>Create Your AIDrive Account</h2>
          <p>Join the next-generation educational platform.</p>
        </div>
        
        <div className="role-selector">
          <button 
            className={`role-button ${role === 'student' ? 'selected' : ''}`}
            onClick={() => setRole('student')}>
            I am a Student
          </button>
          <button 
            className={`role-button ${role === 'staff' ? 'selected' : ''}`}
            onClick={() => setRole('staff')}>
            I am a Staff/Lecturer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g., your.name@university.com"
            />
          </div>

          {role === 'student' && (
            <div className="input-group">
              <label htmlFor="matrickNumber">Matrick Number</label>
              <input
                type="text"
                id="matrickNumber"
                value={matrickNumber}
                onChange={(e) => setMatrickNumber(e.target.value)}
                required
                placeholder="e.g., U1234567X"
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Choose a strong password"
            />
          </div>
          <button type="submit" className="auth-button">Create Account</button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;