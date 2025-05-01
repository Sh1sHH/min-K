# Abonelik ve Kullanım Limiti Yönetim Sistemi

Bu doküman, AI destekli özelliklerin (özellikle "En Uygun Adayı Bul") kullanımını aktif abonelik dönemlerine göre sınırlamak için önerilen sistemi açıklar.

## Amaç

*   Kullanıcıların belirli özellikler için kullanımını, aktif abonelik süreleri dahilinde sınırlamak.
*   Her yeni abonelik dönemi başladığında kullanım hakkını sıfırlamak.
*   Hizmetin API maliyetlerini kontrol altında tutmak ve sürdürülebilirliği sağlamak.

## Firestore Veri Yapısı

Kullanıcı abonelik ve kullanım bilgilerini takip etmek için `users/{userId}/subscription` yolunda bir doküman kullanılması önerilir. Bu doküman aşağıdaki alanları içerebilir:

```json
{
  "userId": "...",             // Kullanıcının UID'si (Referans için)
  "status": "active" | "inactive" | "cancelled" | "past_due", // Abonelik durumu
  "planId": "premium_monthly_50", // Veya "premium_yearly_600" vb. (Abonelik Planı ID'si)
  "provider": "stripe" | "google_play" | "manual", // Ödeme sağlayıcı (Opsiyonel)
  "providerSubscriptionId": "sub_...", // Sağlayıcıdaki abonelik ID'si (Opsiyonel)
  "currentPeriodStart": Timestamp,   // Mevcut AKTİF dönemin başlangıç zamanı
  "currentPeriodEnd": Timestamp,     // Mevcut AKTİF dönemin bitiş zamanı
  "cancelAtPeriodEnd": boolean,      // Dönem sonunda iptal edilecek mi? (Opsiyonel)
  "limits": {                      // Bu döneme ait limitler
    "comparisons": {             // 'En Uygun Aday Bul' özelliği için
      "limit": 50,               // Bu dönemdeki maksimum kullanım hakkı
      "usage": 15                // Bu dönemde yapılan kullanım sayısı
    },
    "cvUploads": {               // Başka limitler de eklenebilir
      "limit": 10,
      "usage": 3
    }
    // ... diğer özellikler için limitler ...
  },
  "lastUpdatedAt": Timestamp       // Bu dokümanın son güncellenme zamanı (Opsiyonel)
}
```

**Alan Açıklamaları:**

*   `status`: Aboneliğin güncel durumunu gösterir. Limit kontrolleri sadece "active" durumunda yapılmalıdır.
*   `planId`: Kullanıcının hangi planda olduğunu ve dolayısıyla hangi limitlere sahip olduğunu belirler.
*   `currentPeriodStart/End`: Kullanım sayacının geçerli olduğu zaman aralığını tanımlar.
*   `limits`: Farklı özellikler için ayrı limit ve kullanım sayaçları tutulmasını sağlar. Bu yapı, gelecekte yeni limitli özellikler eklemeyi kolaylaştırır.
    *   `limit`: Plana göre belirlenen maksimum kullanım hakkı.
    *   `usage`: `currentPeriodStart`'tan beri yapılan kullanım sayısı.

## Backend Limit Kontrol Mantığı (Örn: `findBestCandidateByPrompt` içinde)

1.  **Fonksiyon Başlangıcı:** Özellik çağrıldığında (örn: `findBestCandidateByPrompt`), ilgili kullanıcının `users/{userId}/subscription` dokümanını oku.
2.  **Abonelik Kontrolü:**
    *   Doküman var mı? Yoksa veya `status` alanı "active" değilse, işlemi reddet ve kullanıcıya uygun bir mesaj döndür (örn: "Bu özelliği kullanmak için aktif bir aboneliğiniz olmalıdır.").
    *   (Opsiyonel Güvenlik): Mevcut zaman (`Timestamp.now()`), `currentPeriodStart` ve `currentPeriodEnd` arasında mı? Değilse, işlemi reddet (Bu, abonelik yönetiminde bir sorun olursa diye ek bir kontrol sağlar).
3.  **Limit Kontrolü:**
    *   İlgili özelliğin limitini ve kullanımını oku (örn: `limits.comparisons.usage` ve `limits.comparisons.limit`).
    *   Eğer `usage >= limit` ise, işlemi reddet ve kullanıcıya limitine ulaştığını belirten bir mesaj döndür (örn: "Bu abonelik döneminiz için 'En Uygun Adayı Bul' limitinize ulaştınız.").
4.  **İşleme Devam:** Tüm kontroller geçerse, özelliğin ana mantığını çalıştır (örn: OpenAI çağrısı yap).
5.  **Kullanımı Artırma:** Ana mantık **başarıyla tamamlanırsa** (örn: OpenAI'den geçerli bir yanıt alındıysa), ilgili kullanım sayacını Firestore'da **atomik olarak** bir artır.
    ```javascript
    // Örnek Firestore güncellemesi (comparator.js içinde)
    const subRef = doc(db, 'users', userId, 'subscription');
    await updateDoc(subRef, {
      'limits.comparisons.usage': admin.firestore.FieldValue.increment(1)
    });
    ```
    *Not: Atomik artırma (`increment(1)`), birden fazla eş zamanlı isteğin sayacı yanlış artırmasını önler.*

## Abonelik Yönetimi Mantığı

Bu sistemin doğru çalışması için abonelik olaylarının (başlangıç, yenileme, bitiş, iptal) Firestore'daki `subscription` dokümanını doğru şekilde güncellemesi kritik öneme sahiptir:

*   **Yeni Abonelik / Yenileme:**
    *   `status: "active"`
    *   `currentPeriodStart`: Başlangıç zamanı
    *   `currentPeriodEnd`: Bitiş zamanı (Başlangıç + Abonelik Süresi)
    *   `limits.{feature}.limit`: Plana göre ayarla
    *   **`limits.{feature}.usage`: `0` olarak sıfırla**
*   **Abonelik Bitişi / İptal:**
    *   `status`: "inactive" / "cancelled" / "past_due" olarak güncelle.
    *   (Opsiyonel) `currentPeriodStart/End` ve `limits` alanları temizlenebilir veya eski değerleriyle bırakılabilir.

Bu güncellemeler, ödeme ağ geçidinden (Stripe vb.) gelen webhook'ları dinleyen Cloud Functions veya manuel admin işlemleri ile tetiklenebilir.

## UI (Ön Yüz) Değerlendirmeleri

*   Kullanıcının mevcut abonelik durumu ve kalan kullanım hakları (örn: "Bu ay 35 karşılaştırma hakkınız kaldı.") ilgili sayfalarda gösterilmelidir. Bu bilgi `subscription` dokümanından okunabilir.
*   Limit dolduğunda veya aktif abonelik olmadığında butonlar pasif hale getirilebilir ve kullanıcıya bilgi verilebilir.

## Zamanlanmış Görevler (Opsiyonel)

Eğer otomatik yenileme olmayan veya farklı periyotlarda biten abonelikler varsa, `currentPeriodEnd` zamanı geçen aboneliklerin `status` alanını otomatik olarak "inactive" yapacak bir zamanlanmış Cloud Function (Scheduled Function) kurmak gerekebilir. 