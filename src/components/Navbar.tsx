import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-brand-tyrian/30 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-brand-plum">Rippling</a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#solutions">Solutions</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#resources">Resources</NavLink>
            <NavLink href="#about">About</NavLink>
          </div>

          <div className="flex items-center space-x-4">
            <button className="hidden md:block text-white hover:text-brand-plum transition">
              Sign In
            </button>
            <button className="bg-brand-plum text-brand-tyrian px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition">
              Get Started
            </button>
            <button className="md:hidden text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-white hover:text-brand-plum transition-colors duration-200"
  >
    {children}
  </a>
);

export default Navbar; 