import { apiClient } from "./api.client";
import { ISuccessResponse, IUser } from "../types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
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
  newPassword: string;
}

export interface AuthSuccessData {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<ISuccessResponse<AuthSuccessData>> {
    const res = await apiClient.post<ISuccessResponse<AuthSuccessData>>("/auth/login", payload);
    return res.data;
  },

  async signup(payload: SignupPayload): Promise<ISuccessResponse<{ userId: string; email: string }>> {
    const res = await apiClient.post<ISuccessResponse<{ userId: string; email: string }>>("/auth/register", payload);
    return res.data;
  },

  async verifyEmail(payload: VerifyEmailPayload): Promise<ISuccessResponse<AuthSuccessData>> {
    const res = await apiClient.post<ISuccessResponse<AuthSuccessData>>("/auth/verify-email", payload);
    return res.data;
  },

  async resendOtp(payload: { email: string }): Promise<ISuccessResponse<null>> {
    const res = await apiClient.post<ISuccessResponse<null>>("/auth/resend-otp", payload);
    return res.data;
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<ISuccessResponse<null>> {
    const res = await apiClient.post<ISuccessResponse<null>>("/auth/forgot-password", payload);
    return res.data;
  },

  async verifyResetOtp(payload: VerifyResetOtpPayload): Promise<ISuccessResponse<null>> {
    const res = await apiClient.post<ISuccessResponse<null>>("/auth/verify-reset-otp", payload);
    return res.data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<ISuccessResponse<null>> {
    const res = await apiClient.post<ISuccessResponse<null>>("/auth/reset-password", payload);
    return res.data;
  },

  async getMe(): Promise<ISuccessResponse<{ user: IUser }>> {
    const res = await apiClient.get<ISuccessResponse<{ user: IUser }>>("/auth/me");
    return res.data;
  },

  async logout(): Promise<ISuccessResponse<null>> {
    const res = await apiClient.post<ISuccessResponse<null>>("/auth/logout");
    return res.data;
  },
};
