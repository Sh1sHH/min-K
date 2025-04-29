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
  const [answers, setAnswers] = useState<Record<string, IKAnswer[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'answered' | 'solved'>('all');
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

      // Yanıtları getir
      const answersPromises = allQuestions.map(q => ikHelpService.getQuestionAnswers(q.id!));
      const answersResults = await Promise.all(answersPromises);
      
      // Yanıtları questionId'ye göre grupla
      const answersMap: Record<string, IKAnswer[]> = {};
      allQuestions.forEach((q, index) => {
        if (q.id) {
          answersMap[q.id] = answersResults[index];
        }
      });
      
      setAnswers(answersMap);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Sorular yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
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
        userId: currentUser.uid,
        content: replyContent.trim(),
        attachments: attachmentUrls,
        isExpert: true
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

  const handleMarkAsSolved = async (questionId: string) => {
    if (!currentUser) {
      toast.error('Yetkilendirme hatası');
      return;
    }

    try {
      await ikHelpService.markQuestionAsSolved(questionId, currentUser.uid);
      await fetchQuestions();
      toast.success('Soru çözüldü olarak işaretlendi');
    } catch (error) {
      console.error('Error marking as solved:', error);
      toast.error('İşlem sırasında bir hata oluştu');
    }
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (!replyFiles.length) return [];

    try {
      const uploadPromises = replyFiles.map(async file => {
        const storageRef = ref(storage, `ik-help/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return getDownloadURL(snapshot.ref);
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading files:', error);
      throw new Error('Dosyalar yüklenirken bir hata oluştu');
    }
  };

  const getStatusColor = (status: IKQuestion['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'answered':
        return 'text-blue-500';
      case 'solved':
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
        return <MessageSquare className="w-5 h-5" />;
      case 'solved':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: IKQuestion['status']) => {
    switch (status) {
      case 'pending':
        return 'Yanıt Bekliyor';
      case 'answered':
        return 'Yanıtlandı';
      case 'solved':
        return 'Çözüldü';
      default:
        return 'Bilinmiyor';
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || question.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Soruları durumlarına göre gruplandır
  const groupedQuestions = filteredQuestions.reduce((acc, question) => {
    const status = question.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(question);
    return acc;
  }, {} as Record<IKQuestion['status'], IKQuestion[]>);

  // Durum sıralaması
  const statusOrder: IKQuestion['status'][] = ['pending', 'answered', 'solved'];

  // Durum başlıkları
  const statusTitles: Record<IKQuestion['status'], string> = {
    pending: 'Yanıt Bekleyenler',
    answered: 'Yanıtlananlar',
    solved: 'Çözülenler'
  };

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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-black/30 p-4 rounded-lg border border-white/10">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Soru ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-black/50 border-white/10"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm min-w-[140px]"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Yanıt Bekleyenler</option>
            <option value="answered">Yanıtlananlar</option>
            <option value="solved">Çözülenler</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm min-w-[140px]"
          >
            <option value="all">Tüm Kategoriler</option>
            {IK_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Soru Listesi */}
      <div className="space-y-8">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-black/30 rounded-lg border border-white/10">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-white">Soru Bulunamadı</h3>
            <p className="text-gray-400 mt-2">
              Seçili filtrelerle eşleşen soru bulunmamaktadır.
            </p>
          </div>
        ) : (
          // Duruma göre gruplandırılmış sorular
          statusOrder.map(status => {
            const questions = groupedQuestions[status];
            if (!questions?.length) return null;

            return (
              <div key={status} className="space-y-4">
                {/* Grup Başlığı */}
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-medium text-white flex items-center gap-2">
                    {getStatusIcon(status)}
                    {statusTitles[status]}
                  </h2>
                  <div className="text-sm text-gray-400">({questions.length})</div>
                </div>

                {/* Grup Soruları */}
                <div className="space-y-3">
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      className={`bg-black/50 backdrop-blur-sm rounded-lg border transition-colors ${
                        expandedQuestionId === question.id 
                          ? 'border-purple-500/30' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Soru Başlığı ve Durum */}
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedQuestionId(
                          expandedQuestionId === question.id ? null : question.id!
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium">
                                {question.category}
                              </span>
                              {/* Yanıt Sayısı */}
                              <span className="inline-flex items-center gap-1 text-sm text-gray-400">
                                <MessageSquare className="w-4 h-4" />
                                {answers[question.id!]?.length || 0} yanıt
                              </span>
                            </div>
                            <h3 className="text-lg font-medium text-white truncate">
                              {question.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                              {/* Gönderen Bilgileri */}
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs text-white">
                                    {(question.userName || 'K').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="truncate">
                                  {question.userName || 'İsimsiz Kullanıcı'}
                                </span>
                                {question.userEmail && (
                                  <>
                                    <span className="text-gray-600">•</span>
                                    <span className="truncate text-gray-500">{question.userEmail}</span>
                                  </>
                                )}
                              </div>
                              {/* Tarih */}
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {format(question.createdAt.toDate(), 'd MMMM yyyy', { locale: tr })}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
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
                          {/* Soru İçeriği */}
                          <div className="p-4 space-y-4">
                            <p className="text-gray-300 whitespace-pre-wrap">
                              {question.description}
                            </p>

                            {/* Soru Ekleri */}
                            {question.attachments && question.attachments.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-white">Ekler</h4>
                                <div className="flex flex-wrap gap-2">
                                  {question.attachments.map((url, index) => (
                                    <a
                                      key={index}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
                                    >
                                      <FileText className="w-4 h-4" />
                                      Ek {index + 1}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Yanıtlar */}
                            {answers[question.id!]?.length > 0 && (
                              <div className="space-y-4">
                                <h4 className="text-sm font-medium text-white">Yanıtlar</h4>
                                <div className="space-y-4">
                                  {answers[question.id!].map((answer) => (
                                    <div
                                      key={answer.id}
                                      className={`rounded-lg p-4 ${
                                        answer.isExpert 
                                          ? 'bg-purple-900/20 border border-purple-900/30' 
                                          : 'bg-gray-900/20 border border-gray-900/30'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-start gap-3">
                                          {/* Avatar */}
                                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-medium text-white">
                                              {answer.isExpert ? 'İK' : (question.userName || 'K').charAt(0).toUpperCase()}
                                            </span>
                                          </div>

                                          {/* Kullanıcı Bilgileri */}
                                          <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm font-medium text-white">
                                                {answer.isExpert ? 'İK Uzmanı' : question.userName || 'İsimsiz Kullanıcı'}
                                              </span>
                                              {!answer.isExpert && question.userEmail && (
                                                <span className="text-xs text-gray-400">
                                                  {question.userEmail}
                                                </span>
                                              )}
                                            </div>
                                            <span className="text-xs text-gray-400">
                                              {format(answer.createdAt.toDate(), 'd MMMM yyyy, HH:mm', { locale: tr })}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="pl-11">
                                        <p className="text-gray-300 whitespace-pre-wrap">
                                          {answer.content}
                                        </p>

                                        {/* Yanıt Ekleri */}
                                        {answer.attachments && answer.attachments.length > 0 && (
                                          <div className="mt-3 space-y-2">
                                            <h5 className="text-sm font-medium text-white">Ekler</h5>
                                            <div className="flex flex-wrap gap-2">
                                              {answer.attachments.map((url, index) => (
                                                <a
                                                  key={index}
                                                  href={url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="flex items-center gap-1 px-3 py-1.5 bg-black/30 rounded-lg text-sm text-purple-400 hover:text-purple-300 hover:bg-black/40 transition-colors"
                                                >
                                                  <FileText className="w-4 h-4" />
                                                  Ek {index + 1}
                                                </a>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Yanıt Formu */}
                            {question.status !== 'solved' && (
                              <div className="space-y-4 mt-6">
                                <Textarea
                                  placeholder="Yanıtınızı yazın..."
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  className="min-h-[100px]"
                                />

                                {/* Dosya Yükleme */}
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      onClick={() => document.getElementById(`file-upload-${question.id}`)?.click()}
                                      className="text-sm"
                                    >
                                      <Upload className="w-4 h-4 mr-1" />
                                      Dosya Ekle
                                    </Button>
                                    <input
                                      id={`file-upload-${question.id}`}
                                      type="file"
                                      multiple
                                      onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        setReplyFiles(files);
                                      }}
                                      className="hidden"
                                    />
                                  </div>

                                  {/* Seçilen Dosyalar */}
                                  {replyFiles.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {replyFiles.map((file, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center gap-1 bg-white/5 rounded px-2 py-1"
                                        >
                                          <span className="text-sm text-gray-300">{file.name}</span>
                                          <button
                                            onClick={() => setReplyFiles(files => files.filter((_, i) => i !== index))}
                                            className="text-gray-400 hover:text-gray-300"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-3">
                                  <Button
                                    onClick={() => handleSubmitReply(question.id!)}
                                    disabled={replying || !replyContent.trim()}
                                  >
                                    {replying ? 'Gönderiliyor...' : 'Yanıtla'}
                                  </Button>

                                  <Button
                                    onClick={() => handleMarkAsSolved(question.id!)}
                                    variant="ghost"
                                    className="border border-green-600 text-green-500 hover:bg-green-900/20"
                                  >
                                    Çözüldü Olarak İşaretle
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default IKHelpManagement; 