import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ikHelpService, type IKQuestion, type IKAnswer, IK_CATEGORIES } from '@/lib/services/ikHelpService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { Search, MessageSquare, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, FileText, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { storage } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const IKHelpManagement = () => {
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState<IKQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'answered'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | typeof IK_CATEGORIES[number]>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const allQuestions = await ikHelpService.getAllQuestions();
      setQuestions(allQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Sorular yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

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

    setReplyFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setReplyFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (replyFiles.length === 0) return [];

    const uploadPromises = replyFiles.map(async file => {
      const fileName = `ik-help/answers/${Date.now()}-${file.name}`;
      const fileRef = ref(storage, fileName);
      
      await uploadBytes(fileRef, file);
      return getDownloadURL(fileRef);
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmitReply = async (questionId: string) => {
    if (!currentUser) {
      toast.error('Yetkilendirme hatası');
      return;
    }

    if (!replyContent.trim()) {
      toast.error('Lütfen bir yanıt yazın');
      return;
    }

    setReplying(true);

    try {
      // Dosyaları yükle
      const attachmentUrls = await uploadFiles();

      // Yanıtı kaydet
      await ikHelpService.addAnswer({
        questionId,
        expertId: currentUser.uid,
        content: replyContent.trim(),
        attachments: attachmentUrls
      });

      // Formu sıfırla
      setReplyContent('');
      setReplyFiles([]);
      
      // Soruları güncelle
      await fetchQuestions();
      
      toast.success('Yanıtınız başarıyla gönderildi');
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.error('Yanıt gönderilirken bir hata oluştu');
    } finally {
      setReplying(false);
    }
  };

  const getStatusColor = (status: IKQuestion['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'answered':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: IKQuestion['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'answered':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = 
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'all' || question.status === selectedStatus;
    
    const matchesCategory = 
      selectedCategory === 'all' || question.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtreler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Sorularda ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'pending' | 'answered')}
          className="rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="pending">Yanıt Bekleyenler</option>
          <option value="answered">Yanıtlananlar</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as 'all' | typeof IK_CATEGORIES[number])}
          className="rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Tüm Kategoriler</option>
          {IK_CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Soru Listesi */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div
            key={question.id}
            className="bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden"
          >
            {/* Soru Başlığı ve Durum */}
            <div
              className="p-4 cursor-pointer hover:bg-white/5"
              onClick={() => setExpandedQuestionId(
                expandedQuestionId === question.id ? null : question.id!
              )}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-white">
                    {question.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{question.category}</span>
                    <span>•</span>
                    <span>
                      {format(question.createdAt.toDate(), 'd MMMM yyyy', { locale: tr })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 ${getStatusColor(question.status)}`}>
                    {getStatusIcon(question.status)}
                    <span className="text-sm font-medium">
                      {question.status === 'pending' ? 'Yanıt Bekliyor' : 'Yanıtlandı'}
                    </span>
                  </div>
                  {expandedQuestionId === question.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Soru Detayı ve Yanıt Formu */}
            {expandedQuestionId === question.id && (
              <div className="border-t border-white/10">
                <div className="p-4 bg-black/30">
                  <h4 className="text-sm font-medium text-white mb-2">
                    Soru Detayı
                  </h4>
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {question.description}
                  </p>

                  {/* Dosya Ekleri */}
                  {question.attachments && question.attachments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-white mb-2">
                        Ekler
                      </h4>
                      <div className="space-y-2">
                        {question.attachments.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">Ek {index + 1}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Yanıt Formu */}
                <div className="p-4">
                  <h4 className="text-sm font-medium text-white mb-4">
                    Yanıt Yaz
                  </h4>
                  <div className="space-y-4">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Yanıtınızı yazın..."
                      className="w-full min-h-[150px] bg-black/30 border-white/10 text-white placeholder:text-gray-500"
                      disabled={replying}
                    />

                    {/* Dosya Ekleri */}
                    <div className="space-y-4">
                      {replyFiles.length > 0 && (
                        <div className="space-y-2">
                          {replyFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-black/30 rounded-md border border-white/10"
                            >
                              <span className="text-sm text-gray-300 truncate">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-400 hover:text-red-300"
                                disabled={replying}
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
                          onClick={() => document.getElementById('reply-file-upload')?.click()}
                          disabled={replying}
                          className="border border-white/10 text-white hover:bg-white/5"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Dosya Ekle
                        </Button>
                        <input
                          id="reply-file-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                          multiple
                          disabled={replying}
                        />
                        <span className="text-sm text-gray-400">
                          PDF, Word, Excel veya Görsel (max 5MB)
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleSubmitReply(question.id!)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={replying}
                      >
                        {replying ? 'Gönderiliyor...' : 'Yanıtı Gönder'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12 bg-black/30 rounded-lg border border-white/10">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-white">
              Soru Bulunamadı
            </h3>
            <p className="text-gray-400 mt-2">
              Seçilen kriterlere uygun soru bulunmamaktadır.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IKHelpManagement; 