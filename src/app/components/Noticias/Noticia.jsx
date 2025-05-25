'use client'
import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { Newspaper, AlertTriangle, CheckCircle } from 'lucide-react'
import styles from './Noticia.module.css'

export default function Noticias() {
  const [stateCode] = useState('SP')
  const [newsItems, setNewsItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('Tudo')

  // Definição de filtros e palavras-chave associadas
  const filters = [
    { label: 'Tudo', keywords: [] },
    { label: 'Transporte público', keywords: ['ônibus', 'metrô', 'trem', 'rodoviária', 'transporte'] },
    { label: 'Saúde', keywords: ['saúde', 'hospital', 'vacina', 'médico', 'enfermagem'] },
    { label: 'Vagas de emprego', keywords: ['emprego', 'vaga', 'oportunidade', 'trabalho'] }
  ]

  const iconMap = {
    Comunicado: <Newspaper />,
    Alerta:     <AlertTriangle />,
    Novidade:   <CheckCircle />
  }

  function getBgColor(type) {
    switch (type) {
      case 'Comunicado': return '#E8F0FE'
      case 'Alerta':     return '#FFF9E6'
      case 'Novidade':   return '#E6F4EA'
      default:           return '#F0F0F0'
    }
  }

  const fetchNews = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const feedUrl = `https://g1.globo.com/rss/g1/${stateCode.toLowerCase()}/`
      const res = await fetch(`/api/noticias?rss_url=${encodeURIComponent(feedUrl)}`)
      if (!res.ok) throw new Error(`Erro ao buscar notícias: ${res.status}`)
      const { items } = await res.json()
      const safeItems = Array.isArray(items) ? items.filter(i => i && typeof i === 'object') : []
      setNewsItems(safeItems)
    } catch (err) {
      console.error(err)
      setError('Não foi possível carregar as notícias.')
    } finally {
      setLoading(false)
    }
  }, [stateCode])

  useEffect(() => { fetchNews() }, [fetchNews])

  // Função para extrair texto limpo e tags
  function parseItem(item) {
    const { description = '' } = item
    const textOnly = description
      .replace(/<img[^>]*>/gi, '')
      .replace(/<br\s*\/?\>/gi, '\n')
      .replace(/<[^>]+>/gi, '')
      .trim().toLowerCase()
    // Extrai imagem
    const imgMatch = description.match(/<img[^>]+src="([^"]+)"/i)
    const imgSrc = imgMatch ? imgMatch[1] : null
    // Gera tags por palavras
    const tags = []
    filters.forEach(f => {
      if (f.label !== 'All') {
        f.keywords.forEach(keyword => {
          if (textOnly.includes(keyword) && !tags.includes(f.label)) {
            tags.push(f.label)
          }
        })
      }
    })
    return { textOnly, imgSrc, tags }
  }

  // Filtra itens de acordo com o filtro selecionado
  const filteredItems = newsItems.filter(item => {
    if (selectedFilter === 'All') return true
    const { textOnly } = parseItem(item)
    const filterObj = filters.find(f => f.label === selectedFilter)
    return filterObj.keywords.some(k => textOnly.includes(k))
  })

  if (loading) return <p className={styles.loading}>Carregando notícias...</p>
  if (error) return (
    <div className={styles.errorContainer}>
      <p className={styles.error}>{error}</p>
      <button onClick={fetchNews} className={styles.retryButton}>Tentar novamente</button>
    </div>
  )

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Últimas Notícias – {stateCode}</h1>
      {/* Botões de filtro */}
      <div className={styles.filterBar}>
        {filters.map(f => (
          <button
            key={f.label}
            className={`${styles.filterButton} ${selectedFilter === f.label ? styles.activeFilter : ''}`}
            onClick={() => setSelectedFilter(f.label)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ul className={styles.list} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        {filteredItems.map((item, idx) => {
          const {
            category, categories = [], title = '', link = '', pubDate, isoDate
          } = item || {}
          const type = category || categories[0] || 'Novidade'
          const rawDate = pubDate || isoDate || ''
          const formattedDate = rawDate
            ? new Date(rawDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : ''

          const { textOnly, imgSrc, tags } = parseItem(item)

          return (
            <li key={idx} className={styles.card}>
              <div className={styles.iconWrapper} style={{ backgroundColor: getBgColor(type) }}>
                {iconMap[type] || <Newspaper />}
              </div>
              <div className={styles.content}>
                <h2 className={styles.newsTitle}>{title}</h2>
                <div className={styles.meta}>
                  <span className={styles.type}>{type}</span>
                  <span className={styles.date}>{formattedDate}</span>
                </div>
                {imgSrc && (
                  <div className={styles.imageWrapper} style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
                    <Image src={imgSrc} alt={title} fill sizes="(max-width: 600px) 100vw, 600px" style={{ objectFit: 'cover' }} />
                  </div>
                )}
                {textOnly && <p className={styles.newsDesc}>{textOnly}</p>}
                {/* Lista de tags */}
                <div className={styles.tagList}>
                  {tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                </div>
                {link && <p><a href={link} target="_blank" rel="noopener noreferrer" className={styles.readMore}>Ler mais</a></p>}
              </div>
            </li>
          )
        })}
      </ul>
 <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7736006621106112"
     crossorigin="anonymous"></script>

<ins className="adsbygoogle"
      style={{ display: 'block' }}
     data-ad-client="ca-pub-7736006621106112"
     data-ad-slot="9712163431"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
    </div>
  )
}