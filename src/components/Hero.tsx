"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, Users, Calendar } from 'lucide-react';
import { FlipCard, FlipCardFront, FlipCardBack } from "@/components/ui/flip-card";
import { motion } from 'framer-motion';

const features = [
  {
    title: "Bordro Hesaplama",
    image: "/hesaplama.png",
    icon: <Calculator className="w-12 h-12 text-[#4DA3FF]" />,
    description: "Gelişmiş algoritmalarımız ile maaş, izin, prim ve diğer tüm İK hesaplamalarınızı otomatik olarak yapın. Zaman kazanın, hata yapmayın."
  },
  {
    title: "Blog",
    image: "/blog.png",
    icon: <Users className="w-12 h-12 text-[#4DA3FF]" />,
    description: "Çalışanlarınızın bilgilerini güvenle saklayın, performanslarını takip edin ve kariyer gelişimlerini planlayın. Tek platformda tüm İK süreçleri."
  },
  {
    title: "Danışmanlık",
    image: "/danismanlik.png",
    icon: <Calendar className="w-12 h-12 text-[#4DA3FF]" />,
    description: "Yıllık izin, hastalık izni ve diğer tüm izin türlerini kolayca yönetin. Otomatik hesaplama ve onay süreçleri ile işinizi kolaylaştırın."
  }
];

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="relative py-24 overflow-hidden bg-white">
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
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-white" />
        
        {/* Subtle gradient orbs */}
        <div 
          className="absolute -top-[20%] -left-[10%] w-[900px] h-[900px] bg-[#4DA3FF]/5 rounded-full filter blur-[130px] opacity-30 animate-float"
          style={{ animationDuration: '20s' }}
        />
        <div 
          className="absolute top-[30%] -right-[15%] w-[700px] h-[700px] bg-[#B1E5D3]/5 rounded-full filter blur-[120px] opacity-20 animate-float-delay"
          style={{ animationDuration: '15s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-center text-5xl md:text-6xl font-bold mb-6"
          >
            <span className="text-[#1F2A44] drop-shadow-sm">
              İK süreçlerinizde,
            </span>
            <br />
            <span className="bg-clip-text text-transparent md:text-7xl bg-gradient-to-r from-[#4DA3FF] to-[#1F2A44]">
              İlkyardım bizden.
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-center text-xl md:text-3xl text-[#1F2A44]/80 max-w-3xl mx-auto mb-12 font-bold"
          >
            İKyardim.com, küçük ekipler ve yeni girişimler için hızlı, sade ve etkili çözümler sunar.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button 
              className="bg-[#4DA3FF] hover:bg-[#4DA3FF]/80 text-white px-8 py-6 rounded-full text-lg font-medium w-full sm:w-auto group shadow-lg shadow-[#4DA3FF]/20"
            >
              Hemen Başla
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="ghost"
              className="bg-[#1F2A44]/5 hover:bg-[#1F2A44]/10 text-[#1F2A44] px-8 py-6 rounded-full text-lg font-medium w-full sm:w-auto"
            >
              Tanıtımı İzleyin
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <FlipCard className="h-[365px]">
                  <FlipCardFront className="bg-white shadow-lg rounded-2xl p-6 border border-[#1F2A44]/10">
                    <div className="w-full h-60 mb-6 overflow-hidden rounded-xl">
                      <img 
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-contain hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-2xl font-semibold text-[#1F2A44] text-center">{feature.title}</h3>
                  </FlipCardFront>
                  <FlipCardBack className="flex flex-col items-center justify-center rounded-2xl bg-[#4DA3FF] p-8 text-white">
                    <div className="mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-center text-lg">
                      {feature.description}
                    </p>
                  </FlipCardBack>
                </FlipCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      {/* Bottom glow light effect with animation */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1300px] h-[2000px] bg-[#4DA3FF]/15 blur-[3px] rounded-full pointer-events-none z-0 animate-glowPulse" />
    </section>
  );
};

export default Hero; 