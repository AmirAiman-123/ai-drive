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

import axios from 'axios';

// When deployed on Vercel, this uses the value of REACT_APP_API_BASE_URL.
// In local development, it's undefined, so Axios uses the "proxy" from package.json.
const baseURL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // This line is absolutely critical.
});

export default api;