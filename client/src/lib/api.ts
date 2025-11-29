import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export const API_URL = "http://localhost:5285/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Store'dan token al (persist otomatik yükleniyor)
  const token = useAuthStore.getState().user?.token;
  
  console.log("🔐 API Request:", config.url, "Token:", token ? "✅ Var" : "❌ Yok");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - hata durumlarını yakala
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("❌ 401 Unauthorized - Token geçersiz veya eksik");
      console.log("Current user:", useAuthStore.getState().user);
    }
    return Promise.reject(error);
  }
);

export default api;