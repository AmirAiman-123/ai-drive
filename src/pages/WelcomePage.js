// File: AuraDrive/frontend/src/pages/WelcomePage.js

import React from 'react';
import './AuthForm.css'; // Reuse the same styles

const WelcomePage = () => {
  // This must be your backend ngrok URL
  const backendUrl = process.env.REACT_APP_API_BASE_URL;

  // This is the URL the user will be sent back to AFTER they click "Continue" on the ngrok page.
  const redirectUrl = window.location.origin + '/login';

  // Construct the final ngrok URL with the redirect parameter.
const ngrokGateUrl = `${backendUrl}/auth/gate?redirect=${encodeURIComponent(redirectUrl)}`;

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper" style={{ textAlign: 'center' }}>
        <div className="auth-header">
          <h2>Welcome to AuraDrive</h2>
          <p>To securely connect to the AuraDrive network, please continue.</p>
        </div>
        
        <a 
          href={ngrokGateUrl}
          className="auth-button" 
          style={{ textDecoration: 'none', display: 'block', marginTop: '2rem' }}
        >
          Proceed to Secure Connection
        </a>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '1rem' }}>
          You will be asked to authorize access once. This is a necessary security step.
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;