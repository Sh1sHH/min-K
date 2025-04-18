"use client";

import React from 'react';
import { Users, Briefcase, Building2, Clock, Shield } from 'lucide-react';

const Features = () => {
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First Card - Image Left */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-24">
          <div className="w-full lg:w-1/2">
            <img
              src="/employee-benefits.jpg"
              alt="Employee Benefits"
              className="rounded-2xl object-cover w-full aspect-[4/3] shadow-lg"
            />
          </div>
          <div className="w-full lg:w-1/2 lg:pl-8">
            <h2 className="text-3xl font-semibold text-[#1F2A44] mb-4">
              Make a real difference with affordable employee benefits.
            </h2>
            <p className="text-lg text-[#1F2A44]/70 mb-6">
              Support your team's health and well-being with comprehensive benefits that don't break the bank.
            </p>
            <a href="#" className="text-[#4DA3FF] font-medium hover:text-[#B1E5D3] inline-flex items-center group">
              Learn more about employee benefits
              <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        {/* Second Card - Image Right */}
        <div className="flex flex-col-reverse lg:flex-row gap-12 items-center mb-24">
          <div className="w-full lg:w-1/2 lg:pr-8">
            <h2 className="text-3xl font-semibold text-[#1F2A44] mb-4">
              Hire standout candidates and get them up to speed faster than ever.
            </h2>
            <p className="text-lg text-[#1F2A44]/70 mb-6">
              Streamline your hiring process and onboard new team members efficiently with our integrated HR tools.
            </p>
            <a href="#" className="text-[#4DA3FF] font-medium hover:text-[#B1E5D3] inline-flex items-center group">
              Explore our hiring solutions
              <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
          <div className="w-full lg:w-1/2">
            <img
              src="/team-meeting.jpg"
              alt="Team Meeting"
              className="rounded-2xl object-cover w-full aspect-[4/3] shadow-lg"
            />
          </div>
        </div>

        {/* "But wait, there's more" Section */}
        <div className="text-center mt-32 relative">
          <div className="relative z-10">
            <h3 className="text-2xl font-semibold text-[#1F2A44] mb-16">
              But wait, there's more.
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-4xl mx-auto">
              {/* Time & Attendance */}
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-[#4DA3FF]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#4DA3FF]/20 transition-colors border border-[#4DA3FF]/20">
                  <Clock className="w-12 h-12 text-[#4DA3FF] group-hover:text-[#B1E5D3] transition-colors" />
                </div>
                <span className="text-sm font-medium text-[#1F2A44]/70">Time & Attendance</span>
              </div>

              {/* HR Management */}
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-[#4DA3FF]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#4DA3FF]/20 transition-colors border border-[#4DA3FF]/20">
                  <Users className="w-12 h-12 text-[#4DA3FF] group-hover:text-[#B1E5D3] transition-colors" />
                </div>
                <span className="text-sm font-medium text-[#1F2A44]/70">HR Management</span>
              </div>

              {/* Benefits Admin */}
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-[#4DA3FF]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#4DA3FF]/20 transition-colors border border-[#4DA3FF]/20">
                  <Shield className="w-12 h-12 text-[#4DA3FF] group-hover:text-[#B1E5D3] transition-colors" />
                </div>
                <span className="text-sm font-medium text-[#1F2A44]/70">Benefits Admin</span>
              </div>

              {/* Talent */}
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-[#4DA3FF]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#4DA3FF]/20 transition-colors border border-[#4DA3FF]/20">
                  <Briefcase className="w-12 h-12 text-[#4DA3FF] group-hover:text-[#B1E5D3] transition-colors" />
                </div>
                <span className="text-sm font-medium text-[#1F2A44]/70">Talent</span>
              </div>

              {/* Payroll */}
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-[#4DA3FF]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#4DA3FF]/20 transition-colors border border-[#4DA3FF]/20">
                  <Building2 className="w-12 h-12 text-[#4DA3FF] group-hover:text-[#B1E5D3] transition-colors" />
                </div>
                <span className="text-sm font-medium text-[#1F2A44]/70">Payroll</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 