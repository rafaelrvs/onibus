'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Fuse from 'fuse.js'
import styles from './Main.module.css'
import { Search, ArrowRight, List, Clock, Map, Newspaper } from 'lucide-react'
import Horario from '../Horario/Horario'
import MapaOnibus from '../Mapa/Mapa'
import Noticias from '../Noticias/Noticia'

export default function Main() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('linhas')
  const [popularLines, setPopularLines] = useState([])
  const [loading, setLoading] = useState(true)

  // Fuse.js setup for fuzzy searching
  const fuse = useMemo(
    () => new Fuse(popularLines, {
      keys: ['name', 'id'],
      threshold: 0.3,       // adjust for sensitivity
      includeScore: false,
    }),
    [popularLines]
  )

  // Compute filtered results
  const filteredLines = useMemo(() => {
    const term = search.trim()
    if (!term) return popularLines
    // use Fuse for fuzzy
    const results = fuse.search(term)
    return results.map(({ item }) => item)
  }, [search, popularLines, fuse])

  // função pra escolher cor de ETA
  const getEtaColor = eta => {
    if (eta <= 5) return '#28A745'
    if (eta <= 10) return '#FFC107'
    return '#DC3545'
  }

  // calcula minutos até o próximo horário em partida_a
  const calcEta = partidas => {
    const now = new Date()
    const today = now.toISOString().slice(0,10)
    const deltas = partidas
      .map(t => new Date(`${today}T${t}`))
      .map(d => (d - now)/60000)
      .filter(minutes => minutes >= 0)
    if (!deltas.length) return null
    return Math.round(Math.min(...deltas))
  }

  useEffect(() => {
    async function loadLines() {
      try {
        const res = await fetch('/api/linhas')
        const json = await res.json()
        const lines = json.linhas.map(item => {
          const eta = calcEta(item.partida_a)
          const colorMap = ['#0052CC','#DC3545','#28A745','#6F42C1']
          const idx = Math.floor(Math.random() * colorMap.length)
          return {
            id: item.linha,
            name: item.nome,
            via: item.partida_a.length
              ? `Próx.: ${item.partida_a[0].slice(0,5)}`
              : 'Sem partida',
            eta,
            color: colorMap[idx],
          }
        })
        setPopularLines(lines)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadLines()
  }, [])
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
            {tab.icon}<span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Linhas Populares */}
      {activeTab === 'linhas' && (
        <section className={styles.popularSection}>
          <h2 className={styles.sectionTitle}>Linhas Populares</h2>

          {loading ? (
            <p>Carregando linhas…</p>
          ) : (
            <ul className={styles.lineList}>
              {filteredLines.map(line => (
                <li key={line.id} className={styles.lineCard}>
                  <div
                    className={styles.lineIcon}
                    style={{ backgroundColor: line.color }}
                  >{line.id}</div>
                  <div className={styles.lineInfo}>
                    <h3 className={styles.lineTitle}>{line.name}</h3>
                    <p className={styles.lineVia}>{line.via}</p>
                  </div>
                  {line.eta != null && (
                    <div
                      className={styles.lineEta}
                      style={{ backgroundColor: getEtaColor(line.eta) }}
                    >{line.eta} min</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Horários */}
      {activeTab === 'horarios' && (
        <section className={styles.horariosSection}><Horario /></section>
      )}

      {/* Mapa */}
      {activeTab === 'mapa' && (
        <section className={styles.mapaSection}><MapaOnibus /></section>
      )}

      {/* Notícias */}
      {activeTab === 'noticias' && (
        <section className={styles.noticiasSection}><Noticias /></section>
      )}
    </main>
  )
}
