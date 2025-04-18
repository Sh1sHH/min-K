import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-white border-t border-[#1F2A44]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-semibold text-[#1F2A44] mb-4">minİK</h2>
            <p className="text-[#1F2A44]/70 max-w-md">
              İK süreçlerinizi dijitalleştirin, zamandan tasarruf edin. 
              Modern çözümlerle işinizi kolaylaştırın.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-[#1F2A44]/60 hover:text-[#4DA3FF] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#1F2A44]/60 hover:text-[#4DA3FF] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#1F2A44]/60 hover:text-[#4DA3FF] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#1F2A44]/60 hover:text-[#4DA3FF] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#1F2A44] font-medium mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] transition-colors">Hakkımızda</a>
              </li>
              <li>
                <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] transition-colors">Hizmetlerimiz</a>
              </li>
              <li>
                <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] transition-colors">SSS</a>
              </li>
              <li>
                <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] transition-colors">İletişim</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[#1F2A44] font-medium mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-[#1F2A44]/70">
                <Mail className="w-4 h-4 mr-2" />
                <a href="mailto:info@minik.com" className="hover:text-[#4DA3FF] transition-colors">
                  info@minik.com
                </a>
              </li>
              <li className="flex items-center text-[#1F2A44]/70">
                <Phone className="w-4 h-4 mr-2" />
                <a href="tel:+902121234567" className="hover:text-[#4DA3FF] transition-colors">
                  +90 (212) 123 45 67
                </a>
              </li>
              <li className="flex items-start text-[#1F2A44]/70">
                <MapPin className="w-4 h-4 mr-2 mt-1" />
                <span>
                  Levent, 34330 <br />
                  Beşiktaş/İstanbul
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#1F2A44]/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#1F2A44]/70 text-sm">
              © 2024 minİK. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] text-sm transition-colors">
                Gizlilik Politikası
              </a>
              <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] text-sm transition-colors">
                Kullanım Şartları
              </a>
              <a href="#" className="text-[#1F2A44]/70 hover:text-[#4DA3FF] text-sm transition-colors">
                KVKK
              </a>
            </div>
          </div>
        </div>

{/* Bottom glow light effect with animation */}
<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[3000px] h-[950px] bg-[#4DA3FF]/15 blur-[3px] rounded-full pointer-events-none z-0 animate-glowPulse" />

      </div>
    </footer>
  );
};

export default Footer; 