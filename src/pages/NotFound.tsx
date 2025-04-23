import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-white text-[#1F2A44] pt-32 p-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="/white2.png" 
            alt="Background" 
            className="w-full h-full object-cover object-center opacity-5"
          />
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-white opacity-90" />
        
        {/* Decorative Shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20 animate-float mix-blend-multiply">
          <img 
            src="/shape2.svg" 
            alt="Decorative Shape" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-20 animate-float-delay mix-blend-multiply">
          <img 
            src="/shape2.svg" 
            alt="Decorative Shape" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Subtle gradient orbs */}
        <div 
          className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-[#4DA3FF]/10 rounded-full filter blur-[100px] opacity-40 animate-float mix-blend-multiply"
          style={{ animationDuration: '15s' }}
        />
        <div 
          className="absolute top-[30%] -right-[15%] w-[400px] h-[400px] bg-[#B1E5D3]/10 rounded-full filter blur-[90px] opacity-40 animate-float-delay mix-blend-multiply"
          style={{ animationDuration: '12s' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-8xl font-bold text-[#4DA3FF]">404</h1>
            <h2 className="text-3xl font-semibold text-[#1F2A44]">Sayfa Bulunamadı</h2>
            <p className="text-[#1F2A44]/70 max-w-md mx-auto">
              Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-[#4DA3FF] text-white rounded-full hover:bg-[#4DA3FF]/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Ana Sayfaya Dön</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default NotFound; 