// components/Header.tsx
import React from "react";
import Link from "next/link";
import { Bell, User } from "lucide-react";
import styles from "./Header.module.css";
import Image from "next/image";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link href="/">
          <Image
            src="/logo/onibus.svg"
            alt="Logo Amalfis"
            width={120} // ajuste para o tamanho real
            height={40} // ajuste para o tamanho real
            priority
            className={styles.logo}
          />
        </Link>
        <span className={styles.title}>BusApp</span>
      </div>

      <div className={styles.actions}>
        <Link href={ "/*"/*"/notifications"*/} aria-label="Notificações">
          <Bell className={styles.icon} />
        </Link>
        <Link href={"/"/*"/profile"*/} aria-label="Perfil">
          <User className={styles.icon} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
