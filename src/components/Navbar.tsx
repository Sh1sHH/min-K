import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItem, HoveredLink, ProductItem } from "./ui/navbar-menu";
import { Calculator, FileText, HelpCircle, MessageSquare, Package, Receipt, Settings, Zap, ChevronDown, User } from "lucide-react";
import { Button } from "./ui/button";
import AuthModal from "./auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [active, setActive] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { currentUser, isAdmin, isSubscriber, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleScrollToSection = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight = 80; // Navbar height
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If not on home page, navigate to home
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      // If on home page, scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
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
          <div className="mx-8 px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <button 
                onClick={handleLogoClick}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span className="text-xl font-semibold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                  İKyardim
                </span>
              </button>

              {/* Navigation Links */}
              <div className="hidden lg:flex items-center gap-8">
                <button 
                  onClick={(e) => handleScrollToSection('services-section', e)}
                  className="text-sm text-white hover:text-white transition-colors"
                >
                  Hizmetler
                </button>
                <button 
                  onClick={(e) => handleScrollToSection('benefits-section', e)}
                  className="text-sm text-white hover:text-white transition-colors"
                >
                  Faydalar
                </button>

                <button 
                  onClick={(e) => handleScrollToSection('sss-section', e)}
                  className="text-sm text-white hover:text-white transition-colors"
                >
                  SSS
                </button>

                <button 
                  onClick={(e) => handleScrollToSection('price-section', e)}
                  className="text-sm text-white hover:text-white transition-colors"
                >
                  Abonelikler
                </button>

              </div>

              {/* Auth Buttons */}
              <div className="flex items-center gap-4">
                {currentUser ? (
                  <div className="relative" ref={userMenuRef}>
                    <Button 
                      variant="ghost" 
                      className="text-white hover:text-white hover:bg-white/10 rounded-full px-4 py-2 text-sm flex items-center gap-2"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="" className="w-6 h-6 rounded-full" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {currentUser.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span>{currentUser.displayName || currentUser.email?.split('@')[0]}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </Button>

                    {/* User Menu Dropdown */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-black/50 backdrop-blur-xl border border-white/5 rounded-lg shadow-lg py-1 z-50">
                        <div className="px-4 py-2 border-b border-white/5">
                          <p className="text-sm text-white truncate">{currentUser.email}</p>
                        </div>

                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Profil</span>
                          </div>
                        </Link>

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

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4" />
                              <span>Admin Panel</span>
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
                  </div>
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
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 text-sm transition-all duration-200"
                      onClick={() => handleAuthClick('register')}
                    >
                      Kayıt Ol
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