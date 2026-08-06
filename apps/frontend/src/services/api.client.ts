import axios from "axios";

const API_BASE_URL =
  `${process.env.NEXT_PUBLIC_API_URL_BASE}${
    process.env.NEXT_PUBLIC_API_PREFIX
  }`;

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
