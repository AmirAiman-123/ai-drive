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

import axios from 'axios';

// This reads the backend URL from the Vercel environment variable.
// For local development (when you run `npm start`), this variable won't exist,
// and Axios will correctly use the "proxy" we set up in package.json.
const baseURL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // This is CRITICAL for sending cookies
});

export default api;