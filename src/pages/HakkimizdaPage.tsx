import React from 'react';
import { Check, Users, Clock } from 'lucide-react';
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
    <div className="min-h-screen bg-white">
      {/* Hero Bölümü */}
      <section className="bg-gradient-to-b from-[#4DA3FF]/10 to-white pt-32 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-center text-[#1F2A44] mb-6">
            Hikayemiz
          </h1>
          <p className="text-center text-xl text-[#1F2A44]/80 max-w-3xl mx-auto mb-12">
            İki meraklı girişimcinin İK süreçlerini basitleştirme hayaliyle başlayan macera
          </p>
        </div>
      </section>

      {/* Hikayemiz */}
      <section className="py-16 container mx-auto px-4">
        {/* Modernleştirilmiş "Biz Kimiz?" bölümü */}
        <div className="mb-20 bg-gradient-to-r from-[#4DA3FF]/5 to-white p-10 rounded-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <h2 className="text-3xl font-semibold text-[#1F2A44]">Biz Kimiz?</h2>
            <img src="/logo.webp" alt="iKyardim Logo" className="w-48 h-auto" />
          </div>
          <div className="max-w-4xl">
            <p className="text-xl leading-relaxed text-[#1F2A44]/80">
              İKyardim, 2022 yılında bir İK uzmanı ve bir yazılım geliştiricinin bir araya gelerek İK süreçlerini 
              küçük işletmeler için daha erişilebilir kılma hayaliyle kurduğu bir startup'tır. 
              İki kişilik küçük ekibimizle, müşterilerimize kişisel ilgi gösteriyor, hızlı hareket ediyor ve 
              geri bildirimlere anında yanıt veriyoruz. Teknoloji ile İK uzmanlığını birleştirerek, 
              karmaşık süreçleri basitleştiriyor ve işletmenize değer katıyoruz.
            </p>
          </div>
        </div>

        {/* İyileştirilmiş Misyonumuz - Siteye uygun renklerle */}
        <div className="my-20 relative overflow-hidden rounded-xl bg-[#4DA3FF]/10 shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4DA3FF]/20 rounded-full filter blur-3xl"></div>
          <div className="relative z-10 p-12 text-center">
            <h2 className="text-3xl font-semibold text-[#1F2A44] mb-8">Misyonumuz</h2>
            <p className="text-xl text-[#1F2A44]/80 max-w-3xl mx-auto leading-relaxed">
              İK süreçlerini daha az stresli, daha az zaman alıcı ve daha az karmaşık hale getirerek, 
              küçük ve orta ölçekli işletmelerin kaynaklarını büyümeye ve çalışanlarına odaklamasını sağlamak.
            </p>
          </div>
        </div>

        {/* Yeniden Tasarlanmış Startup Yolculuğumuz */}
        <div className="my-20 py-12 relative overflow-hidden">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#1F2A44] mb-4">Startup Yolculuğumuz</h2>
            <p className="text-[#1F2A44]/70 max-w-2xl mx-auto">
              Küçük adımlarla başladık, her gün büyümeye devam ediyoruz.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-gradient-to-b from-[#4DA3FF]/10 to-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl font-bold text-[#4DA3FF] mb-3">50+</div>
              <p className="text-[#1F2A44] font-medium">Mutlu Müşteri</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-b from-[#4DA3FF]/10 to-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl font-bold text-[#4DA3FF] mb-3">2</div>
              <p className="text-[#1F2A44] font-medium">Tutkulu Kurucu</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-b from-[#4DA3FF]/10 to-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl font-bold text-[#4DA3FF] mb-3">1000+</div>
              <p className="text-[#1F2A44] font-medium">Hesaplanan Bordro</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-b from-[#4DA3FF]/10 to-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl font-bold text-[#4DA3FF] mb-3">∞</div>
              <p className="text-[#1F2A44] font-medium">Büyüme Potansiyeli</p>
            </div>
          </div>
        </div>

        {/* Ekibimiz */}
        <div className="my-20">
          <h2 className="text-3xl font-semibold text-center text-[#1F2A44] mb-4">Ekibimiz</h2>
          <p className="text-center text-[#1F2A44]/70 max-w-2xl mx-auto mb-12">
            İKyardim'in arkasındaki iki tutkulu kurucuyla tanışın.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {ekipUyeleri.map((uye, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={uye.fotograf} 
                    alt={uye.isim} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#1F2A44]">{uye.isim}</h3>
                  <p className="text-[#4DA3FF] font-medium mb-2">{uye.unvan}</p>
                  <p className="text-[#1F2A44]/70">{uye.hakkinda}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="my-16 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-[#1F2A44] mb-4">
            Küçük ekibimiz, büyük hayallerimiz var.
          </h2>
          <p className="text-[#1F2A44]/70 mb-8">
            Sizin de İK süreçlerinizi basitleştirmek, dijitalleştirmek ve işinize odaklanmanızı sağlamak için buradayız. 
            Her geri bildirim bizim için değerli, her müşteri bizim parçamız.
          </p>
          <a href="mailto:info@ikyardim.com" className="inline-block bg-[#4DA3FF] hover:bg-[#4DA3FF]/80 text-white px-8 py-4 rounded-full text-lg font-medium">
            Bize Ulaşın
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HakkimizdaPage; 