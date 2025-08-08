import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import axiosInstance from "../api/axios";
import { getData } from "@/api/response";
// import { apiResponseSchema } from "../lib/validation";

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
  email?: string;
}

interface AuthContextType {
  user: LoginData | null;
  login: (user: LoginData) => void;
  logout: () => void;
  getMe: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoginData | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = (userData: LoginData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const getMe = useCallback(async () => {
    if (!user?.accessToken) return;
    
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/auth/me");
      const userData = getData(response);
      
      if (userData) {
        // Update the user in local storage and state with the fetched data
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { 
          ...currentUser, 
          ...userData, 
          accessToken: currentUser.accessToken, 
          refreshToken: currentUser.refreshToken 
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error("Failed to fetch user data:", (error as any).response?.data?.message || (error as Error).message);
      
      // Only logout if it's an authentication error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).response?.status === 401 || (error as any).response?.status === 403) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.accessToken, logout]);

  useEffect(() => {
    if (user && user.accessToken) {
      getMe();
    }
  }, []); // Remove getMe from dependencies to prevent infinite loop

  return (
    <AuthContext.Provider value={{ user, login, logout, getMe, isLoading }}>
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
