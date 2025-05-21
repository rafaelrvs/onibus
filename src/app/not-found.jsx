// app/not-found.tsx
'use client'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 — Página não encontrada</h1>
      <p className={styles.subtitle}>
        Desculpe, não encontramos o recurso que você buscava.
      </p>
    </div>
  )
}
