import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Remonter en haut à chaque changement de route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Défilement fluide
    });
  }, [pathname]);

  return null;
}
