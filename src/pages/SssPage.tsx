import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { faqs } from '@/lib/faqData';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

const SssPage = () => {
  const location = useLocation();
  const scrolledRef = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa tamamen yüklendiğinde
    setLoading(false);
    
    // Sayfa yüklendikten sonra scroll işlemini yapacağız
    setTimeout(() => {
      if (location.hash && !scrolledRef.current) {
        const id = location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          // Offset için navbar yüksekliğini hesaba katıyoruz (yaklaşık 80px)
          const navbarHeight = 96; // navbar yüksekliği
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
          
          // Yumuşak scroll yerine direkt pozisyona gidiyoruz
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          scrolledRef.current = true;
        }
      } else if (!location.hash) {
        // Hash yoksa sayfanın en üstüne git
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 500); // Sayfanın tamamen yüklenmesi için kısa bir gecikme
  }, [location.hash]);

  // Component yüklendiğinde veya unmount olduğunda scroll pozisyonunu resetleme
  useEffect(() => {
    return () => {
      scrolledRef.current = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-lg text-slate-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Bölümü - Hakkımızda sayfasına benzer bir başlık alanı */}
      <section className="bg-gradient-to-b from-[#4DA3FF]/10 to-white pt-32 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-center text-[#1F2A44] mb-6">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-center text-xl text-[#1F2A44]/80 max-w-3xl mx-auto mb-12">
            iKyardim platformu ve İK süreçlerinin dijitalleşmesi hakkında merak ettiğiniz her şey burada.
          </p>
        </div>
      </section>
      
      <section className="py-16 container mx-auto px-4 max-w-4xl">
        <Link 
          to="/"
          className="mb-12 inline-block bg-[#4DA3FF]/10 text-[#4DA3FF] px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide hover:bg-[#4DA3FF]/20 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4DA3FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label="Ana sayfaya geri dön"
        >
          <ChevronLeft className="inline-block mr-2 h-4 w-4 align-middle" />
          ANA SAYFAYA DÖN
        </Link>

        <div className="space-y-8 md:space-y-10">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              id={faq.id}
              className="bg-slate-50 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 scroll-mt-32 md:scroll-mt-40"
            >
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#4DA3FF] mb-3 sm:mb-4">
                {faq.question}
              </h2>
              <div className="text-slate-700 text-base sm:text-lg leading-relaxed space-y-4">
                {faq.answer.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-20 text-center">
          <p className="text-slate-600 mb-4">
            Aradığınız sorunun cevabını bulamadınız mı?
          </p>
          <Link to="/iletisim">
            <Button 
              className="bg-[#4DA3FF] hover:bg-[#4DA3FF]/90 text-white px-8 py-3 rounded-full text-lg font-medium group transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4DA3FF]"
              aria-label="Bizimle iletişime geçin"
            >
              Bizimle İletişime Geçin
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default SssPage; 