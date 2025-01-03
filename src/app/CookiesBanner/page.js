"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./CookiesBanner.module.css";

const CookiesBanner = ({ onAccept, onCustomize }) => {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (cookiesAccepted) {
      setShowBanner(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowBanner(false);
    onAccept();
  };

  const handleCustomize = () => {
    onCustomize();
  };

  if (!showBanner) return null;

  return (
    <div className={styles.cookiesBanner}>
      <p>
        🍪 Nós usamos cookies para personalizar sua experiência. Consulte nossa{" "}
        <Link href="/cookies-policy">Política de Cookies</Link> e{" "}
        <Link href="/privacy-policy">Política de Privacidade</Link>.
      </p>
      <div className={styles.actions}>
        <button onClick={handleAccept} className={styles.acceptButton}>
          Aceitar
        </button>
        <button onClick={handleCustomize} className={styles.customizeButton}>
          Personalizar
        </button>
      </div>
    </div>
  );
};

export default CookiesBanner;
