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
  const [brutMaas, setBrutMaas] = useState<number>(26005.5);
  const [ucretTipi, setUcretTipi] = useState<string>("brütten-nete");
  const [yil, setYil] = useState<string>("2025");
  const [iseGostergeMaliyeti, setIseGostergeMaliyeti] = useState<boolean>(true);
  const [sgkIndirim5, setSgkIndirim5] = useState<boolean>(true);
  const [sgkIndirim4, setSgkIndirim4] = useState<boolean>(false);

  // Hesaplama sonuçları
  const [sonuclar, setSonuclar] = useState<any>(null);

  // Form değerleri değiştiğinde otomatik hesaplama yap
  useEffect(() => {
    hesaplaBordro();
  }, [brutMaas, ucretTipi, yil, iseGostergeMaliyeti, sgkIndirim5, sgkIndirim4]);

  // Bordro hesaplama fonksiyonu
  const hesaplaBordro = () => {
    // Örnek hesaplama için basit sonuçlar oluşturuyoruz
    // Gerçek hesaplamada, aylık vergi dilimleri, kümülatif vergi matrahı, 
    // AGİ hesaplamaları, asgari ücret istisnaları gibi detaylar olacaktır
    
    // Vergi dilimlerine göre değerler
    const VERGİ_DİLİMİ_1 = 158000; // 15% dilimi üst sınırı
    const VERGİ_DİLİMİ_2 = 330000; // 20% dilimi üst sınırı
    const VERGİ_DİLİMİ_3 = 1200000; // 27% dilimi üst sınırı
    const VERGİ_DİLİMİ_4 = 4300000; // 35% dilimi üst sınırı
    const ORAN_1 = 0.15; // 15% oranı
    const ORAN_2 = 0.20; // 20% oranı
    const ORAN_3 = 0.27; // 27% oranı
    const ORAN_4 = 0.35; // 35% oranı
    const ORAN_5 = 0.40; // 40% oranı
    const STANDART_İSTİSNA = 22104.68;
    
    // Önce temel hesaplamaları yapalım
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
          asgariUcretGelirVergisiIstisnasi: 0, // Geçici değer, sonra güncellenecek
          asgariUcretDamgaVergisiIstisnasi: 100 * 12,
          netOdenecekTutar: (brutMaas * 0.7 + 1000) * 12,
          sgkIsveren: brutMaas * (sgkIndirim5 ? 0.155 - 0.05 : sgkIndirim4 ? 0.155 - 0.04 : 0.155) * 12,
          issizlikIsveren: brutMaas * 0.02 * 12,
          toplamMaliyet: (brutMaas * (1 + (sgkIndirim5 ? 0.155 - 0.05 : sgkIndirim4 ? 0.155 - 0.04 : 0.155) + 0.02)) * 12
        };
      } else {
        // Her ay için hesapla
        const aylikMatrah = brutMaas - brutMaas * 0.14 - brutMaas * 0.01;
        const kumulatifMatrah = aylikMatrah * (index + 1);
        
        return {
          brut: brutMaas,
          sgkIsci: brutMaas * 0.14,
          issizlikIsci: brutMaas * 0.01,
          aylikGelirVergisi: brutMaas * 0.15,
          damgaVergisi: brutMaas * 0.00759,
          kumulatifVergiMatrahi: kumulatifMatrah,
          net: brutMaas * 0.7,
          asgariGecimIndirimi: 1000,
          asgariUcretGelirVergisiIstisnasi: 0, // Geçici değer, sonra güncellenecek
          asgariUcretDamgaVergisiIstisnasi: 100,
          netOdenecekTutar: brutMaas * 0.7 + 1000,
          sgkIsveren: brutMaas * (sgkIndirim5 ? 0.155 - 0.05 : sgkIndirim4 ? 0.155 - 0.04 : 0.155),
          issizlikIsveren: brutMaas * 0.02,
          toplamMaliyet: brutMaas * (1 + (sgkIndirim5 ? 0.155 - 0.05 : sgkIndirim4 ? 0.155 - 0.04 : 0.155) + 0.02)
        };
      }
    });
    
    // Şimdi vergi istisnası değerlerini hesaplayalım
    let ilkKezDilim1Asildi = false;
    let ilkKezDilim2Asildi = false;
    let ilkKezDilim3Asildi = false;
    let ilkKezDilim4Asildi = false;
    let dilim1AsildiAy = -1;
    let dilim2AsildiAy = -1;
    let dilim3AsildiAy = -1;
    let dilim4AsildiAy = -1;
    let oncekiAyMatrah = 0;
    let farkİcin15YüzdeDeğer = 0;
    let farkİcin20YüzdeDeğer = 0;
    let farkİcin27YüzdeDeğer = 0;
    let farkİcin35YüzdeDeğer = 0;
    let aktifOran = ORAN_1; // Başlangıçta %15 kullanılır
    
    // Aylık değerleri güncelle
    for (let i = 0; i < aylikSonuclar.length - 1; i++) { // Toplam hariç
      const sonuc = aylikSonuclar[i];
      const kumulatifMatrah = sonuc.kumulatifVergiMatrahi;
      
      // Gelir vergisi istisnası hesaplama
      let gelirVergisiIstisnasi = 0;
      
      if (kumulatifMatrah <= VERGİ_DİLİMİ_1) {
        // 158.000 TL'ye kadar olan kısım için %15 ve standart istisna
        gelirVergisiIstisnasi = STANDART_İSTİSNA * ORAN_1;
        aktifOran = ORAN_1;
      } else if (kumulatifMatrah <= VERGİ_DİLİMİ_2) {
        // 158.000 TL ile 330.000 TL arasındaki kısım
        if (!ilkKezDilim1Asildi) {
          // İlk kez 158.000 TL aşıldı
          ilkKezDilim1Asildi = true;
          dilim1AsildiAy = i;
          
          // 158.000 TL ile önceki ay matrahı arasındaki farkın %15'i
          const dilimAsimFarki = VERGİ_DİLİMİ_1 - oncekiAyMatrah;
          farkİcin15YüzdeDeğer = dilimAsimFarki * ORAN_1;
          
          // 158.000 TL'yi aşan kısmın %20'si
          const yuksekDilimFarki = kumulatifMatrah - VERGİ_DİLİMİ_1;
          gelirVergisiIstisnasi = farkİcin15YüzdeDeğer + (yuksekDilimFarki * ORAN_2);
          aktifOran = ORAN_2;
        } else {
          // 158.000 TL aşıldıktan sonraki aylar için standart istisnanın %20'si
          gelirVergisiIstisnasi = STANDART_İSTİSNA * ORAN_2;
          aktifOran = ORAN_2;
        }
      } else if (kumulatifMatrah <= VERGİ_DİLİMİ_3) {
        // 330.000 TL ile 1.200.000 TL arasındaki kısım
        if (!ilkKezDilim2Asildi) {
          // İlk kez 330.000 TL aşıldı
          ilkKezDilim2Asildi = true;
          dilim2AsildiAy = i;
          
          // 330.000 TL ile önceki ay matrahı arasındaki farkın %20'si
          const dilimAsimFarki = VERGİ_DİLİMİ_2 - oncekiAyMatrah;
          farkİcin20YüzdeDeğer = dilimAsimFarki * ORAN_2;
          
          // 330.000 TL'yi aşan kısmın %27'si
          const yuksekDilimFarki = kumulatifMatrah - VERGİ_DİLİMİ_2;
          gelirVergisiIstisnasi = farkİcin20YüzdeDeğer + (yuksekDilimFarki * ORAN_3);
          aktifOran = ORAN_3;
        } else {
          // 330.000 TL aşıldıktan sonraki aylar için standart istisnanın %27'si
          gelirVergisiIstisnasi = STANDART_İSTİSNA * ORAN_3;
          aktifOran = ORAN_3;
        }
      } else if (kumulatifMatrah <= VERGİ_DİLİMİ_4) {
        // 1.200.000 TL ile 4.300.000 TL arasındaki kısım
        if (!ilkKezDilim3Asildi) {
          // İlk kez 1.200.000 TL aşıldı
          ilkKezDilim3Asildi = true;
          dilim3AsildiAy = i;
          
          // 1.200.000 TL ile önceki ay matrahı arasındaki farkın %27'si
          const dilimAsimFarki = VERGİ_DİLİMİ_3 - oncekiAyMatrah;
          farkİcin27YüzdeDeğer = dilimAsimFarki * ORAN_3;
          
          // 1.200.000 TL'yi aşan kısmın %35'i
          const yuksekDilimFarki = kumulatifMatrah - VERGİ_DİLİMİ_3;
          gelirVergisiIstisnasi = farkİcin27YüzdeDeğer + (yuksekDilimFarki * ORAN_4);
          aktifOran = ORAN_4;
        } else {
          // 1.200.000 TL aşıldıktan sonraki aylar için standart istisnanın %35'i
          gelirVergisiIstisnasi = STANDART_İSTİSNA * ORAN_4;
          aktifOran = ORAN_4;
        }
      } else {
        // 4.300.000 TL'yi aşan kısım için %40 oran kullanılır
        if (!ilkKezDilim4Asildi) {
          // İlk kez 4.300.000 TL aşıldı
          ilkKezDilim4Asildi = true;
          dilim4AsildiAy = i;
          
          // 4.300.000 TL'yi aştığı ay doğrudan %40 uygulanır
          gelirVergisiIstisnasi = STANDART_İSTİSNA * ORAN_5;
          aktifOran = ORAN_5;
        } else {
          // 4.300.000 TL aşıldıktan sonraki aylar için standart istisnanın %40'ı
          gelirVergisiIstisnasi = STANDART_İSTİSNA * ORAN_5;
          aktifOran = ORAN_5;
        }
      }
      
      // Sonucu güncelle
      aylikSonuclar[i].asgariUcretGelirVergisiIstisnasi = gelirVergisiIstisnasi;
      
      // Bir sonraki ay için mevcut matrahı kaydet
      oncekiAyMatrah = kumulatifMatrah;
    }
    
    // TOPLAM değerini güncelle
    if (dilim4AsildiAy !== -1) {
      // 4.300.000 TL dilimi aşıldıysa
      let toplamIstisna = 0;
      
      // İlk dilim aşılmadan önceki aylar için %15
      for (let i = 0; i < dilim1AsildiAy; i++) {
        toplamIstisna += STANDART_İSTİSNA * ORAN_1;
      }
      
      // 158.000 TL dilimin aşıldığı ay için özel hesaplama
      if (dilim1AsildiAy >= 0) {
        toplamIstisna += aylikSonuclar[dilim1AsildiAy].asgariUcretGelirVergisiIstisnasi;
      }
      
      // İlk ve ikinci dilim arasındaki aylar için %20
      for (let i = dilim1AsildiAy + 1; i < dilim2AsildiAy; i++) {
        toplamIstisna += STANDART_İSTİSNA * ORAN_2;
      }
      
      // 330.000 TL dilimin aşıldığı ay için özel hesaplama
      if (dilim2AsildiAy >= 0) {
        toplamIstisna += aylikSonuclar[dilim2AsildiAy].asgariUcretGelirVergisiIstisnasi;
      }
      
      // İkinci ve üçüncü dilim arasındaki aylar için %27
      for (let i = dilim2AsildiAy + 1; i < dilim3AsildiAy; i++) {
        toplamIstisna += STANDART_İSTİSNA * ORAN_3;
      }
      
      // 1.200.000 TL dilimin aşıldığı ay için özel hesaplama
      if (dilim3AsildiAy >= 0) {
        toplamIstisna += aylikSonuclar[dilim3AsildiAy].asgariUcretGelirVergisiIstisnasi;
      }
      
      // Üçüncü ve dördüncü dilim arasındaki aylar için %35
      for (let i = dilim3AsildiAy + 1; i < dilim4AsildiAy; i++) {
        toplamIstisna += STANDART_İSTİSNA * ORAN_4;
      }
      
      // 4.300.000 TL dilimin aşıldığı ay için özel hesaplama
      if (dilim4AsildiAy >= 0) {
        toplamIstisna += aylikSonuclar[dilim4AsildiAy].asgariUcretGelirVergisiIstisnasi;
      }
      
      // Dördüncü dilim aşıldıktan sonraki aylar için %40
      for (let i = dilim4AsildiAy + 1; i < 12; i++) {
        toplamIstisna += STANDART_İSTİSNA * ORAN_5;
      }
      
      aylikSonuclar[aylikSonuclar.length - 1].asgariUcretGelirVergisiIstisnasi = toplamIstisna;
    } else if (dilim3AsildiAy !== -1) {
      // 1.200.000 TL dilimi aşıldıysa
      let toplamIstisna = 0;
      
      // İlk dilim aşılmadan önceki aylar için %15
      for (let i = 0; i < dilim1AsildiAy; i++) {
        toplamIstisna += STANDART_İSTİSNA * ORAN_1;
      }
      
      // Dilimin aşıldığı ay için özel hesaplama
      if (dilim1AsildiAy >= 0) {
        toplamIstisna += aylikSonuclar[dilim1AsildiAy].asgariUcretGelirVergisiIstisnasi;
      }
      
      // Dilim aşıldıktan sonraki aylar için %20
      for (let i = dilim1AsildiAy + 1; i < 12; i++) {
        toplamIstisna += STANDART_İSTİSNA * ORAN_2;
      }
      
      aylikSonuclar[aylikSonuclar.length - 1].asgariUcretGelirVergisiIstisnasi = toplamIstisna;
    } else if (dilim2AsildiAy !== -1) {
      // 330.000 TL dilimi aşıldıysa
      let toplamIstisna = 0;
      
      // İlk dilim aşılmadan önceki aylar için %15
      for (let i = 0; i < dilim1AsildiAy; i++) {
        toplamIstisna += STANDART_İSTİSNA * ORAN_1;
      }
      
      // Dilimin aşıldığı ay için özel hesaplama
      if (dilim1AsildiAy >= 0) {
        toplamIstisna += aylikSonuclar[dilim1AsildiAy].asgariUcretGelirVergisiIstisnasi;
      }
      
      // Dilim aşıldıktan sonraki aylar için %20
      for (let i = dilim1AsildiAy + 1; i < 12; i++) {
        toplamIstisna += STANDART_İSTİSNA * ORAN_2;
      }
      
      aylikSonuclar[aylikSonuclar.length - 1].asgariUcretGelirVergisiIstisnasi = toplamIstisna;
    } else {
      // Hiçbir dilim aşılmadıysa standart değeri kullan
      aylikSonuclar[aylikSonuclar.length - 1].asgariUcretGelirVergisiIstisnasi = 
        STANDART_İSTİSNA * ORAN_1 * 12;
    }

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
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-6">
                    {/* Ücret Tipi, Yıl ve Brüt Maaş - Tek Satırda */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Ücret Tipi */}
                      <div>
                        <Label className="text-sm font-medium block mb-3">Ücret Tipi</Label>
                        <div className="flex flex-row gap-4 mt-1">
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

                      {/* Yıl */}
                      <div>
                        <Label className="text-sm font-medium block mb-3">Yıl</Label>
                        <div className="flex flex-row gap-4 mt-1">
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

                      {/* Brüt Maaş */}
                      <div>
                        <Label htmlFor="brutMaas" className="text-sm font-medium block mb-3">Brüt Maaş</Label>
                        <Input 
                          id="brutMaas" 
                          type="number" 
                          className="border-[#1F2A44]/20" 
                          value={brutMaas}
                          onChange={(e) => setBrutMaas(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    {/* SGK İndirimleri ve İşveren Maliyeti */}
                    <div className="bg-[#F9FAFC] p-4 rounded-lg border border-[#1F2A44]/10">
                      <div className="flex items-center space-x-2 mb-3">
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <th className="border border-[#1F2A44]/20 p-2 text-left font-medium">Gelir Vergisi İstisnası</th>
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
                              {sonuclar && formatNumber(sonuclar[index]?.asgariUcretGelirVergisiIstisnasi || 0)}
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

                  <div className="text-xs text-[#1F2A44]/60 space-y-1 mt-4 bg-[#F9FAFC] p-4 rounded-lg border border-[#1F2A44]/10">
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