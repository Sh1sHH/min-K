import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#2D1B2D] to-[#1B1B2D] pt-24">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Employees Get<br />
              <span className="text-orange-500">More Done with</span><br />
              Rippling
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Run your entire business on one platform — from payroll and benefits to devices and apps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-600 transition flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="border border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
              <img
                src="/dashboard-preview.png"
                alt="Rippling Dashboard"
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full w-24 h-24 flex items-center justify-center text-white font-bold">
              New
            </div>
          </div>
        </div>
      </div>
      
      {/* Trust Badges */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-wrap justify-center gap-8 opacity-70">
          <img src="/trust-badge-1.png" alt="Trust Badge" className="h-12" />
          <img src="/trust-badge-2.png" alt="Trust Badge" className="h-12" />
          <img src="/trust-badge-3.png" alt="Trust Badge" className="h-12" />
          <img src="/trust-badge-4.png" alt="Trust Badge" className="h-12" />
        </div>
      </div>
    </section>
  );
};

export default Hero; 