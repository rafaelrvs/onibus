// app/api/linhas/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const resp = await fetch(
    'https://mobilidadeservicos.mogidascruzes.sp.gov.br/public/buscar-linha'
  );
  const data = await resp.json();

  // Retorna para o cliente sem CORS issues
  return NextResponse.json(data);
}
