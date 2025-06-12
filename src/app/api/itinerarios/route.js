// /src/app/api/OnibusInterMunicipal/Itinerario/route.js
import { NextResponse } from "next/server";
import { load } from "cheerio";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cidadeDe = searchParams.get("cidadede") || "";
  const cidadeAte = searchParams.get("cidadeate") || "";

  if (!cidadeDe || !cidadeAte) {
    return NextResponse.json(
      { error: "Parâmetros faltando: cidadede e/ou cidadeate" },
      { status: 400 }
    );
  }

  const urlExterna = `https://www.emtu.sp.gov.br/Sistemas/linha/resultado.htm?cidadede=${encodeURIComponent(
    cidadeDe
  )}&cidadeate=${encodeURIComponent(cidadeAte)}&pag=origemdestino.htm`;

  try {
    const resp = await fetch(urlExterna);
    if (!resp.ok) {
      return NextResponse.json(
        { error: "Falha ao buscar itinerários da EMTU." },
        { status: resp.status }
      );
    }

    // Texto bruto (atenção: pode ser ISO-8859-1 no HTML original)
    const html = await resp.text();

    // ===== aqui está a mudança =====
    const $ = load(html, { decodeEntities: true });

    // 1) Total de linhas encontradas
    const totalText = $('form[name="form1"] span').first().text(); // ex: "Linhas encontradas: 24  Ordenar por..."
    const totalLinhas =
      parseInt((totalText.match(/Linhas encontradas:\s*(\d+)/) || [])[1], 10) || 0;

    // 2) Tabela de itinerários
    const $table = $("table.tabelaItinerariosDivisa").first();
    if (!$table.length) {
      return NextResponse.json(
        { total: totalLinhas, linhasEncontradas: [] },
        { status: 200 }
      );
    }

    // 3) Itera pelas linhas de dados (pulando o cabeçalho)
    const linhasEncontradas = [];
    $table.find("tr").slice(1).each((_, tr) => {
      const $tds = $(tr).find("td");
      if ($tds.length < 6) return; // ignora linhas inválidas

      const numero = $tds.eq(0).text().trim();
      const descricao = $tds.eq(1).text().replace(/\s+/g, " ").trim();
      const empresa = $tds.eq(2).text().trim();
      const tarifa = $tds.eq(3).text().trim();
      const possuiIntegracao = $tds.eq(4).text().trim();

      // extrai o link do onclick da última coluna
      const onclick = $tds.eq(5).find("a").attr("onclick") || "";
      const m = onclick.match(
        /AbreJanelaAvaliacaoLinhas\(\s*['"].*?['"]\s*,\s*['"]([^'"]+)['"]\s*\)/
      );
      const realTimeLink = m ? m[1] : null;

      linhasEncontradas.push({
        numero,
        descricao,
        empresa,
        tarifa,
        possuiIntegracao,
        realTimeLink,
      });
    });

    return NextResponse.json(
      { total: totalLinhas, linhasEncontradas },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erro interno ao buscar itinerários:", err);
    return NextResponse.json(
      { error: "Erro interno ao buscar itinerários." },
      { status: 500 }
    );
  }
}
