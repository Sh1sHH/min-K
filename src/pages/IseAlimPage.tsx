import React from 'react';
import { motion } from 'framer-motion';
import { Users, Search, FileCheck, Calendar, PieChart, Briefcase } from 'lucide-react';

const IseAlimPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4DA3FF]/10 to-white" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] opacity-20">
          <img src="/shape2.svg" alt="" className="w-full h-full" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-2 bg-[#4DA3FF]/10 text-[#4DA3FF] rounded-full text-sm font-medium mb-4">
                İŞE ALIM
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1F2A44] mb-6">
                Doğru Yetenekleri Bulun ve İşe Alın
              </h1>
              <p className="text-lg text-[#1F2A44]/70 mb-8">
                Modern, verimli ve adil işe alım süreçleriyle en iyi yetenekleri şirketinize kazandırın.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <img 
                src="/isealim2.webp" 
                alt="İşe Alım Süreç Örneği" 
                className="w-full h-auto" 
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1F2A44] mb-4">
              Dijital İşe Alım Platformu
            </h2>
            <p className="text-lg text-[#1F2A44]/70 max-w-2xl mx-auto">
              İşe alım süreçlerini dijitalleştirerek daha hızlı, daha verimli ve daha adil hale getirin. Potansiyel adaylara olumlu bir deneyim sunun.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-[#1F2A44]/10"
            >
              <div className="w-14 h-14 bg-[#4DA3FF]/10 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Aday Havuzu Yönetimi</h3>
              <p className="text-[#1F2A44]/70">
                Aday veritabanınızı oluşturun, düzenleyin ve yönetin. Aradığınız niteliklere sahip adayları hızla filtreleyerek bulun.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-[#1F2A44]/10"
            >
              <div className="w-14 h-14 bg-[#4DA3FF]/10 rounded-2xl flex items-center justify-center mb-6">
                <Search className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Akıllı İlan Yönetimi</h3>
              <p className="text-[#1F2A44]/70">
                İş ilanlarınızı oluşturun, popüler platformlarda yayınlayın ve başvuruları tek bir yerden yönetin.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-[#1F2A44]/10"
            >
              <div className="w-14 h-14 bg-[#4DA3FF]/10 rounded-2xl flex items-center justify-center mb-6">
                <FileCheck className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">CV Analizi ve Filtreleme</h3>
              <p className="text-[#1F2A44]/70">
                Yapay zeka destekli CV analizi ile adayları hızla değerlendirin ve en uygun adayları belirleyin.
              </p>
            </motion.div>
            
            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-[#1F2A44]/10"
            >
              <div className="w-14 h-14 bg-[#4DA3FF]/10 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Mülakat Planlama</h3>
              <p className="text-[#1F2A44]/70">
                Mülakat süreçlerini otomatikleştirin, takvim entegrasyonu ile mülakat randevularını kolayca planlayın.
              </p>
            </motion.div>
            
            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-[#1F2A44]/10"
            >
              <div className="w-14 h-14 bg-[#4DA3FF]/10 rounded-2xl flex items-center justify-center mb-6">
                <PieChart className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">İşe Alım Analitiği</h3>
              <p className="text-[#1F2A44]/70">
                İşe alım süreçlerinizi analiz edin, darboğazları tespit edin ve süreçlerinizi sürekli iyileştirin.
              </p>
            </motion.div>
            
            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-[#1F2A44]/10"
            >
              <div className="w-14 h-14 bg-[#4DA3FF]/10 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">İşe Başlama Süreci</h3>
              <p className="text-[#1F2A44]/70">
                İşe alım sonrası yeni çalışanın oryantasyon ve işe başlama süreçlerini dijitalleştirin ve hızlandırın.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-[#4DA3FF]/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1F2A44] mb-6">
              En İyi Yetenekleri Kazanmaya Başlayın
            </h2>
            <p className="text-lg text-[#1F2A44]/70 mb-8">
              İşe alım süreçlerinizi dijitalleştirin, doğru adayları hızla bulun ve şirketinizin başarısına katkıda bulunacak yetenekleri kazanın.
            </p>
            <button className="px-8 py-4 bg-[#4DA3FF] text-white font-semibold rounded-full shadow-lg hover:bg-[#4DA3FF]/90 transition-all">
              Hemen Başlayın
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IseAlimPage; 