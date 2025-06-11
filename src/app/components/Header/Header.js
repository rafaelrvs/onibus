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
        <p  aria-label="Notificações">
          <Bell className={styles.icon} />
        </p>
        <p aria-label="Perfil">
          <User className={styles.icon} />
        </p>
      </div>
    </header>
  );
};

export default Header;
