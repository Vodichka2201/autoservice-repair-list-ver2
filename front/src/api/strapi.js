import axios from 'axios';

const api = axios.create({
  baseURL: 'https://strapi.ti-soft.ru', // Updated URL Strapi backend without /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Можно добавить интерсепторы для авторизации, обработки ошибок и т.д.

export default api;
