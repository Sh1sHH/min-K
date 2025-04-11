import React from 'react';

const Showcase = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Billboard Image */}
          <div className="lg:col-span-2 rounded-3xl overflow-hidden relative h-[400px] bg-brand-persian">
            <img
              src="https://picsum.photos/1200/800?random=10"
              alt="Billboard"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-persian/80 to-transparent p-12 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Grow customer retention
              </h2>
              <p className="text-xl text-white/90 max-w-md">
                Transform one-time buyers into lifelong customers.
              </p>
            </div>
          </div>

          {/* Logo Showcase */}
          <div className="bg-brand-tyrian rounded-3xl p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-brand-persian">minİK</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Brand Identity</h3>
              <p className="text-white/80">Modern and professional design system</p>
            </div>
          </div>

          {/* Product Mockup */}
          <div className="bg-gradient-to-br from-brand-plum/20 to-brand-persian/20 rounded-3xl p-8 flex items-center justify-center">
            <img
              src="https://picsum.photos/600/600?random=11"
              alt="Product"
              className="w-full h-64 object-cover rounded-2xl shadow-xl"
            />
          </div>

          {/* Mobile App */}
          <div className="bg-gradient-to-br from-brand-persian to-brand-tyrian rounded-3xl p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl text-white">📱</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Mobile App</h3>
              <p className="text-white/80">Available on iOS & Android</p>
            </div>
          </div>

          {/* Feature Highlight */}
          <div className="bg-white border-2 border-brand-persian/20 rounded-3xl p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-brand-persian/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-brand-tyrian mb-2">Quick Setup</h3>
              <p className="text-gray-600">Get started in minutes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase; 