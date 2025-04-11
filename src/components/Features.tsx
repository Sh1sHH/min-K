"use client";

import React from 'react';
import { Users, Briefcase, Building2, Clock, Shield } from 'lucide-react';

const Features = () => {
  return (
    <div className="relative bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Make a real difference with affordable employee benefits.
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Support your team's health and well-being with comprehensive benefits that don't break the bank.
            </p>
            <a href="#" className="text-purple-600 font-medium hover:text-purple-700 inline-flex items-center group">
              Learn more about employee benefits
              <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        {/* Second Card - Image Right */}
        <div className="flex flex-col-reverse lg:flex-row gap-12 items-center mb-24">
          <div className="w-full lg:w-1/2 lg:pr-8">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Hire standout candidates and get them up to speed faster than ever.
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Streamline your hiring process and onboard new team members efficiently with our integrated HR tools.
            </p>
            <a href="#" className="text-purple-600 font-medium hover:text-purple-700 inline-flex items-center group">
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
          {/* Wave Transition */}
          <div className="absolute inset-0 translate-y-10 z-0">
            <svg className="absolute top-0 w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path 
                fill="rgba(139, 92, 246, 0.05)" 
                fillOpacity="1" 
                d="M0,32L48,37.3C96,43,192,53,288,80C384,107,480,149,576,154.7C672,160,768,128,864,112C960,96,1056,96,1152,101.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
            <svg className="absolute top-0 w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path 
                fill="rgba(139, 92, 246, 0.03)" 
                fillOpacity="1" 
                d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,154.7C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-semibold text-gray-900 mb-16">
              But wait, there's more.
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-4xl mx-auto">
              {/* Time & Attendance */}
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Clock className="w-12 h-12 text-purple-600 group-hover:text-purple-700 transition-colors" />
                </div>
                <span className="text-sm font-medium text-gray-600">Time & Attendance</span>
              </div>

              {/* HR Management */}
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Users className="w-12 h-12 text-purple-600 group-hover:text-purple-700 transition-colors" />
                </div>
                <span className="text-sm font-medium text-gray-600">HR Management</span>
              </div>

              {/* Benefits Admin */}
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Shield className="w-12 h-12 text-purple-600 group-hover:text-purple-700 transition-colors" />
                </div>
                <span className="text-sm font-medium text-gray-600">Benefits Admin</span>
              </div>

              {/* Talent */}
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Briefcase className="w-12 h-12 text-purple-600 group-hover:text-purple-700 transition-colors" />
                </div>
                <span className="text-sm font-medium text-gray-600">Talent</span>
              </div>

              {/* Payroll */}
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Building2 className="w-12 h-12 text-purple-600 group-hover:text-purple-700 transition-colors" />
                </div>
                <span className="text-sm font-medium text-gray-600">Payroll</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 