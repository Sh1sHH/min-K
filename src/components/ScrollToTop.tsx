import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Bu bileşen, her sayfa değişiminde otomatik olarak sayfayı en üste kaydırır
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Sayfa değiştiğinde en üste kaydır
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // Anında kaydırma için
    });
  }, [pathname]);

  return null; // Bu bileşen herhangi bir UI render etmez
}

export default ScrollToTop; 