import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from "@/lib/utils";
import { Calculator, Info, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const BordroHesaplama = ({ isDarkMode = false }) => {
  // Form değerleri (BordroHesaplamaPage.tsx'den alındı)
  const [brutMaas, setBrutMaas] = useState<number>(26005.5);
  const [ucretTipi, setUcretTipi] = useState<string>("brütten-nete");
  const [yil, setYil] = useState<string>("2025"); // Yıl state'i BordroHesaplamaPage'deki gibi
  const [iseGostergeMaliyeti, setIseGostergeMaliyeti] = useState<boolean>(true);
  const [sgkIndirim5, setSgkIndirim5] = useState<boolean>(true);
  const [sgkIndirim4, setSgkIndirim4] = useState<boolean>(false);

  // Hesaplama sonuçları (BordroHesaplamaPage.tsx'den alındı)
  const [sonuclar, setSonuclar] = useState<any>(null);

  // Form değerleri değiştiğinde otomatik hesaplama yap (BordroHesaplamaPage.tsx'den alındı)
  useEffect(() => {
    hesaplaBordro();
  }, [brutMaas, ucretTipi, yil, iseGostergeMaliyeti, sgkIndirim5, sgkIndirim4]);

  // Bordro hesaplama fonksiyonu (BordroHesaplamaPage.tsx'den alındı)
  const hesaplaBordro = () => {
    // Vergi dilimlerine göre değerler (BordroHesaplamaPage.tsx'den alındı)
    const VERGİ_DİLİMİ_1 = 158000; // 15% dilimi üst sınırı
    const VERGİ_DİLİMİ_2 = 330000; // 20% dilimi üst sınırı
    const VERGİ_DİLİMİ_3 = 1200000; // 27% dilimi üst sınırı
    const VERGİ_DİLİMİ_4 = 4300000; // 35% dilimi üst sınırı
    const ORAN_1 = 0.15; // 15% oranı
    const ORAN_2 = 0.20; // 20% oranı
    const ORAN_3 = 0.27; // 27% oranı
    const ORAN_4 = 0.35; // 35% oranı
    const ORAN_5 = 0.40; // 40% oranı
    
    const aylikSonuclarTemel = AYLAR.slice(0, 12).map((ay, index) => {
      const sgkIsciPayi = brutMaas * 0.14;
      const issizlikIsciPayi = brutMaas * 0.01;
      const aylikGelirVergisiMatrahi = brutMaas - sgkIsciPayi - issizlikIsciPayi;
      const kumulatifMatrah = aylikGelirVergisiMatrahi * (index + 1);

      // Gelir Vergisi İstisnası (BordroHesaplamaPage.tsx'deki mantık: Yıl kontrolü YOK)
      let aylikSabitGelirVergisiIstisnasi = 0;
      if (index <= 6) { // Ocak - Temmuz
        aylikSabitGelirVergisiIstisnasi = 3315.70;
      } else if (index === 7) { // Ağustos
        aylikSabitGelirVergisiIstisnasi = 4257.57;
      } else if (index >= 8 && index <= 11) { // Eylül - Aralık
        aylikSabitGelirVergisiIstisnasi = 4420.94;
      }

      const aylikDamgaVergisi = brutMaas * 0.00759;
      // Damga Vergisi İstisnası (BordroHesaplamaPage.tsx'deki mantık: Yıl kontrolü YOK, sabit değer)
      const aylikDamgaVergisiIstisnasi = 197.38;
      // Kesilecek Damga Vergisi (BordroHesaplamaPage.tsx'deki mantık: Math.max YOK)
      const aylikKesilecekDamgaVergisi = aylikDamgaVergisi - aylikDamgaVergisiIstisnasi;

      // SGK İşveren Payı Oranları (BordroHesaplamaPage.tsx'deki oranlar)
      const aylikSgkIsverenPayi = brutMaas * ((): number => {
        if (sgkIndirim5) return 0.1775;
        if (sgkIndirim4) return 0.1675;
        return 0.155;
      })();
      const aylikIssizlikIsverenPayi = brutMaas * 0.02;

      return {
        ay,
        brut: brutMaas,
        sgkIsci: sgkIsciPayi,
        issizlikIsci: issizlikIsciPayi,
        gelirVergisiMatrahi: aylikGelirVergisiMatrahi,
        kumulatifVergiMatrahi: kumulatifMatrah, 
        asgariUcretGelirVergisiIstisnasi: aylikSabitGelirVergisiIstisnasi,
        damgaVergisi: aylikDamgaVergisi,
        asgariUcretDamgaVergisiIstisnasi: aylikDamgaVergisiIstisnasi,
        kesilecekDamgaVergisi: aylikKesilecekDamgaVergisi,
        aylikGelirVergisi: 0, 
        kesilecekGelirVergisi: 0, 
        net: brutMaas * 0.7, // BordroHesaplamaPage.tsx'deki başlangıç değeri
        asgariGecimIndirimi: 1000, // BordroHesaplamaPage.tsx'deki AGİ değeri
        netOdenecekTutar: brutMaas * 0.7 + 1000, // BordroHesaplamaPage.tsx'deki başlangıç değeri
        sgkIsveren: aylikSgkIsverenPayi,
        issizlikIsveren: aylikIssizlikIsverenPayi,
        toplamMaliyet: brutMaas + aylikSgkIsverenPayi + aylikIssizlikIsverenPayi
      };
    });

    let oncekiAyMatrah = 0;
    let ilkKezDilim1Asildi = false;
    let ilkKezDilim2Asildi = false;
    let ilkKezDilim3Asildi = false;
    let ilkKezDilim4Asildi = false;

    for (let i = 0; i < aylikSonuclarTemel.length; i++) {
      const sonuc = aylikSonuclarTemel[i];
      const kumulatifMatrah = sonuc.kumulatifVergiMatrahi; // BordroHesaplamaPage.tsx'deki değişken adı
      let hesaplananAylikGelirVergisi = 0;
      
      // Gelir Vergisi Hesaplama (BordroHesaplamaPage.tsx'deki basit mantık)
      if (kumulatifMatrah <= VERGİ_DİLİMİ_1) {
        hesaplananAylikGelirVergisi = sonuc.gelirVergisiMatrahi * ORAN_1;
      } else if (kumulatifMatrah <= VERGİ_DİLİMİ_2) {
        if (!ilkKezDilim1Asildi) {
          ilkKezDilim1Asildi = true;
          const dilimAsimFarki = VERGİ_DİLİMİ_1 - oncekiAyMatrah;
          const yuksekDilimFarki = sonuc.gelirVergisiMatrahi - dilimAsimFarki;
          hesaplananAylikGelirVergisi = (dilimAsimFarki * ORAN_1) + (yuksekDilimFarki * ORAN_2);
        } else {
          hesaplananAylikGelirVergisi = sonuc.gelirVergisiMatrahi * ORAN_2;
        }
      } else if (kumulatifMatrah <= VERGİ_DİLİMİ_3) {
        if (!ilkKezDilim2Asildi) {
          ilkKezDilim2Asildi = true;
          const dilimAsimFarki = VERGİ_DİLİMİ_2 - oncekiAyMatrah;
          const yuksekDilimFarki = sonuc.gelirVergisiMatrahi - dilimAsimFarki;
          hesaplananAylikGelirVergisi = (dilimAsimFarki * ORAN_2) + (yuksekDilimFarki * ORAN_3);
        } else {
          hesaplananAylikGelirVergisi = sonuc.gelirVergisiMatrahi * ORAN_3;
        }
      } else if (kumulatifMatrah <= VERGİ_DİLİMİ_4) {
        if (!ilkKezDilim3Asildi) {
          ilkKezDilim3Asildi = true;
          const dilimAsimFarki = VERGİ_DİLİMİ_3 - oncekiAyMatrah;
          const yuksekDilimFarki = sonuc.gelirVergisiMatrahi - dilimAsimFarki;
          hesaplananAylikGelirVergisi = (dilimAsimFarki * ORAN_3) + (yuksekDilimFarki * ORAN_4);
        } else {
          hesaplananAylikGelirVergisi = sonuc.gelirVergisiMatrahi * ORAN_4;
        }
      } else {
        if (!ilkKezDilim4Asildi) {
          ilkKezDilim4Asildi = true;
          const dilimAsimFarki = VERGİ_DİLİMİ_4 - oncekiAyMatrah;
          const yuksekDilimFarki = sonuc.gelirVergisiMatrahi - dilimAsimFarki;
          hesaplananAylikGelirVergisi = (dilimAsimFarki * ORAN_4) + (yuksekDilimFarki * ORAN_5);
        } else {
          hesaplananAylikGelirVergisi = sonuc.gelirVergisiMatrahi * ORAN_5;
        }
      }
      aylikSonuclarTemel[i].aylikGelirVergisi = hesaplananAylikGelirVergisi;
      // Kesilecek Gelir Vergisi (BordroHesaplamaPage.tsx'deki mantık: Math.max YOK)
      aylikSonuclarTemel[i].kesilecekGelirVergisi = hesaplananAylikGelirVergisi - sonuc.asgariUcretGelirVergisiIstisnasi;

      // NET ÜCRET HESAPLAMASI (BordroHesaplamaPage.tsx'deki mantık)
      aylikSonuclarTemel[i].net = sonuc.brut - sonuc.sgkIsci - sonuc.issizlikIsci - aylikSonuclarTemel[i].kesilecekGelirVergisi - sonuc.kesilecekDamgaVergisi;
      // netOdenecekTutar BordroHesaplamaPage'de ayrıca güncellenmiyor, AGİ ile net toplanarak kalıyor.

      oncekiAyMatrah = kumulatifMatrah;
    }

    // TOPLAM satırı (BordroHesaplamaPage.tsx'deki mantık)
    const toplamSonuc = {
      ay: 'TOPLAM',
      brut: aylikSonuclarTemel.reduce((sum, s) => sum + s.brut, 0),
      sgkIsci: aylikSonuclarTemel.reduce((sum, s) => sum + s.sgkIsci, 0),
      issizlikIsci: aylikSonuclarTemel.reduce((sum, s) => sum + s.issizlikIsci, 0),
      gelirVergisiMatrahi: aylikSonuclarTemel.reduce((sum, s) => sum + s.gelirVergisiMatrahi, 0),
      kumulatifVergiMatrahi: aylikSonuclarTemel[aylikSonuclarTemel.length - 1].kumulatifVergiMatrahi,
      asgariUcretGelirVergisiIstisnasi: aylikSonuclarTemel.reduce((sum, s) => sum + s.asgariUcretGelirVergisiIstisnasi, 0),
      damgaVergisi: aylikSonuclarTemel.reduce((sum, s) => sum + s.damgaVergisi, 0),
      asgariUcretDamgaVergisiIstisnasi: aylikSonuclarTemel.reduce((sum, s) => sum + s.asgariUcretDamgaVergisiIstisnasi, 0),
      kesilecekDamgaVergisi: aylikSonuclarTemel.reduce((sum, s) => sum + s.kesilecekDamgaVergisi, 0),
      aylikGelirVergisi: aylikSonuclarTemel.reduce((sum, s) => sum + s.aylikGelirVergisi, 0),
      kesilecekGelirVergisi: aylikSonuclarTemel.reduce((sum, s) => sum + s.kesilecekGelirVergisi, 0),
      net: aylikSonuclarTemel.reduce((sum, s) => sum + s.net, 0),
      asgariGecimIndirimi: aylikSonuclarTemel.reduce((sum, s) => sum + s.asgariGecimIndirimi, 0), // AGİ dahil
      netOdenecekTutar: aylikSonuclarTemel.reduce((sum, s) => sum + s.netOdenecekTutar, 0), // Dahil
      sgkIsveren: aylikSonuclarTemel.reduce((sum, s) => sum + s.sgkIsveren, 0),
      issizlikIsveren: aylikSonuclarTemel.reduce((sum, s) => sum + s.issizlikIsveren, 0),
      toplamMaliyet: aylikSonuclarTemel.reduce((sum, s) => sum + s.toplamMaliyet, 0),
    };

    const sonuclarNihai = [...aylikSonuclarTemel, toplamSonuc];
    setSonuclar(sonuclarNihai);
  };

  return (
    <div className={cn(
      "container mx-auto py-8 space-y-6",
      isDarkMode && "text-white"
    )}>
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className={cn(
          "text-3xl font-bold tracking-tight",
          isDarkMode && "text-white"
        )}>Detaylı Maaş Hesaplama</h1>
        <p className={cn(
          "text-muted-foreground",
          isDarkMode && "text-gray-300"
        )}>
          Gelişmiş bordro hesaplamaları için tüm parametrelere erişin
        </p>
      </div>

      {/* Parametre Kartı - Yatay Düzen */}
      <Card className={cn(
        "relative overflow-hidden",
        isDarkMode && "bg-sky-950/80 border-sky-800 shadow-lg"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Bordro Parametreleri
          </CardTitle>
          <CardDescription className={cn(
            isDarkMode && "text-gray-300"
          )}>
            Maaş hesaplama için gerekli değerleri girin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 mb-4">
            {/* Ücret Tipi */}
            <div className="w-full md:w-1/4">
              <Label className={cn(
                "text-sm font-medium block mb-2",
                isDarkMode && "text-white"
              )}>Ücret Tipi</Label>
              <div className="grid grid-cols-2 gap-2">
                <div 
                  className={cn(
                    "flex items-center justify-center p-2 rounded-md cursor-pointer border text-sm transition-colors",
                    ucretTipi === "brütten-nete" 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "bg-muted border-input hover:bg-accent hover:text-accent-foreground",
                    isDarkMode && ucretTipi !== "brütten-nete" && "bg-sky-950/90 border-sky-800 hover:bg-sky-900/90"
                  )}
                  onClick={() => setUcretTipi("brütten-nete")}
                >
                  Brütten Nete
                </div>
                <div 
                  className={cn(
                    "flex items-center justify-center p-2 rounded-md cursor-pointer border text-sm transition-colors",
                    ucretTipi === "netten-brüte" 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "bg-muted border-input hover:bg-accent hover:text-accent-foreground",
                    isDarkMode && ucretTipi !== "netten-brüte" && "bg-sky-950/90 border-sky-800 hover:bg-sky-900/90"
                  )}
                  onClick={() => setUcretTipi("netten-brüte")}
                >
                  Netten Brüte
                </div>
              </div>
            </div>

            {/* Yıl */}
            <div className="w-full md:w-1/4">
              <Label className={cn(
                "text-sm font-medium block mb-2",
                isDarkMode && "text-white"
              )}>Yıl</Label>
              <div className="grid grid-cols-2 gap-2">
                <div 
                  className={cn(
                    "flex items-center justify-center p-2 rounded-md cursor-pointer border text-sm transition-colors",
                    yil === "2024" 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "bg-muted border-input hover:bg-accent hover:text-accent-foreground",
                    isDarkMode && yil !== "2024" && "bg-sky-950/90 border-sky-800 hover:bg-sky-900/90"
                  )}
                  onClick={() => setYil("2024")}
                >
                  2024
                </div>
                <div 
                  className={cn(
                    "flex items-center justify-center p-2 rounded-md cursor-pointer border text-sm transition-colors",
                    yil === "2025" 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "bg-muted border-input hover:bg-accent hover:text-accent-foreground",
                    isDarkMode && yil !== "2025" && "bg-sky-950/90 border-sky-800 hover:bg-sky-900/90"
                  )}
                  onClick={() => setYil("2025")}
                >
                  2025
                </div>
              </div>
            </div>

            {/* Brüt Maaş */}
            <div className="w-full md:w-1/4">
              <Label htmlFor="brutMaas" className={cn(
                "text-sm font-medium block mb-2",
                isDarkMode && "text-white"
              )}>Brüt Maaş</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className={cn(
                    "text-muted-foreground",
                    isDarkMode && "text-gray-400"
                  )}>₺</span>
                </div>
                <Input 
                  id="brutMaas" 
                  type="number" 
                  className={cn(
                    "pl-8",
                    isDarkMode && "bg-sky-950/90 text-white border-sky-800 focus:border-sky-600 focus:ring-sky-600/30"
                  )}
                  value={brutMaas}
                  onChange={(e) => setBrutMaas(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hesaplama Seçenekleri - Yatay Kart */}
      <div className="w-full">
        <Card className={cn(
          "relative overflow-hidden border-dashed",
          isDarkMode && "bg-sky-950/80 border-sky-800 shadow-lg"
        )}>
          <CardHeader className="py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calculator className="w-4 h-4 text-primary" />
              Hesaplama Seçenekleri
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex flex-row items-center gap-8">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="iseGostergeMaliyetiAlt" 
                  checked={iseGostergeMaliyeti}
                  onCheckedChange={(checked) => setIseGostergeMaliyeti(checked === true)}
                  className={cn(
                    isDarkMode && "text-sky-500 border-sky-700 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white"
                  )}
                />
                <Label 
                  htmlFor="iseGostergeMaliyetiAlt" 
                  className={cn(
                    "text-sm",
                    isDarkMode && "text-gray-300"
                  )}
                >
                  İşveren maliyetini göster
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sgkIndirim5Alt" 
                  checked={sgkIndirim5}
                  onCheckedChange={(checked) => {
                    setSgkIndirim5(checked === true);
                    if (checked === true) setSgkIndirim4(false);
                  }}
                  className={cn(
                    isDarkMode && "text-sky-500 border-sky-700 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white"
                  )}
                />
                <Label 
                  htmlFor="sgkIndirim5Alt" 
                  className={cn(
                    "text-sm cursor-pointer",
                    isDarkMode && "text-gray-300"
                  )}
                >
                  5 puanlık indirim
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sgkIndirim4Alt" 
                  checked={sgkIndirim4}
                  onCheckedChange={(checked) => {
                    setSgkIndirim4(checked === true);
                    if (checked === true) setSgkIndirim5(false);
                  }}
                  className={cn(
                    isDarkMode && "text-sky-500 border-sky-700 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white"
                  )}
                />
                <Label 
                  htmlFor="sgkIndirim4Alt" 
                  className={cn(
                    "text-sm cursor-pointer",
                    isDarkMode && "text-gray-300"
                  )}
                >
                  4 puanlık indirim
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sonuç Tablosu */}
      {sonuclar && (
        <div className="w-full">
          <Card className={cn(
            "relative overflow-hidden",
            isDarkMode && "bg-sky-950/80 border-sky-800 shadow-lg"
          )}>
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Brütten Nete Maaş Hesabı ({yil})
                </CardTitle>
                <Badge className={cn(
                  isDarkMode 
                    ? "bg-sky-800 text-sky-100 hover:bg-sky-700" 
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                )}>Premium Sonuçlar</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-2 pb-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[1800px] border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th colSpan={1} className={cn(
                        "p-2 text-center font-medium text-xs uppercase rounded-tl-md",
                        isDarkMode ? "bg-sky-950 text-sky-100" : "bg-blue-100 text-blue-800"
                      )}>
                        Dönem
                      </th>
                      <th colSpan={1} className={cn(
                        "p-2 text-center font-medium text-xs uppercase",
                        isDarkMode ? "bg-indigo-950 text-indigo-100" : "bg-indigo-100 text-indigo-800"
                      )}>
                        Kazanç
                      </th>
                      <th colSpan={2} className={cn(
                        "p-2 text-center font-medium text-xs uppercase",
                        isDarkMode ? "bg-purple-950 text-purple-100" : "bg-purple-100 text-purple-800"
                      )}>
                        Çalışan Primleri
                      </th>
                      <th colSpan={2} className={cn(
                        "p-2 text-center font-medium text-xs uppercase",
                        isDarkMode ? "bg-rose-950 text-rose-100" : "bg-rose-100 text-rose-800"
                      )}>
                        Vergi Matrahı
                      </th>
                      <th colSpan={3} className={cn(
                        "p-2 text-center font-medium text-xs uppercase",
                        isDarkMode ? "bg-amber-950 text-amber-100" : "bg-amber-100 text-amber-800"
                      )}>
                        Gelir Vergisi
                      </th>
                      <th colSpan={3} className={cn(
                        "p-2 text-center font-medium text-xs uppercase",
                        isDarkMode ? "bg-teal-950 text-teal-100" : "bg-teal-100 text-teal-800"
                      )}>
                        Damga Vergisi
                      </th>
                      <th colSpan={1} className={cn(
                        "p-2 text-center font-medium text-xs uppercase",
                        isDarkMode ? "bg-emerald-950 text-emerald-100" : "bg-emerald-100 text-emerald-800"
                      )}>
                        Sonuç
                      </th>
                      {iseGostergeMaliyeti && (
                        <th colSpan={3} className={cn(
                          "p-2 text-center font-medium text-xs uppercase rounded-tr-md",
                          isDarkMode ? "bg-cyan-950 text-cyan-100" : "bg-cyan-100 text-cyan-800"
                        )}>
                          İşveren Maliyeti
                        </th>
                      )}
                    </tr>
                    <tr className={cn(
                      isDarkMode ? "text-gray-200" : "text-gray-700"
                    )}>
                      <th className={cn(
                        "border-b p-2 text-left font-medium uppercase sticky left-0 z-10 border-l border-t rounded-tl-md",
                        isDarkMode ? "bg-sky-950/80" : "bg-blue-50"
                      )}>AY</th>
                      <th className={cn(
                        "border-b p-2 text-right font-medium uppercase border-t",
                        isDarkMode ? "bg-indigo-950/80" : "bg-indigo-50"
                      )}>BRÜT</th>
                      <th className={cn(
                        "border-b p-2 text-right font-medium uppercase border-t",
                        isDarkMode ? "bg-purple-950/80" : "bg-purple-50"
                      )}>SGK İŞÇİ</th>
                      <th className={cn(
                        "border-b p-2 text-right font-medium uppercase border-t",
                        isDarkMode ? "bg-purple-950/80" : "bg-purple-50"
                      )}>İŞSİZLİK İŞÇİ</th>
                      <th className={cn(
                        "border-b p-2 text-right font-medium uppercase border-t",
                        isDarkMode ? "bg-rose-950/80" : "bg-rose-50"
                      )}>GELİR VERGİSİ MATRAHI</th>
                      <th className={cn(
                        "border-b p-2 text-right font-medium uppercase border-t",
                        isDarkMode ? "bg-rose-950/80" : "bg-rose-50"
                      )}>KÜM. VERGİ MATRAHI</th>
                      <th className={cn(
                        "border-b p-2 text-right font-medium uppercase border-t",
                        isDarkMode ? "bg-amber-950/80" : "bg-amber-50"
                      )}>HESAPLANAN G.V.</th>
                      <th className={cn(
                        "border-b p-2 text-right font-medium uppercase border-t",
                        isDarkMode ? "bg-amber-950/80" : "bg-amber-50"
                      )}>G.V. İSTİSNASI</th>
                      <th className={cn(
                        "border-b p-2 text-right font-medium uppercase border-t",
                        isDarkMode ? "bg-amber-950/80" : "bg-amber-50"
                      )}>KESİLECEK G.V.</th>
                      <th className={cn(
                        "border-b p-2 text-right font-medium uppercase border-t",
                        isDarkMode ? "bg-teal-950/80" : "bg-teal-50"
                      )}>DAMGA VERGİSİ</th>
                      <th className={cn(
                        "border-b p-2 text-right font-medium uppercase border-t",
                        isDarkMode ? "bg-teal-950/80" : "bg-teal-50"
                      )}>D.V. İSTİSNASI</th>
                      <th className={cn(
                        "border-b p-2 text-right font-medium uppercase border-t",
                        isDarkMode ? "bg-teal-950/80" : "bg-teal-50"
                      )}>KESİLECEK D.V.</th>
                      <th className={cn(
                        "border-b p-2 text-right font-medium uppercase sticky right-0 z-10 border-t",
                        isDarkMode ? "bg-emerald-950/80" : "bg-emerald-50"
                      )}>NET ÜCRET</th>
                      {iseGostergeMaliyeti && (
                        <>
                          <th className={cn(
                            "border-b p-2 text-right font-medium uppercase border-t",
                            isDarkMode ? "bg-cyan-950/80" : "bg-cyan-50"
                          )}>SGK İŞVEREN</th>
                          <th className={cn(
                            "border-b p-2 text-right font-medium uppercase border-t",
                            isDarkMode ? "bg-cyan-950/80" : "bg-cyan-50"
                          )}>İŞSZ. İŞVEREN</th>
                          <th className={cn(
                            "border-b p-2 text-right font-medium uppercase border-t border-r rounded-tr-md",
                            isDarkMode ? "bg-cyan-950/80" : "bg-cyan-50"
                          )}>TOPLAM MALİYET</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {AYLAR.map((ay, index) => (
                      <tr 
                        key={ay} 
                        className={cn(
                          index === AYLAR.length - 1 && "font-medium",
                          isDarkMode && "text-gray-200"
                        )}
                      >
                        <td className={cn(
                          "border-b p-2 sticky left-0 z-10 border-l",
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "bg-sky-900/70 font-semibold" : "bg-blue-100/70 font-semibold")
                            : isDarkMode 
                              ? "bg-sky-950/80" 
                              : "bg-blue-50/80",
                          index === AYLAR.length - 1 && "rounded-bl-md"
                        )}>
                          {ay}
                        </td>
                        <td className={cn(
                          "border-b p-2 text-right",
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "bg-indigo-900/50" : "bg-indigo-100/70")
                            : isDarkMode 
                              ? "bg-indigo-950/40 hover:bg-indigo-900/30" 
                              : "bg-indigo-50/80 hover:bg-indigo-100/50"
                        )}>
                          {sonuclar && formatNumber(sonuclar[index]?.brut || 0)}
                        </td>
                        <td className={cn(
                          "border-b p-2 text-right",
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "bg-purple-900/50" : "bg-purple-100/70")
                            : isDarkMode 
                              ? "bg-purple-950/40 hover:bg-purple-900/30" 
                              : "bg-purple-50/80 hover:bg-purple-100/50"
                        )}>
                          {sonuclar && formatNumber(sonuclar[index]?.sgkIsci || 0)}
                        </td>
                        <td className={cn(
                          "border-b p-2 text-right",
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "bg-purple-900/50" : "bg-purple-100/70")
                            : isDarkMode 
                              ? "bg-purple-950/40 hover:bg-purple-900/30" 
                              : "bg-purple-50/80 hover:bg-purple-100/50"
                        )}>
                          {sonuclar && formatNumber(sonuclar[index]?.issizlikIsci || 0)}
                        </td>
                        <td className={cn(
                          "border-b p-2 text-right",
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "bg-rose-900/50" : "bg-rose-100/70")
                            : isDarkMode 
                              ? "bg-rose-950/40 hover:bg-rose-900/30" 
                              : "bg-rose-50/80 hover:bg-rose-100/50"
                        )}>
                          {sonuclar && formatNumber(sonuclar[index]?.gelirVergisiMatrahi || 0)}
                        </td>
                        <td className={cn(
                          "border-b p-2 text-right",
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "bg-rose-900/50" : "bg-rose-100/70")
                            : isDarkMode 
                              ? "bg-rose-950/40 hover:bg-rose-900/30" 
                              : "bg-rose-50/80 hover:bg-rose-100/50"
                        )}>
                          {sonuclar && formatNumber(sonuclar[index]?.kumulatifVergiMatrahi || 0)}
                        </td>
                        <td className={cn(
                          "border-b p-2 text-right",
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "bg-amber-900/50" : "bg-amber-100/70")
                            : isDarkMode 
                              ? "bg-amber-950/40 hover:bg-amber-900/30" 
                              : "bg-amber-50/80 hover:bg-amber-100/50"
                        )}>
                          {sonuclar && formatNumber(sonuclar[index]?.aylikGelirVergisi || 0)}
                        </td>
                        <td className={cn(
                          "border-b p-2 text-right",
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "bg-amber-900/50" : "bg-amber-100/70")
                            : isDarkMode 
                              ? "bg-amber-950/40 hover:bg-amber-900/30" 
                              : "bg-amber-50/80 hover:bg-amber-100/50"
                        )}>
                          {sonuclar && formatNumber(sonuclar[index]?.asgariUcretGelirVergisiIstisnasi || 0)}
                        </td>
                        <td className={cn(
                          "border-b p-2 text-right",
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "bg-amber-900/50" : "bg-amber-100/70")
                            : isDarkMode 
                              ? "bg-amber-950/40 hover:bg-amber-900/30" 
                              : "bg-amber-50/80 hover:bg-amber-100/50"
                        )}>
                          {sonuclar && formatNumber(sonuclar[index]?.kesilecekGelirVergisi || 0)}
                        </td>
                        <td className={cn(
                          "border-b p-2 text-right",
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "bg-teal-900/50" : "bg-teal-100/70")
                            : isDarkMode 
                              ? "bg-teal-950/40 hover:bg-teal-900/30" 
                              : "bg-teal-50/80 hover:bg-teal-100/50"
                        )}>
                          {sonuclar && formatNumber(sonuclar[index]?.damgaVergisi || 0)}
                        </td>
                        <td className={cn(
                          "border-b p-2 text-right",
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "bg-teal-900/50" : "bg-teal-100/70")
                            : isDarkMode 
                              ? "bg-teal-950/40 hover:bg-teal-900/30" 
                              : "bg-teal-50/80 hover:bg-teal-100/50"
                        )}>
                          {sonuclar && formatNumber(sonuclar[index]?.asgariUcretDamgaVergisiIstisnasi || 0)}
                        </td>
                        <td className={cn(
                          "border-b p-2 text-right",
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "bg-teal-900/50" : "bg-teal-100/70")
                            : isDarkMode 
                              ? "bg-teal-950/40 hover:bg-teal-900/30" 
                              : "bg-teal-50/80 hover:bg-teal-100/50"
                        )}>
                          {sonuclar && formatNumber(sonuclar[index]?.kesilecekDamgaVergisi || 0)}
                        </td>
                        <td className={cn(
                          "border-b p-2 text-right sticky right-0 z-10",
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "bg-emerald-900/70 font-bold" : "bg-emerald-100 font-bold")
                            : isDarkMode 
                              ? "bg-emerald-950/80 hover:bg-emerald-900/40" 
                              : "bg-emerald-50/80 hover:bg-emerald-100/50"
                        )}>
                          {sonuclar && formatNumber(sonuclar[index]?.net || 0)}
                        </td>
                        {iseGostergeMaliyeti && (
                          <>
                            <td className={cn(
                              "border-b p-2 text-right",
                              index === AYLAR.length - 1 
                                ? (isDarkMode ? "bg-cyan-900/50" : "bg-cyan-100/70")
                                : isDarkMode 
                                  ? "bg-cyan-950/40 hover:bg-cyan-900/30" 
                                  : "bg-cyan-50/80 hover:bg-cyan-100/50"
                            )}>
                              {sonuclar && formatNumber(sonuclar[index]?.sgkIsveren || 0)}
                            </td>
                            <td className={cn(
                              "border-b p-2 text-right",
                              index === AYLAR.length - 1 
                                ? (isDarkMode ? "bg-cyan-900/50" : "bg-cyan-100/70")
                                : isDarkMode 
                                  ? "bg-cyan-950/40 hover:bg-cyan-900/30" 
                                  : "bg-cyan-50/80 hover:bg-cyan-100/50"
                            )}>
                              {sonuclar && formatNumber(sonuclar[index]?.issizlikIsveren || 0)}
                            </td>
                            <td className={cn(
                              "border-b p-2 text-right border-r",
                              index === AYLAR.length - 1 
                                ? (isDarkMode ? "bg-cyan-900/50" : "bg-cyan-100/70")
                                : isDarkMode 
                                  ? "bg-cyan-950/40 hover:bg-cyan-900/30" 
                                  : "bg-cyan-50/80 hover:bg-cyan-100/50",
                              index === AYLAR.length - 1 && "rounded-br-md"
                            )}>
                              {sonuclar && formatNumber(sonuclar[index]?.toplamMaliyet || 0)}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 mx-2">
                <div className={cn(
                  "p-3 rounded-md border flex flex-col",
                  isDarkMode ? "bg-sky-950/60 border-sky-800" : "bg-blue-50 border-blue-100"
                )}>
                  <div className="flex items-center mb-2">
                    <Info className={cn("h-4 w-4 mr-2", isDarkMode ? "text-sky-400" : "text-blue-500")} />
                    <p className={cn(
                      "text-xs font-medium",
                      isDarkMode ? "text-gray-200" : "text-slate-700"
                    )}>
                      Tablonun Renk Kodları
                    </p>
                  </div>
                  <div className={cn(
                    "text-xs space-y-1",
                    isDarkMode ? "text-gray-300" : "text-slate-600"
                  )}>
                    <div className="grid grid-cols-2 gap-1">
                      <p className="flex items-center">
                        <span className={cn("w-3 h-3 rounded-sm mr-1 inline-block", isDarkMode ? "bg-indigo-950" : "bg-indigo-100")}></span>
                        <span>Kazanç Bilgileri</span>
                      </p>
                      <p className="flex items-center">
                        <span className={cn("w-3 h-3 rounded-sm mr-1 inline-block", isDarkMode ? "bg-purple-950" : "bg-purple-100")}></span>
                        <span>Çalışan Primleri</span>
                      </p>
                      <p className="flex items-center">
                        <span className={cn("w-3 h-3 rounded-sm mr-1 inline-block", isDarkMode ? "bg-rose-950" : "bg-rose-100")}></span>
                        <span>Vergi Matrahı</span>
                      </p>
                      <p className="flex items-center">
                        <span className={cn("w-3 h-3 rounded-sm mr-1 inline-block", isDarkMode ? "bg-amber-950" : "bg-amber-100")}></span>
                        <span>Gelir Vergisi</span>
                      </p>
                      <p className="flex items-center">
                        <span className={cn("w-3 h-3 rounded-sm mr-1 inline-block", isDarkMode ? "bg-teal-950" : "bg-teal-100")}></span>
                        <span>Damga Vergisi</span>
                      </p>
                      <p className="flex items-center">
                        <span className={cn("w-3 h-3 rounded-sm mr-1 inline-block", isDarkMode ? "bg-emerald-950" : "bg-emerald-100")}></span>
                        <span>Net Ücret</span>
                      </p>
                      {iseGostergeMaliyeti && (
                        <p className="flex items-center">
                          <span className={cn("w-3 h-3 rounded-sm mr-1 inline-block", isDarkMode ? "bg-cyan-950" : "bg-cyan-100")}></span>
                          <span>İşveren Maliyeti</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className={cn(
                  "p-3 rounded-md border",
                  isDarkMode ? "bg-sky-950/60 border-sky-800" : "bg-blue-50 border-blue-100"
                )}>
                  <div className="flex items-center mb-2">
                    <Info className={cn("h-4 w-4 mr-2", isDarkMode ? "text-sky-400" : "text-blue-500")} />
                    <p className={cn(
                      "text-xs font-medium",
                      isDarkMode ? "text-gray-200" : "text-slate-700"
                    )}>
                      Maaş Hesaplama Bilgileri
                    </p>
                  </div>
                  <div className={cn(
                    "text-xs space-y-1",
                    isDarkMode ? "text-gray-300" : "text-slate-600"
                  )}>
                    <p>• Maaş hesaplamalarında para birimi TL olarak esas alınmaktadır.</p>
                    <p>• Hesaplamalar güncel vergi ve SGK kesinti oranlarına göredir.</p>
                    <p>• Rakam asgari ücretin altında olduğunda hesaplama yapılmaz.</p>
                    <p>• 2022 yılı ve sonrası için AGİ hesaplanmaz.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BordroHesaplama;