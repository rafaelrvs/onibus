// src/app/api/horarios/[linha]/route.js
import { NextResponse } from 'next/server'
import { load }        from 'cheerio'
import { revalidateTag, revalidatePath } from 'next/cache'

export const runtime   = 'edge'
export const revalidate = 60  // ISR: revalida esta rota a cada 60s

// cache in-memory + pooling de chamadas concorrentes
const cache    = new Map()
const inflight = new Map()

export async function GET(request, { params }) {
  const { linha } = params
  const key       = `horarios:${linha}`
  const now       = Date.now()

  // 1) se tiver no cache e não expirou, devolve já
  if (cache.has(key)) {
    const { expires, dados } = cache.get(key)
    if (expires > now) {
      return NextResponse.json(dados, {
        headers: {
          'cache-control': 'public, s-maxage=60, stale-while-revalidate=30'
        }
      })
    }
    cache.delete(key)
  }

  // 2) se já estiver rodando um fetch pra mesma linha, aguarda ele
  if (inflight.has(key)) {
    return inflight.get(key)
  }

  // 3) senão, dispara fetch + parse + cache + revalidate
  const promise = (async () => {
    const url = `https://mobilidadeservicos.mogidascruzes.sp.gov.br/site/transportes/linha_detalhada/${linha}`

    // fetch do HTML com cache interno do Next e tag “horarios”
    const res = await fetch(url, {
      next: { revalidate: 60, tags: ['horarios', key] }
    })
    if (!res.ok) {
      inflight.delete(key)
      return NextResponse.json(
        { error: 'Não foi possível obter a página de horários.' },
        { status: 502 }
      )
    }

    const html = await res.text()
    const $    = load(html)

    // parse
    const dados = { diasUteis: [], sabados: [], domingos: [] }
    $('#imprimirConteudo').find('h6').each((_, h6) => {
      const txt = $(h6).text().trim()
      let section
      if (/Dia útil/i.test(txt))    section = 'diasUteis'
      else if (/Sábado/i.test(txt)) section = 'sabados'
      else if (/Domingo/i.test(txt))section = 'domingos'
      else return

      $(h6).next('table').find('tbody tr').each((_, tr) => {
        const [hora, obs] = $(tr)
          .find('td')
          .map((_, td) => $(td).text().trim())
          .get()
        dados[section].push({ hora, obs })
      })
    })

    inflight.delete(key)

    // sem horário encontrado?
    if (!dados.diasUteis.length && !dados.sabados.length && !dados.domingos.length) {
      return NextResponse.json(
        { error: 'Horario não encontrado.' },
        { status: 404 }
      )
    }

    // grava no cache in-memory por 60s
    cache.set(key, { expires: now + 60_000, dados })

    // dispara revalidação programática:
    revalidateTag('horarios')     // invalida tudo marcado “horarios”
    revalidateTag(key)            // invalida só “horarios:linha:X”
    revalidatePath(`/api/horarios/`) // invalida esta rota (caso usada em page gerada)

    // devolve JSON com instrução de caching para CDN/navegador
    return NextResponse.json(dados, {
      headers: {
        'cache-control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    })
  })()

  inflight.set(key, promise)
  return promise
}
