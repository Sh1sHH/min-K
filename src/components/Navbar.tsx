import React, { useState, useEffect } from "react";
import { Menu, MenuItem, HoveredLink, ProductItem } from "./ui/navbar-menu";
import { Calculator, FileText, HelpCircle, MessageSquare, Package, Receipt, Settings } from "lucide-react";
import { Button } from "./ui/button";
import AuthModal from "./auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [active, setActive] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { currentUser, isAdmin, logout } = useAuth();

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        // Scrolling UP or at top
        setIsVisible(true);
      } else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        // Scrolling DOWN and not at top
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <div 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent h-20 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl">
          {/* Logo and Navigation */}
          <div className="mx-8 px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <span className="text-xl font-semibold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                  İKyardim
                </span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden lg:flex items-center gap-8">
                <NavLink href="/features">Features</NavLink>
                <NavLink href="/pricing">Pricing</NavLink>
                <NavLink href="/blog">Blog</NavLink>
                <NavLink href="/contact">Contact</NavLink>
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center gap-4">
                {currentUser ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin">
                        <Button 
                          variant="ghost" 
                          className="text-white hover:text-white hover:bg-white/10 rounded-full px-4 py-2 text-sm"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="ghost" 
                      className="text-white hover:text-white hover:bg-white/10 rounded-full px-6 py-2 text-sm"
                      onClick={handleLogout}
                    >
                      Çıkış Yap
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      className="text-white hover:text-white hover:bg-white/10 rounded-full px-6 py-2 text-sm"
                      onClick={() => handleAuthClick('login')}
                    >
                      Giriş Yap
                    </Button>
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2 text-sm transition-all duration-200"
                      onClick={() => handleAuthClick('register')}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

const NavLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
  <Link 
    to={href}
    className={cn(
      "text-sm text-white hover:text-white transition-colors",
      className
    )}
  >
    {children}
  </Link>
);

export default Navbar; 