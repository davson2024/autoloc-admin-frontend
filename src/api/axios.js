import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour logger les requêtes
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Requête API:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Erreur requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour logger les réponses
api.interceptors.response.use(
  (response) => {
    console.log('✅ Réponse API:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Erreur réponse:', error);
    return Promise.reject(error);
  }
);

export default api;