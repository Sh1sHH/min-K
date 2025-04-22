import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary?: string;
  image: string;
  category: string;
  date: string;
  slug: string;
}

const BlogSection = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`);
      
      if (!response.ok) {
        throw new Error('Blog yazıları alınamadı');
      }

      const data = await response.json();
      // Son 3 postu al ve tarihe göre sırala
      const latestPosts = data
        .sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
      
      setPosts(latestPosts);
    } catch (error) {
      console.error('Blog yazıları alınırken hata:', error);
      toast.error('Blog yazıları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const handleViewAllClick = () => {
    navigate('/blog');
  };

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
        
        {/* Decorative Shapes with Animations */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
          whileInView={{ opacity: 0.3, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 right-0 w-[800px] h-[800px]"
        >
          <img 
            src="/shape5.svg" 
            alt="Decorative Shape" 
            className="w-full h-full object-contain animate-float"
            style={{ animationDuration: '20s' }}
          />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 90 }}
          whileInView={{ opacity: 0.35, scale: 1, rotate: -90 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px]"
        >
          <img 
            src="/shape2.svg" 
            alt="Decorative Shape" 
            className="w-full h-full object-contain animate-float-delay"
            style={{ animationDuration: '15s' }}
          />
        </motion.div>
        
        {/* Subtle gradient orbs */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.3 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-[#4DA3FF]/5 rounded-full filter blur-[100px] animate-float mix-blend-overlay"
          style={{ animationDuration: '15s' }}
        />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.3 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute top-[30%] -right-[15%] w-[400px] h-[400px] bg-[#B1E5D3]/5 rounded-full filter blur-[90px] animate-float-delay mix-blend-overlay"
          style={{ animationDuration: '12s' }}
        />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-block mb-4">
              <span className="bg-[#4DA3FF]/10 text-[#4DA3FF] px-4 py-2 rounded-full text-sm font-medium">
                BLOG
              </span>
            </motion.div>
            <motion.h2 
              variants={itemVariants}
              className="text-4xl font-bold text-[#1F2A44] mb-4"
            >
              Güncel İK Yazıları
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-[#1F2A44]/70 max-w-2xl mx-auto"
            >
              İK dünyasındaki son gelişmeler, uzman görüşleri ve faydalı bilgiler
            </motion.p>
          </motion.div>

          {/* Blog Posts Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {loading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#1F2A44]/10 animate-pulse">
                  <div className="w-full h-48 bg-gray-200" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))
            ) : (
              posts.map((post) => (
                <motion.div 
                  key={post.id}
                  variants={itemVariants}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#1F2A44]/10 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/blog/${post.slug}`)}
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-contain bg-[#F8FAFC]"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-[#1F2A44] px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#1F2A44] mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-[#1F2A44]/70 mb-6 line-clamp-2">
                      {post.summary || post.content.substring(0, 150) + '...'}
                    </p>

                    {/* Read More Link */}
                    <div className="flex items-center text-[#4DA3FF] font-medium group-hover:text-[#B1E5D3] transition-colors duration-300">
                      <span>Devamını Oku</span>
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* View All Button */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              variants={itemVariants}
              onClick={handleViewAllClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4DA3FF] text-white rounded-full hover:bg-[#4DA3FF]/90 transition-colors"
            >
              <span>Tüm Yazıları Gör</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection; 