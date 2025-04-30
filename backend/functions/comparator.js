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
      // 4. Kullanıcının İşlenmiş CV Metinlerini Firestore'dan Çek
      const cvsSnapshot = await db
        .collection("users")
        .doc(userId)
        .collection("analyzedCVs")
        .where("status", "==", "processed") // Sadece işlenmiş olanları al
        // .where("extractedText", "!=", null) // extractedText alanı olanları filtrele (opsiyonel)
        .limit(5) // En fazla 5 CV (limite uygun)
        .get();

      if (cvsSnapshot.empty) {
        logger.warn(`User ${userId} has no processed CVs.`);
        throw new HttpsError(
          "not-found",
          "Analiz edilecek işlenmiş CV bulunamadı. Lütfen önce CV yükleyip analizinin tamamlanmasını bekleyin."
        );
      }

      // CV metinlerini ve ID'lerini topla
      const cvTexts = [];
      const cvIds = []; // Explicitly store IDs for the prompt
      cvsSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.extractedText && typeof data.extractedText === 'string' && data.extractedText.trim() !== '') {
            cvTexts.push({ id: doc.id, text: data.extractedText.substring(0, 6000) });
            cvIds.push(doc.id); // Add ID to the list
        } else {
            logger.warn(`CV ${doc.id} for user ${userId} is processed but lacks valid extractedText.`);
        }
      });

      if (cvTexts.length === 0) {
         logger.warn(`User ${userId} has processed CVs, but none have usable extracted text.`);
         throw new HttpsError(
           "not-found",
           "İşlenmiş CV'ler bulundu ancak karşılaştırılabilecek metin içerikleri eksik."
         );
       }

      // --- LOGGING: Log the fetched CV IDs ---
      logger.info(`Fetched CV IDs for comparison for user ${userId}: ${cvIds.join(", ")}`);

      // 5. Create OpenAI Prompt (Revised for JSON output with Justification)
      let combinedCvText = "";
      cvTexts.forEach((cv, index) => {
        combinedCvText += `--- START CV ID: ${cv.id} ---
${cv.text}
--- END CV ID: ${cv.id} ---

`;
      });

      // Revised prompt for JSON output
      const comparisonPrompt = `Aşağıda belirtilen iş gereksinimlerine göre, verilen CV metinlerini (${cvTexts.length} adet) karşılaştır.
İş Gereksinimleri:
"${userPrompt}"

Karşılaştırılacak CV'ler ve ID'leri şunlardır:
${combinedCvText}
Geçerli CV ID Listesi: [${cvIds.join(", ")}]

Lütfen bu gereksinimlere en uygun olan SADECE BİR adayı belirle ve yanıtını aşağıdaki JSON formatında ver:
{
  "bestCandidateId": "SEÇİLEN_CV_ID",
  "justification": "BU ADAYIN NEDEN EN UYGUN OLDUĞUNU 1-2 CÜMLE İLE AÇIKLA"
}

Eğer listedeki hiçbir aday belirgin şekilde uygun değilse, aşağıdaki JSON formatında yanıt ver:
{
  "bestCandidateId": null,
  "justification": "Uygun aday bulunamadı."
}

ÖNEMLİ: Yanıtın SADECE geçerli bir JSON objesi olmalıdır. Başka hiçbir metin veya açıklama ekleme. "bestCandidateId" değeri ya yukarıdaki "Geçerli CV ID Listesi" içinden bir ID ya da null olmalıdır.`;

      // --- LOGGING: Log the prompt being sent ---
      logger.info(`Sending comparison prompt for JSON to OpenAI for user ${userId}:`, { prompt: comparisonPrompt });

      // 6. Send Request to OpenAI - Requesting JSON output
      logger.info(`Calling OpenAI for user ${userId} with ${cvTexts.length} CVs (expecting JSON)...`);
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: comparisonPrompt }],
        model: "gpt-3.5-turbo", // Or a model known to be good with JSON format
        temperature: 0.2, // Keep low for consistency
        response_format: { type: "json_object" }, // Enforce JSON output
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

      const foundCv = cvTexts.find(cv => cv.id === bestCandidateId);
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
