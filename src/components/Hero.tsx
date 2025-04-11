import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-brand pt-24">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Employees Get<br />
              <span className="text-brand-plum">More Done with</span><br />
              minİK
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Run your entire business on one platform — from payroll and benefits to devices and apps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-brand-plum text-brand-tyrian px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition flex items-center justify-center">
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
                src="https://picsum.photos/800/600?random=1"
                alt="minİK Dashboard"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-brand-plum to-brand-persian rounded-full w-24 h-24 flex items-center justify-center text-white font-bold">
              New
            </div>
          </div>
        </div>
      </div>
      
      {/* Trust Badges */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-wrap justify-center gap-8 opacity-70">
          <img 
            src="https://picsum.photos/200/100?random=2" 
            alt="Trust Badge" 
            className="h-12 object-contain bg-white/10 rounded px-4"
          />
          <img 
            src="https://picsum.photos/200/100?random=3" 
            alt="Trust Badge" 
            className="h-12 object-contain bg-white/10 rounded px-4"
          />
          <img 
            src="https://picsum.photos/200/100?random=4" 
            alt="Trust Badge" 
            className="h-12 object-contain bg-white/10 rounded px-4"
          />
          <img 
            src="https://picsum.photos/200/100?random=5" 
            alt="Trust Badge" 
            className="h-12 object-contain bg-white/10 rounded px-4"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero; 