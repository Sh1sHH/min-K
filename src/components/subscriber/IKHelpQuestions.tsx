import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ikHelpService, type IKQuestion, type IKAnswer } from '@/lib/services/ikHelpService';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { MessageSquare, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const IKHelpQuestions = () => {
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState<IKQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, IKAnswer[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

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

  const handleMarkAsRead = async (answerId: string) => {
    try {
      await ikHelpService.markAnswerAsRead(answerId);
      // Yanıtları güncelle
      await fetchQuestions();
      toast.success('Yanıt okundu olarak işaretlendi');
    } catch (error) {
      console.error('Error marking answer as read:', error);
      toast.error('İşlem sırasında bir hata oluştu');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 bg-black/30 rounded-lg border border-white/10">
        <MessageSquare className="w-12 h-12 mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-white">
          Henüz soru sormadınız
        </h3>
        <p className="text-gray-400 mt-2">
          İK uzmanlarımıza soru sormak için yukarıdaki formu kullanabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((question) => (
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

          {/* Soru Detayı ve Yanıtlar */}
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

              {/* Yanıtlar */}
              {answers[question.id!]?.length > 0 ? (
                <div className="p-4">
                  <h4 className="text-sm font-medium text-white mb-4">
                    Yanıtlar
                  </h4>
                  <div className="space-y-4">
                    {answers[question.id!].map((answer) => (
                      <div
                        key={answer.id}
                        className="bg-purple-900/20 rounded-lg p-4 border border-purple-900/30"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">
                                İK Uzmanı
                              </span>
                              <span className="text-sm text-gray-400">
                                {format(answer.createdAt.toDate(), 'd MMMM yyyy', { locale: tr })}
                              </span>
                            </div>
                          </div>
                          {!answer.isRead && (
                            <Button
                              onClick={() => answer.id && handleMarkAsRead(answer.id)}
                              className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/40 text-sm py-1 px-3"
                            >
                              Okundu İşaretle
                            </Button>
                          )}
                        </div>
                        <p className="text-gray-300 whitespace-pre-wrap">
                          {answer.content}
                        </p>

                        {/* Yanıt Ekleri */}
                        {answer.attachments && answer.attachments.length > 0 && (
                          <div className="mt-4">
                            <h5 className="text-sm font-medium text-white mb-2">
                              Ekler
                            </h5>
                            <div className="space-y-2">
                              {answer.attachments.map((url, index) => (
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
                    ))}
                  </div>
                </div>
              ) : question.status === 'pending' ? (
                <div className="p-4 text-center text-gray-400">
                  Henüz yanıt verilmedi. En kısa sürede yanıtlanacaktır.
                </div>
              ) : null}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default IKHelpQuestions; 