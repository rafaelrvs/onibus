// src/app/components/Perfil/Perfil.jsx
'use client'
import React from 'react'
import styles from './Perfil.module.css'
import { User, Settings, LogOut } from 'lucide-react'

export default function Perfil() {
  // dados de exemplo
  const user = { name: 'João Silva', email: 'joao.silva@mail.com' }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <User size={48} className={styles.avatar} />
        <div className={styles.info}>
          <h2 className={styles.name}>{user.name}</h2>
          <p className={styles.email}>{user.email}</p>
        </div>
      </div>
      <ul className={styles.actions}>
        <li>
          <Settings size={20} />
          <span>Editar Perfil</span>
        </li>
        <li>
          <LogOut size={20} />
          <span>Sair</span>
        </li>
      </ul>
    </div>
  )
}
