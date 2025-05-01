import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, HeartHandshake, BadgeCheck, Clock, Users2, BookOpen } from 'lucide-react';
import Footer from '@/components/Footer';

const DanismanlikPage = () => {
  const hizmetler = [
    {
      title: "İK Süreç Danışmanlığı",
      description: "İnsan kaynakları süreçlerinizi analiz ederek verimliliği artıracak çözümler sunuyoruz.",
      icon: <Users2 className="w-12 h-12 text-white" />,
      items: [
        "İK departmanı kurulum desteği",
        "Mevcut süreçlerin iyileştirilmesi",
        "Performans sistemleri tasarımı",
        "İşe alım süreçlerinin yapılandırılması",
        "Çalışan bağlılığı programları"
      ]
    },
    {
      title: "Mevzuat ve Uyum Danışmanlığı",
      description: "İş hukuku ve yasal düzenlemelere uyum konusunda uzman danışmanlık hizmeti veriyoruz.",
      icon: <BadgeCheck className="w-12 h-12 text-white" />,
      items: [
        "İş sözleşmeleri hazırlama",
        "Özlük dosyası uyum kontrolü",
        "Yasal denetim hazırlıkları",
        "İş kanunu eğitimleri",
        "Bordro ve özlük süreçleri"
      ]
    },
    {
      title: "Eğitim ve Gelişim Danışmanlığı",
      description: "Çalışanlarınızın potansiyelini en üst düzeye çıkaracak eğitim programları tasarlıyoruz.",
      icon: <BookOpen className="w-12 h-12 text-white" />,
      items: [
        "Eğitim ihtiyaç analizi",
        "Yetkinlik modellemesi",
        "Liderlik gelişim programları",
        "Mentorluk sistemi kurulumu",
        "Kişisel gelişim planları"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Bölümü */}
      <section className="bg-gradient-to-b from-[#4DA3FF]/10 to-white pt-32 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-center text-[#1F2A44] mb-6">
            İK Danışmanlık Hizmetlerimiz
          </h1>
          <p className="text-center text-xl text-[#1F2A44]/80 max-w-3xl mx-auto mb-12">
            Şirketinizin insan kaynakları süreçlerinde uzman desteği ile 
            verimliliği artırın, yasal uyumluluğu sağlayın.
          </p>
        </div>
      </section>

      {/* Ana İçerik */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Sol Taraf - Görsel */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#4DA3FF]/10 rounded-full filter blur-xl opacity-60 z-0" />
              <img 
                src="/danismanlik.webp" 
                alt="İK Danışmanlığı" 
                className="rounded-xl shadow-xl max-w-full relative z-10"
              />
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#4DA3FF]/20 rounded-full filter blur-xl opacity-60 z-0" />
            </div>
          </div>

          {/* Sağ Taraf - Açıklama */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-semibold text-[#1F2A44] mb-6">
              İşletmenize Özel Çözümler
            </h2>
            <p className="text-[#1F2A44]/70 mb-6">
              İKyardim.com olarak, her işletmenin kendine özgü ihtiyaçları olduğunu biliyoruz. 
              Bu nedenle danışmanlık hizmetlerimizi şirketinizin büyüklüğü, sektörü ve 
              spesifik gereksinimlerine göre özelleştiriyoruz.
            </p>
            <p className="text-[#1F2A44]/70 mb-8">
              İK süreçlerinizi optimize ederek çalışan bağlılığını, verimliliğini 
              artırmanıza ve yasal uyumluluğu sağlamanıza yardımcı oluyoruz. 
              Deneyimli danışmanlarımız, en güncel bilgiler ve en iyi uygulamalarla 
              şirketinize değer katıyor.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-[#4DA3FF]/10 p-1 shrink-0">
                  <Check className="w-5 h-5 text-[#4DA3FF]" />
                </div>
                <p className="text-[#1F2A44]/80 text-sm">Uzman kadromuzla hızlı ve etkili çözümler</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-[#4DA3FF]/10 p-1 shrink-0">
                  <Check className="w-5 h-5 text-[#4DA3FF]" />
                </div>
                <p className="text-[#1F2A44]/80 text-sm">İşletmenize özel yaklaşım ve tavsiyeler</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-[#4DA3FF]/10 p-1 shrink-0">
                  <Check className="w-5 h-5 text-[#4DA3FF]" />
                </div>
                <p className="text-[#1F2A44]/80 text-sm">Sürekli destek ve izleme</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hizmetler Bölümü */}
        <h2 className="text-3xl font-semibold text-center text-[#1F2A44] mb-12">
          Danışmanlık Hizmetlerimiz
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {hizmetler.map((hizmet, index) => (
            <Card key={index} className="border-[#1F2A44]/10 shadow-lg overflow-hidden">
              <CardHeader className="bg-[#4DA3FF] pb-14 pt-8 relative">
                <div className="absolute -bottom-8 left-6 w-16 h-16 bg-[#1F2A44] rounded-2xl flex items-center justify-center">
                  {hizmet.icon}
                </div>
                <CardTitle className="text-xl text-white">{hizmet.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-12 pb-6">
                <p className="text-[#1F2A44]/70 mb-6">{hizmet.description}</p>
                <ul className="space-y-2">
                  {hizmet.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="rounded-full bg-[#4DA3FF]/10 p-1 mt-0.5 shrink-0">
                        <Check className="w-4 h-4 text-[#4DA3FF]" />
                      </div>
                      <span className="text-[#1F2A44]/80 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nasıl Çalışıyoruz */}
        <div className="bg-[#1F2A44]/5 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-semibold text-center text-[#1F2A44] mb-12">
            Nasıl Çalışıyoruz?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#4DA3FF] rounded-full flex items-center justify-center mb-4">
                <HeartHandshake className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Tanışma</h3>
              <p className="text-[#1F2A44]/70">İhtiyaçlarınızı anlamak için kapsamlı bir ön görüşme yapıyoruz.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#4DA3FF] rounded-full flex items-center justify-center mb-4">
                <Users2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Analiz</h3>
              <p className="text-[#1F2A44]/70">Mevcut süreçlerinizi inceliyor ve iyileştirme alanlarını belirliyoruz.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#4DA3FF] rounded-full flex items-center justify-center mb-4">
                <BadgeCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Çözüm</h3>
              <p className="text-[#1F2A44]/70">Size özel stratejiler ve eylem planları geliştiriyoruz.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#4DA3FF] rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Uygulama</h3>
              <p className="text-[#1F2A44]/70">Çözümlerin uygulanmasında destek oluyor ve sürekli izliyoruz.</p>
            </div>
          </div>
        </div>

        {/* Danışmanlık Talebi */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#1F2A44] mb-6">
            Danışmanlık Hizmeti Almak İster misiniz?
          </h2>
          <p className="text-[#1F2A44]/70 mb-8">
            İşletmenizin ihtiyaçlarını anlamak ve size nasıl yardımcı olabileceğimizi 
            görüşmek için bizimle iletişime geçin. İlk konsültasyon görüşmemiz ücretsizdir.
          </p>
          <Button className="bg-[#4DA3FF] hover:bg-[#4DA3FF]/80 text-white px-8 py-6 rounded-full text-lg">
            Danışmanlık Talebi Oluştur
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DanismanlikPage; 