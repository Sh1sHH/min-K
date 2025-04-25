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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-[#4DA3FF]" />
        <h2 className="text-xl font-semibold text-gray-900">Bordro Hesaplama</h2>
      </div>

      <div className="space-y-6">
        {/* Hesaplama Tipi Seçimi */}
        <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit">
          <button
            onClick={() => setHesaplamaTipi('bruttenNet')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              hesaplamaTipi === 'bruttenNet'
                ? 'bg-white text-[#4DA3FF] shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Brütten Net
          </button>
          <button
            onClick={() => setHesaplamaTipi('nettenBrut')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              hesaplamaTipi === 'nettenBrut'
                ? 'bg-white text-[#4DA3FF] shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Netten Brüt
          </button>
        </div>

        {/* Tutar Girişi */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {hesaplamaTipi === 'bruttenNet' ? 'Brüt Tutar' : 'Net Tutar'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={tutar}
              onChange={(e) => setTutar(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DA3FF]/20 focus:border-[#4DA3FF] transition-all text-[#4DA3FF]"
              placeholder="Örnek: 22.104,67"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              ₺
            </span>
          </div>
        </div>

        {/* Hesapla Butonu */}
        <Button
          onClick={handleHesapla}
          disabled={!tutar || loading}
          className="w-full bg-[#4DA3FF] hover:bg-[#4DA3FF]/90 text-white py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4DA3FF]/20"
        >
          {loading ? 'Hesaplanıyor...' : 'Hesapla'}
        </Button>

        {/* Sonuçlar */}
        {sonuc && (
          <div className="mt-6 space-y-4 bg-gray-50 rounded-xl p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Brüt Ücret</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(sonuc.brut)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Net Ücret</p>
                <p className="text-lg font-semibold text-[#4DA3FF]">
                  {formatCurrency(sonuc.net)}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Kesintiler</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">SGK Kesintisi (%14)</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(sonuc.sgk)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">İşsizlik Kesintisi (%1)</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(sonuc.issizlik)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Gelir Vergisi (%15)</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(sonuc.gelirVergisi)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Damga Vergisi (%0.759)</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(sonuc.damga)}
                  </p>
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