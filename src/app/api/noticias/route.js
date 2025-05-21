// src/app/api/noticias/route.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const estado = searchParams.get('state') || 'SP'
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing NEWS_API_KEY in env' },
      { status: 500 }
    )
  }

  const qry = encodeURIComponent(estado === 'SP' ? 'São Paulo' : estado)
  const url = `https://newsapi.org/v2/top-headlines?country=br&pageSize=5&q=${qry}&apiKey=${apiKey}`

  const res = await fetch(url)
  if (!res.ok) {
    return NextResponse.json(
      { error: 'Erro ao buscar notícias externas.' },
      { status: 502 }
    )
  }
  const data = await res.json()

  return NextResponse.json(data, {
    headers: {
      // publica no CDN (s-maxage) por 2h, sem cache no browser (max-age=0)
      'Cache-Control': 'public, max-age=0, s-maxage=7200'
    }
  })
}
