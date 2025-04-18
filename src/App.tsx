import React from 'react';
import { Toaster } from 'sonner';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Showcase from './components/Showcase';
import BlogSection from './components/BlogSection';
import { Pricing2 } from './components/blocks/Pricing2';
import Footer from './components/Footer';
import AdminPanel from './pages/AdminPanel';
import ComponentDemo from './pages/ComponentDemo';
import Blog from './pages/Blog';
import BlogManagement from './components/admin/BlogManagement';
import BlogPage from './pages/BlogPage';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';
  const isComponentDemo = location.pathname === '/components';

  const pricingPlans = [
    {
      id: "plus",
      name: "Plus",
      description: "Perfect for small teams",
      monthlyPrice: "$29",
      yearlyPrice: "$24",
      features: [
        { text: "Up to 10 team members" },
        { text: "All basic features" },
        { text: "Priority email support" },
        { text: "5GB storage space" },
      ],
      button: {
        text: "Get Plus",
        url: "#",
      },
    },
    {
      id: "pro",
      name: "Pro",
      description: "For growing businesses",
      monthlyPrice: "$79",
      yearlyPrice: "$65",
      features: [
        { text: "Unlimited team members" },
        { text: "Advanced analytics" },
        { text: "24/7 priority support" },
        { text: "50GB storage space" },
      ],
      button: {
        text: "Get Pro",
        url: "#",
      },
      isPopular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large organizations",
      monthlyPrice: "$149",
      yearlyPrice: "$129",
      features: [
        { text: "Unlimited team members" },
        { text: "Enterprise analytics" },
        { text: "24/7 VIP support" },
        { text: "Unlimited storage" },
        { text: "Custom integrations" },
        { text: "Dedicated account manager" },
      ],
      button: {
        text: "Contact Sales",
        url: "#",
      },
    },
  ];

  return (
    <AuthProvider>
      <div className="min-h-screen relative bg-[#0F0F0F] overflow-hidden">
        {/* Enhanced Gradient Background */}
        <div className="absolute inset-0 w-full h-full">
          {/* Main gradient with enhanced color stops */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2C0633] from-5% via-[#4F1C48] via-25% via-[#1B0421] via-55% to-[#0F0F0F] to-90% opacity-95" />
          
          {/* Mesh gradient overlay with improved blend */}
          <div className="absolute inset-0 bg-[url('/mesh-gradient.png')] bg-cover bg-center mix-blend-soft-light opacity-30" />
          
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
          
          {/* Enhanced noise texture with better blend mode */}
          <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-[0.03] mix-blend-overlay" />
          
          {/* Subtle gradient overlay for better color blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B0421]/10 to-[#0F0F0F]/20" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {!isAdminRoute && !isComponentDemo && <Navbar />}
          <Routes>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/components" element={<ComponentDemo />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/" element={
              <>
                <Hero />
                <AboutUs />
                <Services />
                <Showcase />
                <BlogSection />
                <Pricing2 
                  heading="İK Yardım Paketleri"
                  description="İhtiyaçlarınıza uygun planı seçin"
                  plans={pricingPlans}
                />
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}

export default App;