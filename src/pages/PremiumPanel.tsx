import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { toast } from 'sonner';
import {
  Home,
  Calculator,
  Users,
  LogOut,
  MessageSquare,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';
import BordroHesaplama from '@/components/subscriber/BordroHesaplama';
import HeadHunter from '@/components/subscriber/HeadHunter';
import AskExpert from '@/components/subscriber/AskExpert';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  divider?: boolean;
}

const PremiumPanel = () => {
  const { currentUser, isPremium } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('calculator');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const auth = getAuth();

  // Menü öğeleri
  const menuItems: MenuItem[] = [
    { id: 'calculator', title: 'Bordro Hesaplama', icon: <Calculator size={20} /> },
    { id: 'headhunter', title: 'Head Hunter', icon: <Users size={20} /> },
    { id: 'askexpert', title: 'İKyardım Hattı', icon: <MessageSquare size={20} /> }
  ];

  // Kullanıcı ve premium üyelik kontrolü
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      toast.error('Giriş yapmanız gerekiyor');
      return;
    }

    if (!isPremium) {
      navigate('/');
      toast.error('Bu sayfaya erişim için premium üye olmanız gerekiyor');
      return;
    }
  }, [currentUser, isPremium, navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  // Kullanıcı girişi yoksa veya premium değilse içeriği gösterme
  if (!currentUser || !isPremium) {
    return null;
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      isDarkMode ? "bg-[#0F0F0F]" : "bg-gray-50"
    )}>
      <div className="flex h-screen">
        {/* Sol Menü - Küçük Versiyon */}
        <div 
          className={cn(
            "flex flex-col transition-all duration-300 shadow-sm",
            isDarkMode 
              ? "bg-black/50 backdrop-blur-sm border-r border-white/5" 
              : "bg-white border-r border-gray-200",
            isExpanded ? "w-64" : "w-16"
          )}
        >
          {/* Logo ve Başlık */}
          <div className={cn(
            "h-16 px-4 flex items-center gap-2",
            isDarkMode ? "border-b border-white/5" : "border-b border-gray-100",
            isExpanded ? "justify-between" : "justify-center"
          )}>
            {isExpanded && (
              <h1 className={cn(
                "text-lg font-semibold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Premium Panel
              </h1>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                isDarkMode 
                  ? "hover:bg-white/5 text-gray-300" 
                  : "hover:bg-gray-100 text-gray-500",
                isExpanded ? "ml-auto" : "mx-auto"
              )}
            >
              <ChevronRight className={cn(
                "w-5 h-5 transition-transform",
                isExpanded ? "rotate-180" : "rotate-0"
              )} />
            </button>
          </div>

          {/* Ana Sayfaya Dönüş */}
          <Link 
            to="/"
            className={cn(
              "flex items-center gap-2 rounded-lg transition-colors",
              isDarkMode 
                ? "text-gray-300 hover:bg-white/5" 
                : "text-gray-600 hover:bg-gray-50",
              isExpanded ? "mx-2 px-4 py-3 mt-4" : "mx-auto p-3 mt-4"
            )}
            title="Ana Sayfaya Dön"
          >
            <Home className="w-5 h-5" />
            {isExpanded && <span className="text-sm">Ana Sayfaya Dön</span>}
          </Link>

          {/* Menü Öğeleri */}
          <nav className="flex-1 mt-2">
            {menuItems.map((item) => (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "flex items-center transition-colors w-full",
                    isExpanded ? "px-6 py-3" : "py-3 justify-center",
                    isDarkMode
                      ? activeSection === item.id 
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-300 hover:bg-white/5'
                      : activeSection === item.id 
                        ? 'bg-gray-100 text-gray-900 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  title={!isExpanded ? item.title : undefined}
                >
                  {item.icon}
                  {isExpanded && <span className="ml-3 text-sm">{item.title}</span>}
                </button>
                {item.divider && isExpanded && (
                  <div className={cn(
                    "my-2 border-t",
                    isDarkMode ? "border-white/5" : "border-gray-100"
                  )} />
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Tema Değiştirme */}
          <div className={cn(
            "border-t",
            isDarkMode ? "border-white/5" : "border-gray-100",
            isExpanded ? "px-4 py-3" : "p-2"
          )}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={cn(
                "flex items-center gap-2 rounded-lg transition-colors w-full",
                isDarkMode
                  ? "text-gray-300 hover:bg-white/5"
                  : "text-gray-600 hover:bg-gray-50",
                isExpanded ? "px-4 py-2" : "p-2 justify-center"
              )}
              title={!isExpanded ? (isDarkMode ? "Açık Tema" : "Koyu Tema") : undefined}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4" />
                  {isExpanded && <span className="text-sm">Açık Tema</span>}
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  {isExpanded && <span className="text-sm">Koyu Tema</span>}
                </>
              )}
            </button>
          </div>

          {/* Çıkış Butonu */}
          <div className={cn(
            "border-t",
            isDarkMode ? "border-white/5" : "border-gray-100",
            isExpanded ? "p-4" : "p-2"
          )}>
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-2 text-red-600 rounded-lg transition-colors",
                isDarkMode ? "hover:bg-white/5" : "hover:bg-red-50",
                isExpanded ? "w-full px-4 py-2" : "mx-auto p-2"
              )}
              title={!isExpanded ? "Çıkış Yap" : undefined}
            >
              <LogOut className="w-4 h-4" />
              {isExpanded && <span className="text-sm">Çıkış Yap</span>}
            </button>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="flex-1 overflow-auto p-8">
          {activeSection === 'calculator' ? (
            <BordroHesaplama isDarkMode={isDarkMode} />
          ) : activeSection === 'headhunter' ? (
            <HeadHunter isDarkMode={isDarkMode} />
          ) : activeSection === 'askexpert' ? (
            <AskExpert isDarkMode={isDarkMode} />
          ) : (
            <div className={cn(
              "rounded-xl p-6",
              isDarkMode 
                ? "bg-black/50 backdrop-blur-sm border border-white/5" 
                : "bg-white shadow-sm border border-gray-200"
            )}>
              <h2 className={cn(
                "text-xl font-semibold mb-4",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                {menuItems.find(item => item.id === activeSection)?.title || 'Head Hunter'}
              </h2>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Bu bölüm yakında eklenecek...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumPanel; 