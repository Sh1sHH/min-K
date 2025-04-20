"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "İK süreçlerini dijitalleştirmek işimizi nasıl kolaylaştırır?",
    answer: "İK süreçlerinin dijitalleştirilmesi, manuel işlemlerde harcanan zamanı azaltır, hata oranlarını düşürür ve verimliliği artırır."
  },
  {
    question: "Hangi ödeme planları mevcut?",
    answer: "Küçük işletmelerden kurumsal firmalara kadar farklı ihtiyaçlara uygun esnek ödeme planlarımız bulunmaktadır."
  },
  {
    question: "Sistemin kullanımı için eğitim desteği sağlıyor musunuz?",
    answer: "Evet, tüm müşterilerimize ücretsiz eğitim ve teknik destek hizmeti sunuyoruz."
  },
  {
    question: "Verilerimizin güvenliği nasıl sağlanıyor?",
    answer: "En son güvenlik protokolleri ve şifreleme teknolojileri ile verileriniz güvende tutulur."
  },
  {
    question: "Mevcut sistemimizle entegrasyon mümkün mü?",
    answer: "Yaygın kullanılan İK ve muhasebe yazılımlarıyla entegrasyon sağlayabiliyoruz."
  }
];

const FAQ = () => {
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
    <section id="sss-section" className="relative py-24 overflow-hidden bg-white">
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
          className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-[#4DA3FF]/5 rounded-full filter blur-[100px] opacity-30 animate-float mix-blend-overlay"
          style={{ animationDuration: '15s' }}
        />
        <div 
          className="absolute top-[30%] -right-[15%] w-[400px] h-[400px] bg-[#B1E5D3]/5 rounded-full filter blur-[90px] opacity-30 animate-float-delay mix-blend-overlay"
          style={{ animationDuration: '12s' }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column - Image */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-3xl overflow-hidden"
          >
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              src="/sss.png"
              alt="Frequently Asked Questions"
              className="w-full h-auto object-cover rounded-3xl shadow-lg"
            />
          </motion.div>

          {/* Right Column - FAQ List */}
          <motion.div
            variants={containerVariants}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <span className="bg-[#4DA3FF]/10 text-[#4DA3FF] px-4 py-2 rounded-full text-sm font-medium">
                SIKÇA SORULAN SORULAR
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold text-[#1F2A44] mb-8"
            >
              Aklınızdaki tüm sorulara cevap veriyoruz
            </motion.h2>

            <motion.div
              variants={containerVariants}
              className="space-y-4"
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-[#1F2A44]/10 hover:border-[#4DA3FF]/30 hover:shadow-md transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#1F2A44] group-hover:text-[#4DA3FF] transition-colors">
                      {faq.question}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-[#4DA3FF] transform transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="pt-8"
            >
              <Button 
                className="bg-[#4DA3FF] hover:bg-[#4DA3FF]/90 text-white px-8 py-6 rounded-full text-lg font-medium group"
              >
                Tüm Soruları Görüntüle
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ; 