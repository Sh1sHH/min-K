import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItem, HoveredLink, ProductItem } from "./ui/navbar-menu";
import { Calculator, FileText, HelpCircle, MessageSquare, Package, Receipt, Settings, Zap } from "lucide-react";
import { Button } from "./ui/button";
import AuthModal from "./auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [active, setActive] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { currentUser, isAdmin, isSubscriber, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/100 to-transparent h-20 pointer-events-none" />


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
                    {isSubscriber && (
                      <Link
                        to="/premium"
                        className="text-sm text-white hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span>Premium Panel</span>
                        </div>
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

      {/* User Menu Dropdown */}
      {currentUser && showUserMenu && (
        <div
          ref={userMenuRef}
          className="absolute right-4 top-16 w-48 bg-black/50 backdrop-blur-xl border border-white/5 rounded-lg shadow-lg py-1 z-50"
        >
          <div className="px-4 py-2 border-b border-white/5">
            <p className="text-sm text-white truncate">{currentUser.email}</p>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="block px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
              onClick={() => setShowUserMenu(false)}
            >
              Admin Panel
            </Link>
          )}

          {isSubscriber && (
            <Link
              to="/premium"
              className="block px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
              onClick={() => setShowUserMenu(false)}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Premium Panel</span>
              </div>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      )}

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