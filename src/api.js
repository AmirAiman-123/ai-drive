// File: frontend/src/api.js

//import axios from 'axios';

// Create an instance of axios with a custom configuration
//const api = axios.create({
//  withCredentials: true,
//});


//const api = axios.create({
//  baseURL: 'http://127.0.0.1:5000', // Your public ngrok URL
//  withCredentials: true,
//});

//export default api;

// File: AuraDrive/frontend/src/api.js (Production Ready)

// File: AuraDrive/frontend/src/api.js (Definitive Final Version)
// File: AuraDrive/frontend/src/api.js (Definitive Final Version)

// File: AuraDrive/frontend/src/api.js

import axios from 'axios';

// This logic tells the app:
// 1. If we are deployed on Vercel (or any production environment), use the URL from the environment variables.
// 2. If we are running locally (`npm start`), use the relative path '/' which will be handled by our package.json proxy.
const baseURL = process.env.REACT_APP_API_BASE_URL || '/';

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // This is CRITICAL for sending cookies
});

// --- BULLETPROOF NGROK BYPASS INTERCEPTOR ---
// This interceptor runs for every single request before it is sent.
api.interceptors.request.use(
  (config) => {
    // Always add the bypass header, regardless of the baseURL.
    // The local Flask server will simply ignore this header, so it does no harm.
    // This GUARANTEES the header will be present for all ngrok requests from Vercel.
    config.headers['ngrok-skip-browser-warning'] = 'true';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;