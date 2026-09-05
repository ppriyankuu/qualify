"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { User, UserRole, LoginCredentials, RegisterCredentials } from "@/types/auth";
import { apiClient } from "@/lib/api-client";

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  quickLoginAsDemo: (role: UserRole) => Promise<User>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage and verify with backend on mount
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("auth_user");

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (mounted) {
            setToken(storedToken);
            setUser(parsedUser);
          }

          // Verify token validity with backend
          try {
            const verifyRes = await apiClient.get<{
              success: boolean;
              user: User;
            }>("/auth/me");

            if (mounted && verifyRes?.user) {
              const mergedUser: User = {
                ...parsedUser,
                ...verifyRes.user,
                name: verifyRes.user.name || parsedUser.name,
              };
              setUser(mergedUser);
              localStorage.setItem("auth_user", JSON.stringify(mergedUser));
            }
          } catch (err: any) {
            // Token is expired or invalid on backend
            if (err?.status === 401) {
              if (mounted) {
                setToken(null);
                setUser(null);
              }
              localStorage.removeItem("auth_token");
              localStorage.removeItem("auth_user");
            }
          }
        }
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initSession();

    return () => {
      mounted = false;
    };
  }, []);

  const saveSession = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<User> => {
      setIsLoading(true);
      try {
        const response = await apiClient.post<{
          success: boolean;
          token: string;
          user: User;
        }>("/auth/login", credentials);

        if (response && response.token && response.user) {
          saveSession(response.token, response.user);
          return response.user;
        }
        throw new Error("Invalid response from server");
      } finally {
        setIsLoading(false);
      }
    },
    [saveSession]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<User> => {
      setIsLoading(true);
      try {
        const response = await apiClient.post<{
          success: boolean;
          token: string;
          user: User;
        }>("/auth/register", credentials);

        if (response && response.token && response.user) {
          saveSession(response.token, response.user);
          return response.user;
        }
        throw new Error("Registration failed: Invalid response from server");
      } finally {
        setIsLoading(false);
      }
    },
    [saveSession]
  );

  const quickLoginAsDemo = useCallback(
    async (role: UserRole): Promise<User> => {
      const credentials =
        role === "admin"
          ? { email: "admin@scholarships.gov.in", password: "Admin@12345" }
          : { email: "student1@test.com", password: "Student@12345" };

      return await login(credentials);
    },
    [login]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }, []);

  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      let hasChanges = false;
      for (const key of Object.keys(updatedUser) as (keyof User)[]) {
        if (prev[key] !== updatedUser[key]) {
          hasChanges = true;
          break;
        }
      }
      if (!hasChanges) return prev;
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem("auth_user", JSON.stringify(merged));
      return merged;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      role: user?.role || null,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      register,
      quickLoginAsDemo,
      logout,
      updateUser,
    }),
    [user, token, isLoading, login, register, quickLoginAsDemo, logout, updateUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
