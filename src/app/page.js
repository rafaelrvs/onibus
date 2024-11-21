"use client"
import Carousel from "./components/Carousel";
import { useRouter } from "next/navigation";
import ModalFormsOnibus from "./components/ModalFormsOnibus";
import styles from "./page.module.css";
import Link from "next/link";




export default function Home() {

const router = useRouter();
function handleClickLogin() {
  router.push('/Login'); 
}

function handleClickRegister() {
  router.push('/Register'); 
}



  return (
    <div className={styles.page}>
      <header className={styles.header}>
      <div className={styles.containerlogoEnome}>
      <Link href={"/"}>
        <img className={styles.logoOnibus} src="/logo/onibus.svg" alt="Logo de um onibus  com borda preta"/>
      </Link>
        <h1 className={styles.h1}>Pega o bus AI</h1>
      </div>
        <div className={styles.containerbtnHeader}>
          <button className={styles.headerBtnlogin} onClick={handleClickLogin} >Login</button>
          <button className={styles.headerBtnInicie} onClick={handleClickRegister} >Inicie</button>
        </div>
      </header>
      <main className={styles.main}>
        <ModalFormsOnibus/>
        <Carousel/>
      </main>
    </div>
  );
}
