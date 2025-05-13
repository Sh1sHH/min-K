import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ikHelpService, type IKQuestion, type IKAnswer } from '@/lib/services/ikHelpService';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { MessageSquare, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, FileText, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';
import { cn } from '@/lib/utils';

interface IKHelpQuestionsProps {
  isDarkMode: boolean;
}

const IKHelpQuestions = ({ isDarkMode }: IKHelpQuestionsProps) => {
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState<IKQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, IKAnswer[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchQuestions();
    }
  }, [currentUser]);

  const fetchQuestions = async () => {
    if (!currentUser) return;

    try {
      const userQuestions = await ikHelpService.getUserQuestions(currentUser.uid);
      setQuestions(userQuestions);
      
      // Yanıtları getir
      const answersPromises = userQuestions.map(q => ikHelpService.getQuestionAnswers(q.id!));
      const answersResults = await Promise.all(answersPromises);
      
      // Yanıtları questionId'ye göre grupla
      const answersMap: Record<string, IKAnswer[]> = {};
      userQuestions.forEach((q, index) => {
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
      toast.error('Lütfen giriş yapın');
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

      // Yanıtı kaydet - isExpert: false olarak işaretliyoruz
      await ikHelpService.addAnswer({
        questionId,
        userId: currentUser.uid,
        content: replyContent.trim(),
        attachments: attachmentUrls,
        isExpert: false // Kullanıcı yanıtı olduğunu belirtiyoruz
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

  const uploadFiles = async (): Promise<string[]> => {
    if (!replyFiles.length) return [];

    if (!currentUser) {
        toast.error('Dosya yüklemek için giriş yapmanız gerekiyor.');
        throw new Error('User not authenticated for file upload');
    }

    try {
      const uploadPromises = replyFiles.map(async file => {
        const storageRef = ref(storage, `ik-help/${currentUser.uid}/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return getDownloadURL(snapshot.ref);
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading files:', error);
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string; message: string };
        if (firebaseError.code === 'storage/unauthorized') {
          toast.error('Dosya yükleme yetkiniz yok. Lütfen aboneliğinizi kontrol edin.');
        } else {
          toast.error(`Dosya yüklenirken hata: ${firebaseError.message}`);
        }
      } else {
        toast.error('Dosyalar yüklenirken bilinmeyen bir hata oluştu');
      }
      throw new Error('Dosyalar yüklenirken bir hata oluştu');
    }
  };

  // Soruları durumlarına göre gruplandır
  const groupedQuestions = questions.reduce((acc, question) => {
    const questionAnswers = answers[question.id!] || [];
    const hasExpertAnswer = questionAnswers.some(answer => answer.isExpert);
    const onlyUserAnswers = questionAnswers.length > 0 && !hasExpertAnswer;

    // Sorunun durumunu belirle
    let effectiveStatus: IKQuestion['status'];
    
    if (question.status === 'solved') {
      effectiveStatus = 'solved';
    } else if (hasExpertAnswer) {
      effectiveStatus = 'answered';
    } else {
      effectiveStatus = 'pending';
    }

    // Soruyu uygun kategoriye ekle
    if (!acc[effectiveStatus]) {
      acc[effectiveStatus] = [];
    }
    acc[effectiveStatus].push({
      ...question,
      status: effectiveStatus // Geçici durum güncelleme
    });

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

  // Durum ikonları ve renkleri için yardımcı fonksiyonlar
  const getStatusColor = (status: IKQuestion['status'], questionAnswers: IKAnswer[] = []) => {
    const hasExpertAnswer = questionAnswers.some(answer => answer.isExpert);
    const onlyUserAnswers = questionAnswers.length > 0 && !hasExpertAnswer;

    switch (status) {
      case 'pending':
        return onlyUserAnswers ? 'text-yellow-500' : 'text-yellow-500';
      case 'answered':
        return 'text-blue-500';
      case 'solved':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: IKQuestion['status'], questionAnswers: IKAnswer[] = []) => {
    const hasExpertAnswer = questionAnswers.some(answer => answer.isExpert);
    const onlyUserAnswers = questionAnswers.length > 0 && !hasExpertAnswer;

    switch (status) {
      case 'pending':
        return onlyUserAnswers ? <Clock className="w-5 h-5" /> : <Clock className="w-5 h-5" />;
      case 'answered':
        return <MessageSquare className="w-5 h-5" />;
      case 'solved':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: IKQuestion['status'], questionAnswers: IKAnswer[] = []) => {
    const hasExpertAnswer = questionAnswers.some(answer => answer.isExpert);
    const onlyUserAnswers = questionAnswers.length > 0 && !hasExpertAnswer;

    switch (status) {
      case 'pending':
        return onlyUserAnswers ? 'Yanıt Bekliyor' : 'Yanıt Bekliyor';
      case 'answered':
        return 'Yanıtlandı';
      case 'solved':
        return 'Çözüldü';
      default:
        return statusTitles[status];
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
        return false;
      }
      if (!isValidSize) {
        toast.error('Dosya boyutu 5MB\'dan büyük olamaz');
        return false;
      }
      
      return isValidType && isValidSize;
    });

    if (validFiles.length > 0) {
      setReplyFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} dosya başarıyla eklendi`);
    }
  };

  const removeFile = (index: number) => {
    setReplyFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      toast.success('Dosya kaldırıldı');
      return newFiles;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className={cn(
          "animate-spin rounded-full h-8 w-8 border-b-2",
          isDarkMode ? "border-purple-400" : "border-purple-600"
        )}></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className={cn(
        "text-center py-12 rounded-lg",
        isDarkMode 
          ? "bg-gray-900/50 border border-white/10 text-gray-300" 
          : "bg-gray-50 border border-gray-200 text-gray-600"
      )}>
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>Henüz soru sormadınız.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {statusOrder.map(status => {
        const statusQuestions = groupedQuestions[status];
        if (!statusQuestions?.length) return null;

        return (
          <div key={status} className="space-y-4">
            <h3 className={cn(
              "text-lg font-medium flex items-center gap-2",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              {getStatusIcon(status, answers[statusQuestions[0].id!] || [])}
              <span>{statusTitles[status]}</span>
              <span className={cn(
                "text-sm font-normal ml-2 px-2 py-0.5 rounded-full",
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              )}>
                {statusQuestions.length}
              </span>
            </h3>

            <div className="space-y-4">
              {statusQuestions.map(question => (
                <div
                  key={question.id}
                  className={cn(
                    "rounded-lg overflow-hidden transition-all duration-200",
                    isDarkMode 
                      ? "bg-gray-900/50 border border-white/10" 
                      : "bg-white border border-gray-200"
                  )}
                >
                  <div
                    className={cn(
                      "p-4 cursor-pointer",
                      isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                    )}
                    onClick={() => question.id && setExpandedQuestionId(expandedQuestionId === question.id ? null : question.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className={cn(
                          "font-medium",
                          isDarkMode ? "text-white" : "text-gray-900"
                        )}>{question.title}</h4>
                        <p className={cn(
                          "text-sm",
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        )}>
                          {format(question.createdAt.toDate(), 'dd MMMM yyyy HH:mm', { locale: tr })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm px-2 py-1 rounded-full",
                          isDarkMode ? "bg-gray-800" : "bg-gray-100",
                          getStatusColor(question.status, answers[question.id!] || [])
                        )}>
                          {getStatusText(question.status, answers[question.id!] || [])}
                        </span>
                        {expandedQuestionId === question.id ? (
                          <ChevronUp className={cn(
                            "w-5 h-5",
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          )} />
                        ) : (
                          <ChevronDown className={cn(
                            "w-5 h-5",
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          )} />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedQuestionId === question.id && (
                    <div className={cn(
                      "p-4 border-t",
                      isDarkMode ? "border-white/10" : "border-gray-100"
                    )}>
                      <div className="space-y-4">
                        <div className={cn(
                          "p-4 rounded-lg",
                          isDarkMode ? "bg-black/30" : "bg-gray-50"
                        )}>
                          <p className={cn(
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          )}>{question.description}</p>
                          {question.attachments && question.attachments.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <p className={cn(
                                "text-sm font-medium",
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              )}>Ekler:</p>
                              <div className="flex flex-wrap gap-2">
                                {question.attachments.map((url, index) => (
                                  <a
                                    key={index}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                      "flex items-center gap-1 px-2 py-1 rounded text-sm",
                                      isDarkMode 
                                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    )}
                                  >
                                    <FileText className="w-4 h-4" />
                                    Ek {index + 1}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Yanıtlar */}
                        {answers[question.id!]?.map((answer, index) => (
                          <div
                            key={answer.id}
                            className={cn(
                              "p-4 rounded-lg",
                              answer.isExpert
                                ? isDarkMode ? "bg-purple-950/30 border border-purple-500/20" : "bg-purple-50 border border-purple-100"
                                : isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
                            )}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className={cn(
                                "text-sm font-medium",
                                answer.isExpert
                                  ? isDarkMode ? "text-purple-400" : "text-purple-700"
                                  : isDarkMode ? "text-gray-300" : "text-gray-700"
                              )}>
                                {answer.isExpert ? 'Uzman Yanıtı' : 'Sizin Yanıtınız'}
                              </span>
                              <span className={cn(
                                "text-sm",
                                isDarkMode ? "text-gray-500" : "text-gray-600"
                              )}>
                                • {format(answer.createdAt.toDate(), 'dd MMMM yyyy HH:mm', { locale: tr })}
                              </span>
                            </div>
                            <p className={cn(
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            )}>{answer.content}</p>
                            {answer.attachments && answer.attachments.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <p className={cn(
                                  "text-sm font-medium",
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                )}>Ekler:</p>
                                <div className="flex flex-wrap gap-2">
                                  {answer.attachments.map((url, index) => (
                                    <a
                                      key={index}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={cn(
                                        "flex items-center gap-1 px-2 py-1 rounded text-sm",
                                        isDarkMode 
                                          ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                      )}
                                    >
                                      <FileText className="w-4 h-4" />
                                      Ek {index + 1}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Yanıt Formu */}
                        <div className="space-y-4">
                          <Textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Yanıtınızı yazın..."
                            className={cn(
                              "min-h-[100px]",
                              isDarkMode 
                                ? "bg-black/30 border-white/10 text-white placeholder:text-gray-500" 
                                : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                            )}
                            disabled={replying}
                          />

                          {/* Dosya Yükleme ve Önizleme */}
                          <div className="space-y-4">
                            {replyFiles.length > 0 && (
                              <div className="space-y-2">
                                <p className={cn(
                                  "text-sm font-medium",
                                  isDarkMode ? "text-white/70" : "text-gray-700"
                                )}>
                                  Ekli Dosyalar ({replyFiles.length})
                                </p>
                                <div className="space-y-2">
                                  {replyFiles.map((file, index) => (
                                    <div
                                      key={index}
                                      className={cn(
                                        "flex items-center justify-between p-3 rounded-lg border transition-colors",
                                        isDarkMode 
                                          ? "bg-black/20 border-purple-500/20 text-white/80" 
                                          : "bg-purple-50 border-purple-100 text-gray-700"
                                      )}
                                    >
                                      <div className="flex items-center gap-2">
                                        <FileText className={cn(
                                          "w-4 h-4",
                                          isDarkMode ? "text-purple-400" : "text-purple-500"
                                        )} />
                                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                        <span className="text-xs opacity-60">
                                          ({(file.size / 1024).toFixed(1)} KB)
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className={cn(
                                          "p-1 rounded-md transition-colors",
                                          isDarkMode 
                                            ? "hover:bg-red-500/20 text-red-400" 
                                            : "hover:bg-red-100 text-red-500"
                                        )}
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <Button
                                  type="button"
                                  variant={isDarkMode ? "outline" : "secondary"}
                                  onClick={() => document.getElementById('reply-file')?.click()}
                                  disabled={replying}
                                  className={cn(
                                    "relative flex items-center gap-2",
                                    isDarkMode 
                                      ? "border-purple-400/20 hover:bg-purple-400/10 text-purple-400" 
                                      : "border-purple-200 hover:bg-purple-50 text-purple-600",
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                  )}
                                >
                                  <Upload className="w-4 h-4" />
                                  Dosya Ekle
                                </Button>
                                <input
                                  id="reply-file"
                                  type="file"
                                  className="hidden"
                                  onChange={handleFileChange}
                                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                  multiple
                                  disabled={replying}
                                />
                              </div>
                              <p className={cn(
                                "text-xs",
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              )}>
                                PDF, Word, Excel veya Resim (max 5MB)
                              </p>
                            </div>
                          </div>

                          <Button
                            onClick={() => handleSubmitReply(question.id!)}
                            disabled={!replyContent.trim() || replying}
                            className={cn(
                              "px-4 py-2 rounded-lg transition-all",
                              isDarkMode 
                                ? "bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-800/40" 
                                : "bg-purple-500 hover:bg-purple-600 text-white disabled:bg-purple-300",
                              "disabled:cursor-not-allowed"
                            )}
                          >
                            {replying ? 'Gönderiliyor...' : 'Yanıtla'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IKHelpQuestions; 