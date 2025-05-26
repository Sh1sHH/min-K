import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, MessageCircle, FileText, Shield, ChevronRight, Crown } from 'lucide-react';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';

const DanismanlikPage = () => {
  const abonelikOzellikleri = [
    {
      title: "Uzmanlarla Özel Mesajlaşma",
      description: "Deneyimli İK uzmanlarımızla dilediğiniz zaman özel mesajlaşma imkanı ile sorularınıza hızlı ve kapsamlı yanıtlar alın.",
      icon: <MessageCircle className="w-10 h-10 text-[#4DA3FF]" />,
      features: [
        "Sınırsız mesajlaşma hakkı",
        "Ortalama 2 saat yanıt süresi",
        "Konusunda uzman danışmanlar",
        "Mesajlaşma geçmişine erişim"
      ]
    },
    {
      title: "Belge ve Dosya Paylaşımı",
      description: "Dokümanlarınızı güvenle paylaşın, İK uzmanlarımız belgeleriniz üzerinden detaylı inceleme yaparak size özel çözümler sunsun.",
      icon: <FileText className="w-10 h-10 text-[#4DA3FF]" />,
      features: [
        "Her türlü doküman desteği (PDF, DOCX, XLSX)",
        "Güvenli ve şifreli dosya paylaşımı",
        "Doküman üzerinde notlar ve açıklamalar",
        "İşe alım dokümanları incelemesi"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Bölümü */}
      <section className="bg-gradient-to-b from-[#4DA3FF]/10 to-white pt-36 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-center text-[#1F2A44] mb-6">
            Abonelere Özel İK Danışmanlık Hizmeti
          </h1>
          <p className="text-center text-xl text-[#1F2A44]/80 max-w-3xl mx-auto ">
            İK süreçlerinde karşılaşabileceğiniz her türlü sorun için uzman ekibimizle 
            özel mesajlaşma ve dosya paylaşım sistemi ile kişiselleştirilmiş çözümler sunuyoruz.
          </p>
        </div>
      </section>

      {/* Ana İçerik */}
      <section className="py-16 container mx-auto px-4">
        {/* Abonelik Özellikleri Tanıtım */}
        <div className="mb-16">
          

          <div className="bg-gradient-to-r from-[#4DA3FF]/10 to-[#B1E5D3]/10 rounded-3xl p-8 md:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold text-[#1F2A44] mb-4">
                  İKyardım Danışmanlık Hizmeti?
                </h3>
                <p className="text-[#1F2A44]/70 mb-6">
                  İK süreçleri her işletme için farklı zorluklar içerir. Standart çözümler 
                  yerine, işletmenizin spesifik ihtiyaçlarına özel yaklaşımlar gerekir. 
                  Abonelik sistemi ile:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-[#4DA3FF] p-1 mt-0.5 shrink-0">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#1F2A44]">Zamandan tasarruf edin</span>
                      <p className="text-sm text-[#1F2A44]/70">Uzun araştırmalar yapmak yerine, direkt uzmanlarımıza danışın.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-[#4DA3FF] p-1 mt-0.5 shrink-0">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#1F2A44]">Hatalı kararlardan kaçının</span>
                      <p className="text-sm text-[#1F2A44]/70">Yasal mevzuata uygun, risk içermeyen çözümler elde edin.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-[#4DA3FF] p-1 mt-0.5 shrink-0">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#1F2A44]">Sürekli destek alın</span>
                      <p className="text-sm text-[#1F2A44]/70">İhtiyaç duyduğunuz her an uzmanlarımızla iletişime geçin.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#1F2A44] mb-4">
                  Nasıl Çalışır?
                </h3>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1F2A44]/10">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#4DA3FF]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                        <span className="text-[#4DA3FF] font-semibold text-lg">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1F2A44] mb-1">Abonelik Başlatın</h4>
                        <p className="text-sm text-[#1F2A44]/70">Premium abonelik ile özel danışmanlık hizmetlerine erişim sağlayın.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1F2A44]/10">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#4DA3FF]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                        <span className="text-[#4DA3FF] font-semibold text-lg">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1F2A44] mb-1">Sorunuzu İletin</h4>
                        <p className="text-sm text-[#1F2A44]/70">Mesajlaşma sisteminden sorunuzu detaylandırın veya ilgili belgeleri yükleyin.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1F2A44]/10">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#4DA3FF]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                        <span className="text-[#4DA3FF] font-semibold text-lg">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1F2A44] mb-1">Uzman Yanıtını Alın</h4>
                        <p className="text-sm text-[#1F2A44]/70">Konusunda uzman danışmanlarımız en kısa sürede size özel çözümler sunar.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Abonelere Özel Bölüm */}
        <div className="mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4DA3FF]/5 to-[#B1E5D3]/5 rounded-3xl transform -skew-y-2" />
          
          <div className="relative py-16 px-6">
            <div className="flex items-center justify-center gap-3 mb-5">
              <Crown className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-3xl font-semibold text-center text-[#1F2A44]">
                Abone Ayrıcalıkları
              </h2>
            </div>
            
            <p className="text-center text-lg text-[#1F2A44]/70 max-w-3xl mx-auto mb-12">
              Abone olarak İK uzmanlarımızla özel iletişim kurabilir, belge paylaşabilir ve kişiselleştirilmiş çözümler alabilirsiniz.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {abonelikOzellikleri.map((ozellik, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg border border-[#4DA3FF]/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-[#4DA3FF]/10 p-4 rounded-2xl">
                      {ozellik.icon}
                    </div>
                    <Badge className="bg-[#1F2A44] text-white px-3 py-1">Premium</Badge>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-[#1F2A44] mb-3">{ozellik.title}</h3>
                  <p className="text-[#1F2A44]/70 mb-6">{ozellik.description}</p>
                  
                  <ul className="space-y-3 mb-6">
                    {ozellik.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="rounded-full bg-[#4DA3FF]/10 p-1 mt-0.5 shrink-0">
                          <Check className="w-4 h-4 text-[#4DA3FF]" />
                        </div>
                        <span className="text-[#1F2A44]/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <div className="flex gap-4 flex-col sm:flex-row justify-center items-center">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-[#4DA3FF]/10 flex items-center space-x-4 max-w-md">
                  <div className="bg-[#4DA3FF]/10 p-2 rounded-full">
                    <Shield className="w-6 h-6 text-[#4DA3FF]" />
                  </div>
                  <p className="text-sm text-[#1F2A44]/70">
                    Tüm mesajlaşmalarınız ve paylaştığınız belgeler <span className="font-semibold">uçtan uca şifreleme</span> ile korunur.
                  </p>
                </div>

                <Button className="bg-gradient-to-r from-[#4DA3FF] to-[#6A8BFF] hover:from-[#4DA3FF]/90 hover:to-[#6A8BFF]/90 text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Hemen Abone Ol ve Ayrıcalıklara Eriş
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DanismanlikPage; 