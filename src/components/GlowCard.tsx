import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

const GlowCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const updateMousePosition = (ev: MouseEvent) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = ((ev.clientX - rect.left) / card.clientWidth) * 100;
      const y = ((ev.clientY - rect.top) / card.clientHeight) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    };

    card.addEventListener('mousemove', updateMousePosition);
    return () => {
      card.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  useEffect(() => {
    const particles = particlesRef.current;
    if (!particles) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.animationDelay = Math.random() * 8 + 's';
      document.body.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 8000);
    };

    // Initial particles
    for (let i = 0; i < 20; i++) {
      setTimeout(() => createParticle(), i * 200);
    }

    const interval = setInterval(() => {
      createParticle();
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative">
      <div ref={particlesRef} className="fixed inset-0 pointer-events-none overflow-hidden" />
      <div className="glow-border" />
      <div ref={cardRef} className="glow-card">
        <h2 className="text-3xl font-bold mb-8 text-white">
          İK Süreçlerinizi Kolaylaştırın
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sol Kolon - İstatistikler */}
          <div className="space-y-8">
            <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm">
              <div className="text-5xl font-bold text-purple-400 mb-2">85%</div>
              <div className="text-gray-400">Zaman Tasarrufu</div>
            </div>
            
            <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-600 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-gray-400">Kesintisiz Hizmet</div>
            </div>
          </div>

          {/* Sağ Kolon - Özellikler */}
          <div className="space-y-6">
            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Check className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Otomatik Bordro Hesaplama</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Dakikalar içinde bordro işlemlerinizi tamamlayın
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Check className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">İzin Yönetimi</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Tek tıkla izin talep ve onay süreci
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlowCard; 