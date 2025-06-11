// app/api/Destino/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  // 1) Extrair o query param "cidadede" da URL
  const { searchParams } = new URL(request.url);
  const cidadeDe = searchParams.get("cidadede") || "";

  // 2) Se nenhum valor foi passado, retornar array vazio
  if (!cidadeDe) {
    return NextResponse.json([], { status: 200 });
  }

  // 3) Montar a URL externa usando encodeURIComponent para espaços/acentos
  const urlExterna = `https://www.emtu.sp.gov.br/emtu/home/home.asp?a=queroIrPara&cidadede=${encodeURIComponent(
    cidadeDe
  )}`;

  try {
    const resp = await fetch(urlExterna);
    if (!resp.ok) {
      // Retorna erro genérico se a API externa respondeu fora de 200–299
      return NextResponse.json(
        { error: "Falha ao carregar destinos da API externa." },
        { status: resp.status }
      );
    }
    const data = await resp.json();
    // Esperamos que 'data' seja um array de { municipio, municipioComAcento }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Erro interno ao buscar destinos:", err);
    return NextResponse.json(
      { error: "Erro interno ao buscar destinos." },
      { status: 500 }
    );
  }
}
