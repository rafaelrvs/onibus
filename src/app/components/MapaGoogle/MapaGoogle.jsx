// src/components/MapaGoogle/MapaGoogle.jsx
import React, { useRef, useEffect } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export default function MapaGoogle({ trajectory }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markers = useRef([])
  const polyline = useRef(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
      version: 'weekly',
    })

    loader.load().then(() => {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: trajectory[0] || { lat: -23.5205, lng: -46.1858 },
        zoom: 13,
      })
    })
  }, [])

  useEffect(() => {
    if (!mapInstance.current) return

    // limpa marcadores anteriores
    markers.current.forEach(m => m.setMap(null))
    markers.current = []

    // adiciona novos marcadores
    trajectory.forEach(({ lat, lng }) => {
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstance.current,
      })
      markers.current.push(marker)
    })

    // desenha linha contínua
    if (polyline.current) polyline.current.setMap(null)
    polyline.current = new window.google.maps.Polyline({
      path: trajectory,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 0.6,
      strokeWeight: 4,
      map: mapInstance.current,
    })

    // ajusta os bounds para caber toda a rota
    const bounds = new window.google.maps.LatLngBounds()
    trajectory.forEach(coord => bounds.extend(coord))
    mapInstance.current.fitBounds(bounds)
  }, [trajectory])

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
}
