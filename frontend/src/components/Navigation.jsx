import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/perfumes", label: "Perfumes" },
  { path: "/faq", label: "FAQ" },
  { path: "/about", label: "About" },
];

export default function Navigation() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

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
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.4em] text-white/60"
        >
          Atelier Noir
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.path} to={link.path} className={linkClasses(link.path)}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden w-28 justify-end md:flex">
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/40">
            Est. 2025
          </span>
        </div>
        <button
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
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
        </div>
      )}
    </header>
  );
}
