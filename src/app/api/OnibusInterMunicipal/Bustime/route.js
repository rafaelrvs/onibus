// src/app/api/OnibusInterMunicipal/LineDetails/route.js
import { NextResponse } from 'next/server';

// Proxy para a API REST EMTU (lineDetails)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const linha = searchParams.get('linha');
  if (!linha) {
    return NextResponse.json({ error: 'Parâmetro "linha" é obrigatório' }, { status: 400 });
  }

  const externalUrl = `https://rest-emtu.noxxonsat.com.br/rest/lineDetails?linha=${encodeURIComponent(linha)}`;
  try {
    const resp = await fetch(externalUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Next.js Server'
      }
    });
    if (!resp.ok) {
      console.error(`Erro status ${resp.status} ao buscar ${externalUrl}`);
      return NextResponse.json({ error: 'Falha ao buscar detalhes da linha' }, { status: resp.status });
    }
    const json = await resp.json();
    return NextResponse.json(json, { status: 200 });
  } catch (err) {
    console.error('Erro interno proxy LineDetails:', err);
    return NextResponse.json({ error: 'Erro interno ao buscar detalhes da linha' }, { status: 500 });
  }
}
