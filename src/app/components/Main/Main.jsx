// components/Main/Main.tsx
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Fuse from 'fuse.js'
import styles from './Main.module.css'
import {
  Search,
  ArrowRight,
  List,
  Clock,
  Map,
  Newspaper,
  Loader2,
  TrainFront,
  BusFront
} from 'lucide-react'
import Horario from '../Horario/Horario'
import MapaOnibus from '../Mapa/Mapa'
import Noticias from '../Noticias/Noticia'
import Modal from '../Modal/Modal'
import OnibusInterMunicipal from './../OnibusInterMunicipal/OnibusInterMunicipal';

export default function Main() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('linhas')
  const [popularLines, setPopularLines] = useState([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [selectedLine, setSelectedLine] = useState(null)

  // Fuse.js
  const fuse = useMemo(
    () => new Fuse(popularLines, { keys: ['name', 'id'], threshold: 0.3 }),
    [popularLines]
  )
  const filteredLines = useMemo(() => {
    const term = search.trim()
    if (!term) return popularLines
    return fuse.search(term).map(r => r.item)
  }, [search, popularLines, fuse])

  // -----------------------------
  // Helpers corrigidos abaixo
  // -----------------------------
  // Cor do badge com base no total de minutos
  const getEtaColor = etaObj => {
    if (!etaObj) return '#6c757d'
    const m = etaObj.totalMinutes
    if (m <= 5)  return '#28A745'
    if (m <= 10) return '#FFC107'
    return '#DC3545'
  }

  // Calcula diferença até o próximo horário, considerando também o próximo dia
  const calcEta = partidas => {
    const now = new Date()

    // para cada horário string "HH:mm", retorna diff em ms até hoje ou amanhã
    const diffsMs = partidas.map(t => {
      const [h, m] = t.split(':').map(Number)
      // candidato para hoje
      const cand = new Date(now)
      cand.setHours(h, m, 0, 0)
      let diff = cand.getTime() - now.getTime()
      // se já passou, considera o mesmo horário no dia seguinte
      if (diff < 0) {
        cand.setDate(cand.getDate() + 1)
        diff = cand.getTime() - now.getTime()
      }
      return diff
    })

    if (!diffsMs.length) return null

    // menor diff positivo
    const minDiff = Math.min(...diffsMs)
    const totalMinutes = Math.floor(minDiff / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return { hours, minutes, totalMinutes }
  }
  // -----------------------------

  useEffect(() => {
    async function loadLines() {
      try {
        const res = await fetch('/api/linhas')
        const json = await res.json()

        const lines = json.linhas.map(item => {
          const etaObj = calcEta(item.partida_a)
          const colorMap = ['#0052CC', '#DC3545', '#28A745', '#6F42C1']

          return {
            id:    item.linha,
            name:  item.nome,
            via:   item.partida_a.length
                      ? `Próx.: ${item.partida_a[0].slice(0,5)}`
                      : 'Sem partida',
            eta:   etaObj,
            color: colorMap[Math.floor(Math.random() * colorMap.length)],
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
              <h1 className={styles.h1horario}>Horários dos Ônibus</h1>
      
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
          { key: 'linhas',   icon: <List size={20} />,     label: 'Linhas'   },
          { key: 'horarios', icon: <Clock size={20} />,    label: 'Horários' },
          { key: 'mapa',     icon: <Map size={20} />,      label: 'Mapa'     },
          { key: 'OnibusIntermunicipal', icon: <BusFront   size={20} />,label: 'Ônibus Intermunicipal'},
          { key: 'noticias', icon: <Newspaper size={20} />,label: 'Notícias'}
        ].map(tab => (
          <button
            key={tab.key}
            className={`${styles.navItem} ${
              activeTab === tab.key ? styles.active : ''
            }`}
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
        <h5 className={styles.sectionTitleh5} >Linhas Encontradas:</h5>

          {loading ? (
            <div className={styles.loading}>
              <Loader2 className={styles.spinner} />
             
            </div>
          ) : (
            <ul className={styles.lineList}>
              {filteredLines.map(line => (
                <li
                  key={line.id}
                  className={styles.lineCard}
                  onClick={() => {
                    setSelectedLine(line)
                    setOpenModal(true)
                  }}
                >
                  <div
                    className={styles.lineIcon}
                    style={{ backgroundColor: line.color }}
                  >
                    {line.id}
                  </div>
                  <div className={styles.lineInfo}>
                    <h3 className={styles.lineTitle}>{line.name}</h3>
                    <p className={styles.lineVia}>{line.via}</p>
                  </div>
                  {line.eta && (
                    <div
                      className={styles.lineEta}
                      style={{ backgroundColor: getEtaColor(line.eta) }}
                    >
                      {/* Exibe “Xh Ym” ou só “Ym” */}
                      {line.eta.hours > 0 && `${line.eta.hours}h `}
                      {line.eta.minutes}m
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Outras abas */}
      {activeTab === 'horarios' && <Horario />}
      {activeTab === 'mapa'     && <MapaOnibus />}
      {activeTab === 'OnibusIntermunicipal' && <OnibusInterMunicipal />}
      {activeTab === 'noticias' && <Noticias />}

      {/* Modal */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        {selectedLine && (
          <div>
            <h2>{selectedLine.name}</h2>
            <p><strong>ID:</strong> {selectedLine.id}</p>
            <p><strong>Via:</strong> {selectedLine.via}</p>
            <p>
              <strong>Saída do Terminal:</strong>{' '}
              {selectedLine.eta
                ? `${selectedLine.eta.hours > 0
                    ? `${selectedLine.eta.hours}h `
                    : ''}${selectedLine.eta.minutes}m`
                : 'Sem ETA'}
            </p>
          </div>
        )}
      </Modal>
    </main>
  )
}
