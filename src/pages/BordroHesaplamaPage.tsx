import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Info, Clock, AlertCircle, ChevronRight, PieChart, FileText, CheckCircle, BadgeCheck, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Footer from '@/components/Footer';

// Türk Lirası formatlama fonksiyonu
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Sayı formatlama fonksiyonu (normal sayılar için)
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Aylar
const AYLAR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık', 'TOPLAM'
];

const BordroHesaplamaPage = () => {
  // Form değerleri
  const [brutMaas, setBrutMaas] = useState<number>(15000);
  const [ucretTipi, setUcretTipi] = useState<string>("brütten-nete");
  const [yil, setYil] = useState<string>("2025");
  const [medeniDurum, setMedeniDurum] = useState<string>("bekar");
  const [esiCalisiyorMu, setEsiCalisiyorMu] = useState<string>("çalışmıyor");
  const [cocukSayisi, setCocukSayisi] = useState<string>("0");
  const [iseGostergeMaliyeti, setIseGostergeMaliyeti] = useState<boolean>(true);
  const [sgkIndirim5, setSgkIndirim5] = useState<boolean>(true);
  const [sgkIndirim4, setSgkIndirim4] = useState<boolean>(false);

  // Hesaplama sonuçları
  const [sonuclar, setSonuclar] = useState<any>(null);

  // Form değerleri değiştiğinde otomatik hesaplama yap
  useEffect(() => {
    hesaplaBordro();
  }, [brutMaas, ucretTipi, yil, medeniDurum, esiCalisiyorMu, cocukSayisi, iseGostergeMaliyeti, sgkIndirim5, sgkIndirim4]);

  // Bordro hesaplama fonksiyonu
  const hesaplaBordro = () => {
    // Örnek hesaplama için basit sonuçlar oluşturuyoruz
    // Gerçek hesaplamada, aylık vergi dilimleri, kümülatif vergi matrahı, 
    // AGİ hesaplamaları, asgari ücret istisnaları gibi detaylar olacaktır
    
    const aylikSonuclar = AYLAR.map((ay, index) => {
      if (ay === 'TOPLAM') {
        // Tüm ayların toplamını hesapla
        return {
          brut: brutMaas * 12,
          sgkIsci: brutMaas * 0.14 * 12,
          issizlikIsci: brutMaas * 0.01 * 12,
          aylikGelirVergisi: brutMaas * 0.15 * 12,
          damgaVergisi: brutMaas * 0.00759 * 12,
          kumulatifVergiMatrahi: (brutMaas - brutMaas * 0.14 - brutMaas * 0.01) * 12,
          net: brutMaas * 0.7 * 12,
          asgariGecimIndirimi: 1000 * 12,
          asgariUcretGelirVergisiIstisnasi: 500 * 12,
          asgariUcretDamgaVergisiIstisnasi: 100 * 12,
          netOdenecekTutar: (brutMaas * 0.7 + 1000) * 12,
          sgkIsveren: brutMaas * (sgkIndirim5 ? 0.155 - 0.05 : sgkIndirim4 ? 0.155 - 0.04 : 0.155) * 12,
          issizlikIsveren: brutMaas * 0.02 * 12,
          toplamMaliyet: (brutMaas * (1 + (sgkIndirim5 ? 0.155 - 0.05 : sgkIndirim4 ? 0.155 - 0.04 : 0.155) + 0.02)) * 12
        };
      } else {
        // Her ay için hesapla
        return {
          brut: brutMaas,
          sgkIsci: brutMaas * 0.14,
          issizlikIsci: brutMaas * 0.01,
          aylikGelirVergisi: brutMaas * 0.15,
          damgaVergisi: brutMaas * 0.00759,
          kumulatifVergiMatrahi: (brutMaas - brutMaas * 0.14 - brutMaas * 0.01) * (index + 1),
          net: brutMaas * 0.7,
          asgariGecimIndirimi: 1000,
          asgariUcretGelirVergisiIstisnasi: 500,
          asgariUcretDamgaVergisiIstisnasi: 100,
          netOdenecekTutar: brutMaas * 0.7 + 1000,
          sgkIsveren: brutMaas * (sgkIndirim5 ? 0.155 - 0.05 : sgkIndirim4 ? 0.155 - 0.04 : 0.155),
          issizlikIsveren: brutMaas * 0.02,
          toplamMaliyet: brutMaas * (1 + (sgkIndirim5 ? 0.155 - 0.05 : sgkIndirim4 ? 0.155 - 0.04 : 0.155) + 0.02)
        };
      }
    });

    setSonuclar(aylikSonuclar);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Bölümü */}
      <section className="bg-gradient-to-b from-[#4DA3FF]/10 to-white pt-36 pb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-center text-[#1F2A44] mb-4">
            Bordro Hesaplama
          </h1>
          <p className="text-center text-xl text-[#1F2A44]/80 max-w-3xl mx-auto mb-6">
            İK süreçlerinizin en kritik parçası olan bordro hesaplamalarını
            hızlı ve doğru bir şekilde yapmanıza yardımcı oluyoruz.
          </p>
        </div>
      </section>

      {/* Ana Bordro Hesaplama Alanı (Büyük Alan) */}
      <section className="py-6 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="border-[#1F2A44]/10 shadow-2xl bg-white overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#4DA3FF]/30 to-[#B1E5D3]/30 border-b border-[#1F2A44]/10 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-[#4DA3FF] px-3 py-1.5 rounded-full text-xs font-medium text-white">Ücretsiz</Badge>
                <Badge className="bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-[#1F2A44]">Yıllık Hesaplama</Badge>
              </div>
              <CardTitle className="text-3xl text-[#1F2A44]">Maaş Hesaplama</CardTitle>
              <CardDescription className="text-lg text-[#1F2A44]/70">
                Yıllık maaş, kesintiler ve işveren maliyeti hesaplamaları için bilgileri giriniz
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-8">
                {/* Bordro Hesaplama Formu */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium block mb-1.5">Ücret Tipi</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="bruttenNete" 
                            checked={ucretTipi === "brütten-nete"}
                            onCheckedChange={(checked: boolean | "indeterminate") => {
                              if (checked) setUcretTipi("brütten-nete");
                            }}
                          />
                          <Label 
                            htmlFor="bruttenNete" 
                            className="text-sm text-[#1F2A44]/80"
                          >
                            Brütten Nete
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="nettenBrute" 
                            checked={ucretTipi === "netten-brüte"}
                            onCheckedChange={(checked: boolean | "indeterminate") => {
                              if (checked) setUcretTipi("netten-brüte");
                            }}
                          />
                          <Label 
                            htmlFor="nettenBrute" 
                            className="text-sm text-[#1F2A44]/80"
                          >
                            Netten Brüte
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium block mb-1.5">Yıl</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="yil2024" 
                            checked={yil === "2024"}
                            onCheckedChange={(checked: boolean | "indeterminate") => {
                              if (checked) setYil("2024");
                            }}
                          />
                          <Label 
                            htmlFor="yil2024" 
                            className="text-sm text-[#1F2A44]/80"
                          >
                            2024
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="yil2025" 
                            checked={yil === "2025"}
                            onCheckedChange={(checked: boolean | "indeterminate") => {
                              if (checked) setYil("2025");
                            }}
                          />
                          <Label 
                            htmlFor="yil2025" 
                            className="text-sm text-[#1F2A44]/80"
                          >
                            2025
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="brutMaas" className="text-sm font-medium block mb-1.5">Brüt Maaş</Label>
                      <Input 
                        id="brutMaas" 
                        type="number" 
                        className="border-[#1F2A44]/20" 
                        value={brutMaas}
                        onChange={(e) => setBrutMaas(Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-3 mt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="iseGostergeMaliyeti" 
                          checked={iseGostergeMaliyeti}
                          onCheckedChange={(checked: boolean | "indeterminate") => setIseGostergeMaliyeti(checked as boolean)}
                        />
                        <Label 
                          htmlFor="iseGostergeMaliyeti" 
                          className="text-sm font-medium"
                        >
                          İşveren maliyetini göster
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sgkIndirim5" 
                          checked={sgkIndirim5}
                          onCheckedChange={(checked: boolean | "indeterminate") => {
                            setSgkIndirim5(checked as boolean);
                            if (checked) setSgkIndirim4(false);
                          }}
                        />
                        <Label 
                          htmlFor="sgkIndirim5" 
                          className="text-sm text-[#1F2A44]/80"
                        >
                          Sigorta primi işveren payının hesabında, 5 puanlık indirim dikkate alınsın.
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sgkIndirim4" 
                          checked={sgkIndirim4}
                          onCheckedChange={(checked: boolean | "indeterminate") => {
                            setSgkIndirim4(checked as boolean);
                            if (checked) setSgkIndirim5(false);
                          }}
                        />
                        <Label 
                          htmlFor="sgkIndirim4" 
                          className="text-sm text-[#1F2A44]/80"
                        >
                          Sigorta primi işveren payının hesabında, 4 puanlık indirim dikkate alınsın.
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium block mb-1.5">Medeni Durumu</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="medeniDurumBekar" 
                            checked={medeniDurum === "bekar"}
                            onCheckedChange={(checked: boolean | "indeterminate") => {
                              if (checked) setMedeniDurum("bekar");
                            }}
                          />
                          <Label 
                            htmlFor="medeniDurumBekar" 
                            className="text-sm text-[#1F2A44]/80"
                          >
                            Bekar
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="medeniDurumEvli" 
                            checked={medeniDurum === "evli"}
                            onCheckedChange={(checked: boolean | "indeterminate") => {
                              if (checked) setMedeniDurum("evli");
                            }}
                          />
                          <Label 
                            htmlFor="medeniDurumEvli" 
                            className="text-sm text-[#1F2A44]/80"
                          >
                            Evli
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium block mb-1.5">Eşi Çalışıyor mu?</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="esiCalismiyor" 
                            checked={esiCalisiyorMu === "çalışmıyor"}
                            onCheckedChange={(checked: boolean | "indeterminate") => {
                              if (checked) setEsiCalisiyorMu("çalışmıyor");
                            }}
                          />
                          <Label 
                            htmlFor="esiCalismiyor" 
                            className="text-sm text-[#1F2A44]/80"
                          >
                            Çalışmıyor
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="esiCalisiyor" 
                            checked={esiCalisiyorMu === "çalışıyor"}
                            onCheckedChange={(checked: boolean | "indeterminate") => {
                              if (checked) setEsiCalisiyorMu("çalışıyor");
                            }}
                          />
                          <Label 
                            htmlFor="esiCalisiyor" 
                            className="text-sm text-[#1F2A44]/80"
                          >
                            Çalışıyor
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cocukSayisi" className="text-sm font-medium block mb-1.5">Çocuk Sayısı</Label>
                      <Input 
                        id="cocukSayisi" 
                        type="number" 
                        className="border-[#1F2A44]/20" 
                        value={cocukSayisi}
                        onChange={(e) => setCocukSayisi(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Sonuç Tablosu */}
                <div>
                  <div className="text-lg font-semibold text-[#1F2A44] mb-2">Brütten Nete Maaş Hesabı</div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#F9FAFC]">
                          <th className="border border-[#1F2A44]/20 p-2 text-left font-medium"></th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left font-medium">Brüt</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left font-medium">SSK İşçi</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left font-medium">İşsizlik İşçi</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left font-medium">Aylık Gelir Vergisi</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left font-medium">Damga Vergisi</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left font-medium">Kümülatif Vergi Matrahı</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left font-medium">Net</th>
                          {iseGostergeMaliyeti && (
                            <>
                              <th className="border border-[#1F2A44]/20 p-2 text-left font-medium">SSK İşveren</th>
                              <th className="border border-[#1F2A44]/20 p-2 text-left font-medium">İşsizlik İşveren</th>
                              <th className="border border-[#1F2A44]/20 p-2 text-left font-medium">Toplam Maliyet</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {AYLAR.map((ay, index) => (
                          <tr key={ay} className={index === AYLAR.length - 1 ? "font-semibold" : ""}>
                            <td className="border border-[#1F2A44]/20 p-2">{ay}</td>
                            <td className="border border-[#1F2A44]/20 p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.brut || 0)}
                            </td>
                            <td className="border border-[#1F2A44]/20 p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.sgkIsci || 0)}
                            </td>
                            <td className="border border-[#1F2A44]/20 p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.issizlikIsci || 0)}
                            </td>
                            <td className="border border-[#1F2A44]/20 p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.aylikGelirVergisi || 0)}
                            </td>
                            <td className="border border-[#1F2A44]/20 p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.damgaVergisi || 0)}
                            </td>
                            <td className="border border-[#1F2A44]/20 p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.kumulatifVergiMatrahi || 0)}
                            </td>
                            <td className="border border-[#1F2A44]/20 p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.net || 0)}
                            </td>
                            {iseGostergeMaliyeti && (
                              <>
                                <td className="border border-[#1F2A44]/20 p-2 text-right">
                                  {sonuclar && formatNumber(sonuclar[index]?.sgkIsveren || 0)}
                                </td>
                                <td className="border border-[#1F2A44]/20 p-2 text-right">
                                  {sonuclar && formatNumber(sonuclar[index]?.issizlikIsveren || 0)}
                                </td>
                                <td className="border border-[#1F2A44]/20 p-2 text-right">
                                  {sonuclar && formatNumber(sonuclar[index]?.toplamMaliyet || 0)}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-xs text-[#1F2A44]/60 space-y-1 mt-4">
                    <p>1. Yapılan maaş hesaplamalarında para birimi TL ve takip eden yıllarda TL değerleri esas alınmaktadır.</p>
                    <p>2. Yapılan maaş hesaplamaları ile ilgili olarak kesin bordro işlemleri öncesi uzman veya danışman bilgisine başvurulması tavsiye olunur.</p>
                    <p>3. Rakam asgari ücretin altında olduğunda hesaplama yapılmaz.</p>
                    <p>4. 2022 Yıl ve sonrası için AGİ hesaplanmaz.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bilgilendirme ve Premium Yönlendirme */}
      <section className="py-16 bg-[#F9FAFC]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sol Taraf - Bilgilendirme */}
              <div className="lg:col-span-2 space-y-8">
                <h2 className="text-2xl font-semibold text-[#1F2A44] border-b border-[#1F2A44]/10 pb-4">
                  Neden Bordro Hesaplama Önemli?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1F2A44]/5">
                    <div className="bg-[#4DA3FF]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Calculator className="w-6 h-6 text-[#4DA3FF]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1F2A44] mb-2">Doğru ve Hatasız Hesaplama</h3>
                    <p className="text-sm text-[#1F2A44]/70">
                      Karmaşık vergi dilimleri, SGK primleri ve diğer kesintileri otomatik olarak hesaplayın, 
                      insan kaynaklı hataları önleyin.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1F2A44]/5">
                    <div className="bg-[#4DA3FF]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Info className="w-6 h-6 text-[#4DA3FF]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1F2A44] mb-2">Yasal Mevzuata Uygunluk</h3>
                    <p className="text-sm text-[#1F2A44]/70">
                      Sürekli değişen vergi oranları ve SGK tavanlarına uygun hesaplamalar yaparak
                      yasal yükümlülüklerinizi eksiksiz yerine getirin.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1F2A44]/5">
                    <div className="bg-[#4DA3FF]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-[#4DA3FF]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1F2A44] mb-2">Zaman Tasarrufu</h3>
                    <p className="text-sm text-[#1F2A44]/70">
                      Manuel hesaplamalarla saatler harcamak yerine, saniyeler içinde profesyonel
                      sonuçlar elde edin ve asıl işinize odaklanın.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1F2A44]/5">
                    <div className="bg-[#4DA3FF]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <PieChart className="w-6 h-6 text-[#4DA3FF]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1F2A44] mb-2">Maliyet Optimizasyonu</h3>
                    <p className="text-sm text-[#1F2A44]/70">
                      Farklı senaryoları hızlıca hesaplayarak en uygun maliyetli çalışan planlamasını
                      yapın ve bütçenizi etkili şekilde yönetin.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Sağ Taraf - Premium Yönlendirme */}
              <div>
                <div className="bg-white border border-[#4DA3FF]/20 rounded-xl overflow-hidden shadow-lg">
                  <div className="bg-gradient-to-r from-[#4DA3FF] to-[#6A8BFF] px-6 py-5">
                    <div className="flex items-center gap-2 mb-2">
                      <BadgeCheck className="w-5 h-5 text-white" />
                      <span className="text-sm font-medium text-white">Premium Özellikler</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Gelişmiş Bordro Hesaplama</h3>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-sm text-[#1F2A44]/70 mb-4">
                      Daha gelişmiş ve detaylı hesaplamalar için premium hesabınızla erişin:
                    </p>
                    
                    <ul className="space-y-3 mb-6">
                      {[
                        "Yıllık Kümülatif Vergi Hesaplamaları",
                        "Ayni ve Nakdi Yardımlar (Yemek, Yol)",
                        "BES Kesintileri ve Özel Sigorta",
                        "Prim ve İkramiye Hesaplamaları",
                        "Vergi Dilimi Optimizasyonu",
                        "Toplu Personel İşlemleri",
                        "Çoklu Rapor ve Analiz Oluşturma"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button className="w-full bg-gradient-to-r from-[#4DA3FF] to-[#6A8BFF] hover:from-[#4DA3FF]/90 hover:to-[#6A8BFF]/90 text-white font-medium py-5">
                      Premium'a Geç
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BordroHesaplamaPage; 