import React, { useState, useEffect, useCallback } from 'react';
import { Calculator, Info, FileDown, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  hesaplananGelirVergisi: number;
  damgaVergisiMatrahi: number;
  hesaplananDamgaVergisi: number;
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
  hesaplananGelirVergisi: number;
  damgaVergisiMatrahi: number;
  hesaplananDamgaVergisi: number;
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
      brut: 0, // Temel brüt, aşağıda atanacak
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
      hesaplananGelirVergisi: 0,
      damgaVergisiMatrahi: 0,
      hesaplananDamgaVergisi: 0,
    };

    const gunlukUcret = maasTipi === 'gunluk' ? parseTurkishCurrency(temelUcret) : 0;
    const aylikUcret = maasTipi === 'aylik' ? parseTurkishCurrency(temelUcret) : 0;
    const calisilanGun = parseInt(normalGun) || 0;
    const toplamGun = calisilanGun + (parseInt(haftaTatiliGun) || 0);

    let aylikTemelBrut = 0;
    if (maasTipi === 'gunluk') {
      aylikTemelBrut = gunlukUcret * toplamGun;
    } else {
      aylikTemelBrut = aylikUcret;
    }
    placeholderResult.brut = aylikTemelBrut;

    placeholderResult.yemekBrut = (yemekYardimiTipi !== 'yok' ? parseTurkishCurrency(yemekGunlukTutar) : 0) * calisilanGun;
    placeholderResult.yolBrut = (yolYardimiTipi !== 'yok' ? parseTurkishCurrency(yolGunlukTutar) : 0) * calisilanGun;
    placeholderResult.primBrut = primVarMi ? parseTurkishCurrency(primTutari) : 0;

    // Toplam Brüt Ödeme (Tüm yardımlar dahil, kesintilerden önce)
    placeholderResult.toplamBrut = placeholderResult.brut + placeholderResult.yemekBrut + placeholderResult.yolBrut + placeholderResult.primBrut;
    placeholderResult.damgaVergisiMatrahi = placeholderResult.toplamBrut;

    // SGK Matrahı Hesaplanması
    let sgkMatrahinaTabiTutar = placeholderResult.brut + placeholderResult.primBrut;

    // Yemek Yardımı SGK Matrahı Katkısı
    if (placeholderResult.yemekBrut > 0) {
        const aylikSgkYemekIstisnaSiniri = ISTISNALAR_LIMITLER_2024.SGK_YEMEK_ISTISNASI_GUNLUK * calisilanGun;
        sgkMatrahinaTabiTutar += Math.max(0, placeholderResult.yemekBrut - aylikSgkYemekIstisnaSiniri);
    }

    // Yol Yardımı SGK Matrahı Katkısı (Nakdi yol yardımı SGK'ya tabidir)
    if (yolYardimiTipi === 'nakdi' && placeholderResult.yolBrut > 0) {
        sgkMatrahinaTabiTutar += placeholderResult.yolBrut;
    }
    placeholderResult.sgkMatrahi = Math.min(sgkMatrahinaTabiTutar, RATES.SSK.TAVAN);

    const sgkOrani = calisanTipi === 'normal' ? RATES.SSK.NORMAL : RATES.SSK.EMEKLI;
    const issizlikOrani = calisanTipi === 'normal' ? RATES.ISSIZLIK.NORMAL : RATES.ISSIZLIK.EMEKLI;
    placeholderResult.sgkIsci = placeholderResult.sgkMatrahi * sgkOrani;
    placeholderResult.issizlikIsci = placeholderResult.sgkMatrahi * issizlikOrani;

    // Gelir Vergisi Matrahı Hesaplanması
    let gelirVergisiMatrahinaEsasTutar = placeholderResult.toplamBrut - placeholderResult.sgkIsci - placeholderResult.issizlikIsci;

    // Ayni Yemek Yardımı GV İstisnası
    if (yemekYardimiTipi === 'ayni' && placeholderResult.yemekBrut > 0) {
        const aylikGvYemekIstisnaSiniri = ISTISNALAR_LIMITLER_2024.YEMEK_ISTISNASI_GUNLUK * calisilanGun;
        gelirVergisiMatrahinaEsasTutar -= Math.min(placeholderResult.yemekBrut, aylikGvYemekIstisnaSiniri);
    }
    
    // Ayni Yol Yardımı GV İstisnası
    if (yolYardimiTipi === 'ayni' && placeholderResult.yolBrut > 0) {
        const aylikGvYolIstisnaSiniri = ISTISNALAR_LIMITLER_2024.YOL_ISTISNASI_GUNLUK * calisilanGun;
        gelirVergisiMatrahinaEsasTutar -= Math.min(placeholderResult.yolBrut, aylikGvYolIstisnaSiniri);
    }

    placeholderResult.engellilikIndirimi = engellilikDerecesi !== 'yok' ? ISTISNALAR_LIMITLER_2024.ENGELLILIK_INDIRIMI_AYLIK[engellilikDerecesi] : 0;
    gelirVergisiMatrahinaEsasTutar -= placeholderResult.engellilikIndirimi;
    
    placeholderResult.gvMatrahi = Math.max(0, gelirVergisiMatrahinaEsasTutar);

    // Gelir Vergisi ve Damga Vergisi İstisnaları (Asgari Ücret Bazlı)
    placeholderResult.gelirVergisiIstisnasi = ISTISNALAR_LIMITLER_2024.GELIR_VERGISI_ISTISNASI_AYLIK;
    placeholderResult.damgaVergisiIstisnasi = ISTISNALAR_LIMITLER_2024.DAMGA_VERGISI_ISTISNASI_AYLIK;
    
    // Kümülatif GV Matrahı ve Gelir Vergisi Hesaplanması
    placeholderResult.kumulatifVergiMatrahi = oncekiKumulatifMatrah + placeholderResult.gvMatrahi; // Math.max(0, ...) gvMatrahi zaten içeriyor
    const gvHesapSonucu = hesaplaGelirVergisiDetayli(placeholderResult.gvMatrahi, oncekiKumulatifMatrah);
    placeholderResult.hesaplananGelirVergisi = gvHesapSonucu.toplamVergi;
    placeholderResult.gelirVergisi = Math.max(0, placeholderResult.hesaplananGelirVergisi - placeholderResult.gelirVergisiIstisnasi);
    placeholderResult.gv1 = gvHesapSonucu.dilimler.gv1;
    placeholderResult.gv2 = gvHesapSonucu.dilimler.gv2;
    placeholderResult.gv3 = gvHesapSonucu.dilimler.gv3;
    placeholderResult.gv4 = gvHesapSonucu.dilimler.gv4;
    placeholderResult.gv5 = gvHesapSonucu.dilimler.gv5;

    // Damga Vergisi Hesaplanması
    const hesaplananDamgaVergisiTemp = placeholderResult.damgaVergisiMatrahi * RATES.DAMGA; // DV Matrahı toplamBrut
    placeholderResult.hesaplananDamgaVergisi = hesaplananDamgaVergisiTemp;
    placeholderResult.damgaVergisi = Math.max(0, placeholderResult.hesaplananDamgaVergisi - placeholderResult.damgaVergisiIstisnasi);

    // BES Kesintisi
    placeholderResult.besKesintisi = besVarMi ? placeholderResult.sgkMatrahi * RATES.BES_ORAN : 0;

    // Net Ücret
    placeholderResult.net = placeholderResult.toplamBrut
                          - placeholderResult.sgkIsci
                          - placeholderResult.issizlikIsci
                          - placeholderResult.gelirVergisi // İstisna sonrası GV
                          - placeholderResult.damgaVergisi // İstisna sonrası DV
                          - placeholderResult.besKesintisi;

    // İşveren Maliyeti
    const sskIsverenOrani = calisanTipi === 'normal' ? RATES.ISVEREN_SGK_NORMAL : RATES.ISVEREN_SGK_EMEKLI;
    const issizlikIsverenOrani = calisanTipi === 'normal' ? RATES.ISVEREN_ISSIZLIK_NORMAL : RATES.ISVEREN_ISSIZLIK_EMEKLI;
    placeholderResult.sskIsveren = placeholderResult.sgkMatrahi * sskIsverenOrani;
    placeholderResult.issizlikIsveren = placeholderResult.sgkMatrahi * issizlikIsverenOrani;

    placeholderResult.toplamMaliyet = placeholderResult.toplamBrut + placeholderResult.sskIsveren + placeholderResult.issizlikIsveren;

    return placeholderResult;

  }, [
    calisanTipi, maasTipi, temelUcret, normalGun, haftaTatiliGun,
    yemekGunlukTutar, yolGunlukTutar, engellilikDerecesi, yemekYardimiTipi,
    yolYardimiTipi, primVarMi, primTutari, besVarMi, hesaplamaYili, // hesaplaGelirVergisiDetayli bağımlılıklara eklendi implicit olarak
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

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return '0,00';
    return value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Excel'e aktarma fonksiyonu
  const handleExcelExport = useCallback(() => {
    if (aylikSonuclar.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(aylikSonuclar.map(sonuc => ({
      'Ay': sonuc.ay,
      'Brüt Ücret': sonuc.brut,
      'Yemek Brüt': sonuc.yemekBrut,
      'Yol Brüt': sonuc.yolBrut,
      'Prim Brüt': sonuc.primBrut,
      'Toplam Brüt': sonuc.toplamBrut,
      'SGK Matrahı': sonuc.sgkMatrahi,
      'SGK İşçi': sonuc.sgkIsci,
      'İşsizlik İşçi': sonuc.issizlikIsci,
      'SGK İşveren': sonuc.sskIsveren,
      'İşsizlik İşveren': sonuc.issizlikIsveren,
      'GV Matrahı': sonuc.gvMatrahi,
      'Kümülatif GV Mat.': sonuc.kumulatifVergiMatrahi,
      'Hesaplanan GV': sonuc.hesaplananGelirVergisi,
      'GV İstisnası': sonuc.gelirVergisiIstisnasi,
      'Kesilecek GV': sonuc.gelirVergisi,
      'DV Matrahı': sonuc.damgaVergisiMatrahi,
      'Hesaplanan DV': sonuc.hesaplananDamgaVergisi,
      'DV İstisnası': sonuc.damgaVergisiIstisnasi,
      'Kesilecek DV': sonuc.damgaVergisi,
      'BES Kesintisi': sonuc.besKesintisi,
      'Net Ücret': sonuc.net,
      'İşveren Maliyeti': sonuc.toplamMaliyet,
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bordro Detayları');

    // Excel dosyasını oluştur ve indir
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'bordro_detaylari.xlsx');
  }, [aylikSonuclar]);

  // PDF'e aktarma fonksiyonu
  const handlePdfExport = useCallback(() => {
    if (aylikSonuclar.length === 0) return;

    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFont('helvetica');
    doc.setFontSize(12);

    // Başlık
    doc.text('Bordro Detayları', 15, 15);
    doc.setFontSize(10);

    // Tablo başlıkları
    const headers = ['Ay', 'Brüt', 'Net', 'SGK İşçi', 'GV', 'DV', 'Toplam Maliyet'];
    let y = 25;
    const rowHeight = 8;

    // Başlıkları yazdır
    headers.forEach((header, i) => {
      doc.text(header, 15 + (i * 35), y);
    });

    // Verileri yazdır
    aylikSonuclar.forEach((sonuc, index) => {
      y = 25 + ((index + 1) * rowHeight);
      doc.text(sonuc.ay.toString(), 15, y);
      doc.text(formatCurrency(sonuc.brut), 50, y);
      doc.text(formatCurrency(sonuc.net), 85, y);
      doc.text(formatCurrency(sonuc.sgkIsci), 120, y);
      doc.text(formatCurrency(sonuc.gelirVergisi), 155, y);
      doc.text(formatCurrency(sonuc.damgaVergisi), 190, y);
      doc.text(formatCurrency(sonuc.toplamMaliyet), 225, y);
    });

    // PDF'i indir
    doc.save('bordro_detaylari.pdf');
  }, [aylikSonuclar]);

  return (
    <TooltipProvider>
      <div className={cn(
        "min-h-screen p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8",
        isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      )}>
        <header className="mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className={cn("w-7 h-7 md:w-8 md:h-8", isDarkMode ? "text-primary" : "text-primary")} />
              <h1 className={cn(
                "text-2xl md:text-3xl font-semibold tracking-tight",
                isDarkMode ? "text-white" : "text-slate-900"
              )}>
                Detaylı Bordro Hesaplama ({hesaplamaYili})
              </h1>
            </div>
            
            {/* Dışa Aktarma Butonları */}
            {aylikSonuclar.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExcelExport}
                  className={cn(
                    "flex items-center gap-2",
                    isDarkMode ? "bg-green-900/20 hover:bg-green-900/30 text-green-400 border-green-900" : "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                  )}
                >
                  <FileDown className="w-4 h-4" />
                  Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePdfExport}
                  className={cn(
                    "flex items-center gap-2",
                    isDarkMode ? "bg-red-900/20 hover:bg-red-900/30 text-red-400 border-red-900" : "bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                  )}
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </Button>
              </div>
            )}
          </div>
          <p className={cn(
            "text-sm md:text-base mt-2",
            isDarkMode ? "text-slate-400" : "text-slate-600"
          )}>
            Maaş, yardım ve kesintilerinizi girerek aylık ve yıllık bordro detaylarınızı görün.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className={cn(isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-md")}>
            <CardHeader>
              <CardTitle className={cn("text-lg font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>Maaş Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
          <div className="space-y-2">
                <Label className={cn("text-sm font-medium", isDarkMode ? "text-slate-300" : "text-slate-700")}>Maaş Tipi</Label>
            <RadioGroup value={maasTipi} onValueChange={(value: string) => setMaasTipi(value as MaasTipi)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aylik" id="r_aylik" className={cn(isDarkMode && "border-slate-600 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground")} />
                    <Label htmlFor="r_aylik" className={cn("font-normal", isDarkMode ? "text-slate-300" : "text-slate-700")}>Aylık</Label>
              </div>
              <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gunluk" id="r_gunluk" className={cn(isDarkMode && "border-slate-600 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground")} />
                    <Label htmlFor="r_gunluk" className={cn("font-normal", isDarkMode ? "text-slate-300" : "text-slate-700")}>Günlük</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
                <Label htmlFor="temelUcret" className={cn("text-sm font-medium", isDarkMode ? "text-slate-300" : "text-slate-700")}>
              {maasTipi === 'aylik' ? 'Aylık Brüt Ücret' : 'Günlük Brüt Ücret'}
            </Label>
            <div className="relative">
              <Input
                id="temelUcret"
                type="text"
                inputMode="numeric"
                value={temelUcret}
                onChange={(e) => setTemelUcret(smartFormat(e.target.value))}
                className={cn(
                      "w-full pr-8",
                  isDarkMode 
                        ? "bg-slate-700/50 border-slate-600 placeholder:text-slate-400 text-slate-50 focus:border-primary" 
                        : "bg-white border-slate-300 placeholder:text-slate-400 focus:border-primary"
                )}
                placeholder="0,00"
              />
                  <span className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-sm", isDarkMode ? "text-slate-400" : "text-slate-500")}>₺</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                   <Label htmlFor="normalGun" className={cn("text-sm font-medium",isDarkMode ? "text-slate-300" : "text-slate-700")}>Normal Gün</Label>
               <Input
                 id="normalGun"
                 type="number"
                 value={normalGun}
                 onChange={(e) => handleNumericInputChange(setNormalGun)(e)}
                     className={cn(isDarkMode ? "bg-slate-700/50 border-slate-600 placeholder:text-slate-400 text-slate-50 focus:border-primary" : "bg-white border-slate-300 placeholder:text-slate-400 focus:border-primary")}
                 placeholder="22"
               />
             </div>
             <div className="space-y-2">
                    <Label htmlFor="haftaTatiliGun" className={cn("text-sm font-medium",isDarkMode ? "text-slate-300" : "text-slate-700")}>Hafta Tatili</Label>
                <Input
                  id="haftaTatiliGun"
                  type="number"
                  value={haftaTatiliGun}
                  onChange={(e) => handleNumericInputChange(setHaftaTatiliGun)(e)}
                      className={cn(isDarkMode ? "bg-slate-700/50 border-slate-600 placeholder:text-slate-400 text-slate-50 focus:border-primary" : "bg-white border-slate-300 placeholder:text-slate-400 focus:border-primary")}
                  placeholder="8"
                />
             </div>
          </div>

           <div className="space-y-2">
                <Label className={cn("text-sm font-medium", isDarkMode ? "text-slate-300" : "text-slate-700")}>Çalışan Tipi</Label>
             <RadioGroup value={calisanTipi} onValueChange={(value: string) => setCalisanTipi(value as 'normal' | 'emekli')} className="flex gap-4">
              <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="r_normal" className={cn(isDarkMode && "border-slate-600 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground")}/>
                    <Label htmlFor="r_normal" className={cn("font-normal",isDarkMode ? "text-slate-300" : "text-slate-700")}>Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                    <RadioGroupItem value="emekli" id="r_emekli" className={cn(isDarkMode && "border-slate-600 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground")}/>
                    <Label htmlFor="r_emekli" className={cn("font-normal",isDarkMode ? "text-slate-300" : "text-slate-700")}>Emekli</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
                <Label className={cn("text-sm font-medium", isDarkMode ? "text-slate-300" : "text-slate-700")}>Engellilik Durumu</Label>
            <Select value={engellilikDerecesi} onValueChange={(value: string) => setEngellilikDerecesi(value as EngellilikDerecesi)}>
                    <SelectTrigger className={cn(isDarkMode ? "bg-slate-700/50 border-slate-600 text-slate-50 focus:border-primary" : "bg-white border-slate-300 focus:border-primary")}>
                    <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                    <SelectContent className={cn(isDarkMode ? "bg-slate-800 border-slate-700 text-slate-50" : "bg-white")}>
                    <SelectItem value="yok">Engellilik Yok</SelectItem>
                    <SelectItem value="1">1. Derece</SelectItem>
                    <SelectItem value="2">2. Derece</SelectItem>
                    <SelectItem value="3">3. Derece</SelectItem>
                </SelectContent>
            </Select>
             {engellilikDerecesi !== 'yok' && (
                   <p className={cn("text-xs", isDarkMode ? "text-slate-400" : "text-slate-500")}>
                 Aylık İndirim: {ISTISNALAR_LIMITLER_2024.ENGELLILIK_INDIRIMI_AYLIK[engellilikDerecesi].toLocaleString('tr-TR')} ₺
               </p>
             )}
          </div>
            </CardContent>
          </Card>

          <Card className={cn(isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-md")}>
            <CardHeader>
              <CardTitle className={cn("text-lg font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>Yardımlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className={cn("space-y-3 p-3 rounded-md", isDarkMode ? "bg-slate-700/30 border border-slate-700" : "bg-slate-100 border border-slate-200")}>
                 <Label className={cn("text-sm font-medium flex items-center gap-1.5",isDarkMode ? "text-slate-300" : "text-slate-700")}>
               Yemek Yardımı
                <Tooltip>
                      <TooltipTrigger><Info className="w-3.5 h-3.5 text-slate-500"/></TooltipTrigger>
                      <TooltipContent className={cn("text-xs", isDarkMode ? "bg-slate-900 text-slate-200 border-slate-700" : "bg-white text-slate-700")}>
                        <p>Ayni: Kart/Çek. Nakdi: Nakit ödeme.</p>
                        <p>2024 GV İstisnası (Ayni): {ISTISNALAR_LIMITLER_2024.YEMEK_ISTISNASI_GUNLUK.toLocaleString('tr-TR')} ₺/gün</p>
                         <p>2024 SGK İstisnası: {ISTISNALAR_LIMITLER_2024.SGK_YEMEK_ISTISNASI_GUNLUK.toLocaleString('tr-TR')} ₺/gün</p>
                  </TooltipContent>
                </Tooltip>
             </Label>
                 <RadioGroup value={yemekYardimiTipi} onValueChange={(value: string) => setYemekYardimiTipi(value as YardimTipi)} className="flex gap-4">
                  <div className="flex items-center space-x-2"> <RadioGroupItem value="yok" id="y_yok" className={cn(isDarkMode && "border-slate-600 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground")}/> <Label htmlFor="y_yok" className={cn("font-normal",isDarkMode ? "text-slate-300" : "text-slate-700")}>Yok</Label> </div>
                  <div className="flex items-center space-x-2"> <RadioGroupItem value="nakdi" id="y_nakdi" className={cn(isDarkMode && "border-slate-600 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground")}/> <Label htmlFor="y_nakdi" className={cn("font-normal",isDarkMode ? "text-slate-300" : "text-slate-700")}>Nakdi</Label> </div>
                  <div className="flex items-center space-x-2"> <RadioGroupItem value="ayni" id="y_ayni" className={cn(isDarkMode && "border-slate-600 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground")}/> <Label htmlFor="y_ayni" className={cn("font-normal",isDarkMode ? "text-slate-300" : "text-slate-700")}>Ayni</Label> </div>
             </RadioGroup>
             {yemekYardimiTipi !== 'yok' && (
                   <div className="relative mt-2">
                     <Label htmlFor="yemekGunluk" className={cn("text-xs font-medium mb-1 block", isDarkMode ? "text-slate-400" : "text-slate-600")}>Günlük Brüt Tutar</Label>
                     <Input id="yemekGunluk" type="text" inputMode="numeric" value={yemekGunlukTutar} onChange={(e) => setYemekGunlukTutar(smartFormat(e.target.value))} 
                            className={cn("w-full pr-8 text-sm", isDarkMode ? "bg-slate-700 border-slate-600 placeholder:text-slate-400 text-slate-50 focus:border-primary" : "bg-white border-slate-300 placeholder:text-slate-400 focus:border-primary")} placeholder="0,00" />
                     <span className={cn("absolute right-3 top-1/2 mt-px translate-y-1 text-xs",isDarkMode ? "text-slate-400" : "text-slate-500")}>₺</span>
               </div>
             )}
           </div>

                <div className={cn("space-y-3 p-3 rounded-md", isDarkMode ? "bg-slate-700/30 border border-slate-700" : "bg-slate-100 border border-slate-200")}>
                 <Label className={cn("text-sm font-medium flex items-center gap-1.5",isDarkMode ? "text-slate-300" : "text-slate-700")}>
               Yol Yardımı
                <Tooltip>
                      <TooltipTrigger><Info className="w-3.5 h-3.5 text-slate-500"/></TooltipTrigger>
                       <TooltipContent className={cn("text-xs", isDarkMode ? "bg-slate-900 text-slate-200 border-slate-700" : "bg-white text-slate-700")}>
                        <p>Ayni: Servis/Kart. Nakdi: Nakit ödeme.</p>
                        <p>2024 GV İstisnası (Ayni): {ISTISNALAR_LIMITLER_2024.YOL_ISTISNASI_GUNLUK.toLocaleString('tr-TR')} ₺/gün</p>
                        <p>SGK İstisnası Yoktur.</p>
                  </TooltipContent>
                </Tooltip>
             </Label>
                 <RadioGroup value={yolYardimiTipi} onValueChange={(value: string) => setYolYardimiTipi(value as YardimTipi)} className="flex gap-4">
                  <div className="flex items-center space-x-2"> <RadioGroupItem value="yok" id="yo_yok" className={cn(isDarkMode && "border-slate-600 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground")}/> <Label htmlFor="yo_yok" className={cn("font-normal",isDarkMode ? "text-slate-300" : "text-slate-700")}>Yok</Label> </div>
                  <div className="flex items-center space-x-2"> <RadioGroupItem value="nakdi" id="yo_nakdi" className={cn(isDarkMode && "border-slate-600 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground")}/> <Label htmlFor="yo_nakdi" className={cn("font-normal",isDarkMode ? "text-slate-300" : "text-slate-700")}>Nakdi</Label> </div>
                  <div className="flex items-center space-x-2"> <RadioGroupItem value="ayni" id="yo_ayni" className={cn(isDarkMode && "border-slate-600 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground")}/> <Label htmlFor="yo_ayni" className={cn("font-normal",isDarkMode ? "text-slate-300" : "text-slate-700")}>Ayni</Label> </div>
             </RadioGroup>
             {yolYardimiTipi !== 'yok' && (
                   <div className="relative mt-2">
                     <Label htmlFor="yolGunluk" className={cn("text-xs font-medium mb-1 block",isDarkMode ? "text-slate-400" : "text-slate-600")}>Günlük Brüt Tutar</Label>
                     <Input id="yolGunluk" type="text" inputMode="numeric" value={yolGunlukTutar} onChange={(e) => setYolGunlukTutar(smartFormat(e.target.value))} 
                            className={cn("w-full pr-8 text-sm",isDarkMode ? "bg-slate-700 border-slate-600 placeholder:text-slate-400 text-slate-50 focus:border-primary" : "bg-white border-slate-300 placeholder:text-slate-400 focus:border-primary")} placeholder="0,00" />
                     <span className={cn("absolute right-3 top-1/2 mt-px translate-y-1 text-xs",isDarkMode ? "text-slate-400" : "text-slate-500")}>₺</span>
               </div>
             )}
           </div>
            </CardContent>
          </Card>

          <Card className={cn(isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-md")}>
            <CardHeader>
              <CardTitle className={cn("text-lg font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>Ek Gelir & Kesintiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className={cn("space-y-3 p-3 rounded-md", isDarkMode ? "bg-slate-700/30 border border-slate-700" : "bg-slate-100 border border-slate-200")}>
                <div className="flex items-center justify-between">
                        <Label htmlFor="primVarMi" className={cn("text-sm font-medium",isDarkMode ? "text-slate-300" : "text-slate-700")}>Prim / İkramiye</Label>
                        <Switch id="primVarMi" checked={primVarMi} onCheckedChange={setPrimVarMi} 
                                className={cn(isDarkMode && "data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600")}/>
                </div>
                 {primVarMi && (
                    <div className="relative mt-2">
                            <Label htmlFor="primTutari" className={cn("text-xs font-medium mb-1 block",isDarkMode ? "text-slate-400" : "text-slate-600")}>Aylık Brüt Tutar</Label>
                            <Input id="primTutari" type="text" inputMode="numeric" value={primTutari} onChange={(e) => setPrimTutari(smartFormat(e.target.value))} 
                                   className={cn("w-full pr-8 text-sm",isDarkMode ? "bg-slate-700 border-slate-600 placeholder:text-slate-400 text-slate-50 focus:border-primary" : "bg-white border-slate-300 placeholder:text-slate-400 focus:border-primary")} placeholder="0,00" />
                            <span className={cn("absolute right-3 top-1/2 mt-px translate-y-1 text-xs",isDarkMode ? "text-slate-400" : "text-slate-500")}>₺</span>
                    </div>
                )}
            </div>
                <div className={cn("space-y-3 p-3 rounded-md", isDarkMode ? "bg-slate-700/30 border border-slate-700" : "bg-slate-100 border border-slate-200")}>
                <div className="flex items-center justify-between">
                        <Label htmlFor="besVarMi" className={cn("text-sm font-medium flex items-center gap-1.5",isDarkMode ? "text-slate-300" : "text-slate-700")}>
                        BES Kesintisi (%{RATES.BES_ORAN * 100})
                         <Tooltip>
                               <TooltipTrigger><Info className="w-3.5 h-3.5 text-slate-500"/></TooltipTrigger>
                               <TooltipContent className={cn("text-xs",isDarkMode ? "bg-slate-900 text-slate-200 border-slate-700" : "bg-white text-slate-700")}>
                                 <p>Otomatik Katılım Sistemi kesintisi.</p>
                                 <p>SGK Matrahı üzerinden hesaplanır.</p>
                           </TooltipContent>
                         </Tooltip>
                    </Label>
                        <Switch id="besVarMi" checked={besVarMi} onCheckedChange={setBesVarMi} 
                                className={cn(isDarkMode && "data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600")}/>
                </div>
            </div>
            </CardContent>
          </Card>
      </div>

      {loading && (
          <div className={cn("mt-8 text-center", isDarkMode ? "text-slate-400" : "text-slate-600")}>
          Hesaplanıyor...
        </div>
      )}
      {aylikSonuclar.length > 0 && !loading && (
        <Tabs defaultValue="genel" className="mt-8">
          <TabsList className={cn(
              "grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1 h-auto mb-4 p-1 rounded-lg",
              isDarkMode ? "bg-slate-800" : "bg-slate-100"
            )}>
              <TabsTrigger value="genel" className={cn("text-xs md:text-sm px-2 py-1.5 rounded-md", isDarkMode ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-slate-700" : "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-slate-200")}>Genel</TabsTrigger>
              <TabsTrigger value="yemekNakdi" className={cn("text-xs md:text-sm px-2 py-1.5 rounded-md", isDarkMode ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-slate-700" : "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-slate-200")}>Yemek Nakdi</TabsTrigger>
              <TabsTrigger value="yemekAyni" className={cn("text-xs md:text-sm px-2 py-1.5 rounded-md", isDarkMode ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-slate-700" : "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-slate-200")}>Yemek Ayni</TabsTrigger>
              <TabsTrigger value="prim" className={cn("text-xs md:text-sm px-2 py-1.5 rounded-md", isDarkMode ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-slate-700" : "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-slate-200")}>Prim</TabsTrigger>
              <TabsTrigger value="yolNakdi" className={cn("text-xs md:text-sm px-2 py-1.5 rounded-md", isDarkMode ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-slate-700" : "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-slate-200")}>Yol Nakdi</TabsTrigger>
              <TabsTrigger value="yolAyni" className={cn("text-xs md:text-sm px-2 py-1.5 rounded-md", isDarkMode ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-slate-700" : "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-slate-200")}>Yol Ayni</TabsTrigger>
          </TabsList>

          <TabsContent value="genel">
              <Card className={cn(isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-md")}>
                <CardHeader>
                  <CardTitle className={cn("text-lg font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>Genel Yıllık Özet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className={cn("rounded-lg p-4 border", isDarkMode ? "bg-slate-700/30 border-slate-700" : "bg-slate-100 border-slate-200")}>
                          <p className={cn("text-sm", isDarkMode ? "text-slate-400" : "text-slate-600")}>Yıllık Toplam Brüt</p>
                          <p className={cn("text-xl font-semibold mt-1", isDarkMode ? "text-white" : "text-slate-900")}>
                          {aylikSonuclar.reduce((acc, curr) => acc + curr.toplamBrut, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                        </p>
                    </div>
                      <div className={cn("rounded-lg p-4 border", isDarkMode ? "bg-slate-700/30 border-green-500/30" : "bg-slate-100 border-green-500/30")}>
                          <p className={cn("text-sm", isDarkMode ? "text-slate-400" : "text-slate-600")}>Yıllık Ortalama Net</p>
                          <p className={cn("text-xl font-semibold mt-1", isDarkMode ? "text-green-400" : "text-green-600")}>
                          {(aylikSonuclar.reduce((acc, curr) => acc + curr.net, 0) / aylikSonuclar.length).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                        </p>
                    </div>
                          <div className={cn("rounded-lg p-4 border", isDarkMode ? "bg-slate-700/30 border-red-500/30" : "bg-slate-100 border-red-500/30")}>
                          <p className={cn("text-sm", isDarkMode ? "text-slate-400" : "text-slate-600")}>Yıllık Ortalama Maliyet</p>
                          <p className={cn("text-xl font-semibold mt-1", isDarkMode ? "text-red-400" : "text-red-600")}>
                          {(aylikSonuclar.reduce((acc, curr) => acc + curr.toplamMaliyet, 0) / aylikSonuclar.length).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                        </p>
                    </div>
                </div>

                  <div className={cn("rounded-lg border overflow-x-auto", isDarkMode ? "border-slate-700" : "border-slate-200")}>
                    <h3 className={cn("text-md font-medium p-4 border-b",isDarkMode ? "text-slate-200 bg-slate-700/50 border-slate-700" : "text-slate-700 bg-slate-100 border-slate-200")}>
                        Aylık Detaylar (Genel)
                    </h3>
                    <table className={cn("w-full min-w-[3600px] text-sm whitespace-nowrap", isDarkMode ? "divide-slate-700" : "divide-slate-200")}>
                      <thead className={cn(isDarkMode ? "bg-slate-700/50" : "bg-slate-100")}>
                         <tr className={cn(isDarkMode ? "border-b-slate-700" : "border-b-slate-200")}>
                           <th className={cn("py-2.5 px-2 text-left sticky left-0 z-10 font-medium", isDarkMode ? "bg-slate-700/50 text-slate-300" : "bg-slate-100 text-slate-600")}>Ay</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>Brüt Ücret</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>Yemek Brüt</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>Yol Brüt</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>Prim Brüt</th>
                           <th className={cn("py-2.5 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>Toplam Brüt</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>SGK Matrahı</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>SGK İşçi ({((calisanTipi === 'normal' ? RATES.SSK.NORMAL : RATES.SSK.EMEKLI) * 100).toFixed(1)}%)</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>İşsizlik İşçi ({((calisanTipi === 'normal' ? RATES.ISSIZLIK.NORMAL : RATES.ISSIZLIK.EMEKLI) * 100).toFixed(0)}%)</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>SGK İşveren ({((calisanTipi === 'normal' ? RATES.ISVEREN_SGK_NORMAL : RATES.ISVEREN_SGK_EMEKLI) * 100).toFixed(calisanTipi === 'normal' ? 1:2)}%)</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>İşsizlik İşveren ({((calisanTipi === 'normal' ? RATES.ISVEREN_ISSIZLIK_NORMAL : RATES.ISVEREN_ISSIZLIK_EMEKLI) * 100).toFixed(0)}%)</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>GV Matrahı</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>Kümülatif GV Mat.</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>GV %15</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>GV %20</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>GV %27</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>GV %35</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>GV %40</th>
                           <th className={cn("py-2.5 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>Hesaplanan GV</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>Engellilik İnd.</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>GV İstisnası</th>
                           <th className={cn("py-2.5 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>Kesilecek GV</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>DV Matrahı</th>
                           <th className={cn("py-2.5 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>Hesaplanan DV</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>DV İstisnası</th>
                           <th className={cn("py-2.5 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>Kesilecek DV</th>
                           <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>BES Kesintisi</th>
                           <th className={cn("py-2.5 px-2 text-right font-semibold sticky right-0 z-10", isDarkMode ? "bg-slate-700/50 text-primary" : "bg-slate-100 text-primary")}>Net Ücret</th>
                           <th className={cn("py-2.5 px-2 text-right font-semibold", isDarkMode ? "text-red-400" : "text-red-600")}>İşveren Maliyeti</th>
                       </tr>
                    </thead>
                       <tbody className={cn("divide-y", isDarkMode ? "divide-slate-700 bg-slate-800" : "divide-slate-200 bg-white")}>
                        {aylikSonuclar.map((sonuc, index) => (
                           <tr key={sonuc.ay} className={cn("hover:bg-opacity-50", isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-50", index % 2 === 1 && (isDarkMode ? "bg-slate-800/50" : "bg-slate-50/50"))}>
                             <td className={cn("py-2 px-2 text-left sticky left-0 z-10", isDarkMode ? `${index % 2 === 1 ? "bg-slate-800/50" : "bg-slate-800"} group-hover:bg-slate-700 text-slate-300` : `${index % 2 === 1 ? "bg-slate-50/50" : "bg-white"} group-hover:bg-slate-50 text-slate-500`)}>{sonuc.ay}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.brut)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.yemekBrut)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.yolBrut)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.primBrut)}</td>
                             <td className={cn("py-2 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>{formatCurrency(sonuc.toplamBrut)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.sgkMatrahi)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.sgkIsci)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.issizlikIsci)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.sskIsveren)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.issizlikIsveren)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.gvMatrahi)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.kumulatifVergiMatrahi)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.gv1)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.gv2)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.gv3)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.gv4)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.gv5)}</td>
                             <td className={cn("py-2 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>{formatCurrency(sonuc.hesaplananGelirVergisi)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.engellilikIndirimi)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.gelirVergisiIstisnasi)}</td>
                             <td className={cn("py-2 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>{formatCurrency(sonuc.gelirVergisi)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.damgaVergisiMatrahi)}</td>
                             <td className={cn("py-2 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>{formatCurrency(sonuc.hesaplananDamgaVergisi)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.damgaVergisiIstisnasi)}</td>
                             <td className={cn("py-2 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>{formatCurrency(sonuc.damgaVergisi)}</td>
                             <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.besKesintisi)}</td>
                             <td className={cn("py-2 px-2 text-right font-semibold sticky right-0 z-10", isDarkMode ? `${index % 2 === 1 ? "bg-slate-800/50" : "bg-slate-800"} group-hover:bg-slate-700 text-primary` : `${index % 2 === 1 ? "bg-slate-50/50" : "bg-white"} group-hover:bg-slate-50 text-primary`)}>{formatCurrency(sonuc.net)}</td>
                             <td className={cn("py-2 px-2 text-right font-semibold", isDarkMode ? "text-red-400" : "text-red-600")}>{formatCurrency(sonuc.toplamMaliyet)}</td>
                        </tr>
                      ))}
                         <tr className={cn("font-semibold border-t-2", isDarkMode ? "bg-slate-700/50 border-slate-600 text-slate-100" : "bg-slate-100 border-slate-300 text-slate-800")}>
                          <td className={cn("py-2.5 px-2 text-left sticky left-0 z-10", isDarkMode ? "bg-slate-700/50" : "bg-slate-100")}>Toplam</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.brut, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.yemekBrut, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.yolBrut, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.primBrut, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.toplamBrut, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{/* SGK Matrahı toplamı anlamsız */}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.sgkIsci, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.issizlikIsci, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.sskIsveren, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.issizlikIsveren, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{/* GV Matrahı toplamı anlamsız */}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{/* Kümülatif GV Matrahı toplamı anlamsız */}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.gv1, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.gv2, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.gv3, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.gv4, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.gv5, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.hesaplananGelirVergisi, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.engellilikIndirimi, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.gelirVergisiIstisnasi, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.gelirVergisi, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{/* DV Matrahı toplamı anlamsız */}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.hesaplananDamgaVergisi, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.damgaVergisiIstisnasi, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.damgaVergisi, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.besKesintisi, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right sticky right-0 z-10", isDarkMode ? "bg-slate-700/50 text-primary" : "bg-slate-100 text-primary")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.net, 0))}</td>
                           <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.toplamMaliyet, 0))}</td>
                       </tr>
                    </tbody>
                  </table>
                </div>
                </CardContent>
              </Card>
          </TabsContent>

            {[ "yemekNakdi", "yemekAyni", "prim", "yolNakdi", "yolAyni"].map(tabKey => {
              const isYemekNakdiTab = tabKey === "yemekNakdi";
              const isPrimTab = tabKey === "prim";
              // Diğer tablar için benzer koşullar eklenebilir

              const shouldDisplayTable = 
                (isYemekNakdiTab && yemekYardimiTipi === 'nakdi' && parseTurkishCurrency(yemekGunlukTutar) > 0) ||
                (isPrimTab && primVarMi && parseTurkishCurrency(primTutari) > 0) // Prim tablosu için örnek koşul
                // Diğer tablar için koşullar buraya eklenecek
                ;

              let cardTitle = `${tabKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Etkisi`;
              if (isYemekNakdiTab) cardTitle = "Aylık Detaylar (Yemek Nakdi)";
              // Diğer tab başlıkları da özelleştirilebilir

              return (
                <TabsContent key={tabKey} value={tabKey}>
                     <Card className={cn(isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-md")}>
                        <CardHeader>
                            <CardTitle className={cn("text-lg font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>
                                {cardTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {shouldDisplayTable && isYemekNakdiTab ? (
                                <div className={cn("rounded-lg border overflow-x-auto", isDarkMode ? "border-slate-700" : "border-slate-200")}>
                                <table className={cn("w-full min-w-[1800px] text-sm whitespace-nowrap", isDarkMode ? "divide-slate-700" : "divide-slate-200")}>
                                  <thead className={cn(isDarkMode ? "bg-slate-700/50" : "bg-slate-100")}>
                                     <tr className={cn(isDarkMode ? "border-b-slate-700" : "border-b-slate-200")}>
                                       <th className={cn("py-2.5 px-2 text-left sticky left-0 z-10 font-medium", isDarkMode ? "bg-slate-700/50 text-slate-300" : "bg-slate-100 text-slate-600")}>Ay</th>
                                       <th className={cn("py-2.5 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>Brüt Maaş (Nakdi Yemek Dahil)</th>
                                       <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>SGK Matrahı</th>
                                       <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>SSK İşçi</th>
                                       <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>İşsizlik İşçi</th>
                                       <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>GV Matrahı</th>
                                       <th className={cn("py-2.5 px-2 text-right font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>Kümülatif GV Mat.</th>
                                       <th className={cn("py-2.5 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>Gelir Vergisi</th>
                                       <th className={cn("py-2.5 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>Damga Vergisi</th>
                                       <th className={cn("py-2.5 px-2 text-right font-semibold sticky right-0 z-10", isDarkMode ? "bg-slate-700/50 text-primary" : "bg-slate-100 text-primary")}>Net Ücret</th>
                                     </tr>
                                  </thead>
                                   <tbody className={cn("divide-y", isDarkMode ? "divide-slate-700 bg-slate-800" : "divide-slate-200 bg-white")}>
                                    {aylikSonuclar.map((sonuc, index) => {
                                      // Bu tab için "Brüt Maaş", temel brüt + nakdi yemek brütüdür. Diğer yardımlar bu özel görünümde hariç tutulur.
                                      const brutMaasNakdiYemekDahil = sonuc.brut + (yemekYardimiTipi === 'nakdi' ? sonuc.yemekBrut : 0);
                                      return (
                                       <tr key={sonuc.ay} className={cn("hover:bg-opacity-50", isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-50", index % 2 === 1 && (isDarkMode ? "bg-slate-800/50" : "bg-slate-50/50"))}>
                                         <td className={cn("py-2 px-2 text-left sticky left-0 z-10", isDarkMode ? `${index % 2 === 1 ? "bg-slate-800/50" : "bg-slate-800"} group-hover:bg-slate-700 text-slate-300` : `${index % 2 === 1 ? "bg-slate-50/50" : "bg-white"} group-hover:bg-slate-50 text-slate-500`)}>{sonuc.ay}</td>
                                         <td className={cn("py-2 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>{formatCurrency(brutMaasNakdiYemekDahil)}</td>
                                         <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.sgkMatrahi)}</td>
                                         <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.sgkIsci)}</td>
                                         <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.issizlikIsci)}</td>
                                         <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.gvMatrahi)}</td>
                                         <td className={cn("py-2 px-2 text-right", isDarkMode ? "text-slate-200" : "text-slate-700")}>{formatCurrency(sonuc.kumulatifVergiMatrahi)}</td>
                                         <td className={cn("py-2 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>{formatCurrency(sonuc.gelirVergisi)}</td>
                                         <td className={cn("py-2 px-2 text-right font-semibold", isDarkMode ? "text-slate-100" : "text-slate-800")}>{formatCurrency(sonuc.damgaVergisi)}</td>
                                         <td className={cn("py-2 px-2 text-right font-semibold sticky right-0 z-10", isDarkMode ? `${index % 2 === 1 ? "bg-slate-800/50" : "bg-slate-800"} group-hover:bg-slate-700 text-primary` : `${index % 2 === 1 ? "bg-slate-50/50" : "bg-white"} group-hover:bg-slate-50 text-primary`)}>{formatCurrency(sonuc.net)}</td>
                                      </tr>
                                    );
                                    })}
                                     <tr className={cn("font-semibold border-t-2", isDarkMode ? "bg-slate-700/50 border-slate-600 text-slate-100" : "bg-slate-100 border-slate-300 text-slate-800")}>
                                      <td className={cn("py-2.5 px-2 text-left sticky left-0 z-10", isDarkMode ? "bg-slate-700/50" : "bg-slate-100")}>Toplam</td>
                                       <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + (curr.brut + (yemekYardimiTipi === 'nakdi' ? curr.yemekBrut : 0)), 0))}</td>
                                       <td className={cn("py-2.5 px-2 text-right")}>{/* SGK Matrahı toplamı anlamsız */}</td>
                                       <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.sgkIsci, 0))}</td>
                                       <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.issizlikIsci, 0))}</td>
                                       <td className={cn("py-2.5 px-2 text-right")}>{/* GV Matrahı toplamı anlamsız */}</td>
                                       <td className={cn("py-2.5 px-2 text-right")}>{/* Kümülatif GV Matrahı toplamı anlamsız */}</td>
                                       <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.gelirVergisi, 0))}</td>
                                       <td className={cn("py-2.5 px-2 text-right")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.damgaVergisi, 0))}</td>
                                       <td className={cn("py-2.5 px-2 text-right sticky right-0 z-10", isDarkMode ? "bg-slate-700/50 text-primary" : "bg-slate-100 text-primary")}>{formatCurrency(aylikSonuclar.reduce((acc, curr) => acc + curr.net, 0))}</td>
                                     </tr>
                                  </tbody>
                                </table>
             </div>
                            ) : (
                                <p className={cn(isDarkMode ? "text-slate-400" : "text-slate-600")}>
                                    {(tabKey.includes("yemek") && !((yemekYardimiTipi === 'nakdi' && tabKey.includes("Nakdi")) || (yemekYardimiTipi === 'ayni' && tabKey.includes("Ayni")) && parseTurkishCurrency(yemekGunlukTutar) > 0)) ||
                                     (tabKey.includes("prim") && !(primVarMi && parseTurkishCurrency(primTutari) > 0)) ||
                                     (tabKey.includes("yol") && !((yolYardimiTipi === 'nakdi' && tabKey.includes("Nakdi")) || (yolYardimiTipi === 'ayni' && tabKey.includes("Ayni")) && parseTurkishCurrency(yolGunlukTutar) > 0))
                                     ? "İlgili yardım/prim seçili değil veya tutar girilmemiş."
                                     : `${tabKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} için detaylı hesaplama ve etki bilgileri bu alanda gösterilecektir.`
                                    }
                                </p>
                            )}
                        </CardContent>
                    </Card>
           </TabsContent>
              )
            })}

        </Tabs>
      )}

      {aylikSonuclar.length === 0 && !loading && parseTurkishCurrency(temelUcret) > 0 && (
          <div className={cn("mt-8 text-center", isDarkMode ? "text-slate-400" : "text-slate-600")}>
              Hesaplama yapılamadı. Lütfen girdileri kontrol edin.
          </div>
       )}
        {parseTurkishCurrency(temelUcret) <= 0 && !loading && (
             <div className={cn("mt-8 text-center", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                Lütfen geçerli bir brüt ücret girerek hesaplamayı başlatın.
            </div>
        )}

    </div>
    </TooltipProvider>
  );
};

export default BordroHesaplama; 