import React, { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "../types";
import {
  authService,
  LoginPayload,
  SignupPayload,
  VerifyEmailPayload,
  ForgotPasswordPayload,
  VerifyResetOtpPayload,
  ResetPasswordPayload,
} from "../services/auth.service";
import { tokenStore } from "../services/secure-store";

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<{ userId: string; email: string }>;
  verifyEmail: (payload: VerifyEmailPayload) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<void>;
  verifyResetOtp: (payload: VerifyResetOtpPayload) => Promise<void>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const token = await tokenStore.getAccessToken();
      if (!token) {
        setUser(null);
        return;
      }
      const res = await authService.getMe();
      if (res.success) {
        setUser(res.data.user);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (payload: LoginPayload) => {
    const res = await authService.login(payload);
    if (res.success && res.data) {
      if (res.data.accessToken) {
        await tokenStore.setAccessToken(res.data.accessToken);
      }
      if (res.data.refreshToken) {
        await tokenStore.setRefreshToken(res.data.refreshToken);
      }
      setUser(res.data.user);
    }
  };

  const signup = async (payload: SignupPayload) => {
    const res = await authService.signup(payload);
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message);
  };

  const verifyEmail = async (payload: VerifyEmailPayload) => {
    const res = await authService.verifyEmail(payload);
    if (res.success && res.data) {
      if (res.data.accessToken) {
        await tokenStore.setAccessToken(res.data.accessToken);
      }
      if (res.data.refreshToken) {
        await tokenStore.setRefreshToken(res.data.refreshToken);
      }
      setUser(res.data.user);
    }
  };

  const resendOtp = async (email: string) => {
    await authService.resendOtp({ email });
  };

  const forgotPassword = async (payload: ForgotPasswordPayload) => {
    await authService.forgotPassword(payload);
  };

  const verifyResetOtp = async (payload: VerifyResetOtpPayload) => {
    await authService.verifyResetOtp(payload);
  };

  const resetPassword = async (payload: ResetPasswordPayload) => {
    await authService.resetPassword(payload);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      await tokenStore.clearTokens();
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        verifyEmail,
        resendOtp,
        forgotPassword,
        verifyResetOtp,
        resetPassword,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
