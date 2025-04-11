"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { FlipCard, FlipCardFront, FlipCardBack } from "@/components/ui/flip-card";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C0633] from-5% via-[#4F1C48] via-25% via-[#1B0421] via-55% to-[#0F0F0F] to-90% opacity-95" />
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-[url('/mesh-gradient.png')] bg-cover bg-center mix-blend-soft-light opacity-30" />
        
        {/* Animated gradient orbs */}
        <div 
          className="absolute -top-[20%] -left-[10%] w-[900px] h-[900px] bg-gradient-to-r from-[#4F1C48] via-[#3C1237] to-[#2C0633] rounded-full filter blur-[130px] opacity-50 animate-float"
          style={{ animationDuration: '20s' }}
        />
        <div 
          className="absolute top-[30%] -right-[15%] w-[700px] h-[700px] bg-gradient-to-l from-[#2C0633] via-[#251429] to-[#1B0421] rounded-full filter blur-[120px] opacity-40 animate-float-delay"
          style={{ animationDuration: '15s' }}
        />
        
        {/* Noise texture */}
        <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
          
          </div>

          <h1 className="text-center text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            İK süreçlerini dert etmeyin,</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            minİK halleder.
            </span>
          </h1>
          
          <p className="text-center text-xl md:text-2xl text-neutral-300 max-w-3xl mx-auto mb-12">
          Zamanınızı bordrolarla, izin takibiyle ya da işe alım stresleriyle harcamayın.
          minİK, sizin yerinize bu işleri yürütür. Üstelik uygun fiyatlarla ve tamamen dijital.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-full text-lg font-medium w-full sm:w-auto group"
            >
              Hemen Başla
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="ghost"
              className="border border-white/10 hover:bg-white/5 text-white px-8 py-6 rounded-full text-lg font-medium w-full sm:w-auto"
            >
              Tanıtımı İzleyin
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FlipCard className="h-[300px]">
              <FlipCardFront className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Enterprise Security</h3>
                <p className="text-neutral-300">
                  Bank-grade security with end-to-end encryption and compliance features.
                </p>
              </FlipCardFront>
              <FlipCardBack className="flex flex-col items-center justify-center rounded-2xl bg-purple-600/90 backdrop-blur-sm p-6 text-white">
                <Shield className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
                <p className="text-center">
                  Advanced encryption, regular security audits, and compliance with global standards.
                </p>
              </FlipCardBack>
            </FlipCard>

            <FlipCard className="h-[300px]">
              <FlipCardFront className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
                <p className="text-neutral-300">
                  Optimized performance with sub-second response times globally.
                </p>
              </FlipCardFront>
              <FlipCardBack className="flex flex-col items-center justify-center rounded-2xl bg-purple-600/90 backdrop-blur-sm p-6 text-white">
                <Zap className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-center">
                  Global CDN, optimized code, and smart caching for instant responses.
                </p>
              </FlipCardBack>
            </FlipCard>

            <FlipCard className="h-[300px]">
              <FlipCardFront className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI-Powered</h3>
                <p className="text-neutral-300">
                  Smart automation and insights powered by latest AI technology.
                </p>
              </FlipCardFront>
              <FlipCardBack className="flex flex-col items-center justify-center rounded-2xl bg-purple-600/90 backdrop-blur-sm p-6 text-white">
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