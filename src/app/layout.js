// app/layout.tsx
import localFont from "next/font/local";
import "./globals.css";
import { GlobalProvider } from "../Context/globalContext";

// Fontes locais
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Domínio base via variável de ambiente ou fallback
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rvstechsolucoes.com.br";

export const metadata = {
  // Base para URLs canônicas e Open Graph
  metadataBase: new URL(siteUrl),

  title: "Consulta de Horários de Ônibus Municipais e Intermunicipais | Pega o Bus Aí",
  description:
    "Acesse horários de ônibus em tempo real, rotas e itinerários municipais e intermunicipais. Receba alertas de chegada e planeje sua viagem com precisão.",
  keywords: [
    "horários de ônibus",
    "ônibus municipal",
    "ônibus intermunicipal",
    "consulta de horários de ônibus",
    "rotas de ônibus",
    "itinerários de ônibus",
    "ônibus em tempo real",
    "transporte público",
    "bus timetable",
    "bus schedule",
    "alerta de chegada",
    "Pega o Bus Aí"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },

  openGraph: {
    title: "Consulta de Horários de Ônibus | Pega o Bus Aí",
    description:
      "Confira horários, rotas e itinerários de ônibus municipais e intermunicipais em tempo real.",
    url: siteUrl,
    siteName: "Pega o Bus Aí",
    type: "website",
    locale: "pt_BR",
    images: [
      { url: `${siteUrl}/bus-og.png`, width: 1200, height: 630, alt: "Pega o Bus Aí - Horários de Ônibus" }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "Horários de Ônibus em Tempo Real | Pega o Bus Aí",
    description:
      "Planeje sua viagem com alertas de chegada e itinerários precisos. Consulte agora!",
    site: "@PegaOBusAi",
    creator: "@PegaOBusAi",
    images: [`${siteUrl}/bus-og.png`]
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png"
  },

  alternates: {
    canonical: siteUrl
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}> 
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0d47a1" />
        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content="adgZNeduAxfoc1c0AfmqmaW0tKBqXJhrxLPDFPyHedU"
        />
        {/* AMP Ad */}
        <script
          async
          custom-element="amp-ad"
          src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"
        ></script>
      </head>

      <body>
        <GlobalProvider>{children}</GlobalProvider>

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7736006621106112"
          crossOrigin="anonymous"
        ></script>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="autorelaxed"
          data-ad-client="ca-pub-7736006621106112"
          data-ad-slot="4570844947"
        ></ins>
        {/* <script>(adsbygoogle = window.adsbygoogle || []).push({});</script> */}
      </body>
    </html>
  );
}
