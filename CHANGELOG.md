# Changelog

## [2025-04-30]

### Features
- **Head Hunter (En Uygun Aday Bul) Geliştirmeleri:**
  - PDF CV yükleme ve bireysel analiz (OpenAI ile) altyapısı oluşturuldu (`processUploadedCV` Cloud Function).
  - Yüklenen CV'lerin durum takibi (uploading, processing, processed, error) ve listelenmesi sağlandı (`HeadHunter.tsx`).
  - İşlenmiş CV'lerin analiz detaylarını gösterme özelliği eklendi.
  - Kullanıcının girdiği iş tanımına göre, işlenmiş tüm CV'leri karşılaştıran backend fonksiyonu (`findBestCandidateByPrompt`) oluşturuldu.
  - Karşılaştırma işlemi için UI eklendi (iş tanımı alanı, tetikleme butonu, sonuç gösterimi).
  - AI'ın en uygun adayı seçerken kullanacağı ağırlıklandırılmış kriterler (Yetenekler, Deneyim vb.) prompt'a eklendi.
  - AI'dan, seçilen adayın neden en uygun olduğuna dair karşılaştırmalı bir gerekçe (`justification`) sunması istendi.
  - Karşılaştırma için OpenAI modeli `gpt-4-turbo`'ya yükseltildi.
  - `analysis` verisi eksik olan CV'lerin karşılaştırmaya dahil edilmesi için "En İyi Çaba" doğrulama mantığı eklendi (henüz tam uygulanmadı).
- **Abonelik ve Limit Yönetimi Dokümantasyonu:**
  - Aktif abonelik dönemine göre AI özelliklerinin kullanımını sınırlama sistemi tasarlandı ve `docs/subscription_usage_limits.md` dosyasında belgelendi.

### Fixes & Improvements
- **Shadcn/ui Kurulum Sorunları:**
  - `tailwind.config.js` yerine `tailwind.config.mjs` kullanımından kaynaklanan CLI hatası düzeltildi (`components.json` güncellendi).
  - `@toast-ui/react-editor` paketinin React 18 ile uyumsuzluğundan kaynaklanan bağımlılık çakışması, paket kaldırılarak çözüldü.
  - Eksik shadcn/ui bileşenleri (`label`, `alert`, `progress`, `badge`, `accordion`, `textarea`) projeye eklendi.
- **Frontend (`HeadHunter.tsx`):**
  - Çeşitli linter hataları (import, JSX, değişken tanımlama) düzeltildi.
  - `httpsCallable` kullanımı düzeltildi.
  - `toast.warn` yerine `toast.info` kullanıldı.
  - `Badge` ve `Button` bileşenlerindeki prop hataları giderildi.
  - Kullanıcı arayüzü `Card` bileşenleri kullanılarak yeniden düzenlendi.
- **Backend (`comparator.js`):**
  - OpenAI prompt'u defalarca iyileştirildi (net talimatlar, JSON formatı zorlama, ID listesi ekleme, ağırlıklı kriterler, karşılaştırmalı gerekçe).
  - OpenAI API çağrısına `response_format: { type: "json_object" }` eklendi.
  - Yanıt işleme ve ID doğrulama mantığı geliştirildi.
  - Detaylı loglama eklendi (çekilen ID'ler, prompt, ham yanıt, eşleşme durumu).
  - `HttpsError` kullanımı düzeltildi.
  - Fonksiyon timeout ve memory ayarları güncellendi.

---

## [2025-04-29]

### Added
- Onaylanmamış hesaplar için otomatik email bildirimi sistemi eklendi:
  - Kayıttan 4 dakika sonra otomatik uyarı emaili
  - HTML ve text formatında email şablonu
  - Hesap silinmeden önce son uyarı
- Admin Panel'e gelişmiş arama ve filtreleme özellikleri eklendi:
  - Email ve kullanıcı adına göre anlık arama
  - Rol bazlı filtreleme (Admin, Premium, Normal Kullanıcı)
  - Arama ve filtreleme kombinasyonu desteği
- Admin Panel'e kullanıcı istatistikleri kartları eklendi:
  - Toplam Kullanıcı Sayısı
  - Admin Sayısı
  - Premium Üye Sayısı
  - Normal Kullanıcı Sayısı
- Admin Panel'e modern UI/UX iyileştirmeleri:
  - Kullanıcı profil kartları
  - Rol etiketleri (badges)
  - İşlem butonları için ikonlar ve tooltips
  - Hover efektleri ve geçişler
- İK Yardım Hattı için yeni özellikler:
  - Aylık soru limiti aşıldıktan sonra mevcut sorulara yanıt yazabilme
  - Google ile giriş yapan kullanıcılar için profil bilgisi entegrasyonu
  - Dosya yükleme sistemi iyileştirmeleri

### Changed
- Admin Panel kullanıcı yönetimi arayüzü yenilendi:
  - Tablo tasarımı modernleştirildi
  - Kullanıcı bilgileri tek sütunda birleştirildi
  - Rol gösterimi badge sistemine geçirildi
  - İşlem butonları yeniden tasarlandı
- Yetki verme/alma butonları iyileştirildi:
  - Koşullu buton gösterimi (kullanıcının mevcut rolüne göre)
  - Admin Yap/Kaldır butonları güncellendi
  - Premium Yap/Kaldır butonları güncellendi
  - Her buton için ikon ve açıklama eklendi
- Yeni Admin ekleme formu güncellendi:
  - Modern input tasarımı
  - İkon destekli buton
  - Daha belirgin form alanı
- Doğrulanmamış kullanıcı temizleme fonksiyonu basitleştirildi
  - Email gönderme özelliği kaldırıldı
  - Sadece 5 dakika sonra silme işlemi yapılıyor
  - Kod optimize edildi
- Firestore güvenlik kuralları güncellendi:
  - İK soruları için yeni erişim kuralları
  - Yanıt yazma izinleri düzenlendi (kota aşımı sonrası)
  - Dosya yükleme izinleri iyileştirildi
- Firebase Storage kuralları güncellendi:
  - Premium kullanıcılar için dosya yükleme izinleri
  - İK Yardım Hattı dosyaları için özel kurallar
  - Güvenlik kontrolleri geliştirildi
- Google Auth entegrasyonu iyileştirildi:
  - Kullanıcı bilgileri Firestore'a otomatik kaydediliyor
  - Profil bilgileri (isim, email, fotoğraf) doğru şekilde alınıyor
  - Auth Context güncellemeleri

### Fixed
- Premium kullanıcılara "Premium Yap" butonu gösterilmesi sorunu giderildi
- Admin Panel'de gereksiz tekrarlanan admin listesi kaldırıldı
- Kullanıcı rollerinin doğru gösterilmemesi sorunu çözüldü
- Yetki değişikliklerinde anlık UI güncellenmesi sağlandı
- `index.js` dosyasındaki tekrarlanan export'lar düzeltildi
- Firebase Functions yapılandırması iyileştirildi
- Google ile giriş yapan kullanıcıların profil bilgilerinin görüntülenmemesi sorunu çözüldü
- Aylık soru kotası dolan kullanıcıların mevcut sorularına yanıt yazamaması sorunu giderildi
- Dosya yükleme izinleri sorunu çözüldü
- İK Yardım Hattı'nda "İsimsiz Kullanıcı" görüntülenme problemi giderildi

### Technical Details
- Email bildirimi sistemi için Firebase Cloud Functions güncellendi:
  - `deleteUnverifiedUsers` fonksiyonu geliştirildi
  - Email gönderimi için Firestore mail collection entegrasyonu
  - Zamanlama mantığı optimize edildi (4dk email, 5dk silme)
- Arama ve filtreleme için yeni state yönetimi eklendi:
  - `searchTerm` state'i
  - `activeFilter` state'i
  - Filtreleme mantığı optimize edildi
- TypeScript tip iyileştirmeleri:
  - Rol filtreleme için union type tanımı
  - Arama fonksiyonu null check geliştirmesi
- UI Bileşenleri:
  - Conditional rendering optimizasyonları
  - Tailwind sınıfları düzenlendi
  - Responsive tasarım iyileştirmeleri
- Firestore Rules:
  - İK soruları ve yanıtları için yeni güvenlik kuralları
  - Premium kullanıcılar için özel izinler
  - Admin yetkileri düzenlendi
- Storage Rules:
  - `/ik-help` klasörü için özel kurallar
  - Dosya yükleme/okuma izinleri
  - Güvenlik fonksiyonları eklendi
- Auth Context:
  - Google Sign-In sürecinde Firestore entegrasyonu
  - Kullanıcı bilgileri yönetimi iyileştirildi
- İK Yardım Servisi:
  - Kullanıcı bilgileri getirme fonksiyonu güncellendi
  - Yanıt ekleme mantığı iyileştirildi
  - Dosya yükleme sistemi entegrasyonu

## [2025-04-28]

### Added
- Premium Panel için dropdown menüye erişim linki eklendi (Navbar.tsx)
- İKyardım Hattı özelliği için markdown dokümanı oluşturuldu (docs/IKyardimHatti.md)
- Premium Panel ve Admin Panel için sidebar menüleri varsayılan olarak açık hale getirildi
- Backend: İKyardım Hattı için yeni koleksiyonlar eklendi:
  - `ikQuestions`: Kullanıcı sorularını saklayan koleksiyon
  - `ikAnswers`: Uzman cevaplarını saklayan koleksiyon
- Admin paneline premium üyelik kaldırma özelliği eklendi
  - Premium üyelerin listelendiği bölümde silme butonu eklendi
  - Premium üyeliği kaldırma işlemi için onay penceresi eklendi
  - Başarılı/başarısız işlem bildirimleri eklendi

### Changed
- Navbar'da `isSubscriber` yerine `isPremium` kullanımına geçildi
- "Bir Bilene Sor" menü başlığı "İKyardım Hattı" olarak güncellendi
- IKHelpForm'da TypeScript tip düzeltmeleri yapıldı:
  - `IKCategory` tipi tanımlandı
  - Form state'inde category tipi düzeltildi
  - Select onChange event'inde tip dönüşümü güncellendi
- Dosya/Klasör yeniden adlandırmaları:
  - `SubscriberPanel.tsx` -> `PremiumPanel.tsx`
  - `src/components/subscriber/*` -> `src/components/premium/*`
  - `SalaryCalculator.tsx` -> `BordroHesaplama.tsx`
- Backend: Firestore güvenlik kuralları güncellendi:
  - Premium kullanıcılar için yeni erişim kuralları
  - İK soruları için CRUD operasyonları kuralları
  - Dosya yükleme izinleri düzenlendi
- Admin Panel sidebar menüsü sadeleştirildi:
  - Gereksiz menü öğeleri kaldırıldı
  - Sadece aktif kullanılan özellikler bırakıldı
  - Kaldırılan öğeler: Hesaplama Araçları, Dosya Yönetimi, Soru-Cevap, Fatura/Abonelik, Geri Bildirim, AI Tavsiyeler, Ayarlar

### Fixed
- Premium Panel erişim kontrolü düzeltildi
- IKHelpForm'daki TypeScript tip hatası giderildi
- Navbar'da premium kullanıcılar için menü görünürlük sorunu çözüldü
- URL yönlendirmeleri düzeltildi:
  - `/subscriber` -> `/premium`
  - Import yolları güncellendi
- Backend: Firebase Authentication custom claims düzeltildi:
  - `isSubscriber` claim'i kaldırıldı
  - `isPremium` claim'i eklendi

### Removed
- Gereksiz dosyalar kaldırıldı:
  - `src/lib/calculators/netToBrut.ts`
  - `src/components/premium/SalaryCalculator.tsx`
  - `src/components/layout/Layout.tsx`
  - `src/pages/SubscriberPanel.tsx`
- Backend: Eski koleksiyonlar ve alanlar kaldırıldı:
  - `