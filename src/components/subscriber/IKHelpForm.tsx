import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';
import { storage } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ikHelpService, IK_CATEGORIES } from '@/lib/services/ikHelpService';

interface IKHelpFormProps {
  onSuccess?: () => void;
}

type IKCategory = typeof IK_CATEGORIES[number];

const IKHelpForm: React.FC<IKHelpFormProps> = ({ onSuccess }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: IK_CATEGORIES[0] as IKCategory,
    attachments: [] as string[]
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/png',
        'image/jpeg'
      ].includes(file.type);
      
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        toast.error('Desteklenmeyen dosya formatı');
      }
      if (!isValidSize) {
        toast.error('Dosya boyutu 5MB\'dan büyük olamaz');
      }
      
      return isValidType && isValidSize;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (files.length === 0) return [];

    const uploadPromises = files.map(async file => {
      const fileName = `ik-help/${currentUser?.uid}/${Date.now()}-${file.name}`;
      const fileRef = ref(storage, fileName);
      
      await uploadBytes(fileRef, file);
      return getDownloadURL(fileRef);
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Lütfen giriş yapın');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);

    try {
      // Dosyaları yükle
      const attachmentUrls = await uploadFiles();

      // Soruyu kaydet
      await ikHelpService.addQuestion({
        userId: currentUser.uid,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        attachments: attachmentUrls
      });

      toast.success('Sorunuz başarıyla gönderildi');
      
      // Formu sıfırla
      setFormData({
        title: '',
        description: '',
        category: IK_CATEGORIES[0] as IKCategory,
        attachments: []
      });
      setFiles([]);
      
      // Başarı callback'ini çağır
      onSuccess?.();
    } catch (error: any) {
      console.error('Error submitting question:', error);
      toast.error(error.message || 'Soru gönderilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Soru Başlığı
        </label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Sorunuzun kısa başlığı"
          className="w-full bg-black/30 border-white/10 text-white placeholder:text-gray-500"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Kategori
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as IKCategory })}
          className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={loading}
        >
          {IK_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Soru Detayı
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Sorunuzu detaylı bir şekilde açıklayın..."
          className="w-full min-h-[150px] bg-black/30 border-white/10 text-white placeholder:text-gray-500"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Dosya Ekle (Opsiyonel)
        </label>
        <div className="space-y-4">
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-black/30 border border-white/10 rounded-md"
                >
                  <span className="text-sm text-gray-300 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <Button
              type="button"
              onClick={() => document.getElementById('file-input')?.click()}
              className="text-sm px-4 py-1.5 bg-black/30 border border-white/10 hover:bg-black/40 text-white"
              disabled={loading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Dosya Seç
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              disabled={loading}
            />
            <span className="text-xs text-gray-400">
              PDF, Word, Excel veya Görsel (max 5MB)
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 px-4 py-1.5 text-sm min-w-[100px]"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white/100" />
              <span>Gönderiliyor</span>
            </>
          ) : (
            <span>Gönder</span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default IKHelpForm; 