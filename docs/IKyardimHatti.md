# İKyardım Hattı Özelliği

-bu özellik için herhangi bir dosya oluşturmadan önce projeyi tara daha önce o veya benzer bir dosya oluşturulmuş mu ona bak

## Genel Bakış
İKyardım Hattı, premium abonelerin İK uzmanlarına doğrudan soru sorabilecekleri ve cevap alabilecekleri bir platformdur.

## Kullanıcı Erişimi
- **Hedef Kitle:** Sadece premium aboneliği olan kullanıcılar
- **Erişim Kontrolü:** `isPremium: true` field kontrolü ile sağlanır
- **Kullanım Limiti:** Aylık 3 soru hakkı

## Özellikler

### 1. Soru Gönderme Formu
- **Zorunlu Alanlar:**
  - Başlık
  - Açıklama
- **Opsiyonel:**
  - Dosya ekleme (belge, bordro vb.)
  - Kategori seçimi (Bordro, İzin, Özlük vb.)

### 2. Admin/Uzman Paneli
- Gelen soruların listesi
- Her soru için:
  - Başlık
  - Gönderen kullanıcı
  - Tarih
  - Statü (Yanıt Bekliyor/Yanıtlandı)
  - Yanıt formu
  - Atanan uzman

### 3. Kullanıcı Paneli
- Soru geçmişi
- Her soru için:
  - Başlık
  - Tarih
  - Statü
  - Yanıt (varsa)
  - Dosya ekleri

### 4. Bildirim Sistemi
- E-posta bildirimleri:
  - Yanıt geldiğinde (kullanıcıya bildirim)
- Platform içi bildirimler:
  - "Cevabınız Hazır!" banner'ı
  - Okunmamış yanıt göstergesi

## Teknik Gereksinimler

### Veritabanı Şeması

#### Questions Collection
```typescript
interface Question {
  id: string;
  userId: string;
  title: string;
  description: string;
  attachments?: string[];
  category?: string;
  status: 'pending' | 'answered';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  assignedExpertId?: string;
  monthlyQuestionCount: number;
}
```

#### Answers Collection
```typescript
interface Answer {
  id: string;
  questionId: string;
  expertId: string;
  content: string;
  attachments?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isRead: boolean;
}
```

### API Endpoints

#### Kullanıcı Tarafı
- `POST /api/questions` - Yeni soru oluştur
- `GET /api/questions` - Kullanıcının sorularını listele
- `GET /api/questions/:id` - Soru detayını getir
- `PATCH /api/questions/:id/read` - Yanıtı okundu olarak işaretle

#### Admin Tarafı
- `GET /api/admin/questions` - Tüm soruları listele
- `POST /api/admin/questions/:id/answer` - Soruyu yanıtla
- `PATCH /api/admin/questions/:id/assign` - Uzman ata
- `GET /api/admin/stats` - İstatistikleri getir

## UI Bileşenleri

### Kullanıcı Arayüzü
1. Soru Formu
   - Başlık input
   - Açıklama textarea
   - Dosya yükleme alanı
   - Gönder butonu

2. Soru Listesi
   - Filtreleme/Sıralama
   - Statü göstergeleri
   - Yanıt preview

3. Soru Detay Sayfası
   - Soru detayları
   - Yanıt
   - Dosya ekleri

### Admin Arayüzü
1. Soru Dashboard
   - Filtreleme/Sıralama
   - Hızlı yanıt
   - İstatistikler

2. Yanıt Formu
   - Rich text editor
   - Dosya ekleme
   - Preview

## Geliştirme Aşamaları

### Faz 1: Temel Özellikler
1. Veritabanı şemasının oluşturulması
2. Temel API endpointlerinin geliştirilmesi
3. Soru gönderme formunun oluşturulması
4. Admin paneli soru listeleme

### Faz 2: Yanıt Sistemi
1. Yanıt formunun geliştirilmesi
2. E-posta bildirimlerinin entegrasyonu
3. Dosya yükleme sisteminin eklenmesi

### Faz 3: Kullanıcı Deneyimi
1. UI/UX iyileştirmeleri
2. Platform içi bildirim sistemi
3. Soru limiti kontrolü
4. İstatistik ve raporlama

## Notlar
- Yanıt süresi: 3 iş günü
- Dosya yükleme limiti: 5MB
- Desteklenen dosya formatları: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG
- Aylık soru limiti: 3 soru 