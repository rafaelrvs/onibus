// src/app/components/Mapa/Mapa.jsx
'use client'

import React, { useEffect, useState } from 'react'
import MapaGoogle from '../MapaGoogle/MapaGoogle'
import styles from './Mapa.module.css'

export default function MapaOnibus() {
  const [linhas, setLinhas] = useState([])
  const [selectedLinha, setSelectedLinha] = useState('')
  const [busPositions, setBusPositions] = useState([])

  // 1) carrega as linhas
  useEffect(() => {
    fetch('/api/linhas')
      .then(r => r.json())
      .then(json => {
        const codigos = json.linhas.map(i => i.linha)
        setLinhas(codigos)
        if (codigos.length) setSelectedLinha(codigos[0])
      })
      .catch(err => console.error('Erro ao buscar linhas:', err))
  }, [])

  // 2) carrega itinerário quando trocar de linha
  useEffect(() => {
    if (!selectedLinha) return

    async function fetchPosicoes() {
      try {
        const res = await fetch(`/api/itinerarios/${selectedLinha}`)
        if (!res.ok) {
          console.error(
            `API itinerarios/${selectedLinha} retornou`,
            res.status,
            await res.text()
          )
          setBusPositions([])
          return
        }

        const raw = await res.json()
        // raw pode ser um array ou um objeto { itinerarios: [...] }
        const list = Array.isArray(raw) ? raw : raw.itinerarios || []

        const traj = list.flatMap(item =>
          JSON.parse(item.trajeto).map(str => {
            const [lon, lat] = str.split(',').map(Number)
            return { lat, lng: lon }
          })
        )

        setBusPositions(traj)
      } catch (err) {
        console.error('Falha no fetchPosicoes:', err)
        setBusPositions([])
      }
    }

    fetchPosicoes()
  }, [selectedLinha])

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mapa ao vivo (Google Maps)</h2>

      <div className={styles.selectContainer}>
        <label htmlFor="linhaSelect">Linha:&nbsp;</label>
        <select
          id="linhaSelect"
          value={selectedLinha}
          onChange={e => setSelectedLinha(e.target.value)}
          className={styles.selectLinha}
        >
          {linhas.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <div className={styles.mapWrapper}>
        {busPositions.length > 0
          ? <MapaGoogle trajectory={busPositions} />
          : <p>Carregando posições ou selecione outra linha…</p>
        }
      </div>
    </div>
  )
}
