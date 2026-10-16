import axios from "axios";

/**
 * Local dev → http://localhost:3001
 * Production → use REACT_APP_BACKEND_URL
 */
const isLocalDev =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const BACKEND_URL = isLocalDev
  ? "http://localhost:3001"
  : process.env.REACT_APP_BACKEND_URL || "https://drivedocai-backend.onrender.com";

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout for production
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("drive_rag_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 (logout automatically)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("drive_rag_token");
      localStorage.removeItem("drive_rag_user");

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
export const BACKEND_BASE = BACKEND_URL;