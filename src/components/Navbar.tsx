import React, { useState } from "react";
import { Menu, MenuItem, HoveredLink, ProductItem } from "./ui/navbar-menu";
import { Calculator, FileText, HelpCircle, Home, LayoutGrid, MessageSquare, Package, Receipt, Users } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative w-full">
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Ana Sayfa">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/tanitim">Tanıtım bölümü</HoveredLink>
            <HoveredLink href="/avantajlar">Avantajlar</HoveredLink>
            <HoveredLink href="/cta">Hemen Başla</HoveredLink>
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Hizmetlerimiz">
          <div className="grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Uzaktan İK Paketi"
              description="Kapsamlı İK yönetim çözümü"
              href="/uzaktan-ik"
              src="/product-1.jpg"
            />
            <ProductItem
              title="Bordro Yorumlama"
              description="Uzman bordro analizi"
              href="/bordro"
              src="/product-2.jpg"
            />
            <ProductItem
              title="Danışmanlık"
              description="Profesyonel İK danışmanlığı"
              href="/danismanlik"
              src="/product-3.jpg"
            />
            <ProductItem
              title="Şablon ve Evrak Setleri"
              description="Hazır İK dökümanları"
              href="/sablonlar"
              src="/product-4.jpg"
            />
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Hesaplama Araçları">
          <div className="flex flex-col space-y-4 text-sm min-w-[200px]">
            <HoveredLink href="/net-brut-maas">
              <Calculator className="w-4 h-4 mr-2 inline-block" />
              Net-Brüt Maaş
            </HoveredLink>
            <HoveredLink href="/kidem-ihbar">
              <Receipt className="w-4 h-4 mr-2 inline-block" />
              Kıdem / İhbar Tazminatı
            </HoveredLink>
            <HoveredLink href="/fazla-mesai">
              <FileText className="w-4 h-4 mr-2 inline-block" />
              Fazla Mesai
            </HoveredLink>
            <HoveredLink href="/isveren-maliyeti">
              <Package className="w-4 h-4 mr-2 inline-block" />
              İşveren Maliyeti
            </HoveredLink>
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Blog">
          <div className="flex flex-col space-y-4 text-sm min-w-[200px]">
            <HoveredLink href="/ik-rehberleri">İK rehberleri</HoveredLink>
            <HoveredLink href="/ise-alim-tuyolari">İşe alım tüyoları</HoveredLink>
            <HoveredLink href="/guncel-mevzuat">Güncel mevzuat</HoveredLink>
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Soru-Cevap">
          <div className="flex flex-col space-y-4 text-sm min-w-[220px]">
            <HoveredLink href="/mini-danismanlik">
              <MessageSquare className="w-4 h-4 mr-2 inline-block" />
              Mini danışmanlık bölümü
            </HoveredLink>
            <HoveredLink href="/sss">
              <HelpCircle className="w-4 h-4 mr-2 inline-block" />
              Sıkça sorulan sorular
            </HoveredLink>
            <HoveredLink href="/soru-form">
              <LayoutGrid className="w-4 h-4 mr-2 inline-block" />
              "Siz sorun, minİK cevaplasın" formu
            </HoveredLink>
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Fiyatlandırma">
          <div className="flex flex-col space-y-4 text-sm min-w-[200px]">
            <HoveredLink href="/planlar">Planlar</HoveredLink>
            <HoveredLink href="/abonelik">Abonelik detayları</HoveredLink>
          </div>
        </MenuItem>

        <div className="ml-4 flex items-center gap-3" onMouseEnter={() => setActive(null)}>
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/90 hover:bg-white/10 rounded-full px-6 py-2 text-sm font-medium transition-colors"
          >
            Giriş Yap
          </Button>
          <Button 
            className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
          >
            Kayıt Ol
          </Button>
        </div>
      </Menu>
    </div>
  );
};

export default Navbar; 