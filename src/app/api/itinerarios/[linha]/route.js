// src/app/api/itinerarios/[linha]/route.js
import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const revalidate = 60  // Revalida esta rota a cada 60s

export async function GET(request, context) {
  // Await em context.params para seguir a nova API do Next.js
  const { linha } = await context.params

  // 1) Faz fetch no serviço externo sem usar o cache interno do Next.js
  const res = await fetch(
    `https://mobilidadeservicos.mogidascruzes.sp.gov.br/public/buscar-linha?linha=${encodeURIComponent(linha)}`
  )

  if (!res.ok) {
    const text = await res.text()
    return new NextResponse(`Erro externo: ${text}`, { status: res.status })
  }

  // 2) Extrai o JSON e pega o array de itinerários
  const json = await res.json()
  const itinerarios = Array.isArray(json.itinerarios)
    ? json.itinerarios
    : []

  // 3) Retorna apenas o array, com cabeçalho de cache HTTP (ISR via header)
  return NextResponse.json(itinerarios, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30'
    }
  })
}
