import React from 'react';
import { Toaster } from 'sonner';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Showcase from './components/Showcase';
import FAQ from './components/FAQ';
import BlogSection from './components/BlogSection';
import { Pricing2 } from './components/blocks/Pricing2';
import Footer from './components/Footer';
import AdminPanel from '@/pages/AdminPanel';
import ComponentDemo from '@/pages/ComponentDemo';
import Blog from './pages/Blog';
import BlogManagement from './components/admin/BlogManagement';
import BlogPage from '@/pages/BlogPage';
import BlogDetail from '@/pages/BlogDetail';
import PremiumPanel from '@/pages/PremiumPanel';
import NotFound from '@/pages/NotFound';
import Profile from '@/components/Profile';
import BordroHesaplamaPage from './pages/BordroHesaplamaPage';
import DanismanlikPage from './pages/DanismanlikPage';
import HakkimizdaPage from './pages/HakkimizdaPage';
import PerformansYonetimiPage from './pages/PerformansYonetimiPage';
import IseAlimPage from './pages/IseAlimPage';
import MevzuatsalIslemlerPage from './pages/MevzuatsalIslemlerPage';
import SssPage from './pages/SssPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';
  const isComponentDemo = location.pathname === '/components';
  const isPanel = location.pathname === '/premium' || location.pathname === '/admin' || location.pathname === '/profile';

  const pricingPlans = [
    {
      id: "pro",
      name: "Pro",
      description: "Büyüyen işletmeler için",
      monthlyPrice: "299₺",
      yearlyPrice: "239₺",
      features: [
        { text: "5 çalışan kaydı" },
        { text: "Gelişmiş bordro  aracı" },
        { text: "CV değerlendirme (5 adet)" },
        { text: "Temel danışmanlık (3 soru)" },
      ],
      button: {
        text: "Satın Al",
        url: "#",
      },
      isPopular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Büyük kurumlar için",
      monthlyPrice: "999₺",
      yearlyPrice: "799₺",
      features: [
        { text: "Sınırsız çalışan kaydı" },
        { text: "Gelişmiş bordro aracı" },
        { text: "CV değerlendirme (sınırsız)" },
        { text: "Sınırsız danışmanlık" },
        { text: "7/24 destek" },
      ],
      button: {
        text: "Satın Al",
        url: "#",
      },
    },
  ];

  return (
    <AuthProvider>
      <div className="min-h-screen relative bg-[#0F0F0F] overflow-hidden">
        <ScrollToTop />
        {/* Enhanced Gradient Background */}
        <div className="absolute inset-0 w-full h-full">
          {/* Main gradient with enhanced color stops */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2C0633] from-5% via-[#4F1C48] via-25% via-[#1B0421] via-55% to-[#0F0F0F] to-90% opacity-95" />
          
          {/* Enhanced animated gradient orbs with better positioning */}
          <div 
            className="absolute -top-[20%] -left-[10%] w-[900px] h-[900px] bg-gradient-to-r from-[#4F1C48] via-[#3C1237] to-[#2C0633] rounded-full filter blur-[130px] opacity-50 animate-float"
            style={{ animationDuration: '20s' }}
          />
          <div 
            className="absolute top-[30%] -right-[15%] w-[700px] h-[700px] bg-gradient-to-l from-[#2C0633] via-[#251429] to-[#1B0421] rounded-full filter blur-[120px] opacity-40 animate-float-delay"
            style={{ animationDuration: '15s' }}
          />
          <div 
            className="absolute -bottom-[10%] left-[20%] w-[800px] h-[800px] bg-gradient-to-tr from-[#1B0421] via-[#381934] to-[#4F1C48] rounded-full filter blur-[140px] opacity-35 animate-float-slow"
            style={{ animationDuration: '25s' }}
          />
          
          {/* Additional subtle orbs for depth */}
          <div 
            className="absolute top-[45%] left-[25%] w-[400px] h-[400px] bg-gradient-to-br from-[#3C1237] to-[#251429] rounded-full filter blur-[100px] opacity-25 animate-float"
            style={{ animationDuration: '18s' }}
          />
          <div 
            className="absolute top-[15%] right-[30%] w-[300px] h-[300px] bg-gradient-to-tl from-[#4F1C48] to-[#2C0633] rounded-full filter blur-[90px] opacity-20 animate-float-delay"
            style={{ animationDuration: '22s' }}
          />
          
          {/* Subtle gradient overlay for better color blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B0421]/10 to-[#0F0F0F]/20" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {!isPanel && <Navbar />}
          <Routes>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/premium" element={<PremiumPanel />} />
            <Route path="/components" element={<ComponentDemo />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bordro-hesaplama" element={<BordroHesaplamaPage />} />
            <Route path="/danismanlik" element={<DanismanlikPage />} />
            <Route path="/hakkimizda" element={<HakkimizdaPage />} />
            <Route path="/performans-yonetimi" element={<PerformansYonetimiPage />} />
            <Route path="/ise-alim" element={<IseAlimPage />} />
            <Route path="/mevzuatsal-islemler" element={<MevzuatsalIslemlerPage />} />
            <Route path="/sss" element={<SssPage />} />
            <Route path="/" element={
              <>
                <Hero />
                <AboutUs />
                <Services />
                <Showcase />
                <FAQ />
                <BlogSection />
                <Pricing2 
                  heading="İK Yardım Paketleri"
                  description="İhtiyaçlarınıza uygun planı seçin"
                  plans={pricingPlans}
                />
                <Footer />
              </>
            } />
            {/* 404 sayfası için catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}

export default App;