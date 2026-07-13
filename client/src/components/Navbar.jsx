import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ShieldAlert,
  LogIn,
  LayoutDashboard,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

const Navbar = () => {
  const { user, theme, syncTheme } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide header on printing
  if (location.pathname.includes("/print-cv")) return null;

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    syncTheme({
      theme: nextTheme,
      accentColor: user?.themeSettings?.accentColor || "#3b82f6",
      fontFamily: user?.themeSettings?.fontFamily || "Inter",
      layout: user?.themeSettings?.layout || "glass",
      animationsEnabled: user?.themeSettings?.animationsEnabled !== false,
    });
  };

  const navLinks = [
    { label: "About", path: "/#about" },
    { label: "Skills", path: "/#skills" },
    { label: "Certificates", path: "/#certificates" },
    { label: "Projects", path: "/#projects" },
    { label: "Gallery", path: "/#gallery" },
    { label: "Blog", path: "/blogs" },
    { label: "Contact", path: "/#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav shadow-lg">
      <div className="container mx-auto px-6 py-4 max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform"
          />
          <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all">
            PORTFOLIO
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.path}
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Header Controls */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* User Button */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              {user.role === "Owner" && (
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-inner">
                  ✔ Owner
                </span>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold py-2 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <LogIn className="h-4 w-4 text-purple-400" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-900 bg-slate-950/95 py-6 px-6 space-y-4 shadow-xl">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-900 flex justify-center">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl text-xs text-center flex items-center justify-center gap-1.5"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-slate-900 border border-slate-800 text-white font-bold py-3 rounded-xl text-xs text-center flex items-center justify-center gap-1.5"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
