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
        <div className="text-center mt-32">
          <h3 className="text-2xl font-semibold text-gray-900 mb-16">
            But wait, there's more.
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-4xl mx-auto">
            {/* Time & Attendance */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Time & Attendance</span>
            </div>

            {/* HR Management */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">HR Management</span>
            </div>

            {/* Benefits Admin */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Benefits Admin</span>
            </div>

            {/* Talent */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Talent</span>
            </div>

            {/* Payroll */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Payroll</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 