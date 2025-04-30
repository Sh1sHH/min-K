import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, FileText, Loader2, User, CheckCircle2, AlertCircle, BrainCircuit, Info } from 'lucide-react';
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

const CVSlot = ({ 
  cv, 
  onRemove, 
  uploadProgress,
  onSelect
}: { 
  cv?: AnalyzedCV; 
  onRemove: () => void; 
  uploadProgress?: number | null;
  onSelect: () => void;
}) => {
  const isLoading = cv?.status === 'uploading' || cv?.status === 'processing';
  const isError = cv?.status === 'error';
  const isSuccess = cv?.status === 'processed';
  
  const getStatusColor = (status?: AnalyzedCV['status']) => {
    if (!status) return 'bg-gray-500';
    if (status === 'processed') return 'bg-green-500';
    if (status === 'error') return 'bg-red-500';
    if (status === 'processing' || status === 'uploading') return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const currentProgress = cv?.status === 'uploading' ? uploadProgress : null;

  return (
    <div 
      className={cn(
        "relative group w-40 h-48 rounded-2xl flex flex-col items-center justify-center",
        "border-2 border-dashed transition-all duration-300",
        cv ? "border-white/20 bg-white/5" : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50",
        "hover:shadow-lg hover:shadow-blue-500/5",
        cv ? "cursor-pointer" : "cursor-default"
      )}
      onClick={cv ? onSelect : undefined}
    >
      {cv ? (
        <>
          <div className="absolute -top-2 -right-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center",
            "bg-white/10 relative overflow-hidden border border-white/10",
            "shadow-lg shadow-black/20"
          )}>
            <User className="w-14 h-14 text-white/60" />
             <div className={cn(
                "absolute bottom-0 w-full h-2",
                getStatusColor(cv.status)
              )} />
          </div>
          
          <span className="mt-4 text-sm text-center text-white/70 line-clamp-2 px-3 w-full font-medium">
            {cv.fileName}
          </span>

           <div className="mt-2 flex items-center gap-1.5">
              <div className={cn(
                "w-2 h-2 rounded-full",
                getStatusColor(cv.status)
              )} />
              <span className={cn(
                "text-sm capitalize",
                 isSuccess ? "text-green-400" :
                 isError ? "text-red-400" :
                 isLoading ? "text-blue-400" :
                 "text-yellow-400" 
              )}>
                {cv.status}
              </span>
            </div>

          {isLoading ? (
            <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                <span className="text-sm text-blue-400 capitalize">{cv.status}...</span>
                 {cv.status === 'uploading' && currentProgress !== null && (
                    <div className="w-24 h-1 mt-2 bg-blue-900/50 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 transition-all duration-150" style={{ width: `${currentProgress}%` }}></div>
                    </div>
                 )}
              </div>
            </div>
          ) : isError ? (
             <div className="absolute top-2 left-2" title={cv.errorMessage}>
               <AlertCircle className="w-6 h-6 text-red-400" />
             </div>
          ) : isSuccess ? (
            <div className="absolute top-2 left-2">
               <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
          ) : null}
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
    <div className="space-y-6 p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-primary">AI Destekli CV Analizi</h2>

      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5" /> En Uygun Adayı Bul
              </CardTitle>
              <CardDescription>
                  Aşağıya iş tanımını veya aradığınız temel kriterleri yazın. Sistem, yüklediğiniz ve analizi tamamlanmış CV'ler arasından en uygun olanı bulacaktır.
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              {comparisonResult && (
                  <Alert variant={comparisonResult.type === 'error' ? 'destructive' : 'default'} className={comparisonResult.type === 'success' ? 'border-green-500' : ''}>
                       {comparisonResult.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
                       {comparisonResult.type === 'error' && <AlertCircle className="h-4 w-4" />}
                       {comparisonResult.type === 'info' && <Loader2 className="h-4 w-4 animate-spin" />}
                      <AlertTitle>
                          {comparisonResult.type === 'success' ? 'Başarılı' : comparisonResult.type === 'error' ? 'Hata/Bilgi' : 'İşleniyor'}
                      </AlertTitle>
                      <AlertDescription>
                          {comparisonResult.message}
                          {comparisonResult.type === 'success' && comparisonResult.justification && (
                              <>
                                <p className="mt-2 text-sm font-medium">Neden:</p>
                                <p className="text-sm">{comparisonResult.justification}</p>
                              </>
                          )}
                      </AlertDescription>
                  </Alert>
              )}
              <div>
                  <Label htmlFor="job-requirements">İş Tanımı / Kriterler</Label>
                  <Textarea
                      id="job-requirements"
                      placeholder="Örn: En az 5 yıl React tecrübesi, iyi derecede İngilizce bilen, Next.js konusunda deneyimli bir Frontend Developer arıyoruz..."
                      value={jobRequirements}
                      onChange={(e) => setJobRequirements(e.target.value)}
                      rows={4}
                      className="mt-1"
                      disabled={isComparing}
                  />
              </div>
              <Button
                  onClick={handleFindBestCandidate}
                  disabled={!jobRequirements.trim() || isComparing || cvs.filter(cv => cv.status === 'processed').length === 0}
                  className="w-full sm:w-auto"
              >
                  {isComparing ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Karşılaştırılıyor...</>
                  ) : (
                      <><BrainCircuit className="mr-2 h-4 w-4" /> En Uygun Adayı Bul</>
                  )}
              </Button>
              {cvs.filter(cv => cv.status === 'processed').length === 0 && !isComparing && (
                  <p className="text-sm text-muted-foreground italic">Karşılaştırma yapmak için önce en az bir CV yükleyip analizinin tamamlanmasını beklemelisiniz.</p>
              )}
          </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" /> CV Yükle (.pdf)
              </CardTitle>
              <CardDescription>
                  Analiz etmek ve karşılaştırmak için CV dosyalarınızı (PDF) yükleyin. (Maks: {MAX_CVS})
              </CardDescription>
          </CardHeader>
          <CardContent>
               <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      id="cv-upload-input"
                      accept=".pdf"
                  />
                  <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto"
                      disabled={!!uploadingCvId || cvs.length >= MAX_CVS}
                  >
                      {uploadingCvId ? (
                          <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Yükleniyor...
                          </>
                      ) : (
                          <>
                              <Upload className="mr-2 h-4 w-4" /> PDF CV Yükle
                          </>
                      )}
                  </Button>
                  {cvs.length >= MAX_CVS && !uploadingCvId && (
                     <p className="text-sm text-destructive">Maksimum CV sayısına ulaştınız ({MAX_CVS}).</p>
                  )}
               </div>
               {uploadingCvId && uploadProgress[uploadingCvId] !== undefined && (
                   <Progress value={uploadProgress[uploadingCvId]} className="mt-3 h-2" />
               )}
          </CardContent>
      </Card>

      <Card>
           <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Yüklenen CV'ler ({cvs.length} / {MAX_CVS})
              </CardTitle>
               <CardDescription>
                  Yüklediğiniz CV'ler ve analiz durumları. İşlenmiş olanlara tıklayarak detayları görebilirsiniz.
              </CardDescription>
          </CardHeader>
          <CardContent>
             {loading && cvs.length === 0 && (
                <div className="flex justify-center items-center h-32">
                   <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                </div>
             )}
             {!loading && cvs.length === 0 && (
                <p className="text-center text-muted-foreground mt-8">Henüz CV yüklemediniz.</p>
             )}
             {cvs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {cvs.map((cv) => (
                    <div key={cv.id} className={`p-3 rounded-md border ${
                        comparisonResult?.bestCandidateId === cv.id ? 'border-primary ring-2 ring-primary shadow-md' : 'border-border'
                    } ${
                        selectedCV?.id === cv.id ? 'bg-muted/50' : ''
                    }`}>
                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div className="flex-grow min-w-0">
                                <button
                                    onClick={() => handleSelectCV(cv)}
                                    disabled={!(cv.status === 'processed' || cv.status === 'error')}
                                    className={`font-medium truncate text-left w-full ${ (cv.status === 'processed' || cv.status === 'error') ? 'hover:underline cursor-pointer' : 'cursor-not-allowed text-muted-foreground'}`}
                                    title={(cv.status === 'processed' || cv.status === 'error') ? `${cv.fileName} detaylarını gör/gizle` : `Durum: ${cv.status}`}
                                >
                                    {cv.fileName}
                                </button>
                                <p className="text-xs text-muted-foreground">
                                    {cv.uploadedAt ? cv.uploadedAt.toDate().toLocaleString() : 'Tarih yok'}
                                </p>
                           </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge variant={
                                    cv.status === 'processed' ? 'default' :
                                    cv.status === 'error' ? 'destructive' :
                                    'secondary'
                                } className="whitespace-nowrap">
                                     {cv.status}
                                </Badge>
                                <Button variant="ghost" onClick={() => handleRemoveCV(cv.id)} title={`${cv.fileName} adlı CV'yi sil`} className="p-1 h-auto">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                         {cv.status === 'uploading' && uploadProgress[cv.id] !== undefined && (
                           <Progress value={uploadProgress[cv.id]} className="mt-2 h-1" />
                         )}
                        {cv.status === 'error' && cv.errorMessage && (
                            <p className="text-xs text-destructive mt-1">{cv.errorMessage}</p>
                        )}

                         {selectedCV?.id === cv.id && (
                             <div className="mt-3 border-t pt-3">
                                {selectedCV.status === 'processed' && selectedCV.analysis ? (
                                    <Accordion type="single" collapsible defaultValue="item-1">
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger>Analiz Detayları</AccordionTrigger>
                                            <AccordionContent>
                                                 <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap break-words">
                                                    {JSON.stringify(selectedCV.analysis, null, 2)}
                                                </pre>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ) : selectedCV.status === 'error' ? (
                                     <p className="text-sm text-destructive italic">Analiz sırasında hata oluştu: {selectedCV.errorMessage}</p>
                                ) : (
                                     <p className="text-sm text-muted-foreground italic">Analiz detayları yükleniyor veya mevcut değil.</p>
                                )}
                             </div>
                         )}
                    </div>
                  ))}
                </div>
             )}
          </CardContent>
      </Card>
    </div>
  );
};

export default HeadHunter; 