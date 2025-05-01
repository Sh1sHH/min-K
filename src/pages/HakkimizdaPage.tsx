import React from 'react';
import { Check, Users, Rocket, Heart, Clock } from 'lucide-react';
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

  // Şirket değerleri - startup değerlerine daha uygun
  const degerler = [
    {
      baslik: "Çeviklik",
      icerik: "Küçük ekibimizle hızlı kararlar alır, müşteri ihtiyaçlarına anında yanıt veririz.",
      icon: <Rocket className="h-8 w-8 text-[#4DA3FF]" />
    },
    {
      baslik: "Kişiselleştirme",
      icerik: "Her müşterimize özel çözümler sunar, şablonlara bağlı kalmayız.",
      icon: <Heart className="h-8 w-8 text-[#4DA3FF]" />
    },
    {
      baslik: "Erişilebilirlik",
      icerik: "İK teknolojilerini küçük işletmelerin de erişebileceği şekilde sunuyoruz.",
      icon: <Users className="h-8 w-8 text-[#4DA3FF]" />
    },
    {
      baslik: "Sürekli İyileştirme",
      icerik: "Ürünümüzü sürekli olarak geliştiriyor, geri bildirimleri hızla uygulamaya alıyoruz.",
      icon: <Clock className="h-8 w-8 text-[#4DA3FF]" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-semibold text-[#1F2A44] mb-6">Biz Kimiz?</h2>
            <div className="space-y-4">
              <p className="text-[#1F2A44]/70">
                İKyardim, iki tutkulu profesyonelin - bir İK uzmanı ve bir yazılım geliştiricinin - 
                2022 yılında bir araya gelerek İK süreçlerini daha kolay ve erişilebilir hale getirme 
                hayaliyle kurduğu bir startup'tır.
              </p>
              <p className="text-[#1F2A44]/70">
                İK alanında yıllarca çalışan Ayşe, karmaşık İK süreçlerinin küçük işletmeler için ne kadar 
                zorlu olduğunu fark etti. Yazılım geliştirici Mehmet ile tanışmasıyla birlikte, bu sorunu 
                çözmek için kullanıcı dostu bir platform oluşturma fikri doğdu.
              </p>
              <p className="text-[#1F2A44]/70">
                İki kişilik küçük bir ekip olmamız, aslında en büyük gücümüz. Müşterilerimizi birer numara 
                olarak değil, gerçek insanlar olarak görüyor ve onlara kişisel ilgi gösteriyoruz. Hızlı 
                hareket edebiliyor ve geri bildirimlere anında yanıt verebiliyoruz.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#4DA3FF]/10 rounded-full filter blur-xl opacity-60 z-0" />
            <img 
              src="/aboutus.webp" 
              alt="İKyardim Ekibi" 
              className="rounded-xl shadow-xl max-w-full relative z-10"
            />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#4DA3FF]/20 rounded-full filter blur-xl opacity-60 z-0" />
          </div>
        </div>

        {/* Misyonumuz */}
        <div className="my-20 p-8 bg-[#1F2A44]/5 rounded-xl">
          <h2 className="text-3xl font-semibold text-center text-[#1F2A44] mb-6">Misyonumuz</h2>
          <p className="text-center text-lg text-[#1F2A44]/70 max-w-3xl mx-auto">
            İK süreçlerini daha az stresli, daha az zaman alıcı ve daha az karmaşık hale getirerek, 
            küçük ve orta ölçekli işletmelerin kaynaklarını büyümeye ve çalışanlarına odaklamasını sağlamak.
          </p>
        </div>

        {/* Değerlerimiz */}
        <div className="my-20">
          <h2 className="text-3xl font-semibold text-center text-[#1F2A44] mb-12">Startup Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {degerler.map((deger, index) => (
              <div key={index} className="p-6 rounded-xl bg-[#1F2A44]/5 hover:bg-[#4DA3FF]/10 transition-colors duration-300">
                <div className="mb-4 p-3 bg-white inline-block rounded-lg shadow-sm">
                  {deger.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">{deger.baslik}</h3>
                <p className="text-[#1F2A44]/70">{deger.icerik}</p>
              </div>
            ))}
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

        {/* Startup Yolculuğumuz */}
        <div className="my-20 py-16 bg-[#1F2A44]/5 rounded-3xl">
          <h2 className="text-3xl font-semibold text-center text-[#1F2A44] mb-12">Startup Yolculuğumuz</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#4DA3FF] mb-2">50+</div>
              <p className="text-[#1F2A44]/70">Mutlu Müşteri</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#4DA3FF] mb-2">2</div>
              <p className="text-[#1F2A44]/70">Tutkulu Kurucu</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#4DA3FF] mb-2">1000+</div>
              <p className="text-[#1F2A44]/70">Hesaplanan Bordro</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#4DA3FF] mb-2">∞</div>
              <p className="text-[#1F2A44]/70">Büyüme Potansiyeli</p>
            </div>
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