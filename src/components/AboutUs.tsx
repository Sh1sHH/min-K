import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const AboutUs = () => {
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
        {/* Gradient overlays */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-gradient-to-b from-white via-white to-white" 
        />
        
        {/* Subtle gradient orbs */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5 }}
          className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-[#4DA3FF]/5 rounded-full filter blur-[100px] animate-float mix-blend-overlay"
          style={{ animationDuration: '15s' }}
        />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute top-[30%] -right-[15%] w-[400px] h-[400px] bg-[#B1E5D3]/5 rounded-full filter blur-[90px] animate-float-delay mix-blend-overlay"
          style={{ animationDuration: '12s' }}
        />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <motion.div 
              variants={itemVariants}
              className="relative rounded-3xl overflow-hidden"
            >
              <motion.img 
                initial={{ scale: 1.1, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                src="/aboutus.webp" 
                alt="About Us" 
                className="w-full h-auto object-cover rounded-3xl shadow-lg transform transition-transform duration-300 hover:scale-105"
              />
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <motion.div 
                variants={itemVariants}
                className="inline-block"
              >
                <span className="bg-[#4DA3FF]/10 text-[#4DA3FF] px-4 py-2 rounded-full text-sm font-medium">
                  HAKKIMIZDA
                </span>
              </motion.div>
              
              <motion.h2 
                variants={itemVariants}
                className="text-4xl font-bold text-[#1F2A44]"
              >
                İnsan kaynakları süreçlerinizde mükemmel çözümler
              </motion.h2>
              
              <motion.p 
                variants={itemVariants}
                className="text-lg text-[#1F2A44]/70 leading-relaxed"
              >
                İK departmanlarının günlük operasyonlarını kolaylaştırmak için özel olarak tasarlanmış çözümler sunuyoruz. Modern araçlarımız ve uzman ekibimizle, şirketinizin İK süreçlerini daha verimli ve etkili hale getiriyoruz.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="pt-4"
              >
                <Link to="/hakkimizda">
                  <Button 
                    className="bg-[#4DA3FF] hover:bg-[#4DA3FF]/90 text-white px-8 py-6 rounded-full text-lg font-medium group"
                  >
                    Daha Fazla Bilgi
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs; 