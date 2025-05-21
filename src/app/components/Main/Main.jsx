'use client'

import React, { useState } from 'react'
import styles from './Main.module.css'
import { Search, ArrowRight, List, Clock, Map, Newspaper } from 'lucide-react'
import Horario from '../Horario/Horario'
import MapaOnibus from '../Mapa/Mapa'
import Noticias from '../Noticias/Noticia'

const popularLines = [
  { id: 101, name: 'Centro – Terminal', via: 'Via Av. Principal', eta: 5, color: '#0052CC' },
  { id: 203, name: 'Shopping – Universidade', via: 'Via Estação Norte', eta: 12, color: '#DC3545' },
  { id: 305, name: 'Parque – Hospital', via: 'Via Centro', eta: 20, color: '#28A745' },
  { id: 410, name: 'Circular – Bairros', via: 'Rota completa', eta: 3, color: '#6F42C1' }
]

export default function Main() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('linhas')

  const getEtaColor = eta => {
    if (eta <= 5) return '#28A745'
    if (eta <= 10) return '#FFC107'
    return '#DC3545'
  }

  return (
    <main className={styles.main}>
      {/* Search */}
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar linha ou destino..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <button className={styles.searchButton} aria-label="Buscar">
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Tabs */}
      <nav className={styles.nav}>
        {[
          { key: 'linhas', icon: <List size={20} />, label: 'Linhas' },
          { key: 'horarios', icon: <Clock size={20} />, label: 'Horários' },
          { key: 'mapa', icon: <Map size={20} />, label: 'Mapa' },
          { key: 'noticias', icon: <Newspaper size={20} />, label: 'Notícias' }
        ].map(tab => (
          <button
            key={tab.key}
            className={`${styles.navItem} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Linhas Populares */}
      {activeTab === 'linhas' && (
        <section className={styles.popularSection}>
          <h2 className={styles.sectionTitle}>Linhas Populares</h2>
          <ul className={styles.lineList}>
            {popularLines.map(line => (
              <li key={line.id} className={styles.lineCard}>
                <div className={styles.lineIcon} style={{ backgroundColor: line.color }}>
                  {line.id}
                </div>
                <div className={styles.lineInfo}>
                  <h3 className={styles.lineTitle}>{line.name}</h3>
                  <p className={styles.lineVia}>{line.via}</p>
                </div>
                <div className={styles.lineEta} style={{ backgroundColor: getEtaColor(line.eta) }}>
                  {line.eta} min
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Horários */}
      {activeTab === 'horarios' && (
        <section className={styles.horariosSection}>
          <Horario />
        </section>
      )}

      {/* Mapa */}
      {activeTab === 'mapa' && (
        <section className={styles.mapaSection}>
          <MapaOnibus />
        </section>
      )}

      {/* Notícias */}
      {activeTab === 'noticias' && (
        <section className={styles.noticiasSection}>
          <Noticias />
        </section>
      )}
    </main>
  )
}
