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

            {/* SGK İndirimleri */}
            <div className="w-full md:w-1/4">
              <div className="flex items-center mb-2">
                <Label className={cn(
                  "text-sm font-medium block",
                  isDarkMode && "text-white"
                )}>Hesaplama Seçenekleri</Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox 
                  id="iseGostergeMaliyeti" 
                  checked={iseGostergeMaliyeti}
                  onCheckedChange={(checked) => setIseGostergeMaliyeti(checked === true)}
                  className={cn(
                    isDarkMode && "text-sky-500 border-sky-700 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white"
                  )}
                />
                <Label 
                  htmlFor="iseGostergeMaliyeti" 
                  className={cn(
                    "text-sm",
                    isDarkMode && "text-gray-300"
                  )}
                >
                  İşveren maliyetini göster
                </Label>
              </div>
              <div className="flex items-center space-x-2 ml-2">
                <Checkbox 
                  id="sgkIndirim5" 
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
                  htmlFor="sgkIndirim5" 
                  className={cn(
                    "text-sm cursor-pointer",
                    isDarkMode && "text-gray-300"
                  )}
                >
                  5 puanlık indirim
                </Label>
              </div>
              <div className="flex items-center space-x-2 ml-2">
                <Checkbox 
                  id="sgkIndirim4" 
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
                  htmlFor="sgkIndirim4" 
                  className={cn(
                    "text-sm cursor-pointer",
                    isDarkMode && "text-gray-300"
                  )}
                >
                  4 puanlık indirim
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <table className="w-full text-xs min-w-[1800px]">
                  <thead>
                    <tr className={cn(
                      isDarkMode ? "bg-sky-950/60 text-gray-200" : "bg-muted/50"
                    )}>
                      <th className="border-b p-2 text-left font-medium uppercase sticky left-0 z-10">AY</th>
                      <th className="border-b p-2 text-right font-medium uppercase">BRÜT</th>
                      <th className="border-b p-2 text-right font-medium uppercase">SGK İŞÇİ</th>
                      <th className="border-b p-2 text-right font-medium uppercase">İŞSİZLİK İŞÇİ</th>
                      <th className="border-b p-2 text-right font-medium uppercase">GELİR VERGİSİ MATRAHI</th>
                      <th className="border-b p-2 text-right font-medium uppercase">KÜMÜLATİF VERGİ MATRAHI</th>
                      <th className="border-b p-2 text-right font-medium uppercase">HESAPLANAN GELİR VERGİSİ</th>
                      <th className="border-b p-2 text-right font-medium uppercase">GELİR VERGİSİ İSTİSNASI</th>
                      <th className="border-b p-2 text-right font-medium uppercase">KESİLECEK GELİR VERGİSİ</th>
                      <th className="border-b p-2 text-right font-medium uppercase">DAMGA VERGİSİ</th>
                      <th className="border-b p-2 text-right font-medium uppercase">DAMGA VERGİSİ İSTİSNASI</th>
                      <th className="border-b p-2 text-right font-medium uppercase">KESİLECEK DAMGA VERGİSİ</th>
                      <th className="border-b p-2 text-right font-medium uppercase sticky right-0 z-10">NET ÜCRET</th>
                      {iseGostergeMaliyeti && (
                        <>
                          <th className="border-b p-2 text-right font-medium uppercase">SGK İŞVEREN</th>
                          <th className="border-b p-2 text-right font-medium uppercase">SGK İŞSİZLİK İŞVEREN</th>
                          <th className="border-b p-2 text-right font-medium uppercase">TOPLAM MALİYET</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {AYLAR.map((ay, index) => (
                      <tr 
                        key={ay} 
                        className={cn(
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "font-medium bg-sky-900/30 text-white" : "font-medium bg-blue-50")
                            : isDarkMode 
                              ? "hover:bg-sky-900/20" 
                              : index % 2 === 0 
                                ? "bg-white hover:bg-gray-50" 
                                : "bg-gray-50 hover:bg-gray-100",
                          isDarkMode && "text-gray-200"
                        )}
                      >
                        <td className={cn(
                          "border-b p-2 sticky left-0 z-10",
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "bg-sky-900/30 font-semibold" : "bg-blue-50 font-semibold")
                            : isDarkMode 
                              ? "bg-sky-950/80" 
                              : index % 2 === 0 
                                ? "bg-white" 
                                : "bg-gray-50"
                        )}>
                          {ay}
                        </td>
                        <td className="border-b p-2 text-right">
                          {sonuclar && formatNumber(sonuclar[index]?.brut || 0)}
                        </td>
                        <td className="border-b p-2 text-right">
                          {sonuclar && formatNumber(sonuclar[index]?.sgkIsci || 0)}
                        </td>
                        <td className="border-b p-2 text-right">
                          {sonuclar && formatNumber(sonuclar[index]?.issizlikIsci || 0)}
                        </td>
                        <td className="border-b p-2 text-right">
                          {sonuclar && formatNumber(sonuclar[index]?.gelirVergisiMatrahi || 0)}
                        </td>
                        <td className="border-b p-2 text-right">
                          {sonuclar && formatNumber(sonuclar[index]?.kumulatifVergiMatrahi || 0)}
                        </td>
                        <td className="border-b p-2 text-right">
                          {sonuclar && formatNumber(sonuclar[index]?.aylikGelirVergisi || 0)}
                        </td>
                        <td className="border-b p-2 text-right">
                          {sonuclar && formatNumber(sonuclar[index]?.asgariUcretGelirVergisiIstisnasi || 0)}
                        </td>
                        <td className="border-b p-2 text-right">
                          {sonuclar && formatNumber(sonuclar[index]?.kesilecekGelirVergisi || 0)}
                        </td>
                        <td className="border-b p-2 text-right">
                          {sonuclar && formatNumber(sonuclar[index]?.damgaVergisi || 0)}
                        </td>
                        <td className="border-b p-2 text-right">
                          {sonuclar && formatNumber(sonuclar[index]?.asgariUcretDamgaVergisiIstisnasi || 0)}
                        </td>
                        <td className="border-b p-2 text-right">
                          {sonuclar && formatNumber(sonuclar[index]?.kesilecekDamgaVergisi || 0)}
                        </td>
                        <td className={cn(
                          "border-b p-2 text-right sticky right-0 z-10",
                          index === AYLAR.length - 1 
                            ? (isDarkMode ? "bg-sky-900/30 font-bold" : "bg-blue-50 font-bold")
                            : isDarkMode 
                              ? "bg-sky-950/80" 
                              : index % 2 === 0 
                                ? "bg-white" 
                                : "bg-gray-50"
                        )}>
                          {sonuclar && formatNumber(sonuclar[index]?.net || 0)}
                        </td>
                        {iseGostergeMaliyeti && (
                          <>
                            <td className="border-b p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.sgkIsveren || 0)}
                            </td>
                            <td className="border-b p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.issizlikIsveren || 0)}
                            </td>
                            <td className="border-b p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.toplamMaliyet || 0)}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={cn(
                "flex items-center mt-4 p-4 rounded-md border mx-2",
                isDarkMode ? "bg-sky-950/60 border-sky-800" : "bg-blue-50 border-blue-100"
              )}>
                <Info className={cn(
                  "h-5 w-5 mr-2 shrink-0",
                  isDarkMode ? "text-sky-400" : "text-blue-500"
                )} />
                <div className={cn(
                  "text-xs space-y-1",
                  isDarkMode ? "text-gray-300" : "text-slate-600"
                )}>
                  <p>1. Yapılan maaş hesaplamalarında para birimi TL ve takip eden yıllarda TL değerleri esas alınmaktadır.</p>
                  <p>2. Yapılan maaş hesaplamaları ile ilgili olarak kesin bordro işlemleri öncesi uzman veya danışman bilgisine başvurulması tavsiye olunur.</p>
                  <p>3. Rakam asgari ücretin altında olduğunda hesaplama yapılmaz.</p>
                  <p>4. 2022 Yıl ve sonrası için AGİ hesaplanmaz.</p>
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