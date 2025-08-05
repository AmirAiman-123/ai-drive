// File: frontend/src/api.js

import axios from 'axios';

// Create an instance of axios with a custom configuration
const api = axios.create({
  withCredentials: true,
});


//const api = axios.create({
//  baseURL: 'http://127.0.0.1:5000', // Your public ngrok URL
//  withCredentials: true,
//});

export default api;