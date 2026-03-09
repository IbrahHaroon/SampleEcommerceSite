import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/perfumes", label: "Perfumes" },
  { path: "/faq", label: "FAQ" },
  { path: "/about", label: "About" },
];

export default function Navigation() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const linkClasses = (path) =>
    `text-sm tracking-[0.2em] uppercase transition ${
      isActive(path) ? "text-gray-100" : "text-gray-400 hover:text-gray-100"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-400/20 bg-gray-800/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-5 md:py-6">
        <Link to="/" className="text-xs uppercase tracking-[0.4em] text-gray-300">
          Ibrahim's Samples
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.path} to={link.path} className={linkClasses(link.path)}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth controls — desktop */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.4em] text-gray-400">
                <User size={12} />
                {user.email?.split("@")[0]}
              </span>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.4em] text-gray-400 hover:text-gray-100 transition"
              >
                <LogOut size={12} />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-[10px] uppercase tracking-[0.4em] text-gray-400 hover:text-gray-100 transition"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-gray-400/30 text-gray-200 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="flex flex-col border-t border-gray-400/20 bg-gray-800/80 px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`py-3 text-sm uppercase tracking-[0.2em] ${
                isActive(link.path) ? "text-gray-100" : "text-gray-400"
              }`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-gray-400/20 pt-4">
            {user ? (
              <button
                onClick={() => { signOut(); setOpen(false); }}
                className="flex items-center gap-2 py-2 text-xs uppercase tracking-[0.4em] text-gray-400"
              >
                <LogOut size={12} /> Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="block py-2 text-xs uppercase tracking-[0.4em] text-gray-400"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
