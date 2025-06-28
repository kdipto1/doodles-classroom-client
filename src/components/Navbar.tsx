import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Navigation links for user roles
  const navLinks = user ? (
    <>
      {user?.role === "teacher" && (
        <>
          <Button
            asChild
            variant="ghost"
            className="text-sm font-medium text-blue-600 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Link to="/classes/create">Create Class</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="text-sm font-medium text-blue-600 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Link to="/classes">My Classes</Link>
          </Button>
        </>
      )}
      {user?.role === "student" && (
        <>
          <Button
            asChild
            variant="ghost"
            className="text-sm font-medium text-blue-600 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Link to="/classes/join">Join Class</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="text-sm font-medium text-blue-600 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Link to="/classes">My Classes</Link>
          </Button>
        </>
      )}
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setMenuOpen(false);
          handleLogout();
        }}
        className="w-full md:w-auto mt-2 md:mt-0 border-blue-200 hover:bg-blue-50"
      >
        Logout
      </Button>
    </>
  ) : (
    <>
      <Button
        asChild
        variant="ghost"
        className="text-sm font-medium text-blue-600 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        <Link to="/login">Login</Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        className="text-sm font-medium text-blue-600 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        <Link to="/register">Register</Link>
      </Button>
    </>
  );

  return (
    <nav className="w-full bg-white dark:bg-zinc-900 shadow px-4 py-3 flex items-center sticky top-0 z-30 border-b border-gray-100">
      <div className="flex items-center justify-between w-full">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold text-blue-600 tracking-tight"
        >
          <span className="inline-block bg-blue-600 text-white rounded-full px-2 py-1 text-lg font-bold">
            G
          </span>
          <span className="text-blue-600">Classroom</span>
        </Link>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden ml-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-4">
          {user && (
            <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-950 px-3 py-1 rounded-full">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-bold text-lg uppercase">
                {user?.name[0]}
              </span>
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Hi, {user?.name}{" "}
                <span className="text-xs text-gray-500 dark:text-gray-400">({user?.role})</span>
              </span>
            </div>
          )}
          {navLinks}
        </div>
      </div>
      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div className="absolute left-0 top-full w-full bg-white dark:bg-zinc-900 shadow-md border-b border-gray-100 dark:border-zinc-700 flex flex-col items-start px-4 py-4 md:hidden animate-fade-in z-40">
          {user && (
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full mb-3">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 font-bold text-lg uppercase">
                {user?.name[0]}
              </span>
              <span className="text-sm font-medium text-blue-900">
                Hi, {user?.name}{" "}
                <span className="text-xs text-gray-500">({user?.role})</span>
              </span>
            </div>
          )}
          <div className="flex flex-col w-full gap-2">{navLinks}</div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
