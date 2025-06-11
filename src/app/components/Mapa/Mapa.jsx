// src/app/components/Mapa/Mapa.jsx

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { MapPin } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import styles from './Mapa.module.css'

export default function MapaOnibus() {
  const [linhas, setLinhas] = useState([])
  const [selectedLinha, setSelectedLinha] = useState('')
  const [busPositions, setBusPositions] = useState([])

  // Carrega todas as linhas disponíveis
  useEffect(() => {
    async function fetchLinhas() {
      try {
        const res = await fetch('/api/linhas')
        const data = await res.json()
        const codigos = data.linhas.map(item => item.linha)
        setLinhas(codigos)
        if (codigos.length) setSelectedLinha(codigos[0])
      } catch (err) {
        console.error('Erro ao buscar linhas:', err)
      }
    }
    fetchLinhas()
  }, [])

  // Carrega posições da linha selecionada
  useEffect(() => {
    if (!selectedLinha) return
    async function fetchPosicoes() {
      try {
        const res = await fetch(`/api/itinerarios/${selectedLinha}`)
        if (!res.ok) throw new Error('Erro ao buscar itinerário')
        const data = await res.json()
        // data: array de registros com campo trajeto = ["lon,lat", ...]
        const positions = data.flatMap(item =>
          JSON.parse(item.trajeto).map(str => {
            const [lon, lat] = str.split(',').map(Number)
            return { id: selectedLinha, position: [lat, lon] }
          })
        )
        setBusPositions(positions)
      } catch (err) {
        console.error(err)
        setBusPositions([])
      }
    }
    fetchPosicoes()
  }, [selectedLinha])

  function LocateControl() {
    const map = useMapEvents({
      locationfound(e) {
        map.flyTo(e.latlng, 14)
      }
    })
    return (
      <button
        className={styles.locateButton}
        onClick={() => map.locate()}
        aria-label="Localizar"
      >
        <MapPin size={20} />
      </button>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mapa ao vivo</h2>

      {/* Seleção de linha */}
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
        <MapContainer
        center={busPositions[0]?.position || [-23.5205, -46.1858]}
          zoom={13}
          scrollWheelZoom={false}
          className={styles.map}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {busPositions.map((bus, idx) => (
            <Marker key={`${bus.id}-${idx}`} position={bus.position}>
              <Popup>Linha {bus.id}</Popup>
            </Marker>
          ))}
          <LocateControl />
        </MapContainer>
      </div>
    </div>
  )
}
