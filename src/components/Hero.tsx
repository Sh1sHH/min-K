"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { FlipCard, FlipCardFront, FlipCardBack } from "@/components/ui/flip-card";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-white">
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
          className="absolute -top-[20%] -left-[10%] w-[900px] h-[900px] bg-[#4DA3FF]/5 rounded-full filter blur-[130px] opacity-30 animate-float"
          style={{ animationDuration: '20s' }}
        />
        <div 
          className="absolute top-[30%] -right-[15%] w-[700px] h-[700px] bg-[#B1E5D3]/5 rounded-full filter blur-[120px] opacity-20 animate-float-delay"
          style={{ animationDuration: '15s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
          
          </div>

          <h1 className="text-center text-5xl md:text-7xl font-bold mb-6">
            <span className="text-[#1F2A44] drop-shadow-sm">
            İK süreçlerinizde,</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4DA3FF] to-[#1F2A44]">
            ilkyardım bizden.
            </span>
          </h1>
          
          <p className="text-center text-xl md:text-2xl text-[#1F2A44]/80 max-w-3xl mx-auto mb-12">
            İKyardim.com, küçük ekipler ve yeni girişimler için hızlı, sade ve etkili çözümler sunar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              className="bg-[#4DA3FF] hover:bg-[#4DA3FF]/80 text-white px-8 py-6 rounded-full text-lg font-medium w-full sm:w-auto group shadow-lg shadow-[#4DA3FF]/20"
            >
              Hemen Başla
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="ghost"
              className="bg-[#1F2A44]/5 hover:bg-[#1F2A44]/10 text-[#1F2A44] px-8 py-6 rounded-full text-lg font-medium w-full sm:w-auto"
            >
              Tanıtımı İzleyin
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FlipCard className="h-[300px]">
              <FlipCardFront className="bg-white shadow-lg rounded-2xl p-6 border border-[#1F2A44]/10">
                <div className="w-12 h-12 bg-[#4DA3FF]/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[#4DA3FF]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Enterprise Security</h3>
                <p className="text-[#1F2A44]/70">
                  Bank-grade security with end-to-end encryption and compliance features.
                </p>
              </FlipCardFront>
              <FlipCardBack className="flex flex-col items-center justify-center rounded-2xl bg-[#4DA3FF] p-6 text-white">
                <Shield className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
                <p className="text-center">
                  Advanced encryption, regular security audits, and compliance with global standards.
                </p>
              </FlipCardBack>
            </FlipCard>

            <FlipCard className="h-[300px]">
              <FlipCardFront className="bg-white shadow-lg rounded-2xl p-6 border border-[#1F2A44]/10">
                <div className="w-12 h-12 bg-[#4DA3FF]/10 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-[#4DA3FF]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Lightning Fast</h3>
                <p className="text-[#1F2A44]/70">
                  Optimized performance with sub-second response times globally.
                </p>
              </FlipCardFront>
              <FlipCardBack className="flex flex-col items-center justify-center rounded-2xl bg-[#4DA3FF] p-6 text-white">
                <Zap className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-center">
                  Global CDN, optimized code, and smart caching for instant responses.
                </p>
              </FlipCardBack>
            </FlipCard>

            <FlipCard className="h-[300px]">
              <FlipCardFront className="bg-white shadow-lg rounded-2xl p-6 border border-[#1F2A44]/10">
                <div className="w-12 h-12 bg-[#4DA3FF]/10 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-[#4DA3FF]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">AI-Powered</h3>
                <p className="text-[#1F2A44]/70">
                  Smart automation and insights powered by latest AI technology.
                </p>
              </FlipCardFront>
              <FlipCardBack className="flex flex-col items-center justify-center rounded-2xl bg-[#4DA3FF] p-6 text-white">
                <Sparkles className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
                <p className="text-center">
                  Advanced machine learning algorithms for intelligent automation and predictive analytics.
                </p>
              </FlipCardBack>
            </FlipCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 