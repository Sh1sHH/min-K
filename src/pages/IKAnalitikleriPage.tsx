import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, PieChart, LineChart, TrendingUp, Activity, Share2 } from 'lucide-react';

const IKAnalitikleriPage = () => {
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
                İK ANALİTİKLERİ
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1F2A44] mb-6">
                Veri Odaklı İK Kararları Alın
              </h1>
              <p className="text-lg text-[#1F2A44]/70 mb-8">
                Detaylı raporlar ve analizlerle İK süreçlerinizi optimize edin. İş gücü verimini artırın ve stratejik kararlar alın.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <img 
                src="/analitik2.webp" 
                alt="İK Analitikleri Dashboard Örneği" 
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
              İK Analitik Çözümlerimiz
            </h2>
            <p className="text-lg text-[#1F2A44]/70 max-w-2xl mx-auto">
              Detaylı raporlar, öngörücü analizler ve eğilim raporlarıyla İK stratejilerinizi güçlendirin.
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
                <BarChart className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Çalışan Performans Analizi</h3>
              <p className="text-[#1F2A44]/70">
                Bireysel ve takım performans verilerini analiz edin, gelişim alanlarını tespit edin ve başarıyı ölçümleyin.
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
                <PieChart className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">İşgücü Planlaması</h3>
              <p className="text-[#1F2A44]/70">
                İşgücü dağılımını analiz edin, gelecekteki ihtiyaçları tahmin edin ve stratejik işe alım planları oluşturun.
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
                <LineChart className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Eğilim Analizi</h3>
              <p className="text-[#1F2A44]/70">
                İK metriklerindeki eğilimleri izleyin, değişimleri önceden tespit edin ve proaktif aksiyonlar alın.
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
                <TrendingUp className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">İşgücü Verimliliği</h3>
              <p className="text-[#1F2A44]/70">
                Departman ve çalışan verimliliğini ölçün, darboğazları tespit edin ve üretkenliği artırın.
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
                <Activity className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Çalışan Bağlılığı Analizi</h3>
              <p className="text-[#1F2A44]/70">
                Çalışan bağlılığını ölçün, memnuniyet eğilimlerini takip edin ve iyileştirme alanlarını belirleyin.
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
                <Share2 className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Özelleştirilebilir Raporlar</h3>
              <p className="text-[#1F2A44]/70">
                İhtiyaçlarınıza göre özelleştirilebilir raporlar oluşturun, otomatik raporlama planlayın ve paydaşlarla paylaşın.
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
              Verilerinizi Anlamlandırın ve Aksiyona Dönüştürün
            </h2>
            <p className="text-lg text-[#1F2A44]/70 mb-8">
              İK analitikleri ile veri odaklı kararlar alın, çalışan verimliliğini artırın ve işletmenizi geleceğe taşıyın.
            </p>
            <button className="px-8 py-4 bg-[#4DA3FF] text-white font-semibold rounded-full shadow-lg hover:bg-[#4DA3FF]/90 transition-all">
              Demo İsteyin
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IKAnalitikleriPage; 