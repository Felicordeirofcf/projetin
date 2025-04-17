import axios from "axios";

// Decide automaticamente qual API usar
const API_URL = window.location.hostname === "localhost"
  ? "http://127.0.0.1:8000"
  : "https://calculoprojeto.onrender.com";

console.log("API URL usada:", API_URL);

const api = axios.create({
  baseURL: API_URL,
});

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
