import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  FileCheck, 
  PieChart, 
  Briefcase, 
  FileUp, 
  Brain, 
  FileText, 
  CheckCircle,
  Award,
  Upload,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Footer from '@/components/Footer';

const IseAlimPage = () => {
  return (
    <div className="bg-white pt-20">
      
      {/* Hero Section - Daha kompakt */}
      <section className="relative pt-16 pb-12 overflow-hidden bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block px-4 py-2 bg-[#4DA3FF]/10 text-[#4DA3FF] rounded-full text-sm font-medium mb-4">
                  AI DESTEKLİ İŞE ALIM
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1F2A44] mb-4">
                  Yapay Zeka ile HeadHunter
                </h1>
                <p className="text-base md:text-lg text-[#1F2A44]/70 mb-6">
                  CV yükleyin, ihtiyaçlarınızı belirtin ve yapay zeka destekli sistemimiz sizin için en uygun adayı bulsun.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="inline-flex items-center gap-2 bg-[#F9FAFC] px-3 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-[#4DA3FF]" />
                    <span className="text-sm text-[#1F2A44]/80">3 CV yükleme</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-[#F9FAFC] px-3 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-[#4DA3FF]" />
                    <span className="text-sm text-[#1F2A44]/80">AI analizi</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-[#F9FAFC] px-3 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-[#4DA3FF]" />
                    <span className="text-sm text-[#1F2A44]/80">Detaylı rapor</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="bg-[#4DA3FF] hover:bg-[#4DA3FF]/90 text-white px-6 py-2 rounded-full">
                    <FileUp className="w-4 h-4 mr-2" />
                    CV Yüklemeye Başla
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white p-4 rounded-2xl shadow-lg border border-[#1F2A44]/10 relative"
              >
                <div className="aspect-video bg-[#F9FAFC] rounded-xl overflow-hidden flex items-center justify-center p-4">
                  <div className="relative w-full max-w-xs mx-auto">
                    <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#4DA3FF]/10 rounded-full"></div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#4DA3FF]/10 rounded-full"></div>
                    
                    <div className="relative z-10 bg-white p-4 rounded-xl shadow-md border border-[#1F2A44]/10 mb-4">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-[#4DA3FF]/10 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-5 h-5 text-[#4DA3FF]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#1F2A44]">CV Analiz</div>
                          <div className="text-xs text-[#1F2A44]/60">Yapay zeka analizi</div>
                        </div>
                      </div>
                      <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-[#4DA3FF] rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div className="relative z-10 bg-white p-4 rounded-xl shadow-md border border-[#1F2A44]/10">
                      <div className="text-sm font-medium text-[#1F2A44] mb-1">Uygunluk Skoru</div>
                      <div className="flex justify-between items-center">
                        <span className="text-3xl font-bold text-[#4DA3FF]">95%</span>
                        <Award className="w-8 h-8 text-[#4DA3FF]" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section - Daha özlü */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-2 bg-[#4DA3FF]/10 text-[#4DA3FF] rounded-full text-sm font-medium mb-3">
              NASIL ÇALIŞIR
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1F2A44] mb-3">
              HeadHunter Süreci
            </h2>
            <p className="text-base text-[#1F2A44]/70 max-w-2xl mx-auto">
              Sadece 3 adımda yapay zeka destekli işe alım asistanımız ile en uygun adayları bulun.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-md border border-[#1F2A44]/10 relative"
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#4DA3FF] rounded-full flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <div className="w-12 h-12 bg-[#4DA3FF]/10 rounded-xl flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-[#4DA3FF]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1F2A44] mb-2">CV Yükleme</h3>
              <p className="text-sm text-[#1F2A44]/70">
                Sisteme maksimum 3 aday CV'sini yükleyin. PDF, DOCX veya TXT formatları.
              </p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-md border border-[#1F2A44]/10 relative"
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#4DA3FF] rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <div className="w-12 h-12 bg-[#4DA3FF]/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-[#4DA3FF]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1F2A44] mb-2">İhtiyaçları Belirtin</h3>
              <p className="text-sm text-[#1F2A44]/70">
                İşe alacağınız kişide aradığınız becerileri ve deneyimi belirtin.
              </p>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-md border border-[#1F2A44]/10 relative"
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#4DA3FF] rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <div className="w-12 h-12 bg-[#4DA3FF]/10 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-[#4DA3FF]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1F2A44] mb-2">AI Analizi ve Sonuç</h3>
              <p className="text-sm text-[#1F2A44]/70">
                Yapay zeka CV'leri analiz eder ve en uygun adayı bulur.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* AI Process Visualization - Daha kompakt */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-2 bg-[#4DA3FF]/10 text-[#4DA3FF] rounded-full text-sm font-medium mb-3">
                AI TEKNOLOJİSİ
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1F2A44] mb-3">
                Yapay Zeka CV Analiz Süreci
              </h2>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 border border-[#1F2A44]/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#1F2A44]">CV İçerik Analizi</span>
                      <span className="text-sm text-[#4DA3FF]">100%</span>
                    </div>
                    <Progress value={100} className="h-2 bg-[#4DA3FF]/20" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#1F2A44]">Beceri Eşleştirme</span>
                      <span className="text-sm text-[#4DA3FF]">90%</span>
                    </div>
                    <Progress value={90} className="h-2 bg-[#4DA3FF]/20" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#1F2A44]">Deneyim Değerlendirme</span>
                      <span className="text-sm text-[#4DA3FF]">85%</span>
                    </div>
                    <Progress value={85} className="h-2 bg-[#4DA3FF]/20" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#1F2A44]">Eğitim Analizi</span>
                      <span className="text-sm text-[#4DA3FF]">95%</span>
                    </div>
                    <Progress value={95} className="h-2 bg-[#4DA3FF]/20" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#1F2A44]">Kişilik Uyum Tahmini</span>
                      <span className="text-sm text-[#4DA3FF]">80%</span>
                    </div>
                    <Progress value={80} className="h-2 bg-[#4DA3FF]/20" />
                  </div>
                </div>
                
                <div className="bg-[#4DA3FF]/5 p-4 rounded-xl border border-[#4DA3FF]/20">
                  <h3 className="text-base font-semibold text-[#1F2A44] mb-2 flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-[#4DA3FF]" />
                    Yapay Zeka Nasıl Karar Veriyor?
                  </h3>
                  <p className="text-xs text-[#1F2A44]/80">
                    HeadHunter AI, doğal dil işleme teknolojileri kullanarak CV'leri analiz eder ve belirlediğiniz iş gereksinimlerine göre puanlama yapar. Sistem teknik becerilerin yanı sıra yumuşak becerileri ve kültürel uyumu da değerlendirir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features & Benefits - Daha kompakt grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-2 bg-[#4DA3FF]/10 text-[#4DA3FF] rounded-full text-sm font-medium mb-3">
              AVANTAJLAR
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1F2A44] mb-3">
              HeadHunter'ın Faydaları
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* Benefit 1 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded-xl shadow-md border border-[#1F2A44]/10"
            >
              <div className="w-10 h-10 bg-[#4DA3FF]/10 rounded-lg flex items-center justify-center mb-3">
                <FileCheck className="w-5 h-5 text-[#4DA3FF]" />
              </div>
              <h3 className="text-base font-semibold text-[#1F2A44] mb-1">Zaman Tasarrufu</h3>
              <p className="text-xs text-[#1F2A44]/70">
                Onlarca CV'yi saniyeler içinde analiz eder.
              </p>
            </motion.div>
            
            {/* Benefit 2 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05, duration: 0.3 }}
              className="bg-white p-4 rounded-xl shadow-md border border-[#1F2A44]/10"
            >
              <div className="w-10 h-10 bg-[#4DA3FF]/10 rounded-lg flex items-center justify-center mb-3">
                <Search className="w-5 h-5 text-[#4DA3FF]" />
              </div>
              <h3 className="text-base font-semibold text-[#1F2A44] mb-1">Objektif Değerlendirme</h3>
              <p className="text-xs text-[#1F2A44]/70">
                İnsan önyargısını ortadan kaldırır.
              </p>
            </motion.div>
            
            {/* Benefit 3 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="bg-white p-4 rounded-xl shadow-md border border-[#1F2A44]/10"
            >
              <div className="w-10 h-10 bg-[#4DA3FF]/10 rounded-lg flex items-center justify-center mb-3">
                <Award className="w-5 h-5 text-[#4DA3FF]" />
              </div>
              <h3 className="text-base font-semibold text-[#1F2A44] mb-1">Yüksek İsabet</h3>
              <p className="text-xs text-[#1F2A44]/70">
                İşe alım süreçlerini iyileştirir.
              </p>
            </motion.div>
            
            {/* Benefit 4 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="bg-white p-4 rounded-xl shadow-md border border-[#1F2A44]/10"
            >
              <div className="w-10 h-10 bg-[#4DA3FF]/10 rounded-lg flex items-center justify-center mb-3">
                <PieChart className="w-5 h-5 text-[#4DA3FF]" />
              </div>
              <h3 className="text-base font-semibold text-[#1F2A44] mb-1">Detaylı Rapor</h3>
              <p className="text-xs text-[#1F2A44]/70">
                Karşılaştırmalı analiz raporları.
              </p>
            </motion.div>
            
            {/* Benefit 5 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="bg-white p-4 rounded-xl shadow-md border border-[#1F2A44]/10"
            >
              <div className="w-10 h-10 bg-[#4DA3FF]/10 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-[#4DA3FF]" />
              </div>
              <h3 className="text-base font-semibold text-[#1F2A44] mb-1">Gizlilik</h3>
              <p className="text-xs text-[#1F2A44]/70">
                KVKK uyumlu veri koruma.
              </p>
            </motion.div>
            
            {/* Benefit 6 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="bg-white p-4 rounded-xl shadow-md border border-[#1F2A44]/10"
            >
              <div className="w-10 h-10 bg-[#4DA3FF]/10 rounded-lg flex items-center justify-center mb-3">
                <Briefcase className="w-5 h-5 text-[#4DA3FF]" />
              </div>
              <h3 className="text-base font-semibold text-[#1F2A44] mb-1">Düşük Maliyet</h3>
              <p className="text-xs text-[#1F2A44]/70">
                Uygun maliyetle en iyi adaylar.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Daha küçük */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#4DA3FF]/5 p-6 rounded-xl shadow-md border border-[#4DA3FF]/20">
            <div>
              <h2 className="text-xl font-bold text-[#1F2A44] mb-1">
                En İyi Yetenekleri Keşfedin
              </h2>
              <p className="text-sm text-[#1F2A44]/70">
                CV'leri yükleyin, yapay zeka en uygun adayı bulsun.
              </p>
            </div>
            <Button className="bg-[#4DA3FF] hover:bg-[#4DA3FF]/90 text-white px-6 py-2 rounded-full whitespace-nowrap">
              <FileUp className="w-4 h-4 mr-2" />
              CV Yüklemeye Başla
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default IseAlimPage; 