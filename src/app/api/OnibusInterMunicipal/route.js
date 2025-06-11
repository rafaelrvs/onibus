// app/api/OnibusInterMunicipal/route.js
import { NextResponse } from "next/server";

export async function GET() {
 
  const resp = await fetch(
    "https://www.emtu.sp.gov.br/emtu/home/home.asp?a=estouEm"
  );
 
  const data = await resp.json();

  return NextResponse.json(data);
}
