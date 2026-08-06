"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/types";
import { authApi, LoginPayload, SignupPayload } from "../services/auth.api";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/", "/login", "/signup"];

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
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isPublic = PUBLIC_ROUTES.includes(pathname);
      if (!user && !isPublic) {
        router.push("/login");
      } else if (user && isPublic) {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (payload: LoginPayload) => {
    try {
      const res = await authApi.login(payload);
      if (res.success) {
        setUser(res.data.user);
        toast.success("Welcome back!");
        router.push("/dashboard");
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
        setUser(res.data.user);
        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to create account";
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
      router.push("/login");
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
