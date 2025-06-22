import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white dark:bg-zinc-900 shadow px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-semibold text-blue-600">
        Classroom
      </Link>

      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-sm">
            Hi, {user?.data.name} ({user?.data.role})
          </span>

          {user?.data.role === "teacher" && (
            <>
              <Link
                to="/classes/create"
                className="text-sm text-blue-500 hover:underline"
              >
                Create Class
              </Link>
              <Link
                to="/classes"
                className="text-sm text-blue-500 hover:underline"
              >
                My Classes
              </Link>
            </>
          )}

          {user.data.role === "student" && (
            <>
              <Link
                to="/classes/join"
                className="text-sm text-blue-500 hover:underline"
              >
                Join Class
              </Link>
              <Link
                to="/classes"
                className="text-sm text-blue-500 hover:underline"
              >
                My Classes
              </Link>
            </>
          )}

          <Button size="sm" variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <div className="space-x-2">
          <Link to="/login" className="text-sm text-blue-500 hover:underline">
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm text-blue-500 hover:underline"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
