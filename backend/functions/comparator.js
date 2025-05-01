// backend/functions/cv/comparator.js

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const OpenAI = require("openai");

// Initialize Firebase Admin SDK (varsa tekrar başlatmaz)
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// OpenAI API anahtarı için Secret Manager parametresini tekrar tanımla
const openaiApiKeySecret = defineSecret("openai-api-key");

// OpenAI istemcisini başlat
let openai;
try {
  const apiKey = openaiApiKeySecret.value();
  if (!apiKey) {
    throw new Error("OpenAI API anahtarı sırrı (Secret Manager) bulunamadı.");
  }
  openai = new OpenAI({ apiKey: apiKey });
  logger.info("OpenAI client (comparator) initialized successfully.");
} catch (error) {
  logger.error("Failed to initialize OpenAI client (comparator):", error);
  // Hata olursa fonksiyon çağrıldığında hata dönecek
}

/**
 * HTTP Callable Function to find the best candidate based on a user prompt.
 * Expects { userPrompt: string } in the data payload.
 * Requires authenticated user.
 */
exports.findBestCandidateByPrompt = onCall(
  {
    secrets: [openaiApiKeySecret],
    timeoutSeconds: 120, // Increase timeout slightly more for potentially longer justification
    memory: '512MiB', // May need more memory for processing JSON objects
  },
  async (request) => {
    // 1. Kimlik Doğrulama Kontrolü
    if (!request.auth) {
      logger.error("Authentication required.");
      throw new HttpsError(
        "unauthenticated",
        "Bu işlemi yapmak için giriş yapmalısınız."
      );
    }

    // 2. Gelen Veriyi Al ve Doğrula
    const userPrompt = request.data.userPrompt;
    if (!userPrompt || typeof userPrompt !== "string" || userPrompt.trim() === "") {
      logger.error("Invalid user prompt received:", userPrompt);
      throw new HttpsError(
        "invalid-argument",
        "Lütfen geçerli bir arama kriteri (prompt) girin."
      );
    }

    const userId = request.auth.uid;
    logger.info(`Finding best candidate for user ${userId} with prompt: "${userPrompt}"`);

    // 3. OpenAI İstemcisini Kontrol Et
    if (!openai) {
       logger.error("OpenAI client not initialized.");
        throw new HttpsError(
            "internal",
            "OpenAI istemcisi başlatılamadığı için analiz yapılamıyor."
        );
    }

    try {
      // 4. Fetch Processed CVs analysis data from Firestore
      const cvsSnapshot = await db
        .collection("users")
        .doc(userId)
        .collection("analyzedCVs")
        .where("status", "==", "processed")
        .limit(5) // Keep the limit
        .get();

      if (cvsSnapshot.empty) {
        logger.warn(`User ${userId} has no processed CVs.`);
        throw new HttpsError(
          "not-found",
          "Karşılaştırılacak işlenmiş CV bulunamadı."
        );
      }

      // Collect CV analysis objects and IDs
      const cvAnalyses = [];
      const cvIds = [];
      cvsSnapshot.forEach(doc => {
        const data = doc.data();
        // Ensure analysis exists and is an object
        if (data.analysis && typeof data.analysis === 'object' && Object.keys(data.analysis).length > 0) {
            cvAnalyses.push({ id: doc.id, analysis: data.analysis });
            cvIds.push(doc.id);
        } else {
            logger.warn(`CV ${doc.id} for user ${userId} is processed but lacks valid analysis data.`);
        }
      });

      if (cvAnalyses.length === 0) {
         logger.warn(`User ${userId} has processed CVs, but none have usable analysis data.`);
         throw new HttpsError(
           "not-found",
           "İşlenmiş CV'ler bulundu ancak karşılaştırılabilecek analiz verileri eksik."
         );
       }

      // --- LOGGING: Log the fetched CV IDs ---
      logger.info(`Fetched CV IDs for analysis comparison for user ${userId}: ${cvIds.join(", ")}`);

      // 5. Create OpenAI Prompt using Analysis JSON and Weighted Criteria
      // Prepare the analysis data string for the prompt
      const analysisDataString = cvAnalyses.map(cv => 
        `--- START CV ID: ${cv.id} ---\n${JSON.stringify(cv.analysis, null, 2)} \n--- END CV ID: ${cv.id} ---\n\n` // Use null, 2 for readable JSON formatting
      ).join('');

      const comparisonPrompt = `Aşağıda belirtilen iş gereksinimlerine göre, her biri daha önceden analiz edilmiş CV'lere ait aşağıdaki JSON analiz objelerini (${cvAnalyses.length} adet), belirtilen AĞIRLIKLANDIRILMIŞ KRİTERLERE göre karşılaştır:

**Değerlendirme Kriterleri ve Kullanılacak Analiz Alanları (Önerilen Ağırlıklar):**
1.  **Yetenekler (%35):** \`analysis.anahtar_yetenekler\` ve \`analysis.sertifikalar_kurslar\` içindeki becerilerin, iş gereksinimlerindeki teknik yeteneklerle (React, JS vb.) uyumu. **(En Yüksek Önem)**
2.  **İş Deneyimi (%30):** \`analysis.is_deneyimi_ozeti\` içindeki pozisyonlar, süreler ve özetlerin, aranan rolle ve istenen deneyim süresiyle uyumu. **(Yüksek Önem)**
3.  **Sertifika & Ek Eğitim (%20):** \`analysis.sertifikalar_kurslar\` alanındaki ek eğitim ve sertifikaların güncelliği ve pozisyonla ilgisi. **(Orta Önem)**
4.  **Eğitim (%10):** \`analysis.egitim_bilgileri\` içindeki bölüm ve seviyenin uygunluğu. **(Düşük Önem)**
5.  **Genel Değerlendirme (%5):** \`analysis.genel_degerlendirme\` metnindeki adayın genel profilinin ve motivasyonunun (varsa) değerlendirilmesi. **(En Düşük Önem)**

İş Gereksinimleri:
"${userPrompt}"

Karşılaştırılacak CV Analizleri ve ID'leri:
${analysisDataString}
Geçerli CV ID Listesi: [${cvIds.join(", ")}]

Lütfen her adayı bu yapılandırılmış analiz verilerine ve ağırlıklı kriterlere göre değerlendirerek, iş gereksinimlerine en uygun olan SADECE BİR adayı belirle. Karar verirken özellikle **Yetenekler (%35)** ve **İş Deneyimi (%30)** kriterlerine odaklan. Yanıtını aşağıdaki JSON formatında ver:
{
  "bestCandidateId": "SEÇİLEN_CV_ID",
  "justification": "BU ADAYIN ANALİZ VERİLERİNE VE BELİRTİLEN AĞIRLIKLI KRİTERLERE GÖRE NEDEN EN UYGUN OLDUĞUNU KISACA AÇIKLA. AYRICA, KARŞILAŞTIRILAN DİĞER ADAYLARA GÖRE ÖNE ÇIKAN TEMEL FARKLILIKLARI (örneğin: daha fazla deneyim, kritik bir yetenek, daha iyi eğitim uyumu vb.) BELİRT."
}

Eğer listedeki hiçbir aday belirgin şekilde uygun değilse, aşağıdaki JSON formatında yanıt ver:
{
  "bestCandidateId": null,
  "justification": "Belirtilen ağırlıklı kriterlere ve analiz verilerine göre uygun aday bulunamadı veya adaylar arasında belirgin bir fark yok."
}

ÖNEMLİ: Yanıtın SADECE geçerli bir JSON objesi olmalıdır. Başka hiçbir metin veya açıklama ekleme. "bestCandidateId" değeri ya yukarıdaki "Geçerli CV ID Listesi" içinden bir ID ya da null olmalıdır.`;

      // --- LOGGING: Log the prompt being sent ---
      // Avoid logging the full analysis data string directly if it's too large
      logger.info(`Sending analysis-based comparison prompt for JSON to OpenAI for user ${userId} (Prompt length: ${comparisonPrompt.length})`); 
      // Optionally log a truncated version or just the structure
      // logger.debug("Prompt details:", { userPrompt, cvIds });

      // 6. Send Request to OpenAI
      logger.info(`Calling OpenAI for user ${userId} with ${cvAnalyses.length} CV analyses (expecting JSON)...`);
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: comparisonPrompt }],
        model: "gpt-4-turbo",
        temperature: 0.2,
        response_format: { type: "json_object" },
      });

      // --- LOGGING: Log the raw OpenAI response ---
      const rawResponseContent = completion.choices[0]?.message?.content;
      logger.info(`Raw JSON OpenAI response received for user ${userId}: "${rawResponseContent}"`);

      // 7. Parse and Validate JSON Response
      let parsedResponse;
      try {
          if (!rawResponseContent) {
              throw new Error("OpenAI'den boş yanıt alındı.");
          }
          parsedResponse = JSON.parse(rawResponseContent);
      } catch (parseError) {
          logger.error(`Failed to parse JSON response from OpenAI for user ${userId}:`, parseError, `Raw response: "${rawResponseContent}"`);
          throw new HttpsError("internal", "Yapay zekadan gelen yanıt işlenemedi (JSON formatı bozuk).", rawResponseContent);
      }

      const { bestCandidateId, justification } = parsedResponse;

      // Validate the structure
      if (typeof justification !== 'string') {
         logger.error(`Invalid justification format received for user ${userId}:`, justification);
         throw new HttpsError("internal", "Yapay zekadan geçersiz formatta açıklama alındı.");
      }

      // Handle case where no suitable candidate was found by OpenAI
      if (bestCandidateId === null) {
          logger.info(`OpenAI indicated no suitable candidate found for user ${userId}. Justification: "${justification}"`);
          return { success: false, message: justification || "Girilen kritere uygun belirgin bir aday bulunamadı." }; // Return justification as message
      }

      // Validate the returned bestCandidateId type and if it exists in our list
      if (typeof bestCandidateId !== 'string') {
          logger.error(`Invalid bestCandidateId format received for user ${userId}:`, bestCandidateId);
          throw new HttpsError("internal", "Yapay zekadan geçersiz formatta aday ID'si alındı.");
      }

      // Find based on cvAnalyses array now
      const foundCv = cvAnalyses.find(cv => cv.id === bestCandidateId);
      if (foundCv) {
          logger.info(`Successfully matched OpenAI result ID "${bestCandidateId}" for user ${userId}. Justification: "${justification}"`);
          // Return success with ID and justification
          return { success: true, bestCandidateId: bestCandidateId, justification: justification };
      } else {
          // Log the mismatch clearly
          logger.warn(`OpenAI returned ID "${bestCandidateId}" which is NOT in the provided list [${cvIds.join(", ")}] for user ${userId}. Justification: "${justification}"`);
          // Return failure but include the justification attempts
          return { success: false, message: `Yapay zeka bir aday önerdi (ID: ${bestCandidateId}) ancak ID, sağlanan listedeki ID'lerle eşleşmedi.`, rawResult: justification }; // Show justification attempt in rawResult
      }

    } catch (error) {
      logger.error(`Error finding best candidate for user ${userId}:`, error);
      if (error instanceof HttpsError) {
          throw error;
      }
      throw new HttpsError(
          "internal",
          "Adaylar karşılaştırılırken bir sunucu hatası oluştu.",
          error instanceof Error ? error.message : String(error)
      );
    }
  }
);
