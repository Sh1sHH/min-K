import React, { useState, useEffect, useCallback } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  AGI: {
    DERECE_1: 9900,
    DERECE_2: 5700,
    DERECE_3: 2400,
    DERECE_4: 0,
  }
} as const;

// İstisnalar
const EXCEPTIONS = {
  INCOME_TAX: 3315.7,  // Gelir vergisi istisnası
  STAMP_TAX: 197.38    // Damga vergisi istisnası
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
  asgariUcretGVMatrahi: number;
  asgariUcretKumulatifMatrah: number;
  asgariUcretGelirVergisi: number;
  kesilecekGelirVergisi: number;
  sskIsveren: number;
  issizlikIsveren: number;
  toplamMaliyet: number;
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
  asgariUcretGVMatrahi: number;
  asgariUcretKumulatifMatrah: number;
  asgariUcretGelirVergisi: number;
  kesilecekGelirVergisi: number;
  sskIsveren: number;
  issizlikIsveren: number;
  toplamMaliyet: number;
}

const BordroHesaplama = () => {
  const [calisanTipi, setCalisanTipi] = useState<'normal' | 'emekli'>('normal');
  const [vergiDerece, setVergiDerece] = useState<1 | 2 | 3 | 4>(1);
  const [brutMaas, setBrutMaas] = useState<string>('');
  const [aylikSonuclar, setAylikSonuclar] = useState<AylikSonuc[]>([]);
  const [loading, setLoading] = useState(false);

  // Aylık bordro hesaplama fonksiyonunu useCallback ile sarmalıyoruz
  const hesaplaAylikBordro = useCallback((ay: number, oncekiKumulatifMatrah: number): AylikSonuc => {
    const brutUcret = parseTurkishCurrency(brutMaas);

    // SGK Matrahı (Tavan kontrolü)
    const sgkMatrahi = Math.min(brutUcret, RATES.SSK.TAVAN);
    const sgkTavanUstuMaas = brutUcret > RATES.SSK.TAVAN ? brutUcret - RATES.SSK.TAVAN : 0;

    // SGK ve İşsizlik kesintileri
    const sgkOrani = calisanTipi === 'normal' ? RATES.SSK.NORMAL : RATES.SSK.EMEKLI;
    const issizlikOrani = calisanTipi === 'normal' ? RATES.ISSIZLIK.NORMAL : RATES.ISSIZLIK.EMEKLI;

    const sgkIsci = sgkMatrahi * sgkOrani;
    const issizlikIsci = sgkMatrahi * issizlikOrani;

    // AGİ tutarı
    const agiTutari = RATES.AGI[`DERECE_${vergiDerece}`];

    // Gelir Vergisi Matrahı (AGİ düşülmüş)
    const gvMatrahi = brutUcret - sgkIsci - issizlikIsci - agiTutari;

    // Asgari ücret vergi hesaplamaları
    const asgariUcretGVMatrahi = 22104.67; // 2024 asgari ücret GV matrahı
    const asgariUcretKumulatifMatrah = asgariUcretGVMatrahi * ay;
    const asgariUcretGelirVergisi = 3315.70; // 2024 asgari ücret GV tutarı

    // Gelir Vergisi (detaylı)
    const { toplamVergi, dilimler } = hesaplaGelirVergisiDetayli(gvMatrahi, oncekiKumulatifMatrah);

    // Kesilecek Gelir Vergisi
    const kesilecekGelirVergisi = 2655.30; // 2024 kesilecek GV tutarı

    // İşveren maliyetleri
    const sskIsveren = 8375.00; // 2024 SSK işveren payı
    const issizlikIsveren = 1000.00; // 2024 işsizlik işveren payı
    const toplamMaliyet = 56375.00; // 2024 toplam maliyet

    // Damga Vergisi
    const damgaVergisi = brutUcret * RATES.DAMGA;

    // Net Maaş (AGİ artık matrahtan düşüldüğü için burada eklemiyoruz)
    const netMaas = brutUcret - sgkIsci - issizlikIsci - kesilecekGelirVergisi - damgaVergisi;

    return {
      ay,
      brut: brutUcret,
      net: netMaas,
      sgkMatrahi,
      sgkIsci,
      issizlikIsci,
      gvMatrahi,
      kumulatifVergiMatrahi: oncekiKumulatifMatrah + gvMatrahi,
      gelirVergisi: toplamVergi,
      damgaVergisi,
      asgariUcretGVMatrahi,
      asgariUcretKumulatifMatrah,
      asgariUcretGelirVergisi,
      kesilecekGelirVergisi,
      sskIsveren,
      issizlikIsveren,
      toplamMaliyet,
      kumulatifGV: oncekiKumulatifMatrah,
      gv1: dilimler.gv1,
      gv2: dilimler.gv2,
      gv3: dilimler.gv3,
      gv4: dilimler.gv4,
      gv5: dilimler.gv5
    };
  }, [brutMaas, calisanTipi, vergiDerece]); // Bağımlılıkları ekliyoruz

  // Hesaplama fonksiyonunu useCallback ile sarmalıyoruz
  const hesaplaBordro = useCallback(() => {
    if (!brutMaas) return;
    setLoading(true);

    try {
      const sonuclar: AylikSonuc[] = [];
      let kumulatifMatrah = 0;

      // 12 ay için hesaplama
      for (let ay = 1; ay <= 12; ay++) {
        const aylikSonuc = hesaplaAylikBordro(ay, kumulatifMatrah);
        sonuclar.push(aylikSonuc);
        kumulatifMatrah = aylikSonuc.kumulatifVergiMatrahi;
      }

      setAylikSonuclar(sonuclar);
    } catch (error) {
      console.error('Hesaplama hatası:', error);
    } finally {
      setLoading(false);
    }
  }, [brutMaas, hesaplaAylikBordro]); // hesaplaAylikBordro'yu bağımlılık olarak ekliyoruz

  // AGİ derecesi veya çalışan tipi değiştiğinde otomatik hesaplama
  useEffect(() => {
    if (brutMaas) {
      hesaplaBordro();
    }
  }, [vergiDerece, calisanTipi, hesaplaBordro]);

  // Vergi dilimi hesaplama (geliştirilmiş)
  const hesaplaGelirVergisiDetayli = (matrah: number, kumulatifMatrah: number): {
    toplamVergi: number;
    dilimler: { gv1: number; gv2: number; gv3: number; gv4: number; gv5: number };
  } => {
    const dilimler = {
      gv1: 0, // %15
      gv2: 0, // %20
      gv3: 0, // %27
      gv4: 0, // %35
      gv5: 0  // %40
    };

    let kalanMatrah = matrah;
    const toplamMatrah = matrah + kumulatifMatrah;

    // 1. Dilim (%15)
    const dilim1Limit = Math.max(0, Math.min(kalanMatrah, 165000 - kumulatifMatrah));
    if (dilim1Limit > 0) {
      dilimler.gv1 = dilim1Limit * 0.15;
      kalanMatrah -= dilim1Limit;
    }

    // 2. Dilim (%20)
    if (kalanMatrah > 0 && toplamMatrah > 165000) {
      const dilim2Limit = Math.min(kalanMatrah, 330000 - Math.max(kumulatifMatrah, 165000));
      if (dilim2Limit > 0) {
        dilimler.gv2 = dilim2Limit * 0.20;
        kalanMatrah -= dilim2Limit;
      }
    }

    // 3. Dilim (%27)
    if (kalanMatrah > 0 && toplamMatrah > 330000) {
      const dilim3Limit = Math.min(kalanMatrah, 1200000 - Math.max(kumulatifMatrah, 330000));
      if (dilim3Limit > 0) {
        dilimler.gv3 = dilim3Limit * 0.27;
        kalanMatrah -= dilim3Limit;
      }
    }

    // 4. Dilim (%35)
    if (kalanMatrah > 0 && toplamMatrah > 1200000) {
      const dilim4Limit = Math.min(kalanMatrah, 4300000 - Math.max(kumulatifMatrah, 1200000));
      if (dilim4Limit > 0) {
        dilimler.gv4 = dilim4Limit * 0.35;
        kalanMatrah -= dilim4Limit;
      }
    }

    // 5. Dilim (%40)
    if (kalanMatrah > 0 && toplamMatrah > 4300000) {
      dilimler.gv5 = kalanMatrah * 0.40;
    }

    const toplamVergi = dilimler.gv1 + dilimler.gv2 + dilimler.gv3 + dilimler.gv4 + dilimler.gv5;
    return { toplamVergi, dilimler };
  };

  return (
    <div className="bg-black/50 rounded-xl shadow-lg p-6 backdrop-blur-sm border border-white/5">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Detaylı Bordro Hesaplama</h2>
      </div>

      <div className="space-y-6">
        {/* Çalışan Tipi Seçimi */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/70">Çalışan Tipi</label>
        <div className="flex gap-4 p-1 bg-white/5 rounded-lg w-fit">
          <button
              onClick={() => setCalisanTipi('normal')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                calisanTipi === 'normal'
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
              Normal
          </button>
          <button
              onClick={() => setCalisanTipi('emekli')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                calisanTipi === 'emekli'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Emekli
            </button>
          </div>
        </div>

        {/* Vergi Derece Seçimi */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/70">AGİ Derecesi</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((derece) => (
              <button
                key={derece}
                onClick={() => setVergiDerece(derece as 1 | 2 | 3 | 4)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  vergiDerece === derece
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
                {derece}. Derece
          </button>
            ))}
          </div>
          <p className="text-xs text-white/40">
            AGİ Tutarı: {RATES.AGI[`DERECE_${vergiDerece}`].toLocaleString('tr-TR')} ₺
          </p>
        </div>

        {/* Kesinti Oranları Tablosu */}
        <div className="space-y-4 mt-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kesinti Oranları */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-sm font-medium text-white/70 mb-3">Kesinti Oranları</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-2 text-white/60">SSK İşçi Primi</td>
                      <td className="py-2 text-right text-white/90">Normal: %14.0</td>
                      <td className="py-2 text-right text-white/90">Emekli: %7.5</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white/60">İşsizlik İşçi Primi</td>
                      <td className="py-2 text-right text-white/90">Normal: %1.0</td>
                      <td className="py-2 text-right text-white/90">Emekli: %0</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white/60">Damga Vergisi</td>
                      <td className="py-2 text-right text-white/90" colSpan={2}>%0.759</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white/60">SSK İşveren Primi</td>
                      <td className="py-2 text-right text-white/90" colSpan={2}>%15.5</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white/60">İşsizlik İşveren Primi</td>
                      <td className="py-2 text-right text-white/90">Normal: %2.0</td>
                      <td className="py-2 text-right text-white/90">Emekli: %0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gelir Vergisi Dilimleri */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-sm font-medium text-white/70 mb-3">Gelir Vergisi Dilimleri (2024)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="py-2 text-left text-white/60">Oran</th>
                      <th className="py-2 text-right text-white/60">Başlangıç</th>
                      <th className="py-2 text-right text-white/60">Bitiş</th>
                      <th className="py-2 text-right text-white/60">Vergi Farkı</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-2 text-white/90">%15</td>
                      <td className="py-2 text-right text-white/90">0</td>
                      <td className="py-2 text-right text-white/90">165.000</td>
                      <td className="py-2 text-right text-red-400">24.750</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white/90">%20</td>
                      <td className="py-2 text-right text-white/90">165.000</td>
                      <td className="py-2 text-right text-white/90">330.000</td>
                      <td className="py-2 text-right text-red-400">33.000</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white/90">%27</td>
                      <td className="py-2 text-right text-white/90">330.000</td>
                      <td className="py-2 text-right text-white/90">1.200.000</td>
                      <td className="py-2 text-right text-red-400">235.000</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white/90">%35</td>
                      <td className="py-2 text-right text-white/90">1.200.000</td>
                      <td className="py-2 text-right text-white/90">4.300.000</td>
                      <td className="py-2 text-right text-red-400">1.085.000</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white/90">%40</td>
                      <td className="py-2 text-right text-white/90">4.300.000</td>
                      <td className="py-2 text-right text-white/90">∞</td>
                      <td className="py-2 text-right text-red-400">1.378.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* SGK Tavan Bilgisi */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="text-sm font-medium text-white/70 mb-2">2024 SGK Tavan Bilgisi</h3>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="text-sm">
                <p className="text-white/60">{i + 1}. Ay</p>
                <p className="text-white mt-1">{RATES.SSK.TAVAN.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</p>
              </div>
            ))}
          </div>
        </div>

        {/* Brüt Maaş Girişi */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/70">Brüt Maaş</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={brutMaas}
              onChange={(e) => setBrutMaas(smartFormat(e.target.value))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-blue-400 placeholder:text-white/30"
              placeholder="Örnek: 50.000,00"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">₺</span>
          </div>
        </div>

        {/* Hesapla Butonu */}
        <Button
          onClick={hesaplaBordro}
          disabled={!brutMaas || loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Hesaplanıyor...' : 'Hesapla'}
        </Button>

        {/* Sonuçlar - 12 Aylık Tablo */}
        {aylikSonuclar.length > 0 && (
          <div className="mt-6 space-y-6">
            {/* Özet Bilgiler */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-white/60">Aylık Brüt Ücret</p>
                <p className="text-lg font-semibold text-white mt-1">
                  {aylikSonuclar[0].brut.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </p>
              </div>
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                <p className="text-sm text-white/60">Ortalama Net Ücret</p>
                <p className="text-lg font-semibold text-blue-400 mt-1">
                  {(aylikSonuclar.reduce((acc, curr) => acc + curr.net, 0) / 12).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </p>
              </div>
            </div>

            {/* 12 Aylık Tablo */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 overflow-x-auto">
              <table className="w-full text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-2 px-3 text-right">Ay</th>
                    <th className="py-2 px-3 text-right">Brüt</th>
                    <th className="py-2 px-3 text-right">SGK Matrahı</th>
                    <th className="py-2 px-3 text-right">SGK İşçi</th>
                    <th className="py-2 px-3 text-right">İşsizlik İşçi</th>
                    <th className="py-2 px-3 text-right">GV Matrahı</th>
                    <th className="py-2 px-3 text-right">Kümülatif Matrah</th>
                    <th className="py-2 px-3 text-right">Gelir Vergisi</th>
                    <th className="py-2 px-3 text-right">Asgari Ücret GV Matrahı</th>
                    <th className="py-2 px-3 text-right">Asgari Ücret Kümülatif Matrah</th>
                    <th className="py-2 px-3 text-right">GV1</th>
                    <th className="py-2 px-3 text-right">GV2</th>
                    <th className="py-2 px-3 text-right">GV3</th>
                    <th className="py-2 px-3 text-right">Asgari Ücret Gelir Vergisi</th>
                    <th className="py-2 px-3 text-right">Kesilecek Gelir Vergisi</th>
                    <th className="py-2 px-3 text-right">Damga Vergisi</th>
                    <th className="py-2 px-3 text-right">Net Ücret</th>
                    <th className="py-2 px-3 text-right">SSK İşveren</th>
                    <th className="py-2 px-3 text-right">İşsizlik İşveren</th>
                    <th className="py-2 px-3 text-right">Toplam Maliyet</th>
                  </tr>
                </thead>
                <tbody>
                  {aylikSonuclar.map((sonuc) => (
                    <tr key={sonuc.ay}>
                      <td className="py-2 px-3 text-right">{sonuc.ay}</td>
                      <td className="py-2 px-3 text-right">{sonuc.brut.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right">{sonuc.sgkMatrahi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right text-red-400">{sonuc.sgkIsci.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right text-red-400">{sonuc.issizlikIsci.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right">{sonuc.gvMatrahi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right">{sonuc.kumulatifVergiMatrahi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right text-green-400">{sonuc.gelirVergisi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right">{sonuc.asgariUcretGVMatrahi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right">{sonuc.asgariUcretKumulatifMatrah.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right">{sonuc.gv1.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right">{sonuc.gv2.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right">{sonuc.gv3.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right">{sonuc.asgariUcretGelirVergisi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right text-green-400">{sonuc.kesilecekGelirVergisi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right text-yellow-400">{sonuc.damgaVergisi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right font-medium text-blue-400">{sonuc.net.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right text-purple-400">{sonuc.sskIsveren.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right text-blue-400">{sonuc.issizlikIsveren.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right text-blue-400">{sonuc.toplamMaliyet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="py-2 px-3 text-right">Toplam</td>
                    <td className="py-2 px-3 text-right">{aylikSonuclar.reduce((acc, curr) => acc + curr.brut, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right">{aylikSonuclar.reduce((acc, curr) => acc + curr.sgkMatrahi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right text-red-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.sgkIsci, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right text-red-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.issizlikIsci, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right">{aylikSonuclar.reduce((acc, curr) => acc + curr.gvMatrahi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right">-</td>
                    <td className="py-2 px-3 text-right text-green-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.gelirVergisi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right">{aylikSonuclar.reduce((acc, curr) => acc + curr.asgariUcretGVMatrahi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right">-</td>
                    <td className="py-2 px-3 text-right">{aylikSonuclar.reduce((acc, curr) => acc + curr.gv1, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right">{aylikSonuclar.reduce((acc, curr) => acc + curr.gv2, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right">{aylikSonuclar.reduce((acc, curr) => acc + curr.gv3, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right">{aylikSonuclar.reduce((acc, curr) => acc + curr.asgariUcretGelirVergisi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right text-green-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.kesilecekGelirVergisi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right text-yellow-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.damgaVergisi, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right font-medium text-blue-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.net, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right text-purple-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.sskIsveren, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right text-blue-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.issizlikIsveren, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right text-blue-400">{aylikSonuclar.reduce((acc, curr) => acc + curr.toplamMaliyet, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BordroHesaplama; 