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
  ChevronRight
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

const SubscriberPanel = () => {
  const { currentUser, isSubscriber } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('calculator');
  const [isExpanded, setIsExpanded] = useState(false);
  const auth = getAuth();

  // Menü öğeleri
  const menuItems: MenuItem[] = [
    { id: 'calculator', title: 'Bordro Hesaplama', icon: <Calculator size={20} /> },
    { id: 'headhunter', title: 'Head Hunter', icon: <Users size={20} /> },
    { id: 'askexpert', title: 'Bir Bilene Sor', icon: <MessageSquare size={20} /> }
  ];

  // Kullanıcı ve abone kontrolü
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      toast.error('Giriş yapmanız gerekiyor');
      return;
    }

    if (!isSubscriber) {
      navigate('/');
      toast.error('Bu sayfaya erişim için abone olmanız gerekiyor');
      return;
    }
  }, [currentUser, isSubscriber, navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  // Kullanıcı girişi yoksa veya abone değilse içeriği gösterme
  if (!currentUser || !isSubscriber) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="flex h-screen">
        {/* Sol Menü - Küçük Versiyon */}
        <div 
          className={cn(
            "bg-black/50 backdrop-blur-sm border-r border-white/5 flex flex-col transition-all duration-300",
            isExpanded ? "w-64" : "w-16"
          )}
        >
          {/* Logo ve Başlık */}
          <div className={cn(
            "p-4 flex items-center gap-2 mb-4",
            isExpanded ? "justify-between" : "justify-center"
          )}>
            {isExpanded && <h1 className="text-xl font-semibold">Premium Panel</h1>}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "p-1.5 rounded-lg hover:bg-white/5 transition-all",
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
              "flex items-center gap-2 text-gray-300 hover:bg-white/5 rounded-lg transition-colors mb-4",
              isExpanded ? "mx-2 px-4 py-3" : "mx-auto p-3"
            )}
            title="Ana Sayfaya Dön"
          >
            <Home className="w-5 h-5" />
            {isExpanded && <span>Ana Sayfaya Dön</span>}
          </Link>

          {/* Menü Öğeleri */}
          <nav className="flex-1 py-2">
            {menuItems.map((item) => (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "flex items-center transition-colors w-full",
                    isExpanded ? "px-6 py-2.5" : "py-2.5 justify-center",
                    activeSection === item.id 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-300 hover:bg-white/5'
                  )}
                  title={!isExpanded ? item.title : undefined}
                >
                  {item.icon}
                  {isExpanded && <span className="ml-3 text-sm">{item.title}</span>}
                </button>
                {item.divider && isExpanded && (
                  <div className="my-2 border-t border-white/5" />
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Çıkış Butonu */}
          <div className={cn(
            "border-t border-white/5",
            isExpanded ? "p-4" : "p-2"
          )}>
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-2 text-red-500 hover:bg-white/5 rounded-lg transition-colors",
                isExpanded ? "w-full px-4 py-2" : "mx-auto p-2"
              )}
              title={!isExpanded ? "Çıkış Yap" : undefined}
            >
              <LogOut className="w-4 h-4" />
              {isExpanded && <span>Çıkış Yap</span>}
            </button>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="flex-1 overflow-auto p-8">
          {/* Her bölüm için içerik */}
          {activeSection === 'calculator' ? (
            <BordroHesaplama />
          ) : activeSection === 'headhunter' ? (
            <HeadHunter />
          ) : activeSection === 'askexpert' ? (
            <AskExpert />
          ) : (
            <div className="bg-black/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
              <h2 className="text-xl font-semibold mb-4">
                {menuItems.find(item => item.id === activeSection)?.title || 'Head Hunter'}
              </h2>
              <p className="text-gray-400">Bu bölüm yakında eklenecek...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriberPanel; 