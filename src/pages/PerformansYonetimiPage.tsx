import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Clock, CalendarDays, TrendingUp, Award, BarChart } from 'lucide-react';

const PerformansYonetimiPage = () => {
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
                PERFORMANS YÖNETİMİ
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1F2A44] mb-6">
                Çalışan Performansını İzleyin ve Optimize Edin
              </h1>
              <p className="text-lg text-[#1F2A44]/70 mb-8">
                İzin, mesai, performans takibi gibi süreçleri tek platformdan yönetin. Çalışanlarınızın başarısını güçlendirin.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <img 
                src="/performans.webp" 
                alt="Performans Yönetimi Dashboard Örneği" 
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
              Kapsamlı Performans Yönetim Özellikleri
            </h2>
            <p className="text-lg text-[#1F2A44]/70 max-w-2xl mx-auto">
              Modern işletmelerin ihtiyaçlarını karşılayan performans yönetim araçlarımızla çalışanlarınızın potansiyelini ortaya çıkarın.
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
                <ClipboardCheck className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Hedef Yönetimi</h3>
              <p className="text-[#1F2A44]/70">
                Bireysel, departman ve şirket hedeflerini belirleyin, izleyin ve ölçümleyin. OKR ve SMART hedef metodolojilerini uygulayın.
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
                <Clock className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Mesai Takibi</h3>
              <p className="text-[#1F2A44]/70">
                Çalışanların giriş-çıkış saatlerini, fazla mesailerini ve çalışma sürelerini kolayca izleyin ve raporlayın.
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
                <CalendarDays className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">İzin Yönetimi</h3>
              <p className="text-[#1F2A44]/70">
                Yıllık izin, hastalık izni ve diğer izin türlerini otomatikleştirin. İzin onay süreçlerini dijitalleştirin.
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
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Performans Değerlendirme</h3>
              <p className="text-[#1F2A44]/70">
                360 derece geri bildirim, öz değerlendirme ve yönetici değerlendirmelerini içeren kapsamlı değerlendirme süreçleri oluşturun.
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
                <Award className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Ödül ve Tanıma</h3>
              <p className="text-[#1F2A44]/70">
                Başarılı çalışanları ödüllendirin ve tanıyın. Motivasyonu artırıcı gamifikasyon öğeleri ile çalışan bağlılığını güçlendirin.
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
                <BarChart className="w-7 h-7 text-[#4DA3FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Performans Analitiği</h3>
              <p className="text-[#1F2A44]/70">
                Kapsamlı raporlar ve analizlerle performans verilerini değerlendirin. Eğilimleri tespit edin ve iyileştirme alanlarını belirleyin.
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
              Performans Yönetiminizi Bir Üst Seviyeye Taşıyın
            </h2>
            <p className="text-lg text-[#1F2A44]/70 mb-8">
              Modern, kullanıcı dostu performans yönetim araçlarımızla çalışan verimliliğini artırın ve işletmenizin büyümesine katkıda bulunun.
            </p>
            <button className="px-8 py-4 bg-[#4DA3FF] text-white font-semibold rounded-full shadow-lg hover:bg-[#4DA3FF]/90 transition-all">
              Ücretsiz Demo Alın
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PerformansYonetimiPage; 