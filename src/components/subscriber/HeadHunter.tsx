import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CV {
  id: string;
  file: File;
  content?: string;
  aiAnalysis?: string;
  score?: number;
  error?: string;
}

const MAX_CONTENT_LENGTH = 8000; // Increased for GPT-4 Turbo
const MAX_CVS = 5;
const RATE_LIMIT_DELAY = 1000; // 1 second delay between API calls

const CVSlot = ({ 
  cv, 
  onRemove, 
  score,
  isAnalyzing 
}: { 
  cv?: CV; 
  onRemove: () => void; 
  score?: number;
  isAnalyzing?: boolean;
}) => {
  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-500';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn(
      "relative group w-40 h-48 rounded-2xl flex flex-col items-center justify-center",
      "border-2 border-dashed transition-all duration-300",
      cv ? "border-white/20 bg-white/5" : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50",
      "hover:shadow-lg hover:shadow-blue-500/5"
    )}>
      {cv ? (
        <>
          <div className="absolute -top-2 -right-2 z-10">
            <button
              onClick={onRemove}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Avatar Circle */}
          <div className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center",
            "bg-white/10 relative overflow-hidden border border-white/10",
            "shadow-lg shadow-black/20"
          )}>
            <User className="w-14 h-14 text-white/60" />
            {score !== undefined && (
              <div className={cn(
                "absolute bottom-0 w-full h-2",
                getScoreColor(score)
              )} />
            )}
          </div>
          
          {/* Filename */}
          <span className="mt-4 text-sm text-center text-white/70 line-clamp-2 px-3 w-full font-medium">
            {cv.file.name}
          </span>

          {/* Score Display */}
          {score !== undefined && !isAnalyzing && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className={cn(
                "w-2 h-2 rounded-full",
                getScoreColor(score)
              )} />
              <span className={cn(
                "text-sm",
                score >= 80 ? "text-green-400" :
                score >= 60 ? "text-yellow-400" :
                "text-red-400"
              )}>
                {score}%
              </span>
            </div>
          )}

          {/* Status Indicator */}
          {isAnalyzing ? (
            <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                <span className="text-sm text-blue-400">Analiz Ediliyor</span>
              </div>
            </div>
          ) : score !== undefined && (
            <div className="absolute top-2 left-2">
              {score >= 60 ? (
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-400" />
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-white/40 flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
            <User className="w-14 h-14" />
          </div>
          <span className="text-sm font-medium">Boş Slot</span>
        </div>
      )}
    </div>
  );
};

const HeadHunter = () => {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CV | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analyzingCVIds, setAnalyzingCVIds] = useState<string[]>([]);

  // CV içeriğini kısaltma fonksiyonu
  const truncateContent = (content: string): string => {
    if (content.length <= MAX_CONTENT_LENGTH) return content;
    
    // Önemli anahtar kelimeleri içeren bölümleri seç
    const keywords = requirements.toLowerCase().split(/[\s,]+/);
    const sections = content.split('\n\n');
    let relevantSections = '';
    let currentLength = 0;
    
    // Önce gereksinimlerdeki anahtar kelimeleri içeren bölümleri al
    for (const section of sections) {
      if (currentLength >= MAX_CONTENT_LENGTH) break;
      
      const sectionLower = section.toLowerCase();
      if (keywords.some(keyword => sectionLower.includes(keyword))) {
        if (currentLength + section.length <= MAX_CONTENT_LENGTH) {
          relevantSections += section + '\n\n';
          currentLength += section.length + 2;
        }
      }
    }
    
    // Eğer hala yer varsa, CV'nin başından önemli bilgileri ekle
    if (currentLength < MAX_CONTENT_LENGTH) {
      for (const section of sections) {
        if (currentLength + section.length > MAX_CONTENT_LENGTH) break;
        if (!relevantSections.includes(section)) {
          relevantSections += section + '\n\n';
          currentLength += section.length + 2;
        }
      }
    }
    
    return relevantSections.trim();
  };

  // CV yükleme işlemi
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || cvs.length >= MAX_CVS) return;

    setLoading(true);
    try {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async (event) => {
        if (event.target?.result) {
          const content = event.target.result as string;
          const truncatedContent = truncateContent(content);
          
          const newCV: CV = {
            id: Math.random().toString(36).substr(2, 9),
            file,
            content: truncatedContent
          };
          setCvs([...cvs, newCV]);
          toast.success('CV başarıyla yüklendi');
        }
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('CV yükleme hatası:', error);
      toast.error('CV yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // CV silme işlemi
  const handleRemoveCV = (id: string) => {
    setCvs(cvs.filter(cv => cv.id !== id));
    toast.info('CV silindi');
  };

  // Her CV için ayrı analiz yapma
  const analyzeCV = async (cv: CV, requirements: string, apiKey: string): Promise<CV> => {
    const systemPrompt = `Sen deneyimli bir İK uzmanısın. CV'leri iş gereksinimleriyle karşılaştırarak detaylı analiz yapıyorsun.
Analizini yaparken şu kriterlere dikkat et:
1. Teknik yetenekler ve deneyim uyumu
2. Soft skills ve kültürel uyum
3. Eğitim ve sertifikalar
4. İş deneyimi süresi ve kalitesi
5. Projelerdeki başarılar ve sorumluluklar`;

    const userPrompt = `CV'yi aşağıdaki iş gereksinimleriyle karşılaştır:

${requirements}

CV İçeriği:
${cv.content}

Yanıtı kesinlikle bu formatta ver (başka bir şey ekleme):
PUAN: [0-100]

ÖZET: [Bir cümle ile uygunluk]

ARTILARI: [Maddeler halinde, maksimum 3 madde]

EKSİLERİ: [Maddeler halinde, maksimum 3 madde]

DETAYLI DEĞERLENDİRME: [2-3 paragraf detaylı analiz]`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4-1106-preview",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userPrompt
            }
          ],
          temperature: 0.2,
          max_tokens: 1000,
          stream: true // Enable streaming
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API çağrısı başarısız oldu');
      }

      const reader = response.body?.getReader();
      let analysisText = '';
      let score = 0;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Parse the streaming response
          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                analysisText += content;

                // Extract score if available
                if (!score) {
                  const scoreMatch = analysisText.match(/PUAN:\s*(\d+)/i);
                  if (scoreMatch) {
                    score = parseInt(scoreMatch[1]);
                  }
                }
              } catch (e) {
                console.error('Streaming parse error:', e);
              }
            }
          }
        }
      }

      return {
        ...cv,
        aiAnalysis: analysisText,
        score: score || 0
      };
    } catch (error) {
      console.error(`CV analiz hatası (${cv.file.name}):`, error);
      return {
        ...cv,
        aiAnalysis: 'Analiz sırasında hata oluştu',
        score: 0,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      };
    }
  };

  // Ana analiz fonksiyonu
  const handleAnalyze = async () => {
    if (cvs.length === 0 || !requirements || analyzing) return;

    setAnalyzing(true);
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('API anahtarı bulunamadı');
      }

      const analyzedCVs = [];
      for (const cv of cvs) {
        try {
          setAnalyzingCVIds(prev => [...prev, cv.id]);
          const analyzedCV = await analyzeCV(cv, requirements, apiKey);
          analyzedCVs.push(analyzedCV);
          
          // Rate limiting between API calls
          if (cvs.indexOf(cv) !== cvs.length - 1) {
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
          }
        } catch (error) {
          console.error(`CV analiz hatası (${cv.file.name}):`, error);
          analyzedCVs.push({
            ...cv,
            aiAnalysis: 'Analiz sırasında hata oluştu',
            score: 0,
            error: error instanceof Error ? error.message : 'Bilinmeyen hata'
          });
        } finally {
          setAnalyzingCVIds(prev => prev.filter(id => id !== cv.id));
        }
      }

      setCvs(analyzedCVs);
      
      const bestCV = analyzedCVs.reduce((prev, current) => 
        (current.score || 0) > (prev.score || 0) ? current : prev
      );
      
      setResult(bestCV);

      if (analyzedCVs.some(cv => cv.error)) {
        toast.warning('Bazı CV\'ler analiz edilirken hata oluştu');
      } else {
        toast.success('CV analizi tamamlandı');
      }

    } catch (error) {
      console.error('AI analiz hatası:', error);
      toast.error(error instanceof Error ? error.message : 'CV analizi sırasında bir hata oluştu');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-black/50 rounded-xl p-8 backdrop-blur-sm border border-white/5">
        <h2 className="text-2xl font-semibold mb-8 text-center">CV Yükleme ve Analiz</h2>
        
        {/* CV Slots */}
        <div className="mb-8">
          <div className="flex justify-center gap-6 mb-8">
            {[...Array(MAX_CVS)].map((_, index) => {
              const cv = cvs[index];
              return (
                <CVSlot
                  key={cv?.id || index}
                  cv={cv}
                  onRemove={() => cv && handleRemoveCV(cv.id)}
                  score={cv?.score}
                  isAnalyzing={cv && analyzingCVIds.includes(cv.id)}
                />
              );
            })}
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || cvs.length >= MAX_CVS}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 h-9 px-4 py-2 text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span className="ml-2 text-sm">{loading ? 'Yükleniyor...' : 'CV Yükle'}</span>
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Gereksinimler Alanı */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Pozisyon Gereksinimleri
          </label>
          <Textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Pozisyon için gereken yetenekler, deneyim ve diğer gereksinimleri girin..."
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            rows={4}
          />
        </div>

        {/* Analiz Butonu */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleAnalyze}
            disabled={cvs.length === 0 || !requirements || analyzing}
            className={cn(
              "relative overflow-hidden transition-all duration-200 h-9 px-4 py-2",
              analyzing ? "bg-blue-600/50" : "bg-blue-600 hover:bg-blue-700",
              "text-white min-w-[140px]"
            )}
          >
            <span className={cn(
              "flex items-center gap-2 transition-opacity",
              analyzing ? "opacity-0" : "opacity-100"
            )}>
              <FileText className="w-4 h-4" />
              AI ile Analiz
            </span>
            {analyzing && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-600">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Analiz Ediliyor</span>
                </div>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Analiz Sonuçları */}
      {result && (
        <div className="bg-black/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">Analiz Sonucu</h2>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="font-medium mb-2">En Uygun Aday</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-white/60" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{result.file.name}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          result.score && result.score >= 80 ? "bg-green-500" :
                          result.score && result.score >= 60 ? "bg-yellow-500" :
                          "bg-red-500"
                        )}
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-blue-400">
                      {result.score}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="font-medium mb-2">AI Analizi</h3>
              <p className="text-sm text-gray-300 whitespace-pre-line">
                {result.aiAnalysis}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadHunter; 