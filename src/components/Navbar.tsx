import React from 'react';
import { Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 bg-transparent py-4">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-white">Rippling</a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#solutions">Solutions</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#resources">Resources</NavLink>
            <NavLink href="#about">About</NavLink>
          </div>

          <div className="flex items-center space-x-4">
            <button className="hidden md:block text-white hover:text-gray-200 transition">
              Sign In
            </button>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition">
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
    className="text-white hover:text-gray-200 transition-colors duration-200"
  >
    {children}
  </a>
);

export default Navbar; 