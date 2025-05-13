import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Upload, X, FileText } from 'lucide-react';
import { storage } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ikHelpService, IK_CATEGORIES } from '@/lib/services/ikHelpService';
import { cn } from '@/lib/utils';

interface IKHelpFormProps {
  onSuccess?: () => void;
  isDarkMode: boolean;
}

type IKCategory = typeof IK_CATEGORIES[number];

const IKHelpForm: React.FC<IKHelpFormProps> = ({ onSuccess, isDarkMode }) => {
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
        <label className={cn(
          "block text-sm font-medium mb-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Soru Başlığı
        </label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Sorunuzun kısa başlığı"
          className={cn(
            "w-full",
            isDarkMode 
              ? "bg-black/30 border-white/10 text-white placeholder:text-gray-500" 
              : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
          )}
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className={cn(
          "block text-sm font-medium mb-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Kategori
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as IKCategory })}
          className={cn(
            "w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
            isDarkMode 
              ? "border-white/10 bg-black/30 text-white" 
              : "border-gray-200 bg-white text-gray-900"
          )}
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
        <label className={cn(
          "block text-sm font-medium mb-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Soru Detayı
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Sorunuzu detaylı bir şekilde açıklayın..."
          className={cn(
            "w-full min-h-[150px]",
            isDarkMode 
              ? "bg-black/30 border-white/10 text-white placeholder:text-gray-500" 
              : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
          )}
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className={cn(
          "block text-sm font-medium mb-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Dosya Ekle (Opsiyonel)
        </label>
        <div className="space-y-4">
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    isDarkMode 
                      ? "bg-black/20 border-white/10 text-white/80" 
                      : "bg-gray-50 border-gray-200 text-gray-700"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FileText className={cn(
                      "w-4 h-4",
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    )} />
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs opacity-60">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className={cn(
                      "p-1.5 rounded-md transition-colors",
                      isDarkMode 
                        ? "hover:bg-red-500/20 text-red-400" 
                        : "hover:bg-red-100 text-red-500"
                    )}
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
              variant={isDarkMode ? "outline" : "secondary"}
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={loading}
              className={cn(
                "relative flex items-center gap-2",
                isDarkMode 
                  ? "bg-black/20 border-white/10 text-white hover:bg-white/5" 
                  : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Upload className={cn(
                "w-4 h-4",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )} />
              Dosya Seç
            </Button>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              multiple
              disabled={loading}
            />
            <p className={cn(
              "text-xs",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              PDF, Word, Excel veya Resim (max 5MB)
            </p>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className={cn(
          "w-full transition-colors",
          isDarkMode 
            ? "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-800/40" 
            : "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300",
          "disabled:cursor-not-allowed"
        )}
      >
        {loading ? 'Gönderiliyor...' : 'Gönder'}
      </Button>
    </form>
  );
};

export default IKHelpForm; 