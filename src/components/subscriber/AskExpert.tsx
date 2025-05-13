import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import IKHelpForm from './IKHelpForm';
import IKHelpQuestions from './IKHelpQuestions';
import { cn } from '@/lib/utils';

interface AskExpertProps {
  isDarkMode: boolean;
}

const AskExpert = ({ isDarkMode }: AskExpertProps) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={cn(
        "rounded-xl p-6 backdrop-blur-sm transition-colors",
        isDarkMode 
          ? "bg-gray-900/50 border border-white/10 text-white" 
          : "bg-white border border-gray-200"
      )}>
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-6 h-6 text-purple-400" />
          <h2 className={cn(
            "text-xl font-semibold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>İKyardım Hattı</h2>
        </div>
        <p className={cn(
          isDarkMode ? "text-gray-300" : "text-gray-600"
        )}>
          İK ve bordro konularında uzman danışmanlarımıza sorularınızı iletebilirsiniz.
          Her ay 3 soru sorma hakkınız bulunmaktadır.
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className={cn(
            "mt-4 text-sm font-medium transition-colors",
            isDarkMode 
              ? "text-purple-400 hover:text-purple-300" 
              : "text-purple-600 hover:text-purple-700"
          )}
        >
          {showForm ? '← Sorularıma Dön' : 'Yeni Soru Sor →'}
        </button>
      </div>

      {/* Form veya Soru Listesi */}
      {showForm ? (
        <div className={cn(
          "rounded-xl p-6 backdrop-blur-sm transition-colors",
          isDarkMode 
            ? "bg-gray-900/50 border border-white/10" 
            : "bg-white border border-gray-200"
        )}>
          <h3 className={cn(
            "text-lg font-medium mb-4",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>Yeni Soru</h3>
          <IKHelpForm onSuccess={() => setShowForm(false)} isDarkMode={isDarkMode} />
        </div>
      ) : (
        <IKHelpQuestions isDarkMode={isDarkMode} />
      )}
    </div>
  );
};

export default AskExpert; 