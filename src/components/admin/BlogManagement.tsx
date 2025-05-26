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
import { storage } from '@/config/firebase';
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
    title: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
    ogTitle: string;
    ogDescription: string;
    canonical: string;
    robots: string;
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
    title: '',
    metaDescription: '',
    keywords: [],
    ogImage: '',
    ogTitle: '',
    ogDescription: '',
    canonical: '',
    robots: 'index, follow',
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

        // SEO verilerini hazırla
        const seoData = {
          title: formData.seo.title || formData.title,
          metaDescription: formData.seo.metaDescription || formData.summary,
          keywords: formData.seo.keywords.length > 0 
            ? formData.seo.keywords 
            : [formData.category, ...formData.tags],
          ogImage: formData.seo.ogImage || formData.image,
          ogTitle: formData.seo.ogTitle || formData.title,
          ogDescription: formData.seo.ogDescription || formData.summary,
          canonical: formData.seo.canonical || `https://ikyardim.com/blog/${generateSlug(formData.title)}`,
          robots: formData.seo.robots || 'index, follow'
        };

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
          seo: seoData,
          slug: generateSlug(formData.title)
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
        keywords: Array.isArray(post.seo?.keywords) ? post.seo.keywords : [],
        title: post.title || '',
        ogImage: post.image || '',
        ogTitle: post.title || '',
        ogDescription: post.summary || '',
        canonical: post.slug || '',
        robots: 'index, follow',
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

  const filteredPosts = posts.filter(post => {
    // Kategoriye göre filtreleme
    if (searchTerm.startsWith('category:')) {
      const categoryFilter = searchTerm.substring(9); // 'category:' kısmını kaldır
      return post.category === categoryFilter;
    }
    
    // Normal metin araması
    return post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Blog Yönetimi</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className={`inline-flex items-center gap-2 transition-all duration-200 px-4 py-2 ${
            showForm 
              ? "bg-gray-600/50 hover:bg-gray-600/70 text-white/90" 
              : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
          }`}
        >
          {showForm ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
              Listeye Dön
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              Yeni Blog Yazısı
            </>
          )}
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
            <div className="border-b border-white/10 pb-4 mb-6">
              <h3 className="text-xl font-semibold text-white">
                {isEditing ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Oluştur'}
              </h3>
              <p className="text-sm text-white/60 mt-1">
                Tüm gerekli alanları doldurarak blog içeriğinizi hazırlayın
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Başlık
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Blog yazısı başlığı"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500/50"
                    required
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-400">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as typeof CATEGORIES[number] })}
                    className="w-full rounded-md bg-white/10 border border-white/20 text-white p-2 focus:ring-2 focus:ring-purple-500/50"
                    required
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category} className="bg-gray-800 text-white">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Özet
                </label>
                <Textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Blog yazısı özeti..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px] focus:ring-2 focus:ring-purple-500/50"
                  required
                />
                {formErrors.summary && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.summary}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  İçerik
                </label>
                <div className="rounded-md overflow-hidden border border-white/20">
                  <RichTextEditor
                    value={formData.content}
                    onChange={(val) => setFormData({ ...formData, content: val })}
                    placeholder="Blog yazısı içeriği..."
                  />
                </div>
                {formErrors.content && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.content}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Blog Görseli
                </label>
                <div className="space-y-4">
                  {formData.image ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-white/5 group">
                      <img
                        src={formData.image}
                        alt="Blog görseli"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="bg-red-500/30 hover:bg-red-500/50 text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Görseli Kaldır
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center bg-white/5">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Image className="w-12 h-12 text-white/40" />
                        <p className="text-white/60 text-sm">Henüz görsel yüklenmedi</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 w-full justify-center py-2.5 px-4"
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
                  {formErrors.image && (
                    <p className="text-sm text-red-400">{formErrors.image}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SEO Ayarları */}
            <div className="mt-8 border border-white/10 rounded-lg p-6 bg-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">SEO Ayarları</h3>
                <div className="bg-purple-600/20 text-purple-200 text-xs px-2 py-1 rounded-full">
                  Arama Motoru Optimizasyonu
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SEO Başlık */}
                  <div>
                    <label htmlFor="seoTitle" className="block text-sm font-medium text-white/80 mb-2">
                      SEO Başlık
                    </label>
                    <input
                      type="text"
                      id="seoTitle"
                      name="seo.title"
                      value={formData.seo.title}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, title: e.target.value } })}
                      placeholder="SEO için özel başlık"
                      className="w-full rounded-md bg-white/10 border border-white/20 text-white p-2 focus:ring-2 focus:ring-purple-500/50"
                    />
                    <p className="mt-1 text-xs text-white/60">
                      Boş bırakırsanız blog başlığı kullanılacaktır
                    </p>
                  </div>

                  {/* Anahtar Kelimeler */}
                  <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-white/80 mb-2">
                      Anahtar Kelimeler
                    </label>
                    <Input
                      type="text"
                      id="keywords"
                      value={formData.seo.keywords.join(',')}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          seo: {
                            ...prev.seo,
                            keywords: e.target.value.split(',')
                          }
                        }));
                      }}
                      placeholder="Örnek: insan kaynakları,dijital dönüşüm,iş süreçleri"
                      className="w-full bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-purple-500/50"
                    />
                    <p className="mt-1 text-xs text-white/60">
                      Virgül (,) ile ayırarak yazın
                    </p>
                  </div>
                </div>

                {/* Meta Açıklama */}
                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-white/80 mb-2">
                    Meta Açıklama
                  </label>
                  <Textarea
                    id="metaDescription"
                    value={formData.seo.metaDescription}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })}
                    placeholder="Arama sonuçlarında görünecek kısa açıklama"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[80px] focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Open Graph Başlık */}
                  <div>
                    <label htmlFor="ogTitle" className="block text-sm font-medium text-white/80 mb-2">
                      Sosyal Medya Başlığı
                    </label>
                    <input
                      type="text"
                      id="ogTitle"
                      name="seo.ogTitle"
                      value={formData.seo.ogTitle}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, ogTitle: e.target.value } })}
                      placeholder="Sosyal medya paylaşımlarında görünecek başlık"
                      className="w-full rounded-md bg-white/10 border border-white/20 text-white p-2 focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>

                  {/* Open Graph Görsel */}
                  <div>
                    <label htmlFor="ogImage" className="block text-sm font-medium text-white/80 mb-2">
                      Sosyal Medya Görseli
                    </label>
                    <input
                      type="text"
                      id="ogImage"
                      name="seo.ogImage"
                      value={formData.seo.ogImage}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, ogImage: e.target.value } })}
                      placeholder="Sosyal medya paylaşımlarında kullanılacak görsel URL'i"
                      className="w-full rounded-md bg-white/10 border border-white/20 text-white p-2 focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                </div>

                {/* Open Graph Açıklama */}
                <div>
                  <label htmlFor="ogDescription" className="block text-sm font-medium text-white/80 mb-2">
                    Sosyal Medya Açıklaması
                  </label>
                  <Textarea
                    id="ogDescription"
                    value={formData.seo.ogDescription}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, ogDescription: e.target.value } })}
                    placeholder="Sosyal medya paylaşımlarında görünecek açıklama"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[80px] focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Canonical URL */}
                  <div>
                    <label htmlFor="canonical" className="block text-sm font-medium text-white/80 mb-2">
                      Canonical URL
                    </label>
                    <input
                      type="text"
                      id="canonical"
                      name="seo.canonical"
                      value={formData.seo.canonical}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, canonical: e.target.value } })}
                      placeholder="https://ikyardim.com/blog/ornek-yazi"
                      className="w-full rounded-md bg-white/10 border border-white/20 text-white p-2 focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>

                  {/* Robots Direktifi */}
                  <div>
                    <label htmlFor="robots" className="block text-sm font-medium text-white/80 mb-2">
                      Robots Direktifi
                    </label>
                    <select
                      id="robots"
                      name="seo.robots"
                      value={formData.seo.robots}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, robots: e.target.value } })}
                      className="w-full rounded-md bg-white/10 border border-white/20 text-white p-2 focus:ring-2 focus:ring-purple-500/50"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                    >
                      <option value="index, follow" className="bg-gray-800 text-white">İndeksle ve Takip Et</option>
                      <option value="noindex, follow" className="bg-gray-800 text-white">İndeksleme, Takip Et</option>
                      <option value="index, nofollow" className="bg-gray-800 text-white">İndeksle, Takip Etme</option>
                      <option value="noindex, nofollow" className="bg-gray-800 text-white">İndeksleme ve Takip Etme</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/10 mt-6">
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg px-6 py-2.5 transition-all duration-200 relative overflow-hidden group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? 'Güncelleniyor...' : 'Yayınlanıyor...'}
                  </span>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                      {isEditing ? 'Güncelle' : 'Yayınla'}
                    </span>
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 transition-colors duration-200 px-5 py-2.5"
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M6 18L18 6M6 6l12 12"/></svg>
                  İptal
                </span>
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
            {/* Header and Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 rounded-xl p-4 backdrop-blur-sm shadow-sm">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="text-white/50 h-4 w-4" />
                </div>
                <Input
                  type="text"
                  placeholder="Blog yazılarında ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 w-full focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <span className="bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-sm">
                  Toplam: {filteredPosts.length} yazı
                </span>
                <select 
                  className="bg-white/10 border-white/20 text-white rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-purple-500/50"
                  onChange={(e) => setSearchTerm(e.target.value ? `category:${e.target.value}` : '')}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                >
                  <option value="" className="bg-gray-800 text-white">Tüm Kategoriler</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category} className="bg-gray-800 text-white">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Blog Post List */}
            <div className="grid gap-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden group hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/10 shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-center">
                      {/* Image thumbnail */}
                      {post.image && (
                        <div className="w-full md:w-48 h-32 overflow-hidden flex-shrink-0">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1 p-4 md:p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`px-2 py-0.5 text-xs rounded-full ${
                              post.status === 'published' 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-yellow-500/20 text-yellow-300'
                            }`}>
                              {post.status === 'published' ? 'Yayında' : 'Taslak'}
                            </div>
                            <div className="bg-white/10 text-white/60 px-2 py-0.5 text-xs rounded-full">
                              {post.category}
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                            {post.title}
                          </h3>
                          
                          <p className="text-sm text-white/60 line-clamp-2">
                            {post.summary || (post.content.length > 150
                              ? `${post.content.substring(0, 150)}...`
                              : post.content)}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
                            <div className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                              {post.date || 'Tarih Yok'}
                            </div>
                            <div className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                              {post.author || 'Anonim'}
                            </div>
                            {post.readTime && (
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                                {post.readTime} dk okuma
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex md:flex-col gap-2 self-end md:self-center">
                          <Button
                            onClick={() => handleEdit(post)}
                            className="bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 relative overflow-hidden group p-2.5"
                            aria-label="Düzenle"
                          >
                            <span className="relative z-10">
                              <Pencil className="w-4 h-4" />
                            </span>
                            <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(post.id)}
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-500 transition-colors duration-200 relative overflow-hidden group p-2.5"
                            aria-label="Sil"
                          >
                            <span className="relative z-10">
                              <Trash2 className="w-4 h-4" />
                            </span>
                            <span className="absolute inset-0 bg-red-600/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                  {searchTerm ? (
                    <div className="space-y-3">
                      <Search className="h-12 w-12 text-white/30 mx-auto" />
                      <h3 className="text-lg font-medium text-white">Arama sonucu bulunamadı</h3>
                      <p className="text-white/60 max-w-md mx-auto">
                        "{searchTerm}" için sonuç bulunamadı. Farklı anahtar kelimeler deneyin veya filtreleri temizleyin.
                      </p>
                      <Button 
                        onClick={() => setSearchTerm('')}
                        className="mt-2 bg-white/10 hover:bg-white/20 text-white"
                      >
                        Filtreleri Temizle
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <PlusCircle className="h-12 w-12 text-white/30 mx-auto" />
                      <h3 className="text-lg font-medium text-white">Henüz blog yazısı eklenmemiş</h3>
                      <p className="text-white/60 max-w-md mx-auto">
                        İlk blog yazınızı eklemek için "Yeni Blog Yazısı" butonuna tıklayın.
                      </p>
                    </div>
                  )}
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