import { apiClient } from "./api.client";
import { ISuccessResponse, IUser } from "@/types";

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password?: string;
}

export const authApi = {
  signup: async (payload: SignupPayload): Promise<ISuccessResponse<{ user: IUser }>> => {
    const response = await apiClient.post("/auth/signup", payload);
    return response.data;
  },

  login: async (payload: LoginPayload): Promise<ISuccessResponse<{ user: IUser }>> => {
    const response = await apiClient.post("/auth/login", payload);
    return response.data;
  },

  logout: async (): Promise<ISuccessResponse<object>> => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  refreshToken: async (): Promise<ISuccessResponse<object>> => {
    const response = await apiClient.post("/auth/refresh-token");
    return response.data;
  },

  getMe: async (): Promise<ISuccessResponse<{ user: IUser }>> => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  updateProfile: async (payload: { name?: string }): Promise<ISuccessResponse<IUser>> => {
    const response = await apiClient.patch("/user/profile", payload);
    return response.data;
  },
};
