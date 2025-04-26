import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Format number to Turkish currency format
const formatToTurkishCurrency = (value: string): string => {
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9,]/g, '');
  
  // Convert comma to dot for calculations
  const normalizedValue = numericValue.replace(',', '.');
  
  // Parse the number
  const number = parseFloat(normalizedValue);
  
  // If not a valid number, return empty string
  if (isNaN(number)) return '';
  
  // Format the number to Turkish currency format
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

// Parse Turkish formatted currency to number
const parseTurkishCurrency = (value: string): number => {
  // Remove all non-numeric characters except decimal point or comma
  const numericValue = value.replace(/[^0-9.,]/g, '');
  // Convert comma to dot for JavaScript float parsing
  const normalizedValue = numericValue.replace(/,/g, '.');
  // Get the last decimal point value if multiple exists
  const parts = normalizedValue.split('.');
  const result = parts.length > 1 
    ? parts.slice(0, -1).join('') + '.' + parts.slice(-1)
    : normalizedValue;
  return parseFloat(result) || 0;
};

interface BordroSonuc {
  brut: string;
  net: string;
  sgk: number;
  issizlik: number;
  gelirVergisi: number;
  damga: number;
}

const BordroHesaplama = () => {
  const [hesaplamaTipi, setHesaplamaTipi] = useState<'bruttenNet' | 'nettenBrut'>('bruttenNet');
  const [tutar, setTutar] = useState<string>('');
  const [sonuc, setSonuc] = useState<BordroSonuc | null>(null);
  const [loading, setLoading] = useState(false);

  function bruttenNete(brut: number) {
    const sgkOran = 0.14;
    const issizlikOran = 0.01;
    const damgaOran = 0.00759;
    const gelirVergisiOran = 0.15;

    const istisnaGV = 3315.7;
    const istisnaDV = 197.38;

    const sgk = brut * sgkOran;
    const issizlik = brut * issizlikOran;
    const matrah = brut - sgk - issizlik;

    // Gelir Vergisi Hesabı
    let gelirVergisi = matrah * gelirVergisiOran;
    if (matrah > istisnaGV) {
      gelirVergisi -= istisnaGV;
    } else {
      gelirVergisi = 0;
    }

    // Damga Vergisi Hesabı
    let damga = brut * damgaOran;
    if (damga > istisnaDV) {
      damga -= istisnaDV;
    } else {
      damga = 0;
    }

    const net = brut - sgk - issizlik - gelirVergisi - damga;
    return {
      net: net.toFixed(2),
      detaylar: {
        brut: brut.toFixed(2),
        sgk,
        issizlik,
        gelirVergisi,
        damga
      }
    };
  }

  function nettenBrute(targetNet: number) {
    let brutTahmini = targetNet / 0.75; // Başlangıç tahmini
    let step = 1;
    let net = 0;

    while (step > 0.01) {
      const result = bruttenNete(brutTahmini);
      net = parseFloat(result.net);
      const diff = net - targetNet;

      if (Math.abs(diff) < 0.1) break;
      brutTahmini = brutTahmini - diff / 2;
    }

    const finalResult = bruttenNete(brutTahmini);
    return {
      brut: finalResult.detaylar.brut,
      net: finalResult.net,
      sgk: finalResult.detaylar.sgk,
      issizlik: finalResult.detaylar.issizlik,
      gelirVergisi: finalResult.detaylar.gelirVergisi,
      damga: finalResult.detaylar.damga
    };
  }

  const handleHesapla = () => {
    if (!tutar) return;

    setLoading(true);
    try {
      const tutarNum = parseTurkishCurrency(tutar);
      
      if (hesaplamaTipi === 'bruttenNet') {
        const result = bruttenNete(tutarNum);
        setSonuc({
          brut: result.detaylar.brut,
          net: result.net,
          sgk: result.detaylar.sgk,
          issizlik: result.detaylar.issizlik,
          gelirVergisi: result.detaylar.gelirVergisi,
          damga: result.detaylar.damga
        });
      } else {
        const result = nettenBrute(tutarNum);
        setSonuc(result);
      }
    } catch (error) {
      console.error('Hesaplama hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value));
  };

  return (
    <div className="bg-black/50 rounded-xl shadow-lg p-6 backdrop-blur-sm border border-white/5">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Bordro Hesaplama</h2>
      </div>

      <div className="space-y-6">
        {/* Hesaplama Tipi Seçimi */}
        <div className="flex gap-4 p-1 bg-white/5 rounded-lg w-fit">
          <button
            onClick={() => setHesaplamaTipi('bruttenNet')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              hesaplamaTipi === 'bruttenNet'
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Brütten Net
          </button>
          <button
            onClick={() => setHesaplamaTipi('nettenBrut')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              hesaplamaTipi === 'nettenBrut'
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Netten Brüt
          </button>
        </div>

        {/* Tutar Girişi */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/70">
            {hesaplamaTipi === 'bruttenNet' ? 'Brüt Tutar' : 'Net Tutar'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={tutar}
              onChange={(e) => setTutar(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-blue-400 placeholder:text-white/30"
              placeholder="Örnek: 22.104,67"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
              ₺
            </span>
          </div>
        </div>

        {/* Hesapla Butonu */}
        <Button
          onClick={handleHesapla}
          disabled={!tutar || loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Hesaplanıyor...' : 'Hesapla'}
        </Button>

        {/* Sonuçlar */}
        {sonuc && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-white/60">Brüt Ücret</p>
                <p className="text-lg font-semibold text-white mt-1">
                  {formatCurrency(sonuc.brut)}
                </p>
              </div>
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                <p className="text-sm text-white/60">Net Ücret</p>
                <p className="text-lg font-semibold text-blue-400 mt-1">
                  {formatCurrency(sonuc.net)}
                </p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-sm font-medium text-white/70 mb-4">Kesintiler</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/60">SGK</p>
                    <p className="text-xs text-white/40">%14</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '14%' }} />
                    </div>
                    <p className="text-sm font-medium text-purple-400">
                      {formatCurrency(sonuc.sgk)}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/60">İşsizlik</p>
                    <p className="text-xs text-white/40">%1</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '1%' }} />
                    </div>
                    <p className="text-sm font-medium text-pink-400">
                      {formatCurrency(sonuc.issizlik)}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/60">Gelir Vergisi</p>
                    <p className="text-xs text-white/40">%15</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '15%' }} />
                    </div>
                    <p className="text-sm font-medium text-yellow-400">
                      {formatCurrency(sonuc.gelirVergisi)}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/60">Damga</p>
                    <p className="text-xs text-white/40">%0.759</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '0.759%' }} />
                    </div>
                    <p className="text-sm font-medium text-green-400">
                      {formatCurrency(sonuc.damga)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BordroHesaplama; 