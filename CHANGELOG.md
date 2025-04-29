# Changelog

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