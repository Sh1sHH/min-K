import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import IKHelpForm from './IKHelpForm';
import IKHelpQuestions from './IKHelpQuestions';

const AskExpert = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-black/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">İKyardım Hattı</h2>
        </div>
        <p className="text-gray-400">
          İK ve bordro konularında uzman danışmanlarımıza sorularınızı iletebilirsiniz.
          Her ay 3 soru sorma hakkınız bulunmaktadır.
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 text-purple-400 hover:text-purple-300 text-sm font-medium"
        >
          {showForm ? '← Sorularıma Dön' : 'Yeni Soru Sor →'}
        </button>
      </div>

      {/* Form veya Soru Listesi */}
      {showForm ? (
        <div className="bg-black/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <h3 className="text-lg font-medium text-white mb-4">Yeni Soru</h3>
          <IKHelpForm onSuccess={() => setShowForm(false)} />
        </div>
      ) : (
        <IKHelpQuestions />
      )}
    </div>
  );
};

export default AskExpert; 