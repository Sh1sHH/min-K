import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, User, Tag, ArrowLeft, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  seo?: {
    title?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    canonical?: string;
    robots?: string;
  };
}

const SonYazilar = ({ currentPostId }: { currentPostId: string }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;

        if (!apiUrl) {
          console.error('API URL bulunamadı! Lütfen .env dosyasını kontrol edin.');
          return;
        }

        const response = await fetch(`${apiUrl}/posts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`Son yazılar alınamadı. Hata kodu: ${response.status}`);
        }

        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Mevcut yazıyı hariç tut ve en son 3 yazıyı al
          const filteredPosts = data
            .filter(post => post.id !== currentPostId)
            .slice(0, 3);
          
          setPosts(filteredPosts);
        }
      } catch (error) {
        console.error('Son yazılar alınırken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, [currentPostId]);

  if (loading || posts.length === 0) {
    return null;
  }

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

  return (
    <div className="mt-24 border-t border-[#1F2A44]/10 pt-12">
      <h2 className="text-2xl font-semibold text-[#1F2A44] mb-8">Diğer Yazılar</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-[#1F2A44]/5 hover:border-[#4DA3FF]/30 transition-all duration-300 group"
            onClick={() => navigate(`/blog/${post.slug}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/blog/${post.slug}`)}
          >
            {/* Image */}
            <div className="relative aspect-[3/2] overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 backdrop-blur-sm text-[#1F2A44] px-3 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Title */}
              <h3 className="text-lg font-semibold text-[#1F2A44] group-hover:text-[#4DA3FF] transition-colors line-clamp-2 mb-2">
                {post.title}
              </h3>

              {/* Meta Info */}
              <div className="flex items-center gap-3 text-xs text-[#1F2A44]/60">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(post.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        console.error('API URL (BlogDetail) bulunamadı! Lütfen .env dosyasını kontrol edin.');
        toast.error('API konfigürasyon hatası (BlogDetail).');
        throw new Error('API URL not configured for BlogDetail');
      }

      const response = await fetch(`${apiUrl}/posts/by-slug/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Hatası (BlogDetail):', response.status, response.statusText, errorText);
        toast.error(`Blog yazısı alınamadı: ${response.status}`);
        throw new Error(`Blog yazısı alınamadı (BlogDetail): ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data && data.post) {
        setPost(data.post);
      } else {
        console.error('Geçersiz blog yazısı verisi (BlogDetail):', data);
        toast.error('Blog yazısı formatı geçersiz.');
        throw new Error('Invalid post data structure from API (BlogDetail)');
      }

    } catch (error) {
      console.error('Blog yazısı alınırken hata oluştu (BlogDetail):', error);
      if (error instanceof Error && 
          !error.message.startsWith('API URL not configured for BlogDetail') &&
          !error.message.startsWith('Blog yazısı alınamadı (BlogDetail):') &&
          !error.message.startsWith('Invalid post data structure from API (BlogDetail)')) {
        toast.error('Blog yazısı yüklenirken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#1F2A44] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#4DA3FF]"></div>
            <p className="text-[#1F2A44]/70">Blog yazısı yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white text-[#1F2A44] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="text-red-500 text-center">
              <p>{error || 'Blog yazısı bulunamadı'}</p>
              <button
                onClick={() => navigate('/blog')}
                className="mt-4 px-6 py-3 bg-[#4DA3FF] hover:bg-[#4DA3FF]/90 text-white rounded-full transition-colors"
              >
                Blog Sayfasına Dön
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // HTML içeriğini güvenli hale getir
  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <>
      {post && (
        <Helmet>
          <title>{post.seo?.title || post.title} | iKyardım</title>
          <meta name="description" content={post.seo?.metaDescription || `${post.title} hakkında detaylı bilgi için okuyun.`} />
          <meta name="keywords" content={post.seo?.keywords?.join(', ') || post.category} />
          
          {/* Open Graph meta tags */}
          <meta property="og:title" content={post.seo?.ogTitle || post.title} />
          <meta property="og:description" content={post.seo?.ogDescription || post.seo?.metaDescription || `${post.title} hakkında detaylı bilgi için okuyun.`} />
          <meta property="og:image" content={post.seo?.ogImage || post.image} />
          <meta property="og:type" content="article" />
          
          {/* Twitter Card meta tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={post.seo?.ogTitle || post.title} />
          <meta name="twitter:description" content={post.seo?.ogDescription || post.seo?.metaDescription || `${post.title} hakkında detaylı bilgi için okuyun.`} />
          <meta name="twitter:image" content={post.seo?.ogImage || post.image} />
          
          {/* Canonical URL */}
          {post.seo?.canonical && <link rel="canonical" href={post.seo.canonical} />}
          
          {/* Robots directive */}
          {post.seo?.robots && <meta name="robots" content={post.seo.robots} />}
        </Helmet>
      )}
      <section className="relative min-h-screen bg-white text-[#1F2A44] pt-32 p-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
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

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-[#4DA3FF] hover:text-[#B1E5D3] transition-colors mb-8 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" />
            <span>Blog Sayfasına Dön</span>
          </motion.button>

          {/* Article Header */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-[#4DA3FF]/10 text-[#4DA3FF] px-4 py-2 rounded-full text-sm font-medium inline-block">
              {post.category}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-[#1F2A44]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-[#1F2A44]/60">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div 
            className="mt-8 rounded-3xl overflow-hidden shadow-xl relative aspect-[16/9] w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-contain bg-white/5 backdrop-blur-sm"
            />
          </motion.div>

          {/* Article Content */}
          <motion.div 
            className="mt-12 prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div 
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              className="prose prose-lg prose-headings:text-[#1F2A44] prose-p:text-[#1F2A44]/80 
                prose-a:text-[#4DA3FF] prose-a:no-underline hover:prose-a:text-[#B1E5D3]
                prose-strong:text-[#1F2A44] prose-code:text-[#4DA3FF] prose-pre:bg-[#1F2A44]/5
                prose-blockquote:border-l-[#4DA3FF] prose-blockquote:text-[#1F2A44]/60
                prose-img:rounded-xl prose-img:shadow-lg max-w-none"
            />
          </motion.div>

          {/* Son Yazılar Bölümü */}
          <SonYazilar currentPostId={post.id} />
        </div>
      </section>
    </>
  );
};

export default BlogDetail; 