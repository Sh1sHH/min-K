import React from 'react';
import { Button } from "@/components/ui/button";
import { Coffee, Sun, Heart, Battery, Moon, Clock } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Central gradient orb */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full central-orb"
          style={{
            background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.1) 30%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Where work-life balance
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">comes to rest</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Take a break from the daily grind. We help teams find their perfect rhythm 
            between productivity and well-being.
          </p>

          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Start Your Wellness Journey
          </Button>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-8 text-center transform hover:-translate-y-1 transition-transform duration-300 border border-purple-100 shadow-lg hover:shadow-xl min-h-[400px] flex flex-col">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Coffee className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Break Time</h3>
            <p className="text-lg text-gray-600 flex-grow">
              Regular breaks to recharge and stay fresh throughout the day. We help you maintain 
              a healthy work rhythm with smart break reminders and relaxation techniques.
            </p>
            <div className="mt-6 pt-6 border-t border-purple-100">
              <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                Learn more
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 text-center transform hover:-translate-y-1 transition-transform duration-300 border border-purple-100 shadow-lg hover:shadow-xl min-h-[400px] flex flex-col">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Wellness First</h3>
            <p className="text-lg text-gray-600 flex-grow">
              Prioritize team health and mental well-being with our comprehensive wellness 
              programs, meditation sessions, and stress management tools.
            </p>
            <div className="mt-6 pt-6 border-t border-purple-100">
              <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                Learn more
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 text-center transform hover:-translate-y-1 transition-transform duration-300 border border-purple-100 shadow-lg hover:shadow-xl min-h-[400px] flex flex-col">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Battery className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Energy Management</h3>
            <p className="text-lg text-gray-600 flex-grow">
              Track and optimize team energy levels with smart analytics. Get insights into peak 
              productivity hours and personalized recommendations for better performance.
            </p>
            <div className="mt-6 pt-6 border-t border-purple-100">
              <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                Learn more
              </Button>
            </div>
          </div>
        </div>

        {/* Section Transition Wave */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <div className="relative">
            {/* Primary Wave */}
            <svg className="w-full" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path 
                className="transition-all duration-300 ease-in-out"
                d="M0 120C240 180 480 200 720 180C960 160 1200 120 1440 100V200H0V120Z"
                fill="rgba(139, 92, 246, 0.05)"
              />
            </svg>
            {/* Secondary Wave */}
            <svg className="w-full absolute bottom-0 left-0" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path 
                className="transition-all duration-500 ease-in-out"
                d="M0 140C240 190 480 200 720 170C960 140 1200 130 1440 160V200H0V140Z"
                fill="rgba(236, 72, 153, 0.03)"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 