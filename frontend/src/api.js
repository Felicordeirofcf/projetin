import axios from "axios";

// 👉 Adicionei o console.log aqui para debug
console.log("API URL usada:", process.env.REACT_APP_API_URL);

// Criação da instância do Axios com a URL do backend vinda da variável de ambiente
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Interceptador de requisições para incluir token JWT se existir
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config?.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
