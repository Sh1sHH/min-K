import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#f8fafc] to-[#edf4ff] border-t border-[#1F2A44]/10">
      {/* Dalgalı Üst Kısım */}
      <div className="absolute top-0 left-0 right-0 h-6 overflow-hidden">
        <div className="absolute top-[-24px] left-0 w-full h-8 bg-white" 
             style={{
               borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
               boxShadow: '0 -5px 10px rgba(0,0,0,0.03)'
             }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo ve Açıklama */}
          <div className="space-y-6">
            <img src="/logo.webp" alt="minİK Logo" className="h-12" />
            
            <p className="text-[#1F2A44]/70 max-w-md leading-relaxed">
              İK süreçlerinizi dijitalleştirin, zamandan tasarruf edin. 
              Modern çözümlerle işinizi kolaylaştırın.
            </p>
            
            {/* Sosyal Medya */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="bg-white p-2 rounded-full shadow-sm text-[#4DA3FF] hover:bg-[#4DA3FF] hover:text-white transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white p-2 rounded-full shadow-sm text-[#4DA3FF] hover:bg-[#4DA3FF] hover:text-white transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white p-2 rounded-full shadow-sm text-[#4DA3FF] hover:bg-[#4DA3FF] hover:text-white transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white p-2 rounded-full shadow-sm text-[#4DA3FF] hover:bg-[#4DA3FF] hover:text-white transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Hızlı Erişim */}
          <div className="mt-4 md:mt-0">
            <h3 className="text-[#1F2A44] font-semibold mb-6 text-lg">Hızlı Erişim</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  Hizmetlerimiz
                </a>
              </li>
              <li>
                <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  SSS
                </a>
              </li>
              <li>
                <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  İletişim
                </a>
              </li>
            </ul>
          </div>

          {/* İletişim Bilgileri */}
          <div className="mt-4 md:mt-0">
            <h3 className="text-[#1F2A44] font-semibold mb-6 text-lg">İletişim</h3>
            <ul className="space-y-4">
              <li className="flex items-center text-[#1F2A44]/70 group">
                <div className="bg-white p-2 mr-3 rounded-full shadow-sm text-[#4DA3FF] group-hover:bg-[#4DA3FF] group-hover:text-white transition-all duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:info@minik.com" className="hover:text-[#4DA3FF] transition-colors">
                  info@minik.com
                </a>
              </li>
              <li className="flex items-center text-[#1F2A44]/70 group">
                <div className="bg-white p-2 mr-3 rounded-full shadow-sm text-[#4DA3FF] group-hover:bg-[#4DA3FF] group-hover:text-white transition-all duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <a href="tel:+902121234567" className="hover:text-[#4DA3FF] transition-colors">
                  +90 (212) 123 45 67
                </a>
              </li>
              <li className="flex items-start text-[#1F2A44]/70 group">
                <div className="bg-white p-2 mr-3 rounded-full shadow-sm text-[#4DA3FF] mt-1 group-hover:bg-[#4DA3FF] group-hover:text-white transition-all duration-300">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>
                  Levent, 34330 <br />
                  Beşiktaş/İstanbul
                </span>
              </li>
            </ul>
          </div>

          {/* Bülten Kaydı */}
          <div className="mt-4 md:mt-0">
            <h3 className="text-[#1F2A44] font-semibold mb-6 text-lg">Bültenimize Kaydolun</h3>
            <p className="text-[#1F2A44]/70 mb-4">
              İK trendleri ve sektör haberleri hakkında güncel kalın.
            </p>
            <div className="flex flex-col space-y-3">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="E-posta adresinizi girin"
                  className="pr-10 bg-white border-[#1F2A44]/10 focus:border-[#4DA3FF] transition-colors"
                />
                <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full text-[#4DA3FF] hover:text-[#4DA3FF] hover:bg-transparent">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-[#1F2A44]/50">
                Kaydolarak, <a href="#" className="underline">gizlilik politikamızı</a> kabul etmiş olursunuz.
              </p>
            </div>
          </div>
        </div>

        {/* Alt Kısım */}
        <div className="mt-16 pt-8 border-t border-[#1F2A44]/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#1F2A44]/70 text-sm">
              © 2024 minİK. Tüm hakları saklıdır.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center mt-4 md:mt-0">
              <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] text-sm transition-colors">
                Gizlilik Politikası
              </a>
              <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] text-sm transition-colors">
                Kullanım Şartları
              </a>
              <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] text-sm transition-colors">
                KVKK
              </a>
              <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] text-sm transition-colors">
                Çerez Politikası
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 