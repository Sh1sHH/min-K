import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  {
    title: "Bordro Yönetimi",
    description: "Maaş, SGK, vergi hesaplamaları ve bordro süreçlerinizi otomatik olarak yönetin.",
    image: "/bordro2.png",
  },
  {
    title: "Online Danışmanlık",
    description: "Uzman İK danışmanlarımızla online görüşmeler yapın, sorularınıza anında yanıt alın.",
    image: "/danismanlik4.png",
  },
  {
    title: "İK Analitikleri",
    description: "Detaylı raporlar ve analizlerle İK süreçlerinizi optimize edin.",
    image: "/analitik2.png",
  },
  {
    title: "Performans Yönetimi",
    description: "İzin, mesai, performans takibi gibi süreçleri tek platformdan yönetin.",
    image: "/performans.png",
  },
  {
    title: "İşe Alım",
    description: "Çalışanlarınızın gelişimi için online eğitimler ve sertifikasyon programları.",
    image: "/isealim2.png",
  },
  {
    title: "Mevzuatsal İşlemler",
    description: "Çalışanlarınızın gelişimi için online eğitimler ve sertifikasyon programları.",
    image: "/mevzuat.png",
  }
];

const Services = () => {
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
    <section id="services-section" className="relative py-24 overflow-hidden bg-white">
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
                HİZMETLERİMİZ
              </span>
            </div>
            <h2 className="text-4xl font-bold text-[#1F2A44] mb-4">
              Tek Çatı Altında Tüm İK Çözümleri
            </h2>
            <p className="text-lg text-[#1F2A44]/70 max-w-2xl mx-auto">
              İK süreçlerinizi dijitalleştirin, zamandan tasarruf edin ve çalışan memnuniyetini artırın.
            </p>
          </motion.div>

          {/* Services Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white rounded-3xl p-6 shadow-lg border border-[#1F2A44]/10 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image Container */}
                <div className="w-full h-48 mb-6 overflow-hidden rounded-2xl">
                  <motion.img 
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    initial={{ scale: 1.1, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-3">
                  {service.title}
                </h3>
                <p className="text-[#1F2A44]/70 mb-6">
                  {service.description}
                </p>

                {/* Read More Link */}
                <motion.div 
                  className="flex items-center text-[#4DA3FF] font-medium group-hover:text-[#B1E5D3] transition-colors duration-300"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>Daha Fazla</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services; 