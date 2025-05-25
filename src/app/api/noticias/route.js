// src/app/api/noticias/route.js
import { NextResponse } from 'next/server'
import xml2js from 'xml2js'              // npm install xml2js

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const rssUrl = searchParams.get('rss_url')
    if (!rssUrl) {
      return NextResponse.json(
        { error: 'Parâmetro rss_url é obrigatório' },
        { status: 400 }
      )
    }

    const res = await fetch(rssUrl.toLowerCase())
    if (!res.ok) throw new Error(`Feed retornou ${res.status}`)

    const xml = await res.text()
    const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false })
    const items = parsed.rss?.channel?.item || []
    const normalized = Array.isArray(items) ? items : [items]

    return NextResponse.json({ items: normalized })
  } catch (err) {
    console.error('API /noticias erro:', err)
    return NextResponse.json(
      { error: err.message || 'Erro interno ao converter RSS' },
      { status: 500 }
    )
  }
}