import { Timestamp } from 'firebase/firestore';

// Blog yazısı için kategori seçenekleri
export const CATEGORIES = [
  'İnsan Kaynakları',
  'Çalışma Hayatı',
  'Ücret ve Yan Haklar',
  'Fazla Mesai ve Çalışma Süreleri',
  'İşveren Rehberi',
  'Bordro Yönetimi',
  'İşe Alım Süreçleri',
  'Performans Yönetimi',
  'Çalışan Hakları',
  'Kariyer Gelişimi',
  'İK Teknolojileri',
  'Mevzuat Değişiklikleri',
  'Şirket Kültürü',
  'Eğitim ve Gelişim',
  'Diğer'
] as const;

// Yayın durumu seçenekleri
export const STATUS_OPTIONS = [
  { value: 'draft', label: 'Taslak' },
  { value: 'published', label: 'Yayında' }
] as const;

// Blog yazısı için TypeScript tipi
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  category: typeof CATEGORIES[number];
  tags: string[];
  status: 'draft' | 'published';
  readTime: string;
  date: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  seo: {
    metaDescription: string;
    keywords: string[];
  };
}

/**
 * Başlıktan URL-dostu slug oluşturur
 * @param title Blog yazısı başlığı
 * @returns URL-dostu slug
 */
export const generateSlug = (title: string): string => {
  const turkishChars: { [key: string]: string } = {
    'ğ': 'g', 'Ğ': 'G',
    'ü': 'u', 'Ü': 'U',
    'ş': 's', 'Ş': 'S',
    'ı': 'i', 'I': 'i',
    'ö': 'o', 'Ö': 'O',
    'ç': 'c', 'Ç': 'C',
    ' ': '-', '_': '-',
    '/': '-', '\\': '-',
    '.': '-', ',': '-',
    '!': '', '?': '',
    '(': '', ')': '',
    '[': '', ']': '',
    '{': '', '}': '',
    '"': '', "'": '',
    '@': '', '#': '',
    '$': '', '%': '',
    '^': '', '*': '',
    '+': '', '=': '',
    '|': '', '~': '',
    '`': '', ':': '',
    ';': '', '<': '',
    '>': ''
  };

  return title
    .toLowerCase()
    .trim()
    .split('')
    .map(char => turkishChars[char] || char)
    .join('')
    .replace(/[^a-z0-9-]/g, '') // Sadece küçük harfler, rakamlar ve tire karakterini tut
    .replace(/-+/g, '-') // Birden fazla tireyi tek tireye dönüştür
    .replace(/^-+|-+$/g, '') // Baştaki ve sondaki tireleri kaldır
    .substring(0, 100); // URL uzunluğunu sınırla
};

/**
 * İçeriğin kelime sayısına göre tahmini okuma süresini hesaplar
 * @param content Blog yazısı içeriği
 * @returns Tahmini okuma süresi (örn: "5 dk okuma")
 */
export const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200; // Ortalama okuma hızı
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} dk okuma`;
};

/**
 * İçeriğin minimum kelime sayısını kontrol eder
 * @param content Blog yazısı içeriği
 * @returns İçerik yeterli uzunlukta ise true
 */
export const validateContent = (content: string): boolean => {
  const wordCount = content.trim().split(/\s+/).length;
  return wordCount >= 500; // Minimum 500 kelime
};

/**
 * Meta açıklamanın uzunluğunu kontrol eder
 * @param metaDescription Meta açıklama
 * @returns Meta açıklama uygun uzunlukta ise true
 */
export const validateMetaDescription = (metaDescription: string): boolean => {
  const length = metaDescription.length;
  return length >= 150 && length <= 160;
};

/**
 * Anahtar kelime sayısını kontrol eder
 * @param keywords Anahtar kelimeler dizisi
 * @returns Anahtar kelime sayısı uygun aralıkta ise true
 */
export const validateKeywords = (keywords: string[]): boolean => {
  return keywords.length >= 5 && keywords.length <= 8;
}; 