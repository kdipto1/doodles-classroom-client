import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import axiosInstance from "../api/axios";
import { getData } from "@/api/response";
import { useQuery } from "@tanstack/react-query";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "teacher" | "student";
  token: string;
}

import type { LoginData } from "@/lib/validation"; // New import

interface AuthContextType {
  user: LoginData | null;
  login: (user: LoginData) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoginData | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData: LoginData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const {
    data: fetchedUser,
    isLoading,
    error,
  } = useQuery<IUser>({
    queryKey: ["me", user?.accessToken],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return getData(response);
    },
    enabled: !!user?.accessToken,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Use useEffect to handle onSuccess equivalent
  useEffect(() => {
    if (fetchedUser) {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = {
        ...currentUser,
        ...fetchedUser,
        accessToken: currentUser.accessToken,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  }, [fetchedUser]);

  // Use useEffect to handle onError equivalent
  useEffect(() => {
    if (error) {
      const axiosError = error as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (axiosError.isAxiosError && axiosError.config.url === "/auth/me") {
        console.error(
          "Failed to fetch user data:",
          axiosError.response?.data?.message || axiosError.message
        );

        if (
          axiosError.response?.status === 401 ||
          axiosError.response?.status === 403
        ) {
          logout();
        }
      }
    }
  }, [error, logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
