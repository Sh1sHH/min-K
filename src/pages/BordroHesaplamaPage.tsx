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
    // const STANDART_İSTİSNA = 22104.68; // Bu değer artık doğrudan kullanılmayacak, referans olarak kalabilir.
    
    // 1. Adım: Temel aylık değerleri hesapla (Gelir Vergisi ve Kesilecek GV hariç)
    const aylikSonuclarTemel = AYLAR.slice(0, 12).map((ay, index) => {
      const sgkIsciPayi = brutMaas * 0.14;
      const issizlikIsciPayi = brutMaas * 0.01;
      const aylikGelirVergisiMatrahi = brutMaas - sgkIsciPayi - issizlikIsciPayi;
      const kumulatifMatrah = aylikGelirVergisiMatrahi * (index + 1);

      let aylikSabitGelirVergisiIstisnasi = 0;
      if (index <= 6) { // Ocak - Temmuz
        aylikSabitGelirVergisiIstisnasi = 3315.70;
      } else if (index === 7) { // Ağustos
        aylikSabitGelirVergisiIstisnasi = 4257.57;
      } else if (index >= 8 && index <= 11) { // Eylül - Aralık
        aylikSabitGelirVergisiIstisnasi = 4420.94;
      }

      const aylikDamgaVergisi = brutMaas * 0.00759;
      const aylikDamgaVergisiIstisnasi = 197.38;
      const aylikKesilecekDamgaVergisi = aylikDamgaVergisi - aylikDamgaVergisiIstisnasi;

      // Aylık SGK İşveren ve İşsizlik İşveren Payları
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
        asgariUcretGelirVergisiIstisnasi: aylikSabitGelirVergisiIstisnasi, // Sabit istisna
        damgaVergisi: aylikDamgaVergisi,
        asgariUcretDamgaVergisiIstisnasi: aylikDamgaVergisiIstisnasi,
        kesilecekDamgaVergisi: aylikKesilecekDamgaVergisi,
        aylikGelirVergisi: 0, // Adım 2'de hesaplanıp güncellenecek
        kesilecekGelirVergisi: 0, // Adım 2'de hesaplanıp güncellenecek
        net: brutMaas * 0.7,
        asgariGecimIndirimi: 1000,
        netOdenecekTutar: brutMaas * 0.7 + 1000,
        sgkIsveren: aylikSgkIsverenPayi,
        issizlikIsveren: aylikIssizlikIsverenPayi,
        toplamMaliyet: brutMaas + aylikSgkIsverenPayi + aylikIssizlikIsverenPayi
      };
    });

    // 2. Adım: Detaylı Aylık Gelir Vergisi ve Kesilecek Gelir Vergisini Hesapla
    let oncekiAyMatrah = 0;
    let ilkKezDilim1Asildi = false;
    let ilkKezDilim2Asildi = false;
    let ilkKezDilim3Asildi = false;
    let ilkKezDilim4Asildi = false;

    for (let i = 0; i < aylikSonuclarTemel.length; i++) {
      const sonuc = aylikSonuclarTemel[i];
      const kumulatifMatrah = sonuc.kumulatifVergiMatrahi;
      let hesaplananAylikGelirVergisi = 0;
      
      if (kumulatifMatrah <= VERGİ_DİLİMİ_1) {
        hesaplananAylikGelirVergisi = sonuc.gelirVergisiMatrahi * ORAN_1;
      } else if (kumulatifMatrah <= VERGİ_DİLİMİ_2) {
        if (!ilkKezDilim1Asildi) {
          ilkKezDilim1Asildi = true;
          const dilimAsimFarki = VERGİ_DİLİMİ_1 - oncekiAyMatrah;
          const yuksekDilimFarki = sonuc.gelirVergisiMatrahi - dilimAsimFarki; // Bu ayın matrahının ne kadarı %15, ne kadarı %20
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
      aylikSonuclarTemel[i].kesilecekGelirVergisi = hesaplananAylikGelirVergisi - sonuc.asgariUcretGelirVergisiIstisnasi;

      // NET ÜCRET HESAPLAMASI
      aylikSonuclarTemel[i].net = sonuc.brut - sonuc.sgkIsci - sonuc.issizlikIsci - aylikSonuclarTemel[i].kesilecekGelirVergisi - sonuc.kesilecekDamgaVergisi;

      oncekiAyMatrah = kumulatifMatrah;
    }

    // 3. Adım: TOPLAM satırını oluştur
    const toplamSonuc = {
      ay: 'TOPLAM',
      brut: aylikSonuclarTemel.reduce((sum, s) => sum + s.brut, 0),
      sgkIsci: aylikSonuclarTemel.reduce((sum, s) => sum + s.sgkIsci, 0),
      issizlikIsci: aylikSonuclarTemel.reduce((sum, s) => sum + s.issizlikIsci, 0),
      gelirVergisiMatrahi: aylikSonuclarTemel.reduce((sum, s) => sum + s.gelirVergisiMatrahi, 0),
      kumulatifVergiMatrahi: aylikSonuclarTemel[aylikSonuclarTemel.length - 1].kumulatifVergiMatrahi, // Son ayın kümülatifi
      asgariUcretGelirVergisiIstisnasi: aylikSonuclarTemel.reduce((sum, s) => sum + s.asgariUcretGelirVergisiIstisnasi, 0),
      damgaVergisi: aylikSonuclarTemel.reduce((sum, s) => sum + s.damgaVergisi, 0),
      aylikGelirVergisi: aylikSonuclarTemel.reduce((sum, s) => sum + s.aylikGelirVergisi, 0),
      kesilecekGelirVergisi: aylikSonuclarTemel.reduce((sum, s) => sum + s.kesilecekGelirVergisi, 0),
      net: aylikSonuclarTemel.reduce((sum, s) => sum + s.net, 0), // Güncellenecek
      asgariGecimIndirimi: aylikSonuclarTemel.reduce((sum, s) => sum + s.asgariGecimIndirimi, 0),
      asgariUcretDamgaVergisiIstisnasi: aylikSonuclarTemel.reduce((sum, s) => sum + s.asgariUcretDamgaVergisiIstisnasi, 0),
      kesilecekDamgaVergisi: aylikSonuclarTemel.reduce((sum, s) => sum + s.kesilecekDamgaVergisi, 0), // YENİ EKLENDİ
      netOdenecekTutar: aylikSonuclarTemel.reduce((sum, s) => sum + s.netOdenecekTutar, 0), // Güncellenecek
      sgkIsveren: aylikSonuclarTemel.reduce((sum, s) => sum + s.sgkIsveren, 0),
      issizlikIsveren: aylikSonuclarTemel.reduce((sum, s) => sum + s.issizlikIsveren, 0),
      toplamMaliyet: aylikSonuclarTemel.reduce((sum, s) => sum + s.toplamMaliyet, 0),
    };

    const sonuclarNihai = [...aylikSonuclarTemel, toplamSonuc];
    setSonuclar(sonuclarNihai);
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
        <div className="max-w-7xl mx-auto">
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
                    <table className="w-full text-[10px] border-collapse">
                      <thead>
                        <tr className="bg-[#F9FAFC]">
                          <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase"></th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase">BRÜT</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase">SGK İŞÇİ</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase">İŞSİZLİK İŞÇİ</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase">GELİR VERGİSİ MATRAHI</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase">KÜMÜLATİF VERGİ MATRAHI</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase">GELİR VERGİSİ</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase">GELİR VERGİSİ İSTİSNASI</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase">KESİLECEK GELİR VERGİSİ</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase">DAMGA VERGİSİ</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase">DAMGA VERGİSİ İSTİSNASI</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase">KESİLECEK DAMGA VERGİSİ</th>
                          <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase">NET ÜCRET</th>
                          {iseGostergeMaliyeti && (
                            <>
                              <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase">SGK İŞVEREN</th>
                              <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase">SGK İŞSİZLİK İŞVEREN</th>
                              <th className="border border-[#1F2A44]/20 p-2 text-left text-[10px] font-medium uppercase">TOPLAM MALİYET</th>
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
                              {sonuclar && formatNumber(sonuclar[index]?.gelirVergisiMatrahi || 0)}
                            </td>
                            <td className="border border-[#1F2A44]/20 p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.kumulatifVergiMatrahi || 0)}
                            </td>
                            <td className="border border-[#1F2A44]/20 p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.aylikGelirVergisi || 0)}
                            </td>
                            <td className="border border-[#1F2A44]/20 p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.asgariUcretGelirVergisiIstisnasi || 0)}
                            </td>
                            <td className="border border-[#1F2A44]/20 p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.kesilecekGelirVergisi || 0)}
                            </td>
                            <td className="border border-[#1F2A44]/20 p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.damgaVergisi || 0)}
                            </td>
                            <td className="border border-[#1F2A44]/20 p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.asgariUcretDamgaVergisiIstisnasi || 0)}
                            </td>
                            <td className="border border-[#1F2A44]/20 p-2 text-right">
                              {sonuclar && formatNumber(sonuclar[index]?.kesilecekDamgaVergisi || 0)}
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