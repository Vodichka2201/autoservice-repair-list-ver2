import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:1337/api', // URL Strapi backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Можно добавить интерсепторы для авторизации, обработки ошибок и т.д.

export default api;
