// src/app/components/Noticias/Noticias.jsx
'use client'
import React from 'react'
import { Newspaper, AlertTriangle, CheckCircle } from 'lucide-react'
import styles from './Noticia.module.css'

// Exemplo de dados de notícias






const newsItems = [
  {
    id: 1,
    type: 'Comunicado',
    title: 'Novos ônibus na frota municipal',
    description: 'A prefeitura anunciou a chegada de 20 novos ônibus com ar-condicionado e acessibilidade completa.',
    date: 'Há 2 dias'
  },
  {
    id: 2,
    type: 'Alerta',
    title: 'Desvio temporário na linha 203',
    description: 'Devido a obras na Av. Principal, a linha 203 terá desvio temporário pelos próximos 15 dias.',
    date: 'Há 5 dias'
  },
  {
    id: 3,
    type: 'Novidade',
    title: 'Novo sistema de pagamento',
    description: 'A partir do próximo mês, todos os ônibus aceitarão pagamento por aproximação com cartões e celulares.',
    date: 'Há 1 dia'
  }
]

const iconMap = {
  Comunicado: <Newspaper />, 
  Alerta: <AlertTriangle />, 
  Novidade: <CheckCircle />
}

export default function Noticias() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Últimas Notícias</h2>
      <ul className={styles.list}>
        {newsItems.map(item => (
          <li key={item.id} className={styles.card}>
            <div className={styles.iconWrapper} style={{ backgroundColor: getBgColor(item.type) }}>
              {iconMap[item.type]}
            </div>
            <div className={styles.content}>
              <span className={styles.type}>{item.type}</span>
              <h3 className={styles.newsTitle}>{item.title}</h3>
              <p className={styles.newsDesc}>{item.description}</p>
              <div className={styles.footer}>
                <span className={styles.date}>{item.date}</span>
                <a href="#" className={styles.readMore}>Ler mais</a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function getBgColor(type) {
  switch(type) {
    case 'Comunicado': return '#E8F0FE'
    case 'Alerta': return '#FFF9E6'
    case 'Novidade': return '#E6F4EA'
    default: return '#F0F0F0'
  }
}