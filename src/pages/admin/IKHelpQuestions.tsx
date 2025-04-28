import React from 'react';
import IKHelpManagement from '@/components/admin/IKHelpManagement';

const IKHelpQuestionsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Soru-Cevap Yönetimi
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Premium üyelerden gelen soruları yanıtlayın ve yönetin.
        </p>
      </div>

      <IKHelpManagement />
    </div>
  );
};

export default IKHelpQuestionsPage; 