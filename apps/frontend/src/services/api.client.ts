import axios from "axios";

const getApiBaseUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL_BASE || "http://localhost:5000";
  const prefix = process.env.NEXT_PUBLIC_API_PREFIX || "/api/v1";
  if (base.endsWith("/api/v1") || base.endsWith(prefix)) return base;
  return `${base.replace(/\/$/, "")}${prefix}`;
};

const API_BASE_URL = getApiBaseUrl();

if (process.env.NODE_ENV !== "production") {
  console.log(`[Frontend API Client] Connected to Base URL: ${API_BASE_URL}`);
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/signup") &&
      !originalRequest.url?.includes("/auth/verify-email") &&
      !originalRequest.url?.includes("/auth/resend-otp") &&
      !originalRequest.url?.includes("/auth/forgot-password") &&
      !originalRequest.url?.includes("/auth/verify-reset-otp") &&
      !originalRequest.url?.includes("/auth/reset-password") &&
      !originalRequest.url?.includes("/auth/refresh-token") &&
      !originalRequest.url?.includes("/auth/me")
    ) {
      originalRequest._retry = true;
      try {
        await apiClient.post("/auth/refresh-token");
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
