// src/app/components/Viagens/Viagens.jsx
'use client'
import React from 'react'
import styles from './Viagens.module.css'
import { Clock } from 'lucide-react'

// dados de exemplo
const trips = [
  { id: 1, line: '101 – Centro → Terminal', time: '10:15', status: 'Em andamento' },
  { id: 2, line: '203 – Shopping → Universidade', time: '12:30', status: 'Agendada' },
  { id: 3, line: '305 – Parque → Hospital', time: '14:00', status: 'Concluída' },
]

export default function Viagens() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <Clock size={20} className={styles.icon} /> Minhas Viagens
      </h2>
      <ul className={styles.list}>
        {trips.map(trip => (
          <li key={trip.id} className={styles.card}>
            <div className={styles.info}>
              <span className={styles.line}>{trip.line}</span>
              <span className={styles.time}>{trip.time}</span>
            </div>
            <span className={`${styles.status} ${styles[trip.status.replace(' ', '').toLowerCase()]}`}>
              {trip.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
