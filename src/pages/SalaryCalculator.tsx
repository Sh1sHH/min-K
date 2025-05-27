import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

interface SalaryResult {
  brut: number;
  sgk: number;
  issizlik: number;
  gelirVergisi: number;
  damgaVergisi: number;
  netHesaplanan: number;
}

const SalaryCalculator: React.FC = () => {
  const [netSalary, setNetSalary] = useState<string>('');
  const [result, setResult] = useState<SalaryResult | null>(null);
  const [error, setError] = useState<string>('');

  const calculateGrossFromNet = (net: number): SalaryResult => {
    const ORAN_SGK = 0.14;
    const ORAN_ISSIZLIK = 0.01;
    const ORAN_GV = 0.15;
    const ORAN_DAMGA = 0.00759;
    
    const ISTISNA_GV = 3315.7;
    const ISTISNA_DV = 197.38;

    let tahminiBrut = net / 0.75; // kaba tahmin başlangıç
    let fark = 0;

    do {
      let sgk = tahminiBrut * ORAN_SGK;
      let issizlik = tahminiBrut * ORAN_ISSIZLIK;
      let matrahGV = tahminiBrut - sgk - issizlik;
      let vergiGV = 0;
      let damga = 0;

      // Gelir vergisi hesapla
      if (Math.round(matrahGV * 100) / 100 === ISTISNA_GV) {
        vergiGV = matrahGV * ORAN_GV; // istisna uygulanmaz
      } else if (matrahGV > ISTISNA_GV) {
        vergiGV = (matrahGV * ORAN_GV) - ISTISNA_GV;
      } else {
        vergiGV = 0;
      }

      // Damga vergisi hesapla
      damga = tahminiBrut * ORAN_DAMGA;
      if (Math.round(damga * 100) / 100 === ISTISNA_DV) {
        damga = 0;
      } else if (damga > ISTISNA_DV) {
        damga = damga - ISTISNA_DV;
      } else {
        damga = 0;
      }

      // Net maaş hesapla
      const netHesaplanan = tahminiBrut - sgk - issizlik - vergiGV - damga;
      fark = net - netHesaplanan;
      tahminiBrut = tahminiBrut + fark / 2;

      if (Math.abs(fark) <= 0.01) {
        return {
          brut: tahminiBrut,
          sgk: sgk,
          issizlik: issizlik,
          gelirVergisi: vergiGV,
          damgaVergisi: damga,
          netHesaplanan: netHesaplanan
        };
      }
    } while (true);

    // TypeScript için default return
    return {
      brut: 0,
      sgk: 0,
      issizlik: 0,
      gelirVergisi: 0,
      damgaVergisi: 0,
      netHesaplanan: 0
    };
  };

  const handleCalculate = () => {
    const net = parseFloat(netSalary);
    if (isNaN(net) || net <= 0) {
      setError('Lütfen geçerli bir net maaş girin.');
      setResult(null);
      return;
    }
    setError('');
    setResult(calculateGrossFromNet(net));
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block p-3 rounded-full bg-purple-100 mb-4"
          >
            <Calculator className="w-8 h-8 text-purple-600" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Netten Brüte Maaş Hesaplama
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-gray-600"
          >
            Net maaşınızı girin, brüt maaşınızı ve kesintileri hesaplayalım.
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="mb-8">
            <label htmlFor="netSalary" className="block text-sm font-medium text-gray-700 mb-2">
              Net Maaş (TL)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                name="netSalary"
                id="netSalary"
                value={netSalary}
                onChange={(e) => setNetSalary(e.target.value)}
                className="block w-full rounded-lg border-gray-300 pl-4 pr-12 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm">TL</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Hesapla
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Brüt Maaş</p>
                  <p className="text-xl font-semibold">{result.brut.toFixed(2)} TL</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">SGK (%14)</p>
                  <p className="text-xl font-semibold">{result.sgk.toFixed(2)} TL</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">İşsizlik (%1)</p>
                  <p className="text-xl font-semibold">{result.issizlik.toFixed(2)} TL</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600 font-medium">Gelir Vergisi</p>
                  <p className="text-xl font-semibold">{result.gelirVergisi.toFixed(2)} TL</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">Damga Vergisi</p>
                  <p className="text-xl font-semibold">{result.damgaVergisi.toFixed(2)} TL</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-600 font-medium">Hesaplanan Net</p>
                  <p className="text-xl font-semibold">{result.netHesaplanan.toFixed(2)} TL</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SalaryCalculator; 