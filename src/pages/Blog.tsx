import React, { useState, useEffect } from 'react';
import StarField from "@/components/ui/star-field";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="relative min-h-screen py-24 overflow-hidden bg-black/90">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <StarField />
        
        <div className="absolute inset-0 mix-blend-overlay">
          <img 
            src="/bg3.png" 
            alt="Background" 
            className="w-full h-full object-cover object-center opacity-40"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        
        <div 
          className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full filter blur-[100px] opacity-40 animate-float mix-blend-overlay"
          style={{ animationDuration: '15s' }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-4">
            Blog & Insights
          </h1>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Discover the latest updates, insights, and stories from our team
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-black/30 backdrop-blur-sm rounded-3xl p-6 border border-white/10 animate-pulse">
                <div className="w-full h-48 bg-white/10 rounded-2xl mb-4" />
                <div className="h-8 bg-white/10 rounded mb-2 w-3/4" />
                <div className="h-4 bg-white/10 rounded mb-4 w-1/2" />
                <div className="h-20 bg-white/10 rounded" />
              </div>
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-black/30 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 group hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm text-white">{post.category}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4 text-sm text-neutral-400">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime} read</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-neutral-300 mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {post.author[0]}
                      </span>
                    </div>
                    <span className="text-sm text-neutral-300">{post.author}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-neutral-300">
              No blog posts found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog; 