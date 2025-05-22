"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { faqs } from '@/lib/faqData';

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
              src="/sss.webp"
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
              {faqs.map((faq) => (
                <motion.div
                  key={faq.id} 
                  variants={itemVariants}
                  className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 hover:border-[#4DA3FF]/50 hover:shadow-lg transition-all duration-300 group"
                >
                  <Link 
                    to={`/sss#${faq.id}`}
                    className="flex items-center justify-between p-4 sm:p-5 lg:p-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4DA3FF] rounded-xl lg:rounded-2xl"
                    aria-label={`Soru: ${faq.question}, tüm sıkça sorulan soruları görüntüle`}
                  >
                    <h3 className="text-base sm:text-lg font-semibold text-[#1F2A44] group-hover:text-[#4DA3FF] transition-colors duration-200">
                      {faq.question}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-[#4DA3FF] flex-shrink-0 transform transition-transform group-hover:translate-x-1 duration-200" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="pt-8"
            >
              <Link to="/sss" className="inline-block">
                <Button 
                  className="bg-[#4DA3FF] hover:bg-[#4DA3FF]/90 text-white px-8 py-6 rounded-full text-lg font-medium group w-full sm:w-auto flex items-center justify-center"
                  aria-label="Tüm sıkça sorulan soruları görüntüle"
                >
                  Tüm Soruları Görüntüle
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ; 