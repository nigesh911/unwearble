import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { isAuthenticated } from '../utils/auth';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    setIsAdmin(isAuthenticated());
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-jet-black/95 backdrop-blur-sm shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-serif font-bold">
            <span className="text-acid-green">UN</span>
            <span className="text-soft-gray">WEAR</span>
            <span className="text-acid-green">BLE</span>
          </Link>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-soft-gray hover:text-acid-green transition-colors">
              Home
            </a>
            <a href="#products" className="text-soft-gray hover:text-acid-green transition-colors">
              Products
            </a>
            <a href="#about" className="text-soft-gray hover:text-acid-green transition-colors">
              About
            </a>
            {isAdmin ? (
              <Link 
                to="/admin/dashboard" 
                className="text-acid-green hover:text-acid-green/80 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                to="/admin/login" 
                className="text-soft-gray hover:text-acid-green transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-soft-gray hover:text-acid-green"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-jet-black/95 backdrop-blur-md border-b border-soft-gray/10 animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a 
              href="/" 
              className="text-soft-gray hover:text-acid-green py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#products" 
              className="text-soft-gray hover:text-acid-green py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </a>
            <a 
              href="#about" 
              className="text-soft-gray hover:text-acid-green py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            {isAdmin ? (
              <Link 
                to="/admin/dashboard" 
                className="text-acid-green hover:text-acid-green/80 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                to="/admin/login" 
                className="text-soft-gray hover:text-acid-green py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;