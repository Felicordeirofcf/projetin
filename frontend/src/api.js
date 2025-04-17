import axios from "axios";

const API_URL = process.env.NODE_ENV === "production"
  ? "https://calculoprojeto.onrender.com"
  : "http://127.0.0.1:8000";

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
