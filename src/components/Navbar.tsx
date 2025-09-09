import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Home,
  BookOpen,
  Plus,
  User,
  Menu,
  X,
  LogOut
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close mobile menu on route change and on Escape key
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Navigation links for user roles
  const navLinks = user ? (
    <>
      {user?.role === "teacher" && (
        <>
          <Button
            asChild
            variant="ghost"
            className="text-sm font-medium text-blue-600 hover:bg-blue-100 px-3 py-2 rounded transition-colors min-h-[44px]"
            onClick={() => setMenuOpen(false)}
          >
            <Link to="/classes/create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Class
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="text-sm font-medium text-blue-600 hover:bg-blue-100 px-3 py-2 rounded transition-colors min-h-[44px]"
            onClick={() => setMenuOpen(false)}
          >
            <Link to="/classes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              My Classes
            </Link>
          </Button>
        </>
      )}
      {user?.role === "student" && (
        <>
          <Button
            asChild
            variant="ghost"
            className="text-sm font-medium text-blue-600 hover:bg-blue-100 px-3 py-2 rounded transition-colors min-h-[44px]"
            onClick={() => setMenuOpen(false)}
          >
            <Link to="/classes/join" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Join Class
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="text-sm font-medium text-blue-600 hover:bg-blue-100 px-3 py-2 rounded transition-colors min-h-[44px]"
            onClick={() => setMenuOpen(false)}
          >
            <Link to="/classes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              My Classes
            </Link>
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
        className="w-full md:w-auto mt-2 md:mt-0 border-blue-200 hover:bg-blue-50 min-h-[44px]"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </>
  ) : (
    <>
      <Button
        asChild
        variant="ghost"
        className="text-sm font-medium text-blue-600 hover:bg-blue-100 px-3 py-2 rounded transition-colors min-h-[44px]"
        onClick={() => setMenuOpen(false)}
      >
        <Link to="/login">Login</Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        className="text-sm font-medium text-blue-600 hover:bg-blue-100 px-3 py-2 rounded transition-colors min-h-[44px]"
        onClick={() => setMenuOpen(false)}
      >
        <Link to="/register">Register</Link>
      </Button>
    </>
  );

  // Mobile bottom navigation
  const mobileNavItems = user ? [
    { icon: Home, label: "Dashboard", path: "/", active: location.pathname === "/" },
    { icon: BookOpen, label: "Classes", path: "/classes", active: location.pathname === "/classes" },
    ...(user.role === "teacher" ? [
      { icon: Plus, label: "Create", path: "/classes/create", active: location.pathname === "/classes/create" }
    ] : [
      { icon: Plus, label: "Join", path: "/classes/join", active: location.pathname === "/classes/join" }
    ]),
    { icon: User, label: "Profile", path: "/profile", active: location.pathname === "/profile" }
  ] : [];

  return (
    <>
      <nav className="w-full bg-white dark:bg-zinc-900 shadow px-4 py-3 flex items-center sticky top-0 z-30 border-b border-gray-100 dark:border-zinc-700">
        {/* Skip link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-white dark:bg-zinc-900 text-blue-600 px-3 py-1 rounded shadow"
        >
          Skip to content
        </a>
        <div className="flex items-center justify-between w-full">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-extrabold text-blue-600 tracking-tight"
          >
            <span className="inline-block bg-blue-600 text-white rounded-full px-2 py-1 text-lg font-bold">
              D
            </span>
            <span className="text-blue-600">Classroom</span>
          </Link>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden ml-2 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? (
              <X className="h-6 w-6 text-blue-600" />
            ) : (
              <Menu className="h-6 w-6 text-blue-600" />
            )}
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
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({user?.role})
                  </span>
                </span>
              </div>
            )}
            {navLinks}
            <ThemeToggle />
          </div>
        </div>
        {/* Mobile nav dropdown */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="absolute left-0 top-full w-full bg-white dark:bg-zinc-900 shadow-md border-b border-gray-100 dark:border-zinc-700 flex flex-col items-start px-4 py-4 md:hidden animate-fade-in z-40"
          >
            {user && (
              <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950 px-4 py-3 rounded-full mb-4 min-h-[48px]">
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-bold text-lg uppercase">
                  {user?.name[0]}
                </span>
                <div>
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100 block">
                    Hi, {user?.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({user?.role})
                  </span>
                </div>
              </div>
            )}
            <div className="flex flex-col w-full gap-2">
              {navLinks}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 z-50">
          <div className="flex items-center justify-around px-2 py-2">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors min-h-[56px] min-w-[56px] ${
                    item.active
                      ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
