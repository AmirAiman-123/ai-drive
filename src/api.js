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

//import axios from 'axios';

// This logic tells the app:
// 1. If we are deployed on Vercel (or any production environment), use the URL from the environment variables.
// 2. If we are running locally (`npm start`), use the relative path '/' which will be handled by our package.json proxy.
//const baseURL = process.env.REACT_APP_API_BASE_URL || '/';

//const api = axios.create({
//  baseURL: baseURL,
  //withCredentials: true, // This is CRITICAL for sending cookies
//});
// File: AuraDrive/frontend/src/api.js (Definitive Final Version for Unified Hosting)

import axios from 'axios';

// When running locally, this sends requests to localhost:3000.
// The proxy in package.json forwards them to localhost:5000.
// When tunneled, this sends requests to your tunnel URL, and the proxy still works.
const api = axios.create({
//  baseURL: '/', // Use a relative path, NOT an environment variable.
  baseURL: process.env.REACT_APP_API_URL, // Use a relative path, NOT an environment variable.

  withCredentials: true,
});

//export default api;

export default api;