// components/Footer.tsx
'use client'

import React, { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Clock, User } from 'lucide-react'
import styles from './Footer.module.css'

import { GlobalContext } from './../../../Context/globalContext';

export default function Footer() {
  const router = useRouter()
  const { activeTab, setActiveTab } = useContext(GlobalContext)

  const handleClick = (tab, path) => {
    setActiveTab(tab)
    router.push(path)
  }

  return (
    <footer className={styles.footer}>
      <div
        className={`${styles.item} ${activeTab === 'inicio' ? styles.active : ''}`}
        onClick={() => handleClick('inicio', '/')}
      >
        <Home size={24} />
        <span>Início</span>
      </div>
{/* 
      <div
        className={`${styles.item} ${activeTab === 'viagens' ? styles.active : ''}`}
        onClick={() => handleClick('viagens', '/viagens')}
      >
        <Clock size={24} />
        <span>Viagens</span>
      </div>

      <div
        className={`${styles.item} ${activeTab === 'perfil' ? styles.active : ''}`}
        onClick={() => handleClick('perfil', '/perfil')}
      >
        <User size={24} />
        <span>Perfil</span>
      </div> */}
    </footer>
  )
}
