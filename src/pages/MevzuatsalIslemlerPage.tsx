import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Copy, BookOpen, Scale, FileCheck } from 'lucide-react';

const MevzuatsalIslemlerPage = () => {
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
                MEVZUATSAL İŞLEMLER
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1F2A44] mb-6">
                İK Mevzuatı Uyumluluk Çözümleri
              </h1>
              <p className="text-lg text-[#1F2A44]/70 mb-8">
                Karmaşık İK mevzuatına tam uyumlu süreçler oluşturun, yasal yükümlülükleri kolayca yerine getirin ve riskleri azaltın.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <img 
                src="/mevzuat.webp" 
                alt="Mevzuatsal İşlemler Örneği" 
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
              İK Mevzuatı Uyumluluk Çözümlerimiz
            </h2>
            <p className="text-lg text-[#1F2A44]/70 max-w-2xl mx-auto">
              Sürekli değişen mevzuat gereksinimlerine uyum sağlamanızı kolaylaştıran araçlar ve uzman danışmanlık hizmetleri sunuyoruz.
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
                <FileText className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Sözleşme Yönetimi</h3>
              <p className="text-[#1F2A44]/70">
                İş sözleşmeleri, gizlilik anlaşmaları ve diğer yasal belgeleri hazırlayın, yönetin ve dijital olarak imzalayın.
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
                <Shield className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Yasal Uyumluluk Takibi</h3>
              <p className="text-[#1F2A44]/70">
                İK mevzuatındaki değişiklikleri takip edin, şirketinizin uyumluluğunu kontrol edin ve gerekli aksiyonları alın.
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
                <Copy className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Belge Yönetimi</h3>
              <p className="text-[#1F2A44]/70">
                Yasal belgeleri güvenli bir şekilde saklayın, organize edin ve gerektiğinde hızla erişin. Belge hatırlatıcıları ile süreçleri otomatikleştirin.
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
                <BookOpen className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Politika ve Prosedürler</h3>
              <p className="text-[#1F2A44]/70">
                Şirket politikaları ve prosedürlerini oluşturun, güncelleyin ve çalışanlarla paylaşın. Onay süreçlerini dijitalleştirin.
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
                <Scale className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Hukuki Danışmanlık</h3>
              <p className="text-[#1F2A44]/70">
                İK hukuku konusunda uzman danışmanlarımızdan destek alın. Karmaşık mevzuatsal sorunlar için rehberlik hizmeti.
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
                <FileCheck className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Denetim ve Raporlama</h3>
              <p className="text-[#1F2A44]/70">
                İç denetim süreçlerini otomatikleştirin, uyumluluk raporları oluşturun ve yasal risklerinizi minimize edin.
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
              Mevzuatsal Uyumluluk Risklerinizi Azaltın
            </h2>
            <p className="text-lg text-[#1F2A44]/70 mb-8">
              İK mevzuatına uyumlu süreçlerle yasal riskleri azaltın, cezalardan kaçının ve işinize odaklanın.
            </p>
            <button className="px-8 py-4 bg-[#4DA3FF] text-white font-semibold rounded-full shadow-lg hover:bg-[#4DA3FF]/90 transition-all">
              Danışmanlık Alın
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MevzuatsalIslemlerPage; 