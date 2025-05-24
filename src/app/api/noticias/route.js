// src/app/api/noticias/route.js
import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=br&category=general&apiKey=${process.env.NEWS_API_KEY}`
  )
  const data = await res.json()
  return NextResponse.json(data)
}
