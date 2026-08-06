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

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword?: string;
}

export interface ChangePasswordPayload {
  oldPassword?: string;
  newPassword?: string;
}

export const authApi = {
  signup: async (payload: SignupPayload): Promise<ISuccessResponse<{ userId: string; email: string }>> => {
    const response = await apiClient.post("/auth/signup", payload);
    return response.data;
  },

  verifyEmail: async (payload: VerifyEmailPayload): Promise<ISuccessResponse<{ user: IUser }>> => {
    const response = await apiClient.post("/auth/verify-email", payload);
    return response.data;
  },

  resendOtp: async (payload: ResendOtpPayload): Promise<ISuccessResponse<object>> => {
    const response = await apiClient.post("/auth/resend-otp", payload);
    return response.data;
  },

  login: async (payload: LoginPayload): Promise<ISuccessResponse<{ user: IUser }>> => {
    const response = await apiClient.post("/auth/login", payload);
    return response.data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<ISuccessResponse<object>> => {
    const response = await apiClient.post("/auth/forgot-password", payload);
    return response.data;
  },

  verifyResetOtp: async (payload: VerifyResetOtpPayload): Promise<ISuccessResponse<object>> => {
    const response = await apiClient.post("/auth/verify-reset-otp", payload);
    return response.data;
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<ISuccessResponse<object>> => {
    const response = await apiClient.post("/auth/reset-password", payload);
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

  changePassword: async (payload: ChangePasswordPayload): Promise<ISuccessResponse<object>> => {
    const response = await apiClient.post("/user/change-password", payload);
    return response.data;
  },
};

