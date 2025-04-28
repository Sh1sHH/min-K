# Changelog

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
  - `subscribers` koleksiyonu silindi
  - Kullanıcı dokümanlarından `subscriberType` alanı kaldırıldı
- Admin Panel'den kaldırılan özellikler:
  - Hesaplama Araçları modülü
  - Dosya Yönetimi sistemi
  - Soru-Cevap modülü
  - Fatura/Abonelik yönetimi
  - Geri Bildirim sistemi
  - AI Tavsiyeler özelliği
  - Ayarlar sayfası

### Technical Details
- `IK_CATEGORIES` için özel tip tanımlaması eklendi
- Firestore güvenlik kuralları gözden geçirildi
- Premium panel yetkilendirme kontrolleri iyileştirildi
- Tüm "subscriber" referansları "premium" olarak güncellendi
- Route yapılandırmaları güncellendi
- Backend Değişiklikleri:
  - Firebase Functions:
    - Premium üyelik kontrolü için yeni fonksiyonlar eklendi
    - İK soruları için CRUD operasyonları eklendi
    - Dosya yükleme/silme işlemleri için yeni fonksiyonlar
  - Storage Kuralları:
    - İK soruları için dosya yükleme kuralları eklendi
    - Premium kullanıcılar için özel klasör erişimi
  - Veritabanı Şemaları:
    - İK soruları için yeni şema tanımları
    - Kullanıcı profili güncellemeleri
  - Servis Katmanı:
    - `ikHelpService` servisi eklendi
    - Aylık soru limiti kontrolü implementasyonu
    - Dosya yükleme servisi güncellendi 