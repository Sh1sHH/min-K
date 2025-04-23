import React from 'react';
import { Users, TrendingUp, Clock, Shield, Award, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: <TrendingUp className="w-8 h-8 text-[#4DA3FF]" />,
    title: "Verimlilik Artışı",
    description: "İK süreçlerinizi otomatikleştirerek %40'a varan verimlilik artışı sağlayın.",
    highlight: "%40 Verimlilik",
    delay: 0.2
  },
  {
    icon: <Clock className="w-8 h-8 text-[#4DA3FF]" />,
    title: "Zaman Tasarrufu",
    description: "Manuel işlemlerde harcanan zamanı %60 azaltın.",
    highlight: "%60 Tasarruf",
    delay: 0.3
  },
  {
    icon: <Shield className="w-8 h-8 text-[#4DA3FF]" />,
    title: "Yasal Uyumluluk",
    description: "Güncel mevzuata uygun hesaplamalar.",
    highlight: "100% Uyumluluk",
    delay: 0.4
  },
  {
    icon: <Users className="w-8 h-8 text-[#4DA3FF]" />,
    title: "Çalışan Memnuniyeti",
    description: "Şeffaf ve dijital süreçler.",
    highlight: "Mutlu Çalışanlar",
    delay: 0.5
  },
  {
    icon: <BarChart className="w-8 h-8 text-[#4DA3FF]" />,
    title: "Detaylı Raporlama",
    description: "Gerçek zamanlı İK metrikleri.",
    highlight: "Anlık Analiz",
    delay: 0.6
  },
  {
    icon: <Award className="w-8 h-8 text-[#4DA3FF]" />,
    title: "Profesyonel Destek",
    description: "7/24 uzman İK danışmanlığı.",
    highlight: "7/24 Destek",
    delay: 0.7
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

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#4DA3FF]/5 to-[#B1E5D3]/5 rounded-3xl transform transition-all duration-300 group-hover:scale-105" />
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
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5,
                  delay: benefit.delay,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                {/* Card Background */}
                <div className="absolute inset-0 bg-white rounded-3xl shadow-lg" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#4DA3FF]/5 to-[#B1E5D3]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Gradient Border */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-[#4DA3FF] via-[#B1E5D3] to-[#4DA3FF] rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-[1px]" />
                <div className="absolute inset-[1px] bg-white rounded-[22px]" />
                
                {/* Card Content */}
                <div className="relative p-8">
                  {/* Icon Container */}
                  <div className="mb-6 relative">
                    <div className="w-16 h-16 bg-[#4DA3FF]/10 rounded-2xl flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-6">
                      {benefit.icon}
                    </div>
                    {/* Floating Highlight Badge */}
                    <div className="absolute -top-2 -right-2">
                      <span className="inline-block px-3 py-1 bg-white shadow-md rounded-full text-sm font-medium text-[#4DA3FF] transform transition-transform duration-300 group-hover:scale-110">
                        {benefit.highlight}
                      </span>
                    </div>
                  </div>

                  {/* Text Content */}
                  <h3 className="text-xl font-semibold text-[#1F2A44] mb-3 group-hover:text-[#4DA3FF] transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-[#1F2A44]/70">
                    {benefit.description}
                  </p>

                  {/* Decorative Elements */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#4DA3FF]/10 to-[#B1E5D3]/10 rounded-full blur-xl" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase; 