import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary?: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

const BlogPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://blog-7fl3duvywa-uc.a.run.app/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`Blog yazıları alınamadı. Hata kodu: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error('Invalid data format:', data);
        throw new Error('Geçersiz veri formatı');
      }
    } catch (error) {
      console.error('Blog yazıları alınırken hata oluştu:', error);
      setError(error instanceof Error ? error.message : 'Blog yazıları yüklenirken bir hata oluştu');
      toast.error(error instanceof Error ? error.message : 'Blog yazıları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | { seconds: number }) => {
    try {
      // Firebase Timestamp'i kontrol et
      if (typeof dateString === 'object' && 'seconds' in dateString) {
        const date = new Date(dateString.seconds * 1000);
        return date.toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      // Normal tarih string'i
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Tarih belirtilmemiş';
      }
      
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Tarih formatlanırken hata:', error);
      return 'Tarih belirtilmemiş';
    }
  };

  const categories = [...new Set(posts.map(post => post.category))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#1F2A44] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#4DA3FF]"></div>
            <p className="text-[#1F2A44]/70">Blog yazıları yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-[#1F2A44] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="text-red-500 text-center">
              <p>{error}</p>
              <button
                onClick={fetchPosts}
                className="mt-4 px-6 py-3 bg-[#4DA3FF] hover:bg-[#4DA3FF]/90 text-white rounded-full transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-white text-[#1F2A44] pt-32 p-8 overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-white opacity-90" />
        
        {/* Decorative Shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20 animate-float mix-blend-multiply">
          <img 
            src="/shape2.svg" 
            alt="Decorative Shape" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-20 animate-float-delay mix-blend-multiply">
          <img 
            src="/shape2.svg" 
            alt="Decorative Shape" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Subtle gradient orbs */}
        <div 
          className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-[#4DA3FF]/10 rounded-full filter blur-[100px] opacity-40 animate-float mix-blend-multiply"
          style={{ animationDuration: '15s' }}
        />
        <div 
          className="absolute top-[30%] -right-[15%] w-[400px] h-[400px] bg-[#B1E5D3]/10 rounded-full filter blur-[90px] opacity-40 animate-float-delay mix-blend-multiply"
          style={{ animationDuration: '12s' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block mb-4">
            <span className="bg-[#4DA3FF]/10 text-[#4DA3FF] px-4 py-2 rounded-full text-sm font-medium">
              BLOG
            </span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#1F2A44]"
          >
            İK Dünyasından Haberler
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#1F2A44]/70 max-w-2xl mx-auto text-lg"
          >
            İK süreçleri, dijital dönüşüm ve sektör trendleri hakkında güncel içerikler
          </motion.p>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1F2A44]/40 h-4 w-4" />
            <Input
              type="text"
              placeholder="Blog yazılarında ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-[#1F2A44]/10 text-[#1F2A44] placeholder:text-[#1F2A44]/40 focus:border-[#4DA3FF] focus:ring-[#4DA3FF]/20"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-[#1F2A44]/10 rounded-md px-4 py-2 text-[#1F2A44] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 focus:border-[#4DA3FF]"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#1F2A44]/5 hover:border-[#4DA3FF]/30 transition-all duration-300 group"
              onClick={() => navigate(`/blog/${post.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/blog/${post.id}`)}
            >
              {/* Image Container */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-[#1F2A44] px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-[#1F2A44]/60">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-[#1F2A44] group-hover:text-[#4DA3FF] transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {/* Summary/Content */}
                <div 
                  className="text-[#1F2A44]/70 line-clamp-3 prose prose-sm"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(
                      post.summary || post.content.substring(0, 150) + '...'
                    )
                  }}
                />

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#1F2A44]/5">
                  <div className="w-8 h-8 rounded-full bg-[#4DA3FF]/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-[#4DA3FF]">
                      {post.author[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-[#1F2A44]/70">{post.author}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredPosts.length === 0 && (
            <div className="col-span-full text-center py-12 text-[#1F2A44]/60">
              {searchTerm || selectedCategory
                ? 'Arama kriterlerine uygun blog yazısı bulunamadı.'
                : 'Henüz blog yazısı eklenmemiş.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogPage; 