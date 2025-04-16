// src/api.js
import axios from "axios";

// Instância personalizada do Axios com baseURL da API
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Interceptor para incluir token de autenticação (se existir no localStorage)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config?.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Trata erro ao preparar a requisição
    return Promise.reject(error);
  }
);

export default api;
