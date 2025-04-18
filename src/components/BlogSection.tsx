import React from 'react';
import { ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    title: "İK Süreçlerinde Dijital Dönüşüm",
    description: "Şirketinizin İK süreçlerini nasıl dijitalleştirebileceğinizi ve bunun avantajlarını keşfedin.",
    image: "/hizmet2.png",
    category: "Dijital Dönüşüm",
    readTime: "5 dk okuma"
  },
  {
    title: "Çalışan Bağlılığını Artırmanın Yolları",
    description: "Modern iş dünyasında çalışan bağlılığını artırmak için uygulanabilecek etkili stratejiler.",
    image: "/hizmet2.png",
    category: "Çalışan Deneyimi",
    readTime: "4 dk okuma"
  },
  {
    title: "İK Trendleri 2024",
    description: "2024 yılında İK dünyasını şekillendirecek en önemli trendler ve yenilikler.",
    image: "/hizmet2.png",
    category: "Trendler",
    readTime: "6 dk okuma"
  }
];

const BlogSection = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-white">
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
        
        {/* Decorative Shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-30">
          <img 
            src="/shape5.svg" 
            alt="Decorative Shape" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-35 -rotate-90">
          <img 
            src="/shape2.svg" 
            alt="Decorative Shape" 
            className="w-full h-full object-contain"
          />
        </div>
        
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

      <div className="relative z-10">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-[#4DA3FF]/10 text-[#4DA3FF] px-4 py-2 rounded-full text-sm font-medium">
                BLOG
              </span>
            </div>
            <h2 className="text-4xl font-bold text-[#1F2A44] mb-4">
              Güncel İK Yazıları
            </h2>
            <p className="text-lg text-[#1F2A44]/70 max-w-2xl mx-auto">
              İK dünyasındaki son gelişmeler, uzman görüşleri ve faydalı bilgiler
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <div 
                key={index}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#1F2A44]/10 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image Container */}
                <div className="relative w-full h-48 overflow-hidden">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-[#1F2A44] px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-[#1F2A44]/60 text-sm mb-3">
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-[#1F2A44] mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-[#1F2A44]/70 mb-6 line-clamp-2">
                    {post.description}
                  </p>

                  {/* Read More Link */}
                  <div className="flex items-center text-[#4DA3FF] font-medium group-hover:text-[#B1E5D3] transition-colors duration-300">
                    <span>Devamını Oku</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <button className="bg-[#4DA3FF]/10 hover:bg-[#4DA3FF]/20 text-[#4DA3FF] px-8 py-4 rounded-full text-lg font-medium inline-flex items-center group transition-all duration-300">
              Tüm Yazıları Gör
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection; 