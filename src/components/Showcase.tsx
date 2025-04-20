import React from 'react';
import { Users, TrendingUp, Clock, Shield, Award, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: <TrendingUp className="w-6 h-6 text-[#4DA3FF]" />,
    title: "Verimlilik Artışı",
    description: "İK süreçlerinizi otomatikleştirerek %40'a varan verimlilik artışı sağlayın.",
    highlight: "%40 Verimlilik"
  },
  {
    icon: <Clock className="w-6 h-6 text-[#4DA3FF]" />,
    title: "Zaman Tasarrufu",
    description: "Manuel işlemlerde harcanan zamanı %60 azaltın, stratejik görevlere odaklanın.",
    highlight: "%60 Tasarruf"
  },
  {
    icon: <Shield className="w-6 h-6 text-[#4DA3FF]" />,
    title: "Yasal Uyumluluk",
    description: "Güncel mevzuata uygun, otomatik güncellenen yasal düzenlemeler ve hesaplamalar.",
    highlight: "100% Uyumluluk"
  },
  {
    icon: <Users className="w-6 h-6 text-[#4DA3FF]" />,
    title: "Çalışan Memnuniyeti",
    description: "Şeffaf ve dijital süreçlerle çalışan memnuniyetini artırın.",
    highlight: "Mutlu Çalışanlar"
  },
  {
    icon: <BarChart className="w-6 h-6 text-[#4DA3FF]" />,
    title: "Detaylı Raporlama",
    description: "Gerçek zamanlı verilerle İK metriklerinizi analiz edin ve raporlayın.",
    highlight: "Anlık Analiz"
  },
  {
    icon: <Award className="w-6 h-6 text-[#4DA3FF]" />,
    title: "Profesyonel Destek",
    description: "Uzman İK danışmanlarımızdan 7/24 destek alın.",
    highlight: "7/24 Destek"
  }
];

const stats = [
  {
    number: "500+",
    label: "Aktif Müşteri",
    description: "Türkiye'nin önde gelen şirketleri"
  },
  {
    number: "50.000+",
    label: "Yönetilen Çalışan",
    description: "Mutlu ve üretken ekipler"
  },
  {
    number: "%98",
    label: "Müşteri Memnuniyeti",
    description: "Sürekli artan başarı oranı"
  },
  {
    number: "10+",
    label: "Yıllık Tecrübe",
    description: "Sektörde kanıtlanmış uzmanlık"
  }
];

const Showcase = () => {
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
    <section id="benefits-section" className="relative py-24 overflow-hidden bg-white">
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
        <div className="absolute top-20 right-0 w-[700px] h-[700px] opacity-20 rotate-180 animate-float mix-blend-multiply">
          <img 
            src="/shape3.svg" 
            alt="Decorative Shape" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-20 animate-float-delay mix-blend-multiply">
          <img 
            src="/shape4.svg" 
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

      <div className="relative z-10">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <span className="bg-[#4DA3FF]/10 text-[#4DA3FF] px-4 py-2 rounded-full text-sm font-medium">
                FAYDALAR
              </span>
            </div>
            <h2 className="text-4xl font-bold text-[#1F2A44] mb-4">
              Size Sunduğumuz Avantajlar
            </h2>
            <p className="text-lg text-[#1F2A44]/70 max-w-2xl mx-auto">
              İK süreçlerinizi dijitalleştirerek işinizi kolaylaştırır, verimliliğinizi artırırız
            </p>
          </motion.div>

          {/* Stats Section - New Design */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4DA3FF]/5 to-[#B1E5D3]/5 rounded-3xl transform transition-transform duration-300 group-hover:scale-105" />
                  <div className="relative p-8 text-center">
                    <div className="text-5xl font-bold bg-gradient-to-r from-[#4DA3FF] to-[#B1E5D3] bg-clip-text text-transparent mb-3">
                      {stat.number}
                    </div>
                    <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">
                      {stat.label}
                    </h3>
                    <p className="text-[#1F2A44]/70 text-sm">
                      {stat.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits Grid - New Design */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#4DA3FF]/5 to-[#B1E5D3]/5 rounded-3xl transform transition-all duration-300 group-hover:scale-105" />
                <div className="relative p-8 rounded-3xl border border-[#1F2A44]/10">
                  {/* Top Section */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-[#4DA3FF]/10 rounded-xl flex items-center justify-center group-hover:bg-[#4DA3FF]/20 transition-colors duration-300">
                      {benefit.icon}
                    </div>
                    <span className="text-sm font-medium text-[#4DA3FF] bg-[#4DA3FF]/10 px-3 py-1 rounded-full">
                      {benefit.highlight}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-[#1F2A44] mb-3 group-hover:text-[#4DA3FF] transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-[#1F2A44]/70">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Showcase; 