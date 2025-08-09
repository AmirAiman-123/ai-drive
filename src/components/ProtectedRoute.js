// File: AuraDrive/frontend/src/components/ProtectedRoute.js (Definitive Final Version)

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  // We now use 'sessionChecked' instead of 'loading'.
  const { user, sessionChecked } = useAuth();
  const location = useLocation();

  // If the initial session check has NOT finished, we show a loading screen.
  // This prevents any child components (like DriveViewPage) from trying to fetch data
  // before we are 100% sure about the user's login status.
  if (!sessionChecked) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Authenticating Session...</h2>
      </div>
    );
  }

  // If the session check IS finished, and there is still no user, then redirect.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the session check is finished and we have a user, render the page.
  return children;
};

export default ProtectedRoute;