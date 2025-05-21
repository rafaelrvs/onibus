// src/app/api/horarios/[linha]/route.js
import { NextResponse } from 'next/server'
import { load } from 'cheerio'

export async function GET(request, context) {
  // Em Next 15+, context.params é uma Promise
  const { linha } = await context.params

  const url = `https://mobilidadeservicos.mogidascruzes.sp.gov.br/site/transportes/linha_detalhada/${linha}`
  const res = await fetch(url)
  if (!res.ok) {
    return NextResponse.json(
      { error: 'Não foi possível obter a página de horários.' },
      { status: 502 }
    )
  }

  const html = await res.text()
  const $ = load(html)

  // Estrutura de saída
  const dados = {
    diasUteis: [],
    sabados:   [],
    domingos:  []
  }

  // Extrai cada seção <h6> + <table>
  $('#imprimirConteudo')
    .find('h6')
    .each((_, heading) => {
      const title = $(heading).text().trim()
      let key
      if (title.match(/Dia útil/i))    key = 'diasUteis'
      else if (title.match(/Sábado/i))  key = 'sabados'
      else if (title.match(/Domingo/i)) key = 'domingos'
      else return

      const table = $(heading).next('table')
      table.find('tbody tr').each((_, row) => {
        const cells = $(row)
          .find('td')
          .map((_, td) => $(td).text().trim())
          .get()
        // cells = [horaA, obsA, horaB, tabela, obsB]
        const [hora, obs] = cells
        dados[key].push({ hora, obs })
      })
    })

  // Se não encontrar nenhum horário, retorna “item não encontrado”
  if (
    dados.diasUteis.length === 0 &&
    dados.sabados.length   === 0 &&
    dados.domingos.length  === 0
  ) {
    return NextResponse.json(
      { error: 'Horario não encontrado.' },
      { status: 404 }
    )
  }

  return NextResponse.json(dados)
}
