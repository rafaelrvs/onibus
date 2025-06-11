"use client";

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import styles from './page.module.css';

// Carrega o Main apenas no client (desabilita SSR)
const Main = dynamic(
  () => import('./components/Main/Main'),
  { ssr: false }
);

export default function Home() {
  const pathname = usePathname();

  // Mapeia a rota para a tab ativa
  const activeTab =
    pathname.startsWith('/viagens') ? 'viagens' :
    pathname.startsWith('/perfil')   ? 'perfil'   :
    /* default */                    'inicio';

  return (
    <div className={styles.page}>
      <Header />

      {/* Conteúdo que ocupa todo o espaço entre header e footer */}
      <div className={styles.content}>
        
        <Main />
      </div>

      <Footer activeTab={activeTab} />
    </div>
  );
}
