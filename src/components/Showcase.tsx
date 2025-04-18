import React from 'react';

const Showcase = () => {
  return (
    <div className="relative py-24 overflow-hidden bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="/white2.png" 
            alt="Background" 
            className="w-full h-full object-cover object-center opacity-5"
          />
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-white" />
        
        {/* Subtle gradient orbs */}
        <div 
          className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-[#4DA3FF]/5 rounded-full filter blur-[100px] opacity-30 animate-float mix-blend-overlay"
          style={{ animationDuration: '15s' }}
        />
        <div 
          className="absolute top-[30%] -right-[15%] w-[400px] h-[400px] bg-[#B1E5D3]/5 rounded-full filter blur-[90px] opacity-30 animate-float-delay mix-blend-overlay"
          style={{ animationDuration: '12s' }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Billboard Image */}
          <div className="lg:col-span-2 rounded-3xl overflow-hidden relative h-[400px] bg-white shadow-lg border border-[#1F2A44]/10">
            <img
              src="https://picsum.photos/1200/800?random=10"
              alt="Billboard"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1F2A44]/90 to-transparent p-12 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Grow customer retention
              </h2>
              <p className="text-xl text-white/90 max-w-md">
                Transform one-time buyers into lifelong customers.
              </p>
            </div>
          </div>

          {/* Logo Showcase */}
          <div className="bg-white shadow-lg rounded-3xl p-12 flex items-center justify-center border border-[#1F2A44]/10">
            <div className="text-center">
              <div className="w-32 h-32 bg-[#4DA3FF]/10 rounded-full mx-auto mb-6 flex items-center justify-center border border-[#4DA3FF]/20">
                <span className="text-4xl font-bold text-[#1F2A44]">minİK</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1F2A44] mb-4">Brand Identity</h3>
              <p className="text-[#1F2A44]/70">Modern and professional design system</p>
            </div>
          </div>

          {/* Product Mockup */}
          <div className="bg-white shadow-lg rounded-3xl p-8 flex items-center justify-center border border-[#1F2A44]/10">
            <img
              src="https://picsum.photos/600/600?random=11"
              alt="Product"
              className="w-full h-64 object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Mobile App */}
          <div className="bg-white shadow-lg rounded-3xl p-8 flex items-center justify-center border border-[#1F2A44]/10">
            <div className="text-center">
              <div className="w-24 h-24 bg-[#4DA3FF]/10 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-[#4DA3FF]/20">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-[#1F2A44] mb-2">Mobile App</h3>
              <p className="text-[#1F2A44]/70">Available on iOS & Android</p>
            </div>
          </div>

          {/* Feature Highlight */}
          <div className="bg-white shadow-lg rounded-3xl p-8 flex items-center justify-center border border-[#1F2A44]/10">
            <div className="text-center">
              <div className="w-24 h-24 bg-[#4DA3FF]/10 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-[#4DA3FF]/20">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-[#1F2A44] mb-2">Quick Setup</h3>
              <p className="text-[#1F2A44]/70">Get started in minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showcase; 