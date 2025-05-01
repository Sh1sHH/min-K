import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Footer from '@/components/Footer';

// Türk Lirası formatlama fonksiyonu
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2
  }).format(value);
};

const BordroHesaplamaPage = () => {
  // Basit hesaplayıcı state'leri
  const [brutMaas, setBrutMaas] = useState<number>(15000);
  const [calisanTipi, setCalisanTipi] = useState<string>("normal");
  const [sonuclar, setSonuclar] = useState<{
    netMaas: number;
    sgkIsci: number;
    issizlikIsci: number;
    gelirVergisi: number;
    damgaVergisi: number;
    toplamMaliyet: number;
  } | null>(null);

  // Basit hesaplama fonksiyonu
  const hesaplaBordro = () => {
    // Sabit değerler
    const SGK_ISCI_ORANI = calisanTipi === "normal" ? 0.14 : 0.075;
    const ISSIZLIK_ISCI_ORANI = calisanTipi === "normal" ? 0.01 : 0;
    const DAMGA_VERGISI_ORANI = 0.00759;
    const GELIR_VERGISI_ORANI = 0.15; // Basitleştirilmiş oran (ilk dilim)
    const SGK_ISVEREN_ORANI = calisanTipi === "normal" ? 0.155 : 0.2475;
    const ISSIZLIK_ISVEREN_ORANI = calisanTipi === "normal" ? 0.02 : 0;
    
    // SGK primi hesaplama (işçi payı)
    const sgkIsci = brutMaas * SGK_ISCI_ORANI;
    
    // İşsizlik sigortası hesaplama (işçi payı)
    const issizlikIsci = brutMaas * ISSIZLIK_ISCI_ORANI;
    
    // Gelir vergisi matrahı
    const gelirVergisiMatrahi = brutMaas - sgkIsci - issizlikIsci;
    
    // Gelir vergisi hesaplama (basitleştirilmiş)
    const gelirVergisi = gelirVergisiMatrahi * GELIR_VERGISI_ORANI;
    
    // Damga vergisi hesaplama
    const damgaVergisi = brutMaas * DAMGA_VERGISI_ORANI;
    
    // Net maaş hesaplama
    const netMaas = brutMaas - sgkIsci - issizlikIsci - gelirVergisi - damgaVergisi;
    
    // İşveren maliyeti hesaplama
    const sgkIsveren = brutMaas * SGK_ISVEREN_ORANI;
    const issizlikIsveren = brutMaas * ISSIZLIK_ISVEREN_ORANI;
    const toplamMaliyet = brutMaas + sgkIsveren + issizlikIsveren;
    
    // Sonuçları state'e kaydet
    setSonuclar({
      netMaas,
      sgkIsci,
      issizlikIsci,
      gelirVergisi,
      damgaVergisi,
      toplamMaliyet
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Bölümü */}
      <section className="bg-gradient-to-b from-[#4DA3FF]/10 to-white pt-32 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-center text-[#1F2A44] mb-6">
            Bordro Hesaplama
          </h1>
          <p className="text-center text-xl text-[#1F2A44]/80 max-w-3xl mx-auto mb-12">
            İK süreçlerinizin en kritik parçası olan bordro hesaplamalarını
            hızlı ve doğru bir şekilde yapmanıza yardımcı oluyoruz.
          </p>
        </div>
      </section>

      {/* Ana İçerik */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Sol Taraf - Bilgi */}
          <div>
            <h2 className="text-3xl font-semibold text-[#1F2A44] mb-8">
              Neden Bordro Hesaplama Önemli?
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-[#4DA3FF] p-3 rounded-full shrink-0">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Doğru ve Hatasız Hesaplama</h3>
                  <p className="text-[#1F2A44]/70">
                    Karmaşık vergi dilimleri, SGK primleri ve diğer kesintileri otomatik olarak hesaplayın, 
                    insan kaynaklı hataları önleyin.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-[#4DA3FF] p-3 rounded-full shrink-0">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Yasal Mevzuata Uygunluk</h3>
                  <p className="text-[#1F2A44]/70">
                    Sürekli değişen vergi oranları ve SGK tavanlarına uygun hesaplamalar yaparak
                    yasal yükümlülüklerinizi eksiksiz yerine getirin.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-[#4DA3FF] p-3 rounded-full shrink-0">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Zaman Tasarrufu</h3>
                  <p className="text-[#1F2A44]/70">
                    Manuel hesaplamalarla saatler harcamak yerine, saniyeler içinde profesyonel
                    sonuçlar elde edin ve asıl işinize odaklanın.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-[#1F2A44]/5 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-[#1F2A44] mb-4">Premium Özellikler</h3>
              <p className="text-[#1F2A44]/70 mb-4">
                Daha gelişmiş hesaplamalar için premium hesabınızla:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#1F2A44]/70">
                <li>Yıllık Kümülatif Vergi Hesaplamaları</li>
                <li>Ayni ve Nakdi Yardımlar (Yemek, Yol, vb.)</li>
                <li>BES Kesintileri</li>
                <li>Prim ve İkramiye Hesaplamaları</li>
                <li>Gelir Vergisi, SGK ve Diğer İstisna Hesaplamaları</li>
                <li>Toplu Personel İşlemleri</li>
              </ul>
              <Button className="mt-6 bg-[#4DA3FF] hover:bg-[#4DA3FF]/80 text-white">
                Premium'a Geç
              </Button>
            </div>
          </div>

          {/* Sağ Taraf - Hesaplayıcı */}
          <div>
            <Card className="border-[#1F2A44]/10 shadow-xl">
              <CardHeader className="bg-[#4DA3FF]/5 border-b border-[#1F2A44]/10">
                <CardTitle className="text-2xl text-[#1F2A44]">Basit Bordro Hesaplayıcı</CardTitle>
                <CardDescription>
                  Hızlı bir maaş ve maliyetlendirme sonucu için temel değerleri girin
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="hesaplama" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="hesaplama">Hesaplama</TabsTrigger>
                    <TabsTrigger value="sonuclar">Sonuçlar</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="hesaplama" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor="maas">Brüt Maaş</Label>
                          <span className="text-sm text-[#1F2A44]/60 font-semibold">
                            {formatCurrency(brutMaas)}
                          </span>
                        </div>
                        <Slider
                          id="maas"
                          min={10000}
                          max={100000}
                          step={500}
                          value={[brutMaas]}
                          onValueChange={(value) => setBrutMaas(value[0])}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-xs text-[#1F2A44]/60">
                          <span>₺10.000</span>
                          <span>₺100.000</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="calisanTipi">Çalışan Tipi</Label>
                        <Select 
                          value={calisanTipi} 
                          onValueChange={(value) => setCalisanTipi(value)}
                        >
                          <SelectTrigger id="calisanTipi">
                            <SelectValue placeholder="Seçiniz" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal Çalışan</SelectItem>
                            <SelectItem value="emekli">Emekli Çalışan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        onClick={hesaplaBordro}
                        className="w-full bg-[#4DA3FF] hover:bg-[#4DA3FF]/80 mt-4 text-white"
                      >
                        Hesapla
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sonuclar">
                    {sonuclar ? (
                      <div className="space-y-6">
                        <div className="bg-[#4DA3FF]/10 p-4 rounded-xl">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-lg text-[#1F2A44]">Net Maaş:</span>
                            <span className="text-xl font-semibold text-[#4DA3FF]">
                              {formatCurrency(sonuclar.netMaas)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm border-b pb-2 border-[#1F2A44]/10">
                            <span>Brüt Maaş</span>
                            <span className="font-semibold">{formatCurrency(brutMaas)}</span>
                          </div>
                          <div className="flex justify-between text-sm border-b pb-2 border-[#1F2A44]/10">
                            <span>SGK İşçi Payı</span>
                            <span className="font-semibold">- {formatCurrency(sonuclar.sgkIsci)}</span>
                          </div>
                          <div className="flex justify-between text-sm border-b pb-2 border-[#1F2A44]/10">
                            <span>İşsizlik İşçi Payı</span>
                            <span className="font-semibold">- {formatCurrency(sonuclar.issizlikIsci)}</span>
                          </div>
                          <div className="flex justify-between text-sm border-b pb-2 border-[#1F2A44]/10">
                            <span>Gelir Vergisi</span>
                            <span className="font-semibold">- {formatCurrency(sonuclar.gelirVergisi)}</span>
                          </div>
                          <div className="flex justify-between text-sm border-b pb-2 border-[#1F2A44]/10">
                            <span>Damga Vergisi</span>
                            <span className="font-semibold">- {formatCurrency(sonuclar.damgaVergisi)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-[#1F2A44]/10">
                          <div className="flex justify-between items-center">
                            <span className="text-lg text-[#1F2A44]">İşveren Maliyeti:</span>
                            <span className="text-xl font-semibold text-[#1F2A44]">
                              {formatCurrency(sonuclar.toplamMaliyet)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-center pt-6">
                          <p className="text-xs text-[#1F2A44]/60">
                            * Bu hesaplamalar basitleştirilmiştir ve gerçek hesaplamalardan farklılık gösterebilir.
                            <br />Detaylı hesaplamalar için premium hesabınızla giriş yapınız.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-[#1F2A44]/60">
                          Hesaplama yapmak için "Hesaplama" sekmesine geçin ve "Hesapla" butonuna tıklayın.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-[#1F2A44]/60 mb-4">
                Daha detaylı ve kişiselleştirilmiş bordro hesaplamaları için:
              </p>
              <Button variant="outline" className="border-[#4DA3FF] text-[#4DA3FF]">
                Premium Özellikleri Keşfedin
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BordroHesaplamaPage; 