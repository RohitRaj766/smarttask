"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/types";
import { authApi, LoginPayload, SignupPayload, VerifyEmailPayload } from "../services/auth.api";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<{ userId: string; email: string }>;
  verifyEmail: (payload: VerifyEmailPayload) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/verify-email", "/forgot-password", "/reset-password"];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const res = await authApi.getMe();
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
    // Skip API calls on the public landing page (/)
    if (pathname === "/") {
      setIsLoading(false);
      return;
    }
    fetchCurrentUser();
  }, [pathname]);

  useEffect(() => {
    if (!isLoading) {
      // Don't auto redirect on landing page (/)
      if (pathname === "/") return;

      const isPublic = PUBLIC_ROUTES.includes(pathname);
      if (!user && !isPublic) {
        router.push("/");
      } else if (user && (pathname === "/login" || pathname === "/signup" || pathname === "/verify-email")) {
        router.push("/overview");
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (payload: LoginPayload) => {
    try {
      const res = await authApi.login(payload);
      if (res.success) {
        setUser(res.data.user);
        toast.success("Welcome back!");
        router.push("/overview");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || "Invalid email or password";
      toast.error(message);
      throw err;
    }
  };

  const signup = async (payload: SignupPayload) => {
    try {
      const res = await authApi.signup(payload);
      if (res.success) {
        toast.success("Registration successful! Check your email for verification OTP.");
        return res.data;
      }
      throw new Error(res.message);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to create account";
      toast.error(message);
      throw err;
    }
  };

  const verifyEmail = async (payload: VerifyEmailPayload) => {
    try {
      const res = await authApi.verifyEmail(payload);
      if (res.success) {
        setUser(res.data.user);
        toast.success("Email verified successfully! Welcome aboard.");
        router.push("/overview");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || "Invalid or expired OTP code";
      toast.error(message);
      throw err;
    }
  };

  const resendOtp = async (email: string) => {
    try {
      const res = await authApi.resendOtp({ email });
      if (res.success) {
        toast.success("A new verification OTP has been sent to your email.");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to resend OTP";
      toast.error(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/");
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
