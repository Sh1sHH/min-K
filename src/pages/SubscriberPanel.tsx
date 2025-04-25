import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { toast } from 'sonner';
import {
  Home,
  Compass,
  Zap,
  PlaySquare,
  Library,
  History,
  Clock,
  Bookmark,
  Settings,
  LogOut,
  Heart,
  MessageCircle,
  FileText,
  Calculator
} from 'lucide-react';
import BordroHesaplama from '@/components/subscriber/BordroHesaplama';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  divider?: boolean;
}

const SubscriberPanel = () => {
  const { currentUser, isSubscriber } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const auth = getAuth();

  // Menü öğeleri
  const menuItems: MenuItem[] = [
    { id: 'home', title: 'Ana Sayfa', icon: <Home size={20} /> },
    { id: 'explore', title: 'Keşfet', icon: <Compass size={20} /> },
    { id: 'shorts', title: 'Shorts', icon: <Zap size={20} /> },
    { id: 'calculator', title: 'Bordro Hesaplama', icon: <Calculator size={20} /> },
    { id: 'subscriptions', title: 'Abonelikler', icon: <PlaySquare size={20} />, divider: true },
    { id: 'library', title: 'Kütüphane', icon: <Library className="w-5 h-5" /> },
    { id: 'history', title: 'Geçmiş', icon: <History className="w-5 h-5" /> },
    { id: 'watchLater', title: 'Daha Sonra İzle', icon: <Clock className="w-5 h-5" /> },
    { id: 'bookmarks', title: 'Kaydedilenler', icon: <Bookmark className="w-5 h-5" />, divider: true },
    
    { id: 'favorites', title: 'Favorilerim', icon: <Heart className="w-5 h-5" /> },
    { id: 'messages', title: 'Mesajlarım', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'documents', title: 'Dökümanlarım', icon: <FileText className="w-5 h-5" /> },
    { id: 'settings', title: 'Ayarlar', icon: <Settings className="w-5 h-5" /> }
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
        {/* Sol Menü */}
        <div className="w-64 bg-black/50 backdrop-blur-sm border-r border-white/5 flex flex-col">
          <div className="p-4 flex items-center gap-2 mb-4">
            <h1 className="text-xl font-semibold">Premium Panel</h1>
          </div>

          {/* Ana Sayfaya Dönüş */}
          <Link 
            to="/"
            className="mx-2 flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Ana Sayfaya Dön</span>
          </Link>

          <nav className="flex-1 py-2">
            {menuItems.map((item) => (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-6 py-2.5 transition-colors ${
                    activeSection === item.id 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm">{item.title}</span>
                </button>
                {item.divider && (
                  <div className="my-2 border-t border-white/5" />
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-white/5 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Her bölüm için içerik */}
            {activeSection === 'calculator' ? (
              <BordroHesaplama />
            ) : (
              <div className="bg-black/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
                <h2 className="text-xl font-semibold mb-4">
                  {menuItems.find(item => item.id === activeSection)?.title || 'Ana Sayfa'}
                </h2>
                <p className="text-gray-400">Bu bölüm yakında eklenecek...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriberPanel; 