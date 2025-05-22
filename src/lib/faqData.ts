export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: "ik-sureclerini-dijitallestirmek",
    question: "İK süreçlerini dijitalleştirmek işimizi nasıl kolaylaştırır?",
    answer: "İK süreçlerinin dijitalleştirilmesi, işe alımdan performans yönetimine, izin takibinden bordrolamaya kadar birçok alanda verimliliği önemli ölçüde artırır. Manuel işlemlerde harcanan zamanı ortadan kaldırır, hata payını minimize eder ve çalışan verilerinin güvenli ve merkezi bir platformda yönetilmesini sağlar. Bu sayede İK departmanınız stratejik konulara daha fazla odaklanabilir ve şirket genelinde daha hızlı ve doğru kararlar alınmasına olanak tanır."
  },
  {
    id: "odeme-planlari",
    question: "Hangi ödeme planları mevcut?",
    answer: "Şirketinizin büyüklüğüne ve ihtiyaç duyduğu özelliklere göre tasarlanmış çeşitli esnek ödeme planlarımız bulunmaktadır. Küçük işletmeler için temel paketlerden, büyük kurumsal yapılar için kapsamlı çözümlere kadar farklı seçenekler sunuyoruz. Web sitemizdeki fiyatlandırma sayfasını ziyaret ederek veya satış temsilcilerimizle iletişime geçerek size en uygun planı belirleyebiliriz."
  },
  {
    id: "egitim-destegi",
    question: "Sistemin kullanımı için eğitim desteği sağlıyor musunuz?",
    answer: "Evet, platformumuzun tüm kullanıcıları için kapsamlı eğitim ve destek hizmetleri sunuyoruz. Başlangıçta size özel online veya yerinde eğitimler düzenleyebilir, kullanım kılavuzları, video eğitimler ve sıkça sorulan sorular bölümümüzle sürekli destek olabiliriz. Ayrıca, herhangi bir sorunuz veya teknik bir problemle karşılaşmanız durumunda uzman destek ekibimiz her zaman yardıma hazırdır."
  },
  {
    id: "veri-guvenligi",
    question: "Verilerimizin güvenliği nasıl sağlanıyor?",
    answer: "Veri güvenliği bizim için en üst düzey önceliktir. Platformumuz, en son endüstri standartlarına uygun güvenlik protokolleri (SSL/TLS şifreleme, güvenlik duvarları, vb.) ve altyapı ile korunmaktadır. Verileriniz düzenli olarak yedeklenir ve yetkisiz erişimlere karşı çok katmanlı güvenlik önlemleriyle korunur. KVKK ve GDPR gibi veri koruma yönetmeliklerine tam uyum sağlıyoruz."
  },
  {
    id: "entegrasyon-imkani",
    question: "Mevcut sistemimizle entegrasyon mümkün mü?",
    answer: "Evet, platformumuz, birçok popüler İK, muhasebe, ERP ve diğer iş yazılımlarıyla kolay entegrasyon sağlayacak şekilde tasarlanmıştır. Hazır entegrasyonlarımızın yanı sıra, API'larımız aracılığıyla özel entegrasyonlar geliştirme esnekliği de sunuyoruz. Böylece mevcut altyapınızla sorunsuz bir şekilde veri alışverişi yapabilir ve iş akışlarınızı optimize edebilirsiniz."
  }
]; 