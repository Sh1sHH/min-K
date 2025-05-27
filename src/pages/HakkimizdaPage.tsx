import React from 'react';
import { Check, Users, Clock, Brain, Target, Sparkles } from 'lucide-react';
import Footer from '@/components/Footer';

const HakkimizdaPage = () => {
  // Ekip üyeleri - sadece 2 kişi
  const ekipUyeleri = [
    {
      isim: "Ayşe Demir",
      unvan: "Kurucu & İK Uzmanı",
      fotograf: "/emre.webp",
      hakkinda: "10+ yıllık İK deneyimi ile bordro ve İK süreçleri konusunda uzman"
    },
    {
      isim: "Mehmet Kaya",
      unvan: "Kurucu & Yazılım Geliştirici",
      fotograf: "/emre.webp",
      hakkinda: "Web uygulamaları geliştirmede uzmanlaşmış full-stack developer"
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hakkımızda Özet */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold text-center text-[#1F2A44] mb-6">
            Hakkımızda
          </h1>
          
          <div className="bg-white rounded-xl shadow-md p-8 mb-12">
            <div className="flex items-center justify-center mb-8">
              <img src="/logo.webp" alt="iKyardim Logo" className="w-32 h-auto" />
            </div>
            <p className="text-center text-lg text-[#1F2A44]/80 mb-0">
              İK süreçlerini basitleştiren, yapay zeka destekli çözümler sunan bir teknoloji girişimiyiz.
            </p>
          </div>
          
          {/* Amacımız ve Sistemi Anlatan Kartlar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-[#4DA3FF]">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[#4DA3FF]/10 rounded-lg flex items-center justify-center mr-3">
                  <Target className="w-5 h-5 text-[#4DA3FF]" />
                </div>
                <h2 className="text-xl font-semibold text-[#1F2A44]">Amacımız</h2>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4DA3FF] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-[#1F2A44]/80">İK süreçlerini dijitalleştirerek zaman tasarrufu sağlamak</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4DA3FF] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-[#1F2A44]/80">Karmaşık hesaplamaları basitleştirerek hata riskini azaltmak</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4DA3FF] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-[#1F2A44]/80">KOBİ'lerin büyük şirket teknolojilerine erişimini sağlamak</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-[#4DA3FF]">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[#4DA3FF]/10 rounded-lg flex items-center justify-center mr-3">
                  <Brain className="w-5 h-5 text-[#4DA3FF]" />
                </div>
                <h2 className="text-xl font-semibold text-[#1F2A44]">Sistemimiz</h2>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4DA3FF] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-[#1F2A44]/80">Yapay zeka destekli bordro hesaplama ve işe alım süreçleri</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4DA3FF] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-[#1F2A44]/80">Güncel yasal mevzuatlara otomatik uyum sağlayan altyapı</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4DA3FF] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-[#1F2A44]/80">Bulut tabanlı, her yerden erişilebilen kullanıcı dostu arayüz</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Değerlerimiz */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-xl font-semibold text-center text-[#1F2A44] mb-6">Değerlerimiz</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-[#4DA3FF]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-[#4DA3FF]" />
                </div>
                <h3 className="text-sm font-semibold text-[#1F2A44] mb-1">Yenilikçilik</h3>
                <p className="text-xs text-[#1F2A44]/70">Sürekli gelişim ve inovasyon</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-[#4DA3FF]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-[#4DA3FF]" />
                </div>
                <h3 className="text-sm font-semibold text-[#1F2A44] mb-1">Müşteri Odaklılık</h3>
                <p className="text-xs text-[#1F2A44]/70">İhtiyaçlarınıza özel çözümler</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-[#4DA3FF]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-[#4DA3FF]" />
                </div>
                <h3 className="text-sm font-semibold text-[#1F2A44] mb-1">Verimlilik</h3>
                <p className="text-xs text-[#1F2A44]/70">Zaman ve kaynak tasarrufu</p>
              </div>
            </div>
          </div>
          
          {/* Rakamlarla Biz */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-xl font-semibold text-center text-[#1F2A44] mb-6">Rakamlarla Biz</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#4DA3FF] mb-1">50+</div>
                <p className="text-xs text-[#1F2A44]/70">Mutlu Müşteri</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#4DA3FF] mb-1">2</div>
                <p className="text-xs text-[#1F2A44]/70">Kurucu</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#4DA3FF] mb-1">1000+</div>
                <p className="text-xs text-[#1F2A44]/70">Hesaplanan Bordro</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#4DA3FF] mb-1">2022</div>
                <p className="text-xs text-[#1F2A44]/70">Kuruluş Yılı</p>
              </div>
            </div>
          </div>
          
          {/* Ekibimiz */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-xl font-semibold text-center text-[#1F2A44] mb-6">Kurucularımız</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ekipUyeleri.map((uye, index) => (
                <div key={index} className="flex items-center">
                  <img 
                    src={uye.fotograf} 
                    alt={uye.isim} 
                    className="w-16 h-16 object-cover rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-[#1F2A44]">{uye.isim}</h3>
                    <p className="text-sm text-[#4DA3FF] mb-1">{uye.unvan}</p>
                    <p className="text-xs text-[#1F2A44]/70">{uye.hakkinda}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* İletişim CTA */}
          <div className="bg-[#4DA3FF]/10 rounded-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-[#1F2A44] mb-2">
              İK süreçlerinizi dijitalleştirelim
            </h2>
            <p className="text-sm text-[#1F2A44]/70 mb-4">
              Sorularınız için bizimle iletişime geçin
            </p>
            <a href="mailto:info@ikyardim.com" className="inline-block bg-[#4DA3FF] hover:bg-[#4DA3FF]/90 text-white px-6 py-2 rounded-full text-sm font-medium">
              Bize Ulaşın
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HakkimizdaPage; 