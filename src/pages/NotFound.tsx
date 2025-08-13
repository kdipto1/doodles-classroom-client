import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/context/AuthContext";

function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = useCallback(() => {
    navigate(user ? "/" : "/login");
  }, [navigate, user]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <EmptyState
        icon={<SearchX className="w-8 h-8 text-gray-500" aria-hidden />}
        title="Page not found"
        description="The page you’re looking for doesn’t exist or has been moved."
        action={{ label: user ? "Go to dashboard" : "Go to login", onClick: handleGoHome }}
        className="max-w-xl"
      />
    </div>
  );
}

export default NotFound;
