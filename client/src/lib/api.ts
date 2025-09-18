import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 7000,
});

export default api;
