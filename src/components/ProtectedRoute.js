// File: AuraDrive/frontend/src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // --- THIS IS THE NEW LOGIC ---
  if (loading) {
    // While the context is checking for a session, show a loading indicator
    // or a blank screen to prevent a flicker/redirect.
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading Session...</h2>
      </div>
    );
  }

  if (!user) {
    // If loading is finished AND there's still no user, then redirect.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;