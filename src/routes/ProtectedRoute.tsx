import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: ("student" | "teacher")[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (
    allowedRoles &&
    !allowedRoles.includes(user?.role as "student" | "teacher")
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
