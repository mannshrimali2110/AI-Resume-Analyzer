import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  // Increased timeout because AI calls can take longer than a typical REST request.
  // 7000ms was too short and caused frontend aborts while the server waited for Gemini.
  timeout: 60000,
});

export default api;
