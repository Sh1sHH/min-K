import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, User, Tag, ArrowLeft } from 'lucide-react';
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

      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/by-slug/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Blog yazısı alınamadı. Hata kodu: ${response.status}`);
      }

      const data = await response.json();
      setPost(data.post);
    } catch (error) {
      console.error('Blog yazısı alınırken hata oluştu:', error);
      setError(error instanceof Error ? error.message : 'Blog yazısı yüklenirken bir hata oluştu');
      toast.error(error instanceof Error ? error.message : 'Blog yazısı yüklenirken bir hata oluştu');
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
            className="mt-8 rounded-3xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[400px] object-cover"
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
        </div>
      </section>
    </>
  );
};

export default BlogDetail; 