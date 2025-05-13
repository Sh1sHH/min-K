import React, { useState, useEffect } from 'react';
import IKHelpForm from '@/components/subscriber/IKHelpForm';
import IKHelpQuestions from '@/components/subscriber/IKHelpQuestions';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const IKHelp = () => {
  const { currentUser, isPremium } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if dark mode is enabled by looking at html class
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Optional: Listen for changes in dark mode
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  if (!currentUser || !isPremium) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <MessageSquare className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Premium Özellik
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
          İK uzmanlarımıza soru sorabilmek için premium aboneliğe sahip olmanız gerekmektedir.
        </p>
        <Button
          onClick={() => window.location.href = '/pricing'}
          className={cn(
            "px-4 py-2 rounded-lg transition-all",
            isDarkMode 
              ? "bg-purple-600 hover:bg-purple-700 text-white" 
              : "bg-purple-500 hover:bg-purple-600 text-white"
          )}
        >
          Premium'a Geç
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            İKyardım Hattı
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            İK uzmanlarımıza sorularınızı iletebilirsiniz.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
            isDarkMode 
              ? "bg-purple-600 hover:bg-purple-700 text-white" 
              : "bg-purple-500 hover:bg-purple-600 text-white"
          )}
        >
          <PlusCircle className="w-5 h-5" />
          {showForm ? 'Sorularımı Göster' : 'Yeni Soru Sor'}
        </Button>
      </div>

      {showForm ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <IKHelpForm onSuccess={() => setShowForm(false)} isDarkMode={isDarkMode} />
        </div>
      ) : (
        <IKHelpQuestions isDarkMode={isDarkMode} />
      )}
    </div>
  );
};

export default IKHelp; 