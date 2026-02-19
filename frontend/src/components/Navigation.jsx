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
      isActive(path) ? "text-white" : "text-white/50 hover:text-white"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-5 md:py-6">
        <Link to="/" className="text-xs uppercase tracking-[0.4em] text-white/60">
          Atelier Noir
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
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.4em] text-white/40">
                <User size={12} />
                {user.email?.split("@")[0]}
              </span>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-white transition"
              >
                <LogOut size={12} />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-white transition"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="flex flex-col border-t border-white/10 bg-black/95 px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`py-3 text-sm uppercase tracking-[0.2em] ${
                isActive(link.path) ? "text-white" : "text-white/60"
              }`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-white/10 pt-4">
            {user ? (
              <button
                onClick={() => { signOut(); setOpen(false); }}
                className="flex items-center gap-2 py-2 text-xs uppercase tracking-[0.4em] text-white/40"
              >
                <LogOut size={12} /> Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="block py-2 text-xs uppercase tracking-[0.4em] text-white/40"
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
