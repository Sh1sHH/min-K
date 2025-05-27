import React from 'react';
import { Users, TrendingUp, Clock, Shield, Award, BarChart, FileSpreadsheet, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
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
    icon: <Award className="w-8 h-8 text-[#4DA3FF]" />,
    title: "Profesyonel Destek",
    description: "7/24 uzman İK danışmanlığı.",
    highlight: "7/24 Destek",
    delay: 0.7
  }
];

const expertCards = [
  {
    icon: <FileSpreadsheet className="w-8 h-8 text-white" />,
    title: "Karmaşık Bordro İşlemlerinde Uzmanlık",
    description: "ChatGPT cevapları yerine, yasal mevzuata hakim, güncel uygulamaları takip eden uzmanlarımızla bordro süreçlerinizi hatasız ve hızlı şekilde yönetin.",
    points: [
      "Vergiler, SGK kesintileri ve yasal hesaplamalar",
      "Özel durumlar (BES, icra, nafaka kesintileri vb.)",
      "Kanun değişikliklerine anında uyum"
    ],
    gradient: "from-[#52A0FD] to-[#6FC2FF]"
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    title: "Gerçek İK Uzmanlarıyla Birebir Danışmanlık",
    description: "Yapay zeka yanıtları değil, işinizi ve sektörünüzü anlayan gerçek İK profesyonellerinden stratejik tavsiyeler alın.",
    points: [
      "İşletmenize özel İK stratejileri",
      "Sektörel tecrübeye dayalı öneriler",
      "İhtiyaç duyduğunuz her an erişim"
    ],
    gradient: "from-[#4DA3FF] to-[#B1E5D3]"
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

          {/* Uzman Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {expertCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className={`p-6 bg-gradient-to-r ${card.gradient}`}>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mt-4">
                    {card.title}
                  </h3>
                </div>
                
                <div className="p-6">
                  <p className="text-[#1F2A44]/70 mb-6">
                    {card.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {card.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="mt-1 min-w-[20px]">
                          <div className="w-4 h-4 rounded-full bg-[#4DA3FF]/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-[#4DA3FF]"></div>
                          </div>
                        </div>
                        <span className="text-[#1F2A44]/80 text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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