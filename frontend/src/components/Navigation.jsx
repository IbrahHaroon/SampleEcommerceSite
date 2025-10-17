import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import '../styles/globals.css';

export default function Navigation({ cartItemCount = 0 }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200
    ${isActive(path)
      ? 'text-primary'
      : 'text-text hover:text-primary'}
  `;

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50
      bg-[rgba(251,251,253,${isScrolled ? '0.9' : '0.8'})]
      backdrop-blur-md transition-all duration-300
      ${isScrolled ? 'shadow-sm' : ''}
    `}>
      <div className="h-12 flex items-center justify-center border-b border-[#d2d2d7]">
        <div className="container flex items-center justify-between">
          <Link 
            to="/" 
            className="text-lg font-semibold text-text hover:text-primary transition-colors"
          >
            Essence Decants
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-6">
            <Link to="/" className={navLinkClass('/')}>
              Home
            </Link>
            <Link to="/products" className={navLinkClass('/products')}>
              Products
            </Link>
            <Link to="/about" className={navLinkClass('/about')}>
              About
            </Link>
            <Link to="/contact" className={navLinkClass('/contact')}>
              Contact
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-text hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link
              to="/cart"
              className="relative p-2 text-text hover:text-primary transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed right-4 top-2 p-2 text-[#1d1d1f] hover:opacity-70 transition-opacity"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Mobile menu */}
      <div 
        className={`md:hidden absolute w-full bg-[rgba(251,251,253,0.95)] transition-all duration-300 border-b border-[#d2d2d7]
          ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        <div className="px-8 py-2 space-y-1">
          <Link
            to="/"
            className="block py-2 text-sm text-[#1d1d1f] hover:opacity-70 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="block py-2 text-sm text-[#1d1d1f] hover:opacity-70 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            to="/about"
            className="block py-2 text-sm text-[#1d1d1f] hover:opacity-70 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block py-2 text-sm text-[#1d1d1f] hover:opacity-70 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}