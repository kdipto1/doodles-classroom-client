import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import axiosInstance from "../api/axios";
import axios from "axios";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "teacher" | "student";
  token: string;
}

interface LoginData {
  _id: string;
  accessToken: string;
  refreshToken: string;
  role: "teacher" | "student";
  name: string;
}

interface AuthContextType {
  user: LoginData | null;
  login: (user: LoginData) => void;
  logout: () => void;
  getMe: () => Promise<void>;
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

  const getMe = useCallback(async () => {
    try {
      const response = await axiosInstance.post("/auth/me");
      const fetchedUser = response.data;
      if (fetchedUser) {
        // Update the user in local storage and state with the fetched data
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...currentUser, ...fetchedUser, accessToken: currentUser.accessToken, refreshToken: currentUser.refreshToken };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          console.error("Failed to fetch user data: Request timed out or aborted.", error);
        } else {
          console.error("Failed to fetch user data:", error.response?.data?.message || error.message);
        }
      } else {
        console.error("Failed to fetch user data: An unexpected error occurred.", error);
      }
      // If fetching user data fails, it might mean the token is invalid
      // or expired, so log out the user.
      logout();
    }
  }, [logout, setUser]);

  useEffect(() => {
    if (user && user.accessToken) {
      getMe();
    }
  }, [getMe]);

  return (
    <AuthContext.Provider value={{ user, login, logout, getMe }}>
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
