import React, { useState, useEffect, useCallback } from 'react';
import { Calculator, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils";

// Sabit Değerler
const RATES = {
  SSK: {
    NORMAL: 0.14, // Normal çalışan SGK kesinti oranı (%14)
    EMEKLI: 0.075, // Emekli çalışan SGK kesinti oranı (%7.5)
    TAVAN: 195041.40 // 2024 SGK tavan ücreti
  },
  ISSIZLIK: {
    NORMAL: 0.01, // Normal çalışan işsizlik kesinti oranı (%1)
    EMEKLI: 0 // Emekli çalışan işsizlik kesinti oranı (%0)
  },
  GELIR_VERGISI: {
    DILIM_1: { ORAN: 0.15, TAVAN: 165000 },
    DILIM_2: { ORAN: 0.20, TAVAN: 330000 },
    DILIM_3: { ORAN: 0.27, TAVAN: 1200000 },
    DILIM_4: { ORAN: 0.35, TAVAN: 4300000 },
    DILIM_5: { ORAN: 0.40, TAVAN: Infinity }
  },
  DAMGA: 0.00759, // Damga vergisi oranı (%0.759)
  ISVEREN_SGK_NORMAL: 0.155, // %5 indirimli oran, TODO: Dinamik veya seçenekli olmalı
  ISVEREN_SGK_EMEKLI: 0.2475, // TODO: Doğrula
  ISVEREN_ISSIZLIK_NORMAL: 0.02,
  ISVEREN_ISSIZLIK_EMEKLI: 0,
  BES_ORAN: 0.03 // Otomatik katılım oranı
} as const;

// İstisnalar
const EXCEPTIONS = {
  INCOME_TAX: 3315.7,  // Gelir vergisi istisnası
  STAMP_TAX: 197.38    // Damga vergisi istisnası
} as const;

// TODO: Bu istisnaları ve limitleri yıla göre dinamik hale getir
const ISTISNALAR_LIMITLER_2024 = {
  GELIR_VERGISI_ISTISNASI_AYLIK: 2943.00, // 2024 Asgari Ücret Gelir Vergisi İstisnası
  DAMGA_VERGISI_ISTISNASI_AYLIK: 151.82,  // 2024 Asgari Ücret Damga Vergisi İstisnası
  YEMEK_ISTISNASI_GUNLUK: 170.00,        // 2024 Nakit dışı yemek bedeli GV istisnası (KDV Hariç)
  YOL_ISTISNASI_GUNLUK: 88.00,           // 2024 Nakit dışı yol yardımı GV istisnası
  SGK_YEMEK_ISTISNASI_GUNLUK: 157.69,    // 2024 Yemek parası SGK istisnası
  ENGELLILIK_INDIRIMI_AYLIK: {          // 2024 Aylık Engellilik İndirim Tutarları
    '1': 6900,
    '2': 4000,
    '3': 1700,
  }
} as const;

// Akıllı formatlama fonksiyonu
const smartFormat = (input: string): string => {
  if (!input) return "0,00";

  // Inputu temizle (sadece rakamları al)
  const cleanedInput = input.replace(/[^\d]/g, '');

  // Sayıya çevir ve 100'e böl (son iki hane kuruş olarak)
  const number = parseFloat(cleanedInput) / 100;

  // Türkçe formatta göster
  return number.toLocaleString('tr-TR', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  });
};

// Parse Turkish formatted currency to number
const parseTurkishCurrency = (value: string): number => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/[^\d]/g, '');
  // Convert to number and divide by 100 (because input is treated as kuruş)
  return parseFloat(numericValue) / 100 || 0;
};

interface AylikSonuc extends BordroSonuc {
  ay: number;
  kumulatifGV: number;
  gv1: number;
  gv2: number;
  gv3: number;
  gv4: number;
  gv5: number;
  gelirVergisiIstisnasi: number;
  damgaVergisiIstisnasi: number;
  engellilikIndirimi: number;
  besKesintisi: number;
  yemekBrut: number;
  yolBrut: number;
  primBrut: number;
  toplamBrut: number;
}

interface BordroSonuc {
  brut: number;
  net: number;
  sgkMatrahi: number;
  sgkIsci: number;
  issizlikIsci: number;
  gvMatrahi: number;
  kumulatifVergiMatrahi: number;
  gelirVergisi: number;
  damgaVergisi: number;
  sskIsveren: number;
  issizlikIsveren: number;
  toplamMaliyet: number;
  gelirVergisiIstisnasi: number;
  damgaVergisiIstisnasi: number;
  engellilikIndirimi: number;
  besKesintisi: number;
  yemekBrut: number;
  yolBrut: number;
  primBrut: number;
  toplamBrut: number;
}

// Engellilik derecesi tipi
type EngellilikDerecesi = 'yok' | '1' | '2' | '3';
// Yardım tipi
type YardimTipi = 'yok' | 'nakdi' | 'ayni';
// Maaş Tipi
type MaasTipi = 'aylik' | 'gunluk';

interface BordroHesaplamaProps {
  isDarkMode: boolean;
}

const BordroHesaplama = ({ isDarkMode }: BordroHesaplamaProps) => {
  const [calisanTipi, setCalisanTipi] = useState<'normal' | 'emekli'>('normal');
  const [temelUcret, setTemelUcret] = useState<string>('');
  const [aylikSonuclar, setAylikSonuclar] = useState<AylikSonuc[]>([]);
  const [loading, setLoading] = useState(false);
  const [maasTipi, setMaasTipi] = useState<MaasTipi>('aylik');
  const [normalGun, setNormalGun] = useState<string>('22');
  const [haftaTatiliGun, setHaftaTatiliGun] = useState<string>('8');
  const [yemekGunlukTutar, setYemekGunlukTutar] = useState<string>('');
  const [yolGunlukTutar, setYolGunlukTutar] = useState<string>('');
  const [engellilikDerecesi, setEngellilikDerecesi] = useState<EngellilikDerecesi>('yok');
  const [yemekYardimiTipi, setYemekYardimiTipi] = useState<YardimTipi>('yok');
  const [yolYardimiTipi, setYolYardimiTipi] = useState<YardimTipi>('yok');
  const [primVarMi, setPrimVarMi] = useState<boolean>(false);
  const [primTutari, setPrimTutari] = useState<string>('');
  const [besVarMi, setBesVarMi] = useState<boolean>(false);
  const [hesaplamaYili] = useState<number>(2024);

  const hesaplaAylikBordro = useCallback((
    ay: number,
    oncekiKumulatifMatrah: number
  ): AylikSonuc => {
    const placeholderResult: AylikSonuc = {
      ay,
      brut: parseTurkishCurrency(temelUcret),
      net: 0,
      sgkMatrahi: 0,
      sgkIsci: 0,
      issizlikIsci: 0,
      gvMatrahi: 0,
      kumulatifVergiMatrahi: 0,
      gelirVergisi: 0,
      damgaVergisi: 0,
      sskIsveren: 0,
      issizlikIsveren: 0,
      toplamMaliyet: 0,
      kumulatifGV: oncekiKumulatifMatrah,
      gv1: 0, gv2: 0, gv3: 0, gv4: 0, gv5: 0,
      gelirVergisiIstisnasi: 0,
      damgaVergisiIstisnasi: 0,
      engellilikIndirimi: 0,
      besKesintisi: 0,
      yemekBrut: 0,
      yolBrut: 0,
      primBrut: 0,
      toplamBrut: 0,
    };
    console.log("Hesaplama yapılacak state'ler:", {
      calisanTipi, maasTipi, temelUcret, normalGun, haftaTatiliGun,
      yemekGunlukTutar, yolGunlukTutar, engellilikDerecesi, yemekYardimiTipi,
      yolYardimiTipi, primVarMi, primTutari, besVarMi, hesaplamaYili
    });

    let aylikTemelBrut = 0;
    const gunlukUcret = maasTipi === 'gunluk' ? parseTurkishCurrency(temelUcret) : 0;
    const aylikUcret = maasTipi === 'aylik' ? parseTurkishCurrency(temelUcret) : 0;
    const calisilanGun = parseInt(normalGun) || 0;
    const toplamGun = calisilanGun + (parseInt(haftaTatiliGun) || 0);

    if (maasTipi === 'gunluk') {
      aylikTemelBrut = gunlukUcret * toplamGun;
    } else {
      aylikTemelBrut = aylikUcret;
    }
    placeholderResult.brut = aylikTemelBrut;

    const gunlukYemekBrut = yemekYardimiTipi !== 'yok' ? parseTurkishCurrency(yemekGunlukTutar) : 0;
    const gunlukYolBrut = yolYardimiTipi !== 'yok' ? parseTurkishCurrency(yolGunlukTutar) : 0;

    placeholderResult.yemekBrut = gunlukYemekBrut * calisilanGun;
    placeholderResult.yolBrut = gunlukYolBrut * calisilanGun;

    placeholderResult.primBrut = primVarMi ? parseTurkishCurrency(primTutari) : 0;

    placeholderResult.toplamBrut = placeholderResult.brut + placeholderResult.yemekBrut + placeholderResult.yolBrut + placeholderResult.primBrut;

    placeholderResult.sgkMatrahi = Math.min(placeholderResult.toplamBrut, RATES.SSK.TAVAN);

    const sgkOrani = calisanTipi === 'normal' ? RATES.SSK.NORMAL : RATES.SSK.EMEKLI;
    const issizlikOrani = calisanTipi === 'normal' ? RATES.ISSIZLIK.NORMAL : RATES.ISSIZLIK.EMEKLI;
    placeholderResult.sgkIsci = placeholderResult.sgkMatrahi * sgkOrani;
    placeholderResult.issizlikIsci = placeholderResult.sgkMatrahi * issizlikOrani;

    placeholderResult.gvMatrahi = placeholderResult.toplamBrut - placeholderResult.sgkIsci - placeholderResult.issizlikIsci;

    placeholderResult.gelirVergisiIstisnasi = ISTISNALAR_LIMITLER_2024.GELIR_VERGISI_ISTISNASI_AYLIK;
    placeholderResult.damgaVergisiIstisnasi = ISTISNALAR_LIMITLER_2024.DAMGA_VERGISI_ISTISNASI_AYLIK;

    placeholderResult.engellilikIndirimi = engellilikDerecesi !== 'yok' ? ISTISNALAR_LIMITLER_2024.ENGELLILIK_INDIRIMI_AYLIK[engellilikDerecesi] : 0;
    placeholderResult.gvMatrahi -= placeholderResult.engellilikIndirimi;

    placeholderResult.kumulatifVergiMatrahi = oncekiKumulatifMatrah + Math.max(0, placeholderResult.gvMatrahi);
    const gvHesapSonucu = hesaplaGelirVergisiDetayli(Math.max(0, placeholderResult.gvMatrahi), oncekiKumulatifMatrah);
    placeholderResult.gelirVergisi = Math.max(0, gvHesapSonucu.toplamVergi - placeholderResult.gelirVergisiIstisnasi);
    placeholderResult.gv1 = gvHesapSonucu.dilimler.gv1;
    placeholderResult.gv2 = gvHesapSonucu.dilimler.gv2;
    placeholderResult.gv3 = gvHesapSonucu.dilimler.gv3;
    placeholderResult.gv4 = gvHesapSonucu.dilimler.gv4;
    placeholderResult.gv5 = gvHesapSonucu.dilimler.gv5;

    const hesaplananDamgaVergisi = placeholderResult.toplamBrut * RATES.DAMGA;
    placeholderResult.damgaVergisi = Math.max(0, hesaplananDamgaVergisi - placeholderResult.damgaVergisiIstisnasi);

    placeholderResult.besKesintisi = besVarMi ? placeholderResult.sgkMatrahi * RATES.BES_ORAN : 0;

    placeholderResult.net = placeholderResult.toplamBrut
                          - placeholderResult.sgkIsci
                          - placeholderResult.issizlikIsci
                          - placeholderResult.gelirVergisi
                          - placeholderResult.damgaVergisi
                          - placeholderResult.besKesintisi;

    const sskIsverenOrani = calisanTipi === 'normal' ? RATES.ISVEREN_SGK_NORMAL : RATES.ISVEREN_SGK_EMEKLI;
    const issizlikIsverenOrani = calisanTipi === 'normal' ? RATES.ISVEREN_ISSIZLIK_NORMAL : RATES.ISVEREN_ISSIZLIK_EMEKLI;
    placeholderResult.sskIsveren = placeholderResult.sgkMatrahi * sskIsverenOrani;
    placeholderResult.issizlikIsveren = placeholderResult.sgkMatrahi * issizlikIsverenOrani;

    placeholderResult.toplamMaliyet = placeholderResult.toplamBrut + placeholderResult.sskIsveren + placeholderResult.issizlikIsveren;

    return placeholderResult;

  }, [
    calisanTipi, maasTipi, temelUcret, normalGun, haftaTatiliGun,
    yemekGunlukTutar, yolGunlukTutar, engellilikDerecesi, yemekYardimiTipi,
    yolYardimiTipi, primVarMi, primTutari, besVarMi, hesaplamaYili
  ]);

  const hesaplaGelirVergisiDetayli = (matrah: number, kumulatifMatrah: number): {
    toplamVergi: number;
    dilimler: { gv1: number; gv2: number; gv3: number; gv4: number; gv5: number };
  } => {
    const dilimler = { gv1: 0, gv2: 0, gv3: 0, gv4: 0, gv5: 0 };
    let kalanMatrah = Math.max(0, matrah);
    const toplamMatrah = kalanMatrah + kumulatifMatrah;

    const gv = RATES.GELIR_VERGISI;

    const dilim1UstSinir = gv.DILIM_1.TAVAN;
    const vergiDilim1 = Math.max(0, Math.min(kalanMatrah, dilim1UstSinir - kumulatifMatrah));
    if (vergiDilim1 > 0) {
      dilimler.gv1 = vergiDilim1 * gv.DILIM_1.ORAN;
      kalanMatrah -= vergiDilim1;
    }

    const dilim2UstSinir = gv.DILIM_2.TAVAN;
    if (kalanMatrah > 0 && toplamMatrah > dilim1UstSinir) {
      const vergiDilim2 = Math.min(kalanMatrah, dilim2UstSinir - Math.max(kumulatifMatrah, dilim1UstSinir));
      if (vergiDilim2 > 0) {
        dilimler.gv2 = vergiDilim2 * gv.DILIM_2.ORAN;
        kalanMatrah -= vergiDilim2;
      }
    }

    const dilim3UstSinir = gv.DILIM_3.TAVAN;
    if (kalanMatrah > 0 && toplamMatrah > dilim2UstSinir) {
      const vergiDilim3 = Math.min(kalanMatrah, dilim3UstSinir - Math.max(kumulatifMatrah, dilim2UstSinir));
      if (vergiDilim3 > 0) {
        dilimler.gv3 = vergiDilim3 * gv.DILIM_3.ORAN;
        kalanMatrah -= vergiDilim3;
      }
    }

    const dilim4UstSinir = gv.DILIM_4.TAVAN;
    if (kalanMatrah > 0 && toplamMatrah > dilim3UstSinir) {
      const vergiDilim4 = Math.min(kalanMatrah, dilim4UstSinir - Math.max(kumulatifMatrah, dilim3UstSinir));
      if (vergiDilim4 > 0) {
        dilimler.gv4 = vergiDilim4 * gv.DILIM_4.ORAN;
        kalanMatrah -= vergiDilim4;
      }
    }

    if (kalanMatrah > 0 && toplamMatrah > dilim4UstSinir) {
       dilimler.gv5 = kalanMatrah * gv.DILIM_5.ORAN;
    }

    const toplamVergi = dilimler.gv1 + dilimler.gv2 + dilimler.gv3 + dilimler.gv4 + dilimler.gv5;
    return { toplamVergi, dilimler };
  };

  const hesaplaBordro = useCallback(() => {
    if (!temelUcret || parseTurkishCurrency(temelUcret) <= 0) {
        setAylikSonuclar([]);
        return;
    };
    setLoading(true);

    try {
      const sonuclar: AylikSonuc[] = [];
      let kumulatifMatrah = 0;

      for (let ay = 1; ay <= 12; ay++) {
        const aylikSonuc = hesaplaAylikBordro(ay, kumulatifMatrah);
        sonuclar.push(aylikSonuc);
        kumulatifMatrah = aylikSonuc.kumulatifVergiMatrahi;
      }

      setAylikSonuclar(sonuclar);
    } catch (error) {
      console.error('Hesaplama hatası:', error);
      setAylikSonuclar([]);
    } finally {
      setLoading(false);
    }
  }, [temelUcret, hesaplaAylikBordro]);

  useEffect(() => {
    if (temelUcret && parseTurkishCurrency(temelUcret) > 0) {
      hesaplaBordro();
    }
  }, [calisanTipi, maasTipi, normalGun, haftaTatiliGun, yemekGunlukTutar, yolGunlukTutar, engellilikDerecesi, yemekYardimiTipi, yolYardimiTipi, primVarMi, primTutari, besVarMi, hesaplamaYili, hesaplaBordro]);

  const handleNumericInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setter(value);
  };

  return (
    <TooltipProvider>
    <div className={cn(
      "rounded-xl shadow-lg p-6 md:p-8 backdrop-blur-sm border transition-colors",
      isDarkMode 
        ? "bg-gray-900/50 border-white/10 text-white" 
        : "bg-white border-gray-200"
    )}>
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-blue-400" />
        <h2 className={cn(
          "text-xl font-semibold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>Detaylı Bordro Hesaplama ({hesaplamaYili})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-4">
          <h3 className={cn(
            "text-lg font-medium border-b pb-2 mb-4",
            isDarkMode 
              ? "text-white/80 border-white/10" 
              : "text-gray-900 border-gray-200"
          )}>Maaş Bilgileri</h3>

          <div className="space-y-2">
            <Label className={cn(
              "text-sm font-medium",
              isDarkMode ? "text-white/70" : "text-gray-700"
            )}>Maaş Tipi</Label>
            <RadioGroup value={maasTipi} onValueChange={(value: string) => setMaasTipi(value as MaasTipi)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="aylik" id="r_aylik" />
                <Label htmlFor="r_aylik" className={cn(
                  isDarkMode ? "text-white/80" : "text-gray-700"
                )}>Aylık</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gunluk" id="r_gunluk" />
                <Label htmlFor="r_gunluk" className={cn(
                  isDarkMode ? "text-white/80" : "text-gray-700"
                )}>Günlük</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temelUcret" className={cn(
              "text-sm font-medium",
              isDarkMode ? "text-white/70" : "text-gray-700"
            )}>
              {maasTipi === 'aylik' ? 'Aylık Brüt Ücret' : 'Günlük Brüt Ücret'}
            </Label>
            <div className="relative">
              <Input
                id="temelUcret"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={temelUcret}
                onChange={(e) => setTemelUcret(smartFormat(e.target.value))}
                className={cn(
                  "w-full px-4 py-2 rounded-lg transition-all",
                  isDarkMode 
                    ? "bg-black/20 border-white/10 text-blue-400 placeholder:text-white/30 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50" 
                    : "bg-white border-gray-200 text-blue-600 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                )}
                placeholder="0,00"
              />
              <span className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2",
                isDarkMode ? "text-white/40" : "text-gray-400"
              )}>₺</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="normalGun" className={cn(
                 "text-sm font-medium",
                 isDarkMode ? "text-white/70" : "text-gray-700"
               )}>Normal Gün</Label>
               <Input
                 id="normalGun"
                 type="number"
                 value={normalGun}
                 onChange={(e) => handleNumericInputChange(setNormalGun)(e)}
                 className={cn(
                   "w-full px-4 py-2 rounded-lg transition-all",
                   isDarkMode 
                     ? "bg-black/20 border-white/10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50" 
                     : "bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                 )}
                 placeholder="22"
               />
             </div>
             <div className="space-y-2">
                <Label htmlFor="haftaTatiliGun" className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-white/70" : "text-gray-700"
                )}>Hafta Tatili</Label>
                <Input
                  id="haftaTatiliGun"
                  type="number"
                  value={haftaTatiliGun}
                  onChange={(e) => handleNumericInputChange(setHaftaTatiliGun)(e)}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg transition-all",
                    isDarkMode 
                      ? "bg-black/20 border-white/10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50" 
                      : "bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  )}
                  placeholder="8"
                />
             </div>
          </div>

           <div className="space-y-2">
            <Label className={cn(
              "text-sm font-medium",
              isDarkMode ? "text-white/70" : "text-gray-700"
            )}>Çalışan Tipi</Label>
             <RadioGroup value={calisanTipi} onValueChange={(value: string) => setCalisanTipi(value as 'normal' | 'emekli')} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="r_normal" />
                <Label htmlFor="r_normal" className={cn(
                  isDarkMode ? "text-white/80" : "text-gray-700"
                )}>Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="emekli" id="r_emekli" />
                <Label htmlFor="r_emekli" className={cn(
                  isDarkMode ? "text-white/80" : "text-gray-700"
                )}>Emekli</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className={cn(
              "text-sm font-medium",
              isDarkMode ? "text-white/70" : "text-gray-700"
            )}>Engellilik Durumu</Label>
            <Select value={engellilikDerecesi} onValueChange={(value: string) => setEngellilikDerecesi(value as EngellilikDerecesi)}>
                <SelectTrigger className={cn(
                  "w-full bg-white/5 border-white/10 text-white/80",
                  isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
                )}>
                    <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent className={cn(
                  "bg-gray-800 border-white/20 text-white",
                  isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
                )}>
                    <SelectItem value="yok">Engellilik Yok</SelectItem>
                    <SelectItem value="1">1. Derece</SelectItem>
                    <SelectItem value="2">2. Derece</SelectItem>
                    <SelectItem value="3">3. Derece</SelectItem>
                </SelectContent>
            </Select>
             {engellilikDerecesi !== 'yok' && (
               <p className={cn(
                 "text-xs",
                 isDarkMode ? "text-white/50" : "text-gray-500"
               )}>
                 Aylık İndirim: {ISTISNALAR_LIMITLER_2024.ENGELLILIK_INDIRIMI_AYLIK[engellilikDerecesi].toLocaleString('tr-TR')} ₺
               </p>
             )}
          </div>

        </div>

        <div className="space-y-4">
          <h3 className={cn(
            "text-lg font-medium border-b pb-2 mb-4",
            isDarkMode 
              ? "text-white/80 border-white/10" 
              : "text-gray-900 border-gray-200"
          )}>Yardımlar</h3>

           <div className={cn(
             "space-y-2 p-3 bg-white/5 rounded-lg border border-white/10",
             isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
           )}>
             <Label className={cn(
               "text-sm font-medium flex items-center gap-1",
               isDarkMode ? "text-white/70" : "text-gray-700"
             )}>
               Yemek Yardımı
                <Tooltip>
                  <TooltipTrigger><Info className="w-3 h-3 text-white/50"/></TooltipTrigger>
                  <TooltipContent className={cn(
                    "bg-gray-800 text-white border-white/20",
                    isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
                  )}>
                    <p className="text-xs">Ayni: Kart/Çek. Nakdi: Nakit ödeme.</p>
                    <p className="text-xs">2024 GV İstisnası (Ayni): {ISTISNALAR_LIMITLER_2024.YEMEK_ISTISNASI_GUNLUK.toLocaleString('tr-TR')} ₺/gün</p>
                     <p className="text-xs">2024 SGK İstisnası: {ISTISNALAR_LIMITLER_2024.SGK_YEMEK_ISTISNASI_GUNLUK.toLocaleString('tr-TR')} ₺/gün</p>
                  </TooltipContent>
                </Tooltip>
             </Label>
             <RadioGroup value={yemekYardimiTipi} onValueChange={(value: string) => setYemekYardimiTipi(value as YardimTipi)} className="flex gap-4 mb-2">
               <div className="flex items-center space-x-2"> <RadioGroupItem value="yok" id="y_yok"/> <Label htmlFor="y_yok" className={cn(
                 isDarkMode ? "text-white/80" : "text-gray-700"
               )}>Yok</Label> </div>
               <div className="flex items-center space-x-2"> <RadioGroupItem value="nakdi" id="y_nakdi"/> <Label htmlFor="y_nakdi" className={cn(
                 isDarkMode ? "text-white/80" : "text-gray-700"
               )}>Nakdi</Label> </div>
               <div className="flex items-center space-x-2"> <RadioGroupItem value="ayni" id="y_ayni"/> <Label htmlFor="y_ayni" className={cn(
                 isDarkMode ? "text-white/80" : "text-gray-700"
               )}>Ayni</Label> </div>
             </RadioGroup>
             {yemekYardimiTipi !== 'yok' && (
               <div className="relative">
                 <Label htmlFor="yemekGunluk" className={cn(
                   "text-xs font-medium text-white/60 mb-1 block",
                   isDarkMode ? "text-white/60" : "text-gray-600"
                 )}>Günlük Brüt Tutar</Label>
                 <Input id="yemekGunluk" type="text" inputMode="numeric" pattern="[0-9]*" value={yemekGunlukTutar} onChange={(e) => setYemekGunlukTutar(smartFormat(e.target.value))} className={cn(
                   "w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/50 text-blue-300 text-sm",
                   isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
                 )} placeholder="0,00" />
                 <span className={cn(
                   "absolute right-4 bottom-2 text-white/40 text-sm",
                   isDarkMode ? "text-white/40" : "text-gray-400"
                 )}>₺</span>
               </div>
             )}
           </div>

            <div className={cn(
              "space-y-2 p-3 bg-white/5 rounded-lg border border-white/10",
              isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
            )}>
             <Label className={cn(
               "text-sm font-medium flex items-center gap-1",
               isDarkMode ? "text-white/70" : "text-gray-700"
             )}>
               Yol Yardımı
                <Tooltip>
                  <TooltipTrigger><Info className="w-3 h-3 text-white/50"/></TooltipTrigger>
                   <TooltipContent className={cn(
                     "bg-gray-800 text-white border-white/20",
                     isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
                   )}>
                    <p className="text-xs">Ayni: Servis/Kart. Nakdi: Nakit ödeme.</p>
                    <p className="text-xs">2024 GV İstisnası (Ayni): {ISTISNALAR_LIMITLER_2024.YOL_ISTISNASI_GUNLUK.toLocaleString('tr-TR')} ₺/gün</p>
                    <p className="text-xs">SGK İstisnası Yoktur.</p>
                  </TooltipContent>
                </Tooltip>
             </Label>
             <RadioGroup value={yolYardimiTipi} onValueChange={(value: string) => setYolYardimiTipi(value as YardimTipi)} className="flex gap-4 mb-2">
               <div className="flex items-center space-x-2"> <RadioGroupItem value="yok" id="yo_yok"/> <Label htmlFor="yo_yok" className={cn(
                 isDarkMode ? "text-white/80" : "text-gray-700"
               )}>Yok</Label> </div>
               <div className="flex items-center space-x-2"> <RadioGroupItem value="nakdi" id="yo_nakdi"/> <Label htmlFor="yo_nakdi" className={cn(
                 isDarkMode ? "text-white/80" : "text-gray-700"
               )}>Nakdi</Label> </div>
               <div className="flex items-center space-x-2"> <RadioGroupItem value="ayni" id="yo_ayni"/> <Label htmlFor="yo_ayni" className={cn(
                 isDarkMode ? "text-white/80" : "text-gray-700"
               )}>Ayni</Label> </div>
             </RadioGroup>
             {yolYardimiTipi !== 'yok' && (
               <div className="relative">
                 <Label htmlFor="yolGunluk" className={cn(
                   "text-xs font-medium text-white/60 mb-1 block",
                   isDarkMode ? "text-white/60" : "text-gray-600"
                 )}>Günlük Brüt Tutar</Label>
                 <Input id="yolGunluk" type="text" inputMode="numeric" pattern="[0-9]*" value={yolGunlukTutar} onChange={(e) => setYolGunlukTutar(smartFormat(e.target.value))} className={cn(
                   "w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/50 text-blue-300 text-sm",
                   isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
                 )} placeholder="0,00" />
                 <span className={cn(
                   "absolute right-4 bottom-2 text-white/40 text-sm",
                   isDarkMode ? "text-white/40" : "text-gray-400"
                 )}>₺</span>
               </div>
             )}
           </div>

        </div>

        <div className="space-y-4">
            <h3 className={cn(
              "text-lg font-medium border-b pb-2 mb-4",
              isDarkMode ? "text-white/80 border-white/10" : "text-gray-900 border-gray-200"
            )}>Ek Gelir & Kesintiler</h3>

            <div className={cn(
              "space-y-2 p-3 bg-white/5 rounded-lg border border-white/10",
              isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
            )}>
                <div className="flex items-center justify-between">
                    <Label htmlFor="primVarMi" className={cn(
                      "text-sm font-medium",
                      isDarkMode ? "text-white/70" : "text-gray-700"
                    )}>Prim / İkramiye</Label>
                    <Switch id="primVarMi" checked={primVarMi} onCheckedChange={setPrimVarMi} />
                </div>
                 {primVarMi && (
                    <div className="relative mt-2">
                        <Label htmlFor="primTutari" className={cn(
                          "text-xs font-medium text-white/60 mb-1 block",
                          isDarkMode ? "text-white/60" : "text-gray-600"
                        )}>Aylık Brüt Tutar</Label>
                        <Input id="primTutari" type="text" inputMode="numeric" pattern="[0-9]*" value={primTutari} onChange={(e) => setPrimTutari(smartFormat(e.target.value))} className={cn(
                          "w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/50 text-blue-300 text-sm",
                          isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
                        )} placeholder="0,00" />
                        <span className={cn(
                          "absolute right-4 bottom-2 text-white/40 text-sm",
                          isDarkMode ? "text-white/40" : "text-gray-400"
                        )}>₺</span>
                    </div>
                )}
            </div>

             <div className={cn(
               "space-y-2 p-3 bg-white/5 rounded-lg border border-white/10",
               isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
             )}>
                <div className="flex items-center justify-between">
                    <Label htmlFor="besVarMi" className={cn(
                      "text-sm font-medium flex items-center gap-1",
                      isDarkMode ? "text-white/70" : "text-gray-700"
                    )}>
                        BES Kesintisi (%{RATES.BES_ORAN * 100})
                         <Tooltip>
                           <TooltipTrigger><Info className="w-3 h-3 text-white/50"/></TooltipTrigger>
                           <TooltipContent className={cn(
                             "bg-gray-800 text-white border-white/20",
                             isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
                           )}>
                             <p className="text-xs">Otomatik Katılım Sistemi kesintisi.</p>
                             <p className="text-xs">SGK Matrahı üzerinden hesaplanır.</p>
                           </TooltipContent>
                         </Tooltip>
                    </Label>
                    <Switch id="besVarMi" checked={besVarMi} onCheckedChange={setBesVarMi} />
                </div>
            </div>

        </div>
      </div>

      {/* Hesapla Butonu - Kaldırıldı */}
      {/* 
      <Button
        onClick={hesaplaBordro}
        disabled={parseTurkishCurrency(temelUcret) <= 0 || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-base"
      >
        {loading ? 'Hesaplanıyor...' : 'Hesapla'}
      </Button>
      */}

      {/* Sonuçlar - Tabs Yapısı */}
      {loading && (
        <div className={cn(
          "mt-8 text-center",
          isDarkMode ? "text-white/60" : "text-gray-600"
        )}>
          Hesaplanıyor...
        </div>
      )}
      {aylikSonuclar.length > 0 && !loading && (
        <Tabs defaultValue="genel" className="mt-8">
          {/* Sekme Başlıkları */}
          <TabsList className={cn(
            "grid w-full grid-cols-3 md:grid-cols-6 gap-1 h-auto mb-4 p-1",
            isDarkMode ? "bg-black/20" : "bg-gray-100"
          )}>
            <TabsTrigger value="genel" className={cn(
              "text-xs md:text-sm px-2 py-1.5",
              isDarkMode 
                ? "data-[state=active]:bg-blue-600 data-[state=active]:text-white" 
                : "data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            )}>Genel Sonuçlar</TabsTrigger>
            <TabsTrigger value="yemekNakdi" className={cn(
              "text-xs md:text-sm px-2 py-1.5",
              isDarkMode 
                ? "data-[state=active]:bg-blue-600 data-[state=active]:text-white" 
                : "data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            )}>Yemek Nakdi</TabsTrigger>
            <TabsTrigger value="yemekAyni" className={cn(
              "text-xs md:text-sm px-2 py-1.5",
              isDarkMode 
                ? "data-[state=active]:bg-blue-600 data-[state=active]:text-white" 
                : "data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            )}>Yemek Ayni</TabsTrigger>
            <TabsTrigger value="prim" className={cn(
              "text-xs md:text-sm px-2 py-1.5",
              isDarkMode 
                ? "data-[state=active]:bg-blue-600 data-[state=active]:text-white" 
                : "data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            )}>Prim/İkramiye</TabsTrigger>
            <TabsTrigger value="yolNakdi" className={cn(
              "text-xs md:text-sm px-2 py-1.5",
              isDarkMode 
                ? "data-[state=active]:bg-blue-600 data-[state=active]:text-white" 
                : "data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            )}>Yol Nakdi</TabsTrigger>
            <TabsTrigger value="yolAyni" className={cn(
              "text-xs md:text-sm px-2 py-1.5",
              isDarkMode 
                ? "data-[state=active]:bg-blue-600 data-[state=active]:text-white" 
                : "data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            )}>Yol Ayni</TabsTrigger>
          </TabsList>

          {/* Genel Sonuçlar İçeriği */}
          <TabsContent value="genel">
             <div className="space-y-6">
                 {/* Özet Bilgiler (Zaten vardı)*/}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className={cn(
                      "rounded-xl p-4 border",
                      isDarkMode ? "bg-black/20 border-white/10" : "bg-white border-gray-200"
                    )}>
                        <p className={cn(
                          "text-sm",
                          isDarkMode ? "text-white/60" : "text-gray-600"
                        )}>Aylık Toplam Brüt</p>
                        <p className={cn(
                          "text-lg font-semibold mt-1",
                          isDarkMode ? "text-white" : "text-gray-900"
                        )}>
                        {aylikSonuclar[0]?.toplamBrut?.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) || '0,00'} ₺
                        </p>
                    </div>
                    <div className={cn(
                      "rounded-xl p-4 border border-green-500/20",
                      isDarkMode ? "bg-black/20 border-white/10" : "bg-white border-gray-200"
                    )}>
                        <p className={cn(
                          "text-sm",
                          isDarkMode ? "text-white/60" : "text-gray-600"
                        )}>Ortalama Net Ücret</p>
                        <p className={cn(
                          "text-lg font-semibold mt-1",
                          isDarkMode ? "text-green-400" : "text-gray-900"
                        )}>
                        {(aylikSonuclar.reduce((acc, curr) => acc + curr.net, 0) / 12).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </p>
                    </div>
                        <div className={cn(
                          "rounded-xl p-4 border border-red-500/20",
                          isDarkMode ? "bg-black/20 border-white/10" : "bg-white border-gray-200"
                        )}>
                        <p className={cn(
                          "text-sm",
                          isDarkMode ? "text-white/60" : "text-gray-600"
                        )}>Ortalama İşveren Maliyeti</p>
                        <p className={cn(
                          "text-lg font-semibold mt-1",
                          isDarkMode ? "text-red-400" : "text-gray-900"
                        )}>
                        {(aylikSonuclar.reduce((acc, curr) => acc + curr.toplamMaliyet, 0) / 12).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </p>
                    </div>
                </div>

                {/* 12 Aylık Detay Tablosu (Zaten vardı) */}
                <div className={cn(
                  "rounded-xl p-4 border overflow-x-auto",
                  isDarkMode ? "bg-black/20 border-white/10" : "bg-white border-gray-200"
                )}>
                  <h3 className={cn(
                    "text-lg font-medium mb-4",
                    isDarkMode ? "text-white/80" : "text-gray-900"
                  )}>Aylık Detaylar (Genel)</h3>
                  <table className={cn(
                    "w-full min-w-[1800px] text-sm whitespace-nowrap",
                    isDarkMode ? "text-white/70" : "text-gray-600"
                  )}>
                     {/* ... thead ve tbody içeriği aynı kalıyor ... */}
                     <thead>
                       <tr className="border-b border-white/10">
                         <th className="py-2 px-2 text-right sticky left-0 bg-white/5 z-10">Ay</th>
                         <th className="py-2 px-2 text-right">Toplam Brüt</th>
                         <th className="py-2 px-2 text-right">SGK Matrahı</th>
                         <th className="py-2 px-2 text-right text-red-400">SGK İşçi (%{calisanTipi === 'normal' ? RATES.SSK.NORMAL*100 : RATES.SSK.EMEKLI*100})</th>
                         <th className="py-2 px-2 text-right text-red-400">İşsizlik İşçi (%{calisanTipi === 'normal' ? RATES.ISSIZLIK.NORMAL*100 : RATES.ISSIZLIK.EMEKLI*100})</th>
                         <th className="py-2 px-2 text-right">GV Matrahı (İnd. Sonrası)</th>
                         <th className="py-2 px-2 text-right">Kümülatif Matrah</th>
                          <th className="py-2 px-2 text-right text-yellow-400">Eng. İnd.</th>
                         <th className="py-2 px-2 text-right text-green-400">GV İstisnası</th>
                         <th className="py-2 px-2 text-right text-green-400">Hesaplanan GV</th>
                         <th className="py-2 px-2 text-right text-green-400">Kesilen GV</th>
                          <th className="py-2 px-2 text-right text-yellow-400">DV İstisnası</th>
                         <th className="py-2 px-2 text-right text-yellow-400">Kesilen DV</th>
                          <th className="py-2 px-2 text-right text-purple-400">BES Kesintisi</th>
                         <th className="py-2 px-2 text-right font-semibold text-blue-400 sticky right-0 bg-white/5 z-10">Net Ücret</th>
                         <th className="py-2 px-2 text-right text-orange-400">SGK İşveren</th>
                         <th className="py-2 px-2 text-right text-orange-400">İşsizlik İşveren</th>
                         <th className="py-2 px-2 text-right font-semibold text-red-400">Toplam Maliyet</th>
                       </tr>
                    </thead>
                     <tbody>
                      {aylikSonuclar.map((sonuc) => (
                         <tr key={sonuc.ay} className="border-b border-white/5 hover:bg-white/10 transition-colors">
                           <td className="py-2 px-2 text-right sticky left-0 bg-inherit z-10">{sonuc.ay}</td>
                           <td className="py-2 px-2 text-right">{sonuc.toplamBrut.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                           <td className="py-2 px-2 text-right">{sonuc.sgkMatrahi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                           <td className="py-2 px-2 text-right text-red-400">{sonuc.sgkIsci.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                           <td className="py-2 px-2 text-right text-red-400">{sonuc.issizlikIsci.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                           <td className="py-2 px-2 text-right">{sonuc.gvMatrahi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                           <td className="py-2 px-2 text-right">{sonuc.kumulatifVergiMatrahi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                            <td className="py-2 px-2 text-right text-yellow-400">{sonuc.engellilikIndirimi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                           <td className="py-2 px-2 text-right text-green-400">{sonuc.gelirVergisiIstisnasi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                            <td className="py-2 px-2 text-right text-green-500/70">{(sonuc.gelirVergisi + sonuc.gelirVergisiIstisnasi).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                           <td className="py-2 px-2 text-right text-green-400 font-medium">{sonuc.gelirVergisi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                           <td className="py-2 px-2 text-right text-yellow-400">{sonuc.damgaVergisiIstisnasi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                           <td className="py-2 px-2 text-right text-yellow-400 font-medium">{sonuc.damgaVergisi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                           <td className="py-2 px-2 text-right text-purple-400">{sonuc.besKesintisi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                           <td className="py-2 px-2 text-right font-semibold text-blue-400 sticky right-0 bg-inherit z-10">{sonuc.net.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                           <td className="py-2 px-2 text-right text-orange-400">{sonuc.sskIsveren.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                           <td className="py-2 px-2 text-right text-orange-400">{sonuc.issizlikIsveren.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                           <td className="py-2 px-2 text-right font-semibold text-red-400">{sonuc.toplamMaliyet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                       {/* Toplam Satırı (Genel) */}
                       <tr className="font-semibold border-t-2 border-white/20">
                        <td className="py-2 px-2 text-right sticky left-0 bg-inherit z-10">Toplam</td>
                         <td className="py-2 px-2 text-right">{aylikSonuclar.reduce((acc, curr) => acc + curr.toplamBrut, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                         <td className="py-2 px-2 text-right">{aylikSonuclar.reduce((acc, curr) => acc + curr.sgkMatrahi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                         <td className="py-2 px-2 text-right text-red-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.sgkIsci, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                         <td className="py-2 px-2 text-right text-red-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.issizlikIsci, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                         <td className="py-2 px-2 text-right">{aylikSonuclar.reduce((acc, curr) => acc + curr.gvMatrahi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                         <td className="py-2 px-2 text-right">-</td> {/* Kümülatif Toplam anlamsız */}
                         <td className="py-2 px-2 text-right text-yellow-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.engellilikIndirimi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                         <td className="py-2 px-2 text-right text-green-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.gelirVergisiIstisnasi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                          <td className="py-2 px-2 text-right text-green-500/70">{aylikSonuclar.reduce((acc, curr) => acc + curr.gelirVergisi + curr.gelirVergisiIstisnasi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                         <td className="py-2 px-2 text-right text-green-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.gelirVergisi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                         <td className="py-2 px-2 text-right text-yellow-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.damgaVergisiIstisnasi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                         <td className="py-2 px-2 text-right text-yellow-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.damgaVergisi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                         <td className="py-2 px-2 text-right text-purple-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.besKesintisi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                         <td className="py-2 px-2 text-right font-semibold text-blue-400 sticky right-0 bg-inherit z-10">{aylikSonuclar.reduce((acc, curr) => acc + curr.net, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                         <td className="py-2 px-2 text-right text-orange-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.sskIsveren, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                         <td className="py-2 px-2 text-right text-orange-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.issizlikIsveren, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                         <td className="py-2 px-2 text-right font-semibold text-red-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.toplamMaliyet, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                       </tr>
                    </tbody>
                  </table>
                </div>
            </div>
          </TabsContent>

          {/* Diğer Sekme İçerikleri (Placeholder) */}
          <TabsContent value="yemekNakdi">
             <div className={cn(
               "bg-white/5 rounded-xl p-4 border border-white/10",
               isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
             )}>
               <h3 className={cn(
                 "text-lg font-medium mb-4",
                 isDarkMode ? "text-white/80" : "text-gray-900"
               )}>Aylık Detaylar (Yemek Nakdi Etkisi)</h3>
               {yemekYardimiTipi === 'nakdi' && parseTurkishCurrency(yemekGunlukTutar) > 0 ? (
                 <p className={cn(
                   "text-white/70",
                   isDarkMode ? "text-white/70" : "text-gray-700"
                 )}>Nakdi yemek yardımının aylık brüt, kesinti ve net etki tablosu burada gösterilecek.</p>
                 // TODO: Buraya Yemek Nakdi mini tablosu gelecek
               ) : (
                 <p className={cn(
                   "text-white/50",
                   isDarkMode ? "text-white/50" : "text-gray-500"
                 )}>Nakdi yemek yardımı seçili değil veya tutar girilmemiş.</p>
               )}
             </div>
           </TabsContent>

          <TabsContent value="yemekAyni">
             <div className={cn(
               "bg-white/5 rounded-xl p-4 border border-white/10",
               isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
             )}>
               <h3 className={cn(
                 "text-lg font-medium mb-4",
                 isDarkMode ? "text-white/80" : "text-gray-900"
               )}>Aylık Detaylar (Yemek Ayni Etkisi)</h3>
                {yemekYardimiTipi === 'ayni' && parseTurkishCurrency(yemekGunlukTutar) > 0 ? (
                  <p className={cn(
                    "text-white/70",
                    isDarkMode ? "text-white/70" : "text-gray-700"
                  )}>Ayni yemek yardımının (istisnalar sonrası) aylık brüt, kesinti ve net etki tablosu burada gösterilecek.</p>
                  // TODO: Buraya Yemek Ayni mini tablosu gelecek
                ) : (
                  <p className={cn(
                    "text-white/50",
                    isDarkMode ? "text-white/50" : "text-gray-500"
                  )}>Ayni yemek yardımı seçili değil veya tutar girilmemiş.</p>
                )}
            </div>
          </TabsContent>

          <TabsContent value="prim">
            <div className={cn(
              "bg-white/5 rounded-xl p-4 border border-white/10",
              isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
            )}>
              <h3 className={cn(
                "text-lg font-medium mb-4",
                isDarkMode ? "text-white/80" : "text-gray-900"
              )}>Aylık Detaylar (Prim/İkramiye Etkisi)</h3>
              {primVarMi && parseTurkishCurrency(primTutari) > 0 ? (
                <p className={cn(
                  "text-white/70",
                  isDarkMode ? "text-white/70" : "text-gray-700"
                )}>Prim/İkramiyenin aylık brüt, kesinti ve net etki tablosu burada gösterilecek.</p>
                 // TODO: Buraya Prim mini tablosu gelecek
               ) : (
                 <p className={cn(
                   "text-white/50",
                   isDarkMode ? "text-white/50" : "text-gray-500"
                 )}>Prim/İkramiye seçili değil veya tutar girilmemiş.</p>
               )}
            </div>
          </TabsContent>

          <TabsContent value="yolNakdi">
             <div className={cn(
               "bg-white/5 rounded-xl p-4 border border-white/10",
               isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
             )}>
               <h3 className={cn(
                 "text-lg font-medium mb-4",
                 isDarkMode ? "text-white/80" : "text-gray-900"
               )}>Aylık Detaylar (Yol Nakdi Etkisi)</h3>
               {yolYardimiTipi === 'nakdi' && parseTurkishCurrency(yolGunlukTutar) > 0 ? (
                 <p className={cn(
                   "text-white/70",
                   isDarkMode ? "text-white/70" : "text-gray-700"
                 )}>Nakdi yol yardımının aylık brüt, kesinti ve net etki tablosu burada gösterilecek.</p>
                 // TODO: Buraya Yol Nakdi mini tablosu gelecek
               ) : (
                 <p className={cn(
                   "text-white/50",
                   isDarkMode ? "text-white/50" : "text-gray-500"
                 )}>Nakdi yol yardımı seçili değil veya tutar girilmemiş.</p>
               )}
             </div>
           </TabsContent>

           <TabsContent value="yolAyni">
             <div className={cn(
               "bg-white/5 rounded-xl p-4 border border-white/10",
               isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-200 border-gray-200"
             )}>
               <h3 className={cn(
                 "text-lg font-medium mb-4",
                 isDarkMode ? "text-white/80" : "text-gray-900"
               )}>Aylık Detaylar (Yol Ayni Etkisi)</h3>
                {yolYardimiTipi === 'ayni' && parseTurkishCurrency(yolGunlukTutar) > 0 ? (
                  <p className={cn(
                    "text-white/70",
                    isDarkMode ? "text-white/70" : "text-gray-700"
                  )}>Ayni yol yardımının (istisnalar sonrası) aylık brüt, kesinti ve net etki tablosu burada gösterilecek.</p>
                  // TODO: Buraya Yol Ayni mini tablosu gelecek
                ) : (
                  <p className={cn(
                    "text-white/50",
                    isDarkMode ? "text-white/50" : "text-gray-500"
                  )}>Ayni yol yardımı seçili değil veya tutar girilmemiş.</p>
                )}
            </div>
           </TabsContent>

        </Tabs>
      )}

      {/* Henüz hesaplama yapılmadıysa mesajlar (Tabs dışı) */}
      {aylikSonuclar.length === 0 && !loading && parseTurkishCurrency(temelUcret) > 0 && (
          <div className={cn(
            "mt-8 text-center",
            isDarkMode ? "text-white/60" : "text-gray-600"
          )}>
              Hesaplama yapılamadı. Lütfen girdileri kontrol edin.
          </div>
       )}
        {parseTurkishCurrency(temelUcret) <= 0 && !loading && (
             <div className={cn(
               "mt-8 text-center",
               isDarkMode ? "text-white/60" : "text-gray-600"
             )}>
                Lütfen geçerli bir brüt ücret girerek hesaplamayı başlatın.
            </div>
        )}

    </div>
    </TooltipProvider>
  );
};

export default BordroHesaplama; 