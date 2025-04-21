import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Pencil, Trash2, Search, Image, Link2, Bold, Italic, List, ListOrdered, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from './RichTextEditor';
import { BlogPost, CATEGORIES, generateSlug } from '@/utils/blogHelpers';
import { Timestamp } from 'firebase/firestore';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface FormState {
  id: string;
  title: string;
  slug?: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  category: typeof CATEGORIES[number];
  tags: string[];
  status: 'draft' | 'published';
  readTime?: string;
  date?: string;
  seo: {
    metaDescription: string;
    keywords: string[];
  };
}

interface FormErrors {
  title?: string;
  summary?: string;
  content?: string;
  image?: string;
  author?: string;
  seo?: {
    metaDescription?: string;
    keywords?: string;
  };
}

const initialFormState: FormState = {
  id: '',
  title: '',
  summary: '',
  content: '',
  image: '',
  category: CATEGORIES[0],
  author: '',
  tags: [],
  status: 'published',
  seo: {
    metaDescription: '',
    keywords: [],
  },
};

const BlogManagement = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (currentUser) {
      console.log('useEffect - Current User Changed:', {
        displayName: currentUser.displayName,
        email: currentUser.email,
        uid: currentUser.uid,
        metadata: currentUser.metadata,
        providerData: currentUser.providerData
      });

      // Eğer display name varsa form datasını güncelle
      if (currentUser.displayName) {
        setFormData(prev => ({
          ...prev,
          author: currentUser.displayName || ''
        }));
      }
    }
  }, [currentUser]);

  const fetchPosts = async () => {
    try {
      const token = await currentUser?.getIdToken();
      const response = await fetch('https://us-central1-minik-a61c5.cloudfunctions.net/blog/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Blog yazıları alınamadı');
      
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Blog yazıları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.title?.trim()) {
      errors.title = 'Başlık gereklidir';
    }
    
    if (!formData.summary?.trim()) {
      errors.summary = 'Özet gereklidir';
    }
    
    if (!formData.content?.trim()) {
      errors.content = 'İçerik gereklidir';
    }
    
    if (!formData.image) {
      errors.image = 'Görsel gereklidir';
    }

    // SEO alanlarını otomatik doldur
    if (!formData.seo?.metaDescription) {
      formData.seo = {
        ...formData.seo,
        metaDescription: formData.summary || '',
        keywords: [formData.category]
      };
    }

    // Konsola hataları yazdır
    if (Object.keys(errors).length > 0) {
      console.log('Form validation errors:', errors);
      console.log('Current form data:', formData);
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    if (!currentUser?.displayName) {
      toast.error('Kullanıcı bilgileri yüklenemedi');
      return;
    }

    setIsSubmitting(true);
    const promise = new Promise<BlogPost>(async (resolve, reject) => {
      try {
        const token = await currentUser.getIdToken();
        if (!token) throw new Error('Yetkilendirme hatası');

        // Blog verisi hazırla
        const blogData = {
          title: formData.title.trim(),
          summary: formData.summary.trim(),
          content: formData.content.trim(),
          image: formData.image,
          category: formData.category,
          author: currentUser.displayName,
          tags: formData.tags,
          status: formData.status,
          seo: {
            metaDescription: formData.summary.trim(),
            keywords: [formData.category, ...formData.tags]
          }
        };

        console.log('Gönderilecek blog verisi:', blogData);

        // API isteği yap
        const url = isEditing 
          ? `https://us-central1-minik-a61c5.cloudfunctions.net/blog/posts/${formData.id}`
          : 'https://us-central1-minik-a61c5.cloudfunctions.net/blog/posts';

        const response = await fetch(url, {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(blogData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Blog yazısı kaydedilemedi');
        }
        
        const data = await response.json();
        resolve(data);
      } catch (error) {
        console.error('Blog post işlem hatası:', error);
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: isEditing ? 'Blog yazısı güncelleniyor...' : 'Blog yazısı kaydediliyor...',
      success: () => {
        fetchPosts();
        resetForm();
        setShowForm(false);
        return isEditing ? 'Blog yazısı güncellendi!' : 'Blog yazısı kaydedildi!';
      },
      error: (err) => `Hata: ${err.message}`
    });

    setIsSubmitting(false);
  };

  const handleDelete = async (postId: string) => {
    if (!postId) return;
    
    toast.promise(
      new Promise<boolean>(async (resolve, reject) => {
        try {
          const token = await currentUser?.getIdToken();
          if (!token) throw new Error('Yetkilendirme hatası');

          const response = await fetch(`https://us-central1-minik-a61c5.cloudfunctions.net/blog/posts/${postId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) throw new Error('Silme işlemi başarısız');
          resolve(true);
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Blog yazısı siliniyor...',
        success: () => {
          fetchPosts();
          return 'Blog yazısı başarıyla silindi!';
        },
        error: 'Blog yazısı silinirken bir hata oluştu.',
      }
    );
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      id: post.id || '',
      title: post.title || '',
      slug: post.slug || '',
      summary: post.summary || '',
      content: post.content || '',
      image: post.image || '',
      author: post.author || currentUser?.displayName || 'Anonim',
      category: post.category || CATEGORIES[0],
      tags: Array.isArray(post.tags) ? post.tags : [],
      status: post.status || 'published',
      readTime: post.readTime || '',
      seo: {
        metaDescription: post.seo?.metaDescription || '',
        keywords: Array.isArray(post.seo?.keywords) ? post.seo.keywords : []
      }
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      ...initialFormState,
      author: currentUser?.displayName || 'Anonim'
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Create a unique file name
      const fileName = `blog-images/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      
      // Set metadata with content type
      const metadata = {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000',
      };
      
      // Upload the file with metadata
      await uploadBytes(storageRef, file, metadata);
      
      // Get the download URL with custom headers
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update form data with the new image URL
      setFormData(prev => ({
        ...formData,
        image: downloadURL
      }));

      toast.success('Görsel başarıyla yüklendi!');
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      toast.error('Görsel yüklenirken bir hata oluştu. Lütfen daha küçük bir dosya deneyin veya farklı bir format kullanın.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Blog Yönetimi</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {showForm ? 'Listeye Dön' : 'Yeni Blog Yazısı'}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Başlık
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Blog yazısı başlığı"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Özet
                </label>
                <Textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Blog yazısı özeti..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  İçerik
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val })}
                  placeholder="Blog yazısı içeriği..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Blog Görseli
                </label>
                <div className="space-y-4">
                  {formData.image && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-white/5">
                      <img
                        src={formData.image}
                        alt="Blog görseli"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/10 hover:bg-white/20 text-white flex items-center gap-2"
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4" />
                      {isUploading ? 'Yükleniyor...' : 'Görsel Yükle'}
                    </Button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as typeof CATEGORIES[number] })}
                  className="w-full rounded-md bg-white/10 border border-white/20 text-white p-2"
                  required
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isSubmitting}
              >
                {isEditing ? 'Güncelle' : 'Yayınla'}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                İptal
              </Button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                type="text"
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="grid gap-6">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-white">
                        {post.title}
                      </h3>
                      <p className="text-sm text-white/60">
                        {post.content.length > 150
                          ? `${post.content.substring(0, 150)}...`
                          : post.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span>{post.author}</span>
                        <span>{post.date}</span>
                        <span>{post.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(post)}
                        className="bg-white/10 hover:bg-white/20 text-white p-2"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(post.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-500 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredPosts.length === 0 && (
                <div className="text-center py-12 text-white/60">
                  {searchTerm
                    ? 'Arama kriterlerine uygun blog yazısı bulunamadı.'
                    : 'Henüz blog yazısı eklenmemiş.'}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogManagement; 