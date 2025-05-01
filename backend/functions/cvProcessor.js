// backend/functions/cvProcessor.js

console.log("--- cvProcessor.js loading START ---"); // Veya logger.info(...)

// v2 Imports
const { onObjectFinalized } = require("firebase-functions/v2/storage");
console.log("Imported onObjectFinalized"); // Veya logger.info(...)
// const { setGlobalOptions } = require("firebase-functions/v2"); // Global ayarlar gerekirse kullanılabilir
console.log("--- cvProcessor.js imports DONE ---"); // Veya logger.info(...)

// Parametreleri kullanmak için 'defineString' import edin
const { defineSecret } = require("firebase-functions/params");

const admin = require("firebase-admin");
const OpenAI = require("openai");
const pdfParse = require("pdf-parse");
const path = require("path");
const os = require("os");
const fs = require("fs");
const logger = require("firebase-functions/logger"); // v2 logger kullan

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const storage = admin.storage();

// --- Parameterized Configuration using defineSecret ---
// Secret Manager'da manuel olarak oluşturduğunuz sırrın ADINI buraya yazın
const openaiApiKeySecret = defineSecret("openai-api-key");

// Initialize OpenAI client using the secret value
let openai;
try {
  // Parametrenin değerini .value() ile alın (defineSecret için de aynı)
  const apiKey = openaiApiKeySecret.value();

  if (!apiKey) {
    // Bu hata artık pek olası değil çünkü sır doğrudan referanslanıyor
    throw new Error(
      "OpenAI API anahtarı sırrı (Secret Manager) bulunamadı veya değeri boş."
    );
  }
  openai = new OpenAI({ apiKey: apiKey });
  logger.info("OpenAI istemcisi başarıyla başlatıldı (Secret Manager ile).");
} catch (error) {
  logger.error(
    "OpenAI istemcisi Secret Manager ile başlatılamadı:",
    error
  );
}

// İsterseniz bu dosyadaki tüm fonksiyonlar için global ayarları burada yapabilirsiniz
// setGlobalOptions({ region: 'us-central1', memory: '1GiB', timeoutSeconds: 300 });

/**
 * Cloud Function triggered when a file is uploaded to Firebase Storage (v2 Syntax).
 */
exports.processUploadedCV = onObjectFinalized(
  {
    // --- Sırrı fonksiyona bağlayın ---
    secrets: [openaiApiKeySecret],
    region: 'us-west1',
    timeoutSeconds: 60,
    memory: "512MiB",
  },
  async (event) => {
    // event nesnesi eski object parametresinin yerini alır
    const fileObject = event.data; // StorageObject verisini al

    // --- Dosya Bilgilerini Al ve Kontrol Et ---
    const filePath = fileObject.name;
    const contentType = fileObject.contentType;
    const bucketName = fileObject.bucket;

    if (!contentType || !contentType.startsWith("application/pdf")) {
      logger.log(`Dosya PDF değil, işlenmiyor: ${filePath}`);
      return; // v2 void fonksiyonlarında null yerine return kullanılır
    }
    if (!filePath || !filePath.startsWith("userCVs/")) {
      logger.log(`Dosya userCVs/ klasöründe değil, işlenmiyor: ${filePath}`);
      return;
    }

    const pathParts = filePath.split("/");
    if (pathParts.length < 3) {
      logger.error(
        `Dosya yolu beklenenden kısa, userId çıkarılamadı: ${filePath}`
      );
      return;
    }
    const userId = pathParts[1];
    const fileName = pathParts[pathParts.length - 1];

    logger.log(`İşlenecek CV: ${fileName}, Kullanıcı: ${userId}`);

    // --- İlgili Firestore Belgesini Bul ---
    const userCvsRef = db
      .collection("users")
      .doc(userId)
      .collection("analyzedCVs");
    const q = userCvsRef.where("filePath", "==", filePath).limit(1);

    let docRef; // docSnapshot'a genellikle gerek kalmaz

    try {
      const querySnapshot = await q.get();
      if (querySnapshot.empty) {
        logger.error(
          `Firestore'da eşleşen kayıt bulunamadı: filePath=${filePath}`
        );
        return;
      }
      // Sadece referansı almamız yeterli
      docRef = querySnapshot.docs[0].ref;
      logger.log(`İlgili Firestore belgesi bulundu: ${docRef.id}`);

      // Durumu 'processing' olarak güncelle
      await docRef.update({
        status: "processing",
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      logger.error(
        `Firestore belgesi bulunurken veya güncellenirken hata (Ref: ${
          docRef?.id || "Bilinmiyor"
        }):`,
        error
      );
      return; // Hata durumunda çık
    }

    // --- PDF İndirme ve Ayrıştırma ---
    const bucket = storage.bucket(bucketName); // Gelen event'ten bucket adını kullan
    const tempFilePath = path.join(os.tmpdir(), fileName);

    try {
      await bucket.file(filePath).download({ destination: tempFilePath });
      logger.log(`PDF başarıyla indirildi: ${tempFilePath}`);

      const dataBuffer = fs.readFileSync(tempFilePath);
      const pdfData = await pdfParse(dataBuffer);
      const cvText = pdfData.text;
      logger.log("PDF içeriği başarıyla çıkarıldı.");

      // Geçici dosyayı sil
      try {
        fs.unlinkSync(tempFilePath);
        logger.log("Geçici PDF dosyası silindi.");
      } catch (unlinkError) {
        logger.warn("Geçici dosya silinemedi:", unlinkError);
      }


      if (!cvText || cvText.trim().length === 0) {
        logger.warn(`PDF içeriği boş veya çıkarılamadı: ${filePath}`);
        await docRef.update({
          status: "error",
          errorMessage: "PDF içeriği boş veya okunamadı.",
        });
        return;
      }

      // --- OpenAI ile Analiz ---
      if (!openai) {
        logger.error("OpenAI client başlatılmamış (Secret Manager). Analiz yapılamıyor.");
        throw new Error(
          "OpenAI istemcisi başlatılamadığı için analiz yapılamıyor. Lütfen Secret Manager'daki 'openai-api-key' sırrının doğru yapılandırıldığından emin olun."
        );
      }

      const prompt = `Aşağıdaki CV metnini detaylı bir şekilde analiz et ve aşağıdaki yapıya uygun bir JSON formatında özet sağla (başka hiçbir metin ekleme, sadece JSON):
            {
              "genel_degerlendirme": "Adayın genel profili ve uygunluğu hakkında 1-2 cümlelik kısa bir özet.",
              "anahtar_yetenekler": ["Tespit edilen en önemli 5-10 teknik ve sosyal yeteneklerin listesi"],
              "is_deneyimi_ozeti": [
                {
                  "pozisyon": "Pozisyon adı",
                  "sirket": "Şirket adı",
                  "sure": "Çalışma süresi (örn: 'Ocak 2020 - Mart 2022 (2 yıl 3 ay)' veya sadece '2 yıl')",
                  "ozet": "Bu roldeki ana sorumluluklar ve başarılardan 1-2 cümlelik özet."
                }
              ],
              "egitim_bilgileri": [
                {
                  "derece": "Alınan derece veya program adı",
                  "kurum": "Eğitim kurumu adı",
                  "mezuniyet_yili": "Mezuniyet yılı (varsa, sadece yıl olarak örn: 2019)"
                }
              ],
              "diller": ["Bilinen diller ve seviyeleri (örn: 'İngilizce (İleri Seviye)', 'Almanca (Başlangıç)')"],
              "sertifikalar_kurslar": ["Alınan ilgili sertifikaların veya önemli kursların listesi"]
            }

            CV Metni:
            ---
            ${cvText.substring(0, 15000)}
            ---`; // Ensure template literal is correctly formatted

      logger.log("OpenAI API'sine istek gönderiliyor...");
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const aiAnalysisResult = completion.choices[0]?.message?.content;
      logger.log("OpenAI API'sinden yanıt alındı.");

      if (!aiAnalysisResult) {
        throw new Error("OpenAI API'sinden geçerli bir analiz alınamadı.");
      }

      let aiAnalysisJson = {};
      try {
        aiAnalysisJson = JSON.parse(aiAnalysisResult);
      } catch (parseError) {
        logger.error(
          "OpenAI yanıtı JSON formatında değil veya ayrıştırılamadı:",
          parseError,
          "\nAlınan Ham Yanıt:", // Keep newline escape here for readability in logs
          aiAnalysisResult
        );
        throw new Error("AI analiz sonucu beklenen JSON formatında gelmedi.");
      }

      // --- Firestore'u Sonuçlarla Güncelle ---
      await docRef.update({
        status: "processed",
        analysis: aiAnalysisJson,
        extractedText: cvText,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        errorMessage: admin.firestore.FieldValue.delete(),
      });

      logger.log(`CV başarıyla işlendi, analiz edildi ve metin kaydedildi: ${filePath}`);
    } catch (error) {
      logger.error(`CV işlenirken hata oluştu (${filePath}):`, error);
      try {
        if (docRef) {
          await docRef.update({
            status: "error",
            errorMessage:
              error instanceof Error
                ? error.message
                : "Bilinmeyen bir hata oluştu.",
            processedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        } else {
           logger.error("docRef tanımlı değil, Firestore hata durumu güncellenemedi.");
        }
      } catch (updateError) {
        logger.error(
          `Hata durumu Firestore'a yazılamadı (Doc ID: ${docRef?.id || "Bilinmiyor"}):`,
          updateError
        );
      }
    }
  }
);