// app/layout.tsx
import localFont from "next/font/local"
import "./globals.css"
import { GlobalProvider } from "../Context/globalContext"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata = {
  title: "Pega o Bus Aí - Consulta de Horários de Ônibus",
  description:
    "Com o app Pega o Bus Aí, consulte os horários de ônibus em tempo real, visualize rotas e receba alertas...",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}> 
      <head>
        <meta charSet="utf-8" />
        {/* snippet SSR para o crawler do AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          data-ad-client="ca-pub-7736006621106112"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body>
        <GlobalProvider>
          {children}
        </GlobalProvider>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7736006621106112"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="autorelaxed"
     data-ad-client="ca-pub-7736006621106112"
     data-ad-slot="4570844947"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
      </body>
    </html>
  )
}
