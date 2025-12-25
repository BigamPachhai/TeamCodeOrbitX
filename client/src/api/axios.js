import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env.VITE_BACKEND_URL || "http://localhost:9000") + "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired - clear auth state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Trigger a custom event that components can listen to
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
    return Promise.reject(error);
  }
);

export default api;
