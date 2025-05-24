'use client'
import React, { useEffect, useState } from 'react'
import { Newspaper, AlertTriangle, CheckCircle } from 'lucide-react'
import styles from './Noticia.module.css'

export default function Noticias() {
  const [stateCode] = useState('SP')         // Estado fixo em SP
  const [newsItems, setNewsItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const iconMap = {
    Comunicado: <Newspaper />,
    Alerta:     <AlertTriangle />,
    Novidade:   <CheckCircle />
  }

  function getBgColor(type) {
    switch(type) {
      case 'Comunicado': return '#E8F0FE'
      case 'Alerta':     return '#FFF9E6'
      case 'Novidade':   return '#E6F4EA'
      default:           return '#F0F0F0'
    }
  }

  useEffect(() => {
    async function fetchNews() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/noticias?state=${stateCode}`)
        if (!res.ok) throw new Error('Erro ao buscar notícias')
        const { articles } = await res.json()
        setNewsItems(articles || [])
      } catch (err) {
        console.error(err)
        setError('Não foi possível carregar as notícias.')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [stateCode])

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Últimas Notícias – {stateCode}</h2>

      {loading && <p className={styles.loading}>Carregando notícias...</p>}
      {error   && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <ul className={styles.list}>
          {newsItems.map((item, idx) => {
            const type = item.source.name || 'Novidade'
            return (
              <li key={idx} className={styles.card}>
                <div
                  className={styles.iconWrapper}
                  style={{ backgroundColor: getBgColor(type) }}
                >
                  {iconMap[type] || <Newspaper />}
                </div>
                <div className={styles.content}>
                  <span className={styles.type}>{type}</span>
                  <h3 className={styles.newsTitle}>{item.title}</h3>
                  <p className={styles.newsDesc}>{item.description}</p>
                  <div className={styles.footer}>
                    <span className={styles.date}>
                      {new Date(item.publishedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                      })}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.readMore}
                    >
                      Ler mais
                    </a>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
   
    </div>
  )
}
