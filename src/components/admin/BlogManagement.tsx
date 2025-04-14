import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, Search, Image, Link2, Bold, Italic, List, ListOrdered } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

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

const CATEGORIES = [
  'Teknoloji',
  'Yazılım Geliştirme',
  'Tasarım',
  'İş Dünyası',
  'Eğitim',
  'Diğer'
];

const BlogManagement = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    content: '',
    image: '',
    category: CATEGORIES[0],
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = await currentUser?.getIdToken();
      const response = await fetch('https://us-central1-minik-a61c5.cloudfunctions.net/api/posts', {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Lütfen giriş yapın');
      return;
    }

    try {
      const token = await currentUser.getIdToken();

      // Base64 kontrolü
      if (formData.image.startsWith('data:')) {
        toast.error('Lütfen resim için geçerli bir URL girin. Base64 formatı desteklenmiyor.');
        return;
      }

      // URL kontrolü
      try {
        new URL(formData.image);
      } catch {
        toast.error('Lütfen geçerli bir resim URL\'i girin');
        return;
      }

      const url = isEditing 
        ? `https://us-central1-minik-a61c5.cloudfunctions.net/api/posts/${formData.id}`
        : 'https://us-central1-minik-a61c5.cloudfunctions.net/api/posts';

      console.log('Gönderilecek veri:', {
        title: formData.title,
        content: formData.content,
        image: formData.image,
        category: formData.category
      });

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          image: formData.image,
          category: formData.category
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'İşlem başarısız');
      }

      toast.success(isEditing ? 'Blog yazısı güncellendi!' : 'Yeni blog yazısı eklendi!');
      await fetchPosts();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return;

    try {
      const token = await currentUser?.getIdToken();
      const response = await fetch(`https://us-central1-minik-a61c5.cloudfunctions.net/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Silme işlemi başarısız');

      toast.success('Blog yazısı silindi!');
      fetchPosts();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Silme işlemi sırasında bir hata oluştu.');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      id: post.id,
      title: post.title,
      content: post.content,
      image: post.image,
      category: post.category,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      content: '',
      image: '',
      category: CATEGORIES[0],
    });
    setIsEditing(false);
    setShowForm(false);
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="space-y-2">
                <label className="text-sm text-neutral-300">Blog Başlığı</label>
                <Input
                  type="text"
                  placeholder="Etkileyici bir başlık yazın..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-black/30 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-neutral-300">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-black/30 border-white/10 text-white rounded-md px-3 py-2"
                  required
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-neutral-300">Kapak Görseli URL</label>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="bg-black/30 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-neutral-300">İçerik</label>
                <div className="bg-black/30 border border-white/10 rounded-t-md p-2 flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    title="Kalın"
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    title="İtalik"
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    title="Liste"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    title="Numaralı Liste"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    title="Görsel Ekle"
                  >
                    <Image className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    title="Bağlantı Ekle"
                  >
                    <Link2 className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Blog içeriğini yazın..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="min-h-[300px] bg-black/30 border-white/10 text-white rounded-t-none"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isEditing ? 'Güncelle' : 'Yayınla'}
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border-white/10 text-white hover:bg-white/5"
                >
                  İptal
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                type="text"
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/30 border-white/10 text-white"
              />
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-neutral-300">Yükleniyor...</div>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-white">{post.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-neutral-400">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span className="bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded-full text-xs">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleEdit(post)}
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/5"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(post.id)}
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-neutral-300">
                  {searchTerm ? 'Aranan kriterlere uygun blog yazısı bulunamadı.' : 'Henüz blog yazısı bulunmuyor.'}
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