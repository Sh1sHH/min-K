import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, FileText, Loader2, User, CheckCircle2, AlertCircle, BrainCircuit, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  getFirestore, collection, addDoc, serverTimestamp, doc, setDoc, Timestamp, 
  onSnapshot,
  QuerySnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  FirestoreError,
  deleteDoc,
  updateDoc,
  getDoc,
  query,
  where
} from 'firebase/firestore';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getFunctions, httpsCallable } from "firebase/functions";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

interface AnalyzedCV {
  id: string;
  userId: string;
  fileName: string;
  filePath: string;
  downloadURL?: string;
  status: 'uploading' | 'uploaded' | 'processing' | 'processed' | 'error';
  uploadedAt: Timestamp;
  processedAt?: Timestamp;
  analysis?: any;
  errorMessage?: string;
  uploadProgress?: number | null;
}

interface ComparisonResult {
    type: "info" | "success" | "error";
    message: string;
    bestCandidateId?: string;
    justification?: string;
}

const MAX_CVS = 3;

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

interface HeadHunterProps {
  isDarkMode: boolean;
}

const CVCard = ({ 
  cv, 
  onRemove, 
  uploadProgress,
  onSelect,
  isSelected,
  isBestMatch,
  isDarkMode
}: { 
  cv: AnalyzedCV; 
  onRemove: () => void; 
  uploadProgress?: number | null;
  onSelect: () => void;
  isSelected: boolean;
  isBestMatch: boolean;
  isDarkMode: boolean;
}) => {
  const isLoading = cv.status === 'uploading' || cv.status === 'processing';
  const isError = cv.status === 'error';
  const isSuccess = cv.status === 'processed';
  const currentProgress = uploadProgress ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "group relative p-4 rounded-xl transition-all duration-300",
        "border bg-card hover:shadow-xl",
        isDarkMode && "bg-gray-900/50 border-gray-700 text-white",
        isSelected && "ring-2 ring-primary",
        isBestMatch && "ring-2 ring-green-500",
        "cursor-pointer"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          "bg-primary/10 relative"
        )}>
          <FileText className="w-6 h-6 text-primary" />
          <div className={cn(
            "absolute -bottom-1 -right-1 w-3 h-3 rounded-full",
            isSuccess ? "bg-green-500" :
            isError ? "bg-red-500" :
            "bg-blue-500 animate-pulse"
          )} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium line-clamp-1">{cv.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {cv.uploadedAt?.toDate().toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {isLoading && currentProgress !== 0 && (
            <div className="mt-2">
              <Progress value={currentProgress} className="h-1" />
              <p className="text-xs text-muted-foreground mt-1">
                {cv.status === 'uploading' ? 'Yükleniyor' : 'İşleniyor'}... {Math.round(currentProgress)}%
              </p>
            </div>
          )}

          {isError && cv.errorMessage && (
            <p className="text-xs text-destructive mt-2">{cv.errorMessage}</p>
          )}

          {isBestMatch && (
            <Badge variant="success" className="mt-2">
              En Uygun Aday
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const HeadHunter = ({ isDarkMode }: HeadHunterProps) => {
  const [cvs, setCvs] = useState<AnalyzedCV[]>([]);
  const [jobRequirements, setJobRequirements] = useState<string>("");
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadingCvId, setUploadingCvId] = useState<string | null>(null);
  const [selectedCV, setSelectedCV] = useState<AnalyzedCV | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { currentUser } = useAuth();
  const storage = getStorage();
  const db = getFirestore();
  const functionsInstance = getFunctions();

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    const cvsCollectionRef = collection(db, 'users', currentUser.uid, 'analyzedCVs');
    
    const unsubscribe = onSnapshot(cvsCollectionRef, 
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const fetchedCvs: AnalyzedCV[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          fetchedCvs.push({ 
             id: doc.id, 
             ...doc.data(),
             uploadedAt: doc.data().uploadedAt instanceof Timestamp ? doc.data().uploadedAt : Timestamp.now()
          } as AnalyzedCV);
        });
        fetchedCvs.sort((a, b) => b.uploadedAt.toMillis() - a.uploadedAt.toMillis());
        setCvs(fetchedCvs);

        if (selectedCV) {
            const updatedSelectedCV = fetchedCvs.find(cv => cv.id === selectedCV.id);
             if (!updatedSelectedCV || updatedSelectedCV.status !== selectedCV.status) {
                 setSelectedCV(updatedSelectedCV && (updatedSelectedCV.status === 'processed' || updatedSelectedCV.status === 'error') ? updatedSelectedCV : null);
             }
        }

        setLoading(false);
      }, 
      (error: FirestoreError) => {
        console.error("Error fetching CVs:", error);
        toast.error("CV listesi alınırken bir hata oluştu.");
        setLoading(false);
      });

    return () => unsubscribe();

  }, [currentUser, db, selectedCV]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (cvs.length >= MAX_CVS) {
      toast.info(`Maksimum ${MAX_CVS} CV yükleyebilirsiniz. Yeni bir tane eklemek için lütfen mevcut bir CV'yi silin.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; 
      }
      return;
    }

    if (!currentUser) {
      toast.error('CV yüklemek için giriş yapmalısınız.');
      return;
    }
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    if (file.type !== 'application/pdf') {
      toast.error('Lütfen sadece PDF formatında bir CV yükleyin.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (uploadingCvId) {
      toast.info("Lütfen önceki yüklemenin bitmesini bekleyin.");
      return;
    }

    const uniqueFileName = `${Date.now()}_${file.name}`;
    const storagePath = `userCVs/${currentUser.uid}/${uniqueFileName}`;
    const storageRef = ref(storage, storagePath);

    const newCvDocRef = doc(collection(db, 'users', currentUser.uid, 'analyzedCVs'));
    const newCvId = newCvDocRef.id;
    setUploadingCvId(newCvId);
    setUploadProgress({ [newCvId]: 0 });
    
    const initialCvData = {
      userId: currentUser.uid,
      fileName: file.name,
      filePath: storagePath,
      status: 'uploading' as const,
      uploadedAt: serverTimestamp(),
    };

    try {
       await setDoc(newCvDocRef, initialCvData);
       toast.info('CV yükleniyor...');

       const uploadTask = uploadBytesResumable(storageRef, file);

       uploadTask.on('state_changed', 
         (snapshot) => {
           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
           setUploadProgress({ [newCvId]: progress });
         }, 
         (error) => {
           console.error('Upload Error:', error);
           toast.error('CV yüklenirken bir hata oluştu.');
           setUploadProgress({});
           setUploadingCvId(null);
           const errorData = { status: 'error' as const, errorMessage: error.message };
           setDoc(newCvDocRef, errorData, { merge: true });
         }, 
         async () => {
           toast.success('CV başarıyla yüklendi, analiz bekleniyor.');
           setUploadProgress({});
           setUploadingCvId(null);

           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

           const finalData = { 
               status: 'uploaded' as const,
               downloadURL: downloadURL 
           };
           await setDoc(newCvDocRef, finalData, { merge: true });

           if (fileInputRef.current) {
             fileInputRef.current.value = ''; 
           }
         }
       );

    } catch (error) {
       console.error("Firestore/Upload Error:", error);
       toast.error("CV kaydı oluşturulurken veya yükleme başlatılırken hata.");
       setUploadProgress({});
       setUploadingCvId(null);
    }
  };

  const handleRemoveCV = async (id: string) => {
     const cvToRemove = cvs.find(cv => cv.id === id);
     if (!cvToRemove || !currentUser) return;

     if (selectedCV?.id === id) {
       setSelectedCV(null);
     }
     if (comparisonResult?.bestCandidateId === id) {
        setComparisonResult({ type: "info", message: "En iyi olarak seçilen aday silindi." });
     }

     toast.promise(
        (async () => {
            const docRef = doc(db, 'users', currentUser.uid, 'analyzedCVs', id);
            await deleteDoc(docRef);

            if (cvToRemove.filePath) {
               try {
                 const storageRef = ref(storage, cvToRemove.filePath);
                 await deleteObject(storageRef);
               } catch (storageError: any) {
                  console.warn("Storage deletion error (might be expected if upload failed):", storageError);
                  if (storageError.code !== 'storage/object-not-found') {
                     throw storageError;
                  }
               }
            }
         })(),
        {
          loading: 'CV siliniyor...',
          success: 'CV başarıyla silindi.',
          error: (err) => { 
             console.error("Deletion error:", err);
             return `CV silinirken bir hata oluştu: ${err instanceof Error ? err.message : err}`;
          },
        }
      );
  };

  const handleSelectCV = (cv: AnalyzedCV) => {
    if (selectedCV?.id === cv.id) {
        setSelectedCV(null);
        return;
    }

    if (cv.status === 'processed' || cv.status === 'error') {
      setSelectedCV(cv);
      setComparisonResult(null);
    } else if (cv.status === 'uploading') {
      toast.info("Bu CV henüz yükleniyor.")
    } else if (cv.status === 'processing') {
      toast.info("Bu CV henüz analiz ediliyor.")
    } else {
      toast.info("Analiz detaylarını görmek için işlemin tamamlanmasını bekleyin.");
      setSelectedCV(null);
      setComparisonResult(null);
    }
  };

  const handleFindBestCandidate = async () => {
       if (!currentUser || !jobRequirements.trim()) {
           toast.error("Lütfen önce iş tanımını girin.");
           return;
       }
       const processedCvsCount = cvs.filter(cv => cv.status === 'processed').length;
        if (processedCvsCount === 0) {
           toast.info("Karşılaştırma yapmak için en az bir işlenmiş CV bulunmalıdır.");
           return;
        }

       setIsComparing(true);
       setComparisonResult({ type: "info", message: "Adaylar karşılaştırılıyor..." });
       setSelectedCV(null);

       try {
           const findBestCandidateFunction = httpsCallable(functionsInstance, 'findBestCandidateByPrompt');
           const result = await findBestCandidateFunction({ userPrompt: jobRequirements });

           const data = result.data as { success: boolean; bestCandidateId?: string; message?: string; justification?: string; rawResult?: string };

           if (data.success && data.bestCandidateId) {
               setComparisonResult({
                   type: "success",
                   message: `En uygun aday bulundu (ID: ${data.bestCandidateId}).`,
                   bestCandidateId: data.bestCandidateId,
                   justification: data.justification
               });
               toast.success("En uygun aday başarıyla belirlendi!");

           } else {
               setComparisonResult({
                   type: "error",
                   message: data.message || "Uygun aday bulunamadı veya bir hata oluştu.",
                   bestCandidateId: undefined,
                   justification: undefined
               });
               toast.info(data.message || "Belirtilen kritere uygun bir aday bulunamadı.");
           }
           console.log("Comparison result data:", data);

       } catch (error: any) {
           console.error("Error calling findBestCandidateByPrompt function:", error);
           let errorMessage = "Adaylar karşılaştırılırken bir sunucu hatası oluştu.";
            if (error.code && error.message) {
               errorMessage = `Hata (${error.code}): ${error.message}`;
           }
           setComparisonResult({ type: "error", message: errorMessage, justification: undefined });
           toast.error(errorMessage);
       } finally {
           setIsComparing(false);
       }
   };

  return (
    <div className={cn(
      "container mx-auto py-8 space-y-8",
      isDarkMode && "text-white"
    )}>
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className={cn(
          "text-3xl font-bold tracking-tight",
          isDarkMode && "text-white"
        )}>HeadHunter AI</h1>
        <p className={cn(
          "text-muted-foreground",
          isDarkMode && "text-gray-300"
        )}>
          Yapay zeka destekli CV analizi ve aday değerlendirme sistemi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel - CV Management */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upload Section */}
          <Card className={cn(
            "relative overflow-hidden border-dashed hover:border-primary/50 transition-colors",
            isDarkMode && "bg-gray-900/50 border-gray-700"
          )}>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                CV Yönetimi
              </CardTitle>
              <CardDescription>
                PDF formatında, maksimum {MAX_CVS} adet CV yükleyebilirsiniz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full relative group"
                disabled={!!uploadingCvId || cvs.length >= MAX_CVS}
                variant="outline"
              >
                {uploadingCvId ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    PDF CV Seç
                  </>
                )}
              </Button>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Yüklenen CV'ler</span>
                  <Badge variant="outline">{cvs.length}/{MAX_CVS}</Badge>
                </div>
                
                <ScrollArea className="h-[400px] rounded-md border">
                  <div className="p-4 space-y-4">
                    <AnimatePresence>
                      {loading && cvs.length === 0 ? (
                        <div className="flex justify-center items-center h-32">
                          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                        </div>
                      ) : cvs.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          Henüz CV yüklemediniz
                        </div>
                      ) : (
                        cvs.map((cv) => (
                          <CVCard
                            key={cv.id}
                            cv={cv}
                            onRemove={() => handleRemoveCV(cv.id)}
                            uploadProgress={uploadProgress[cv.id]}
                            onSelect={() => handleSelectCV(cv)}
                            isSelected={selectedCV?.id === cv.id}
                            isBestMatch={comparisonResult?.bestCandidateId === cv.id}
                            isDarkMode={isDarkMode}
                          />
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Analysis */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="search" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Aday Ara</TabsTrigger>
              <TabsTrigger value="analysis">Analiz Sonuçları</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-6">
              {/* Job Requirements Card */}
              <Card className={cn(
                "relative",
                isDarkMode && "bg-gray-900/50 border-gray-700"
              )}>
                <CardHeader>
                  <CardTitle className={cn(
                    "flex items-center gap-2",
                    isDarkMode && "text-white"
                  )}>
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    En Uygun Adayı Bul
                  </CardTitle>
                  <CardDescription className={cn(
                    isDarkMode && "text-gray-300"
                  )}>
                    Pozisyon gereksinimlerini girin ve yapay zeka destekli analiz başlasın
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="job-requirements" className={cn(
                      isDarkMode && "text-white"
                    )}>Pozisyon Gereksinimleri</Label>
                    <Textarea
                      id="job-requirements"
                      placeholder="Örn: En az 5 yıl React tecrübesi, iyi derecede İngilizce..."
                      value={jobRequirements}
                      onChange={(e) => setJobRequirements(e.target.value)}
                      rows={4}
                      className={cn(
                        "resize-none",
                        isDarkMode && "bg-gray-900/50 text-white placeholder:text-gray-400"
                      )}
                    />
                  </div>
                  <Button
                    onClick={handleFindBestCandidate}
                    className="w-full"
                    disabled={!jobRequirements.trim() || isComparing || cvs.filter(cv => cv.status === 'processed').length === 0}
                  >
                    {isComparing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analiz Ediliyor...
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="w-4 h-4 mr-2" />
                        Analizi Başlat
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Comparison Result */}
              {comparisonResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {comparisonResult.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {comparisonResult.type === 'error' && <AlertCircle className="w-5 h-5 text-destructive" />}
                      {comparisonResult.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                      Analiz Sonucu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert 
                      variant={comparisonResult.type === 'error' ? 'destructive' : 'default'}
                      className={cn(
                        "transition-all duration-300",
                        comparisonResult.type === 'success' && 'border-green-500 bg-green-500/10',
                        comparisonResult.type === 'error' && 'border-destructive bg-destructive/10'
                      )}
                    >
                      <AlertTitle className="flex items-center gap-2">
                        {comparisonResult.type === 'success' ? 'Başarılı' : 
                         comparisonResult.type === 'error' ? 'Hata/Bilgi' : 
                         'İşleniyor'}
                      </AlertTitle>
                      <AlertDescription className="mt-2">
                        {comparisonResult.message}
                        {comparisonResult.type === 'success' && comparisonResult.justification && (
                          <div className="mt-4 p-4 rounded-lg bg-card border">
                            <p className="font-medium mb-2">Seçim Nedeni:</p>
                            <p className="text-sm text-muted-foreground">{comparisonResult.justification}</p>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              {selectedCV ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        CV Analiz Detayları
                      </div>
                      <Badge variant={
                        selectedCV.status === 'processed' ? 'default' :
                        selectedCV.status === 'error' ? 'destructive' :
                        'secondary'
                      }>
                        {selectedCV.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedCV.status === 'processed' && selectedCV.analysis ? (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="analysis">
                          <AccordionTrigger>
                            <span className="flex items-center gap-2">
                              <Info className="w-4 h-4" />
                              Detaylı Analiz Sonuçları
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="rounded-lg bg-muted p-4 mt-2">
                              <pre className="text-xs whitespace-pre-wrap break-words">
                                {JSON.stringify(selectedCV.analysis, null, 2)}
                              </pre>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : selectedCV.status === 'error' ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Hata</AlertTitle>
                        <AlertDescription>
                          {selectedCV.errorMessage}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Analiz detaylarını görüntülemek için bir CV seçin
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HeadHunter; 