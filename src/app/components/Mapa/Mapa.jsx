// src/app/components/Mapa/Mapa.jsx
import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { MapPin } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import styles from './Mapa.module.css'

const busPositions = [
  { id: 101, position: [-23.5505, -46.6333] },
  { id: 203, position: [-23.5480, -46.6362] }
]

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

export default function MapaOnibus() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mapa ao vivo</h2>
      <div className={styles.mapWrapper}>
        <MapContainer
          center={[-23.5505, -46.6333]}
          zoom={13}
          scrollWheelZoom={false}
          className={styles.map}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {busPositions.map(bus => (
            <Marker key={bus.id} position={bus.position}>
              <Popup>Linha {bus.id}</Popup>
            </Marker>
          ))}
          <LocateControl />
        </MapContainer>
      </div>
      <section className={styles.nextBusesSection}>
        <h3 className={styles.sectionTitle}>Ônibus próximos</h3>
        <ul className={styles.busList}>
          <li className={styles.busItem}>
            <span className={styles.busLine}>101</span>
            <span className={styles.busInfo}>Centro – Terminal</span>
            <span className={styles.busEta}>Chegando em 2 min</span>
          </li>
          <li className={styles.busItem}>
            <span className={styles.busLine}>203</span>
            <span className={styles.busInfo}>Shopping – Universidade</span>
            <span className={styles.busEta}>Chegando em 5 min</span>
          </li>
        </ul>
      </section>
    </div>
  )
}