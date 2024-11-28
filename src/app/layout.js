import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";

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

export const metadata = {
  title: "Pega o Bus Aí - Consulta de Horários de Ônibus",
  description: "Com o app Pega o Bus Aí, consulte os horários de ônibus em tempo real, visualize rotas e receba alertas sobre a chegada e partida de ônibus na sua cidade. Planeje sua viagem, evite atrasos e saiba tudo sobre as linhas de transporte público. Não perca mais tempo esperando na parada!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
      <meta name="google-site-verification" content="BvUBcMILtkjr0ybfmjq-N--ZGHmpEpfMxhytjF8dOww" />
        <meta name="google-adsense-account" content="ca-pub-7736006621106112" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Script
          id="funding-choices"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                window.__fundingChoices = window.__fundingChoices || {};
                window.__fundingChoices.loadMessage = function () {
                  const consentMessage = document.createElement("script");
                  consentMessage.async = true;
                  consentMessage.src = "https://fundingchoicesmessages.google.com/i/pub-7736006621106112?ers=1";
                  document.head.appendChild(consentMessage);
                };
                window.__fundingChoices.loadMessage();
              })();
            `,
          }}
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7736006621106112"
     crossorigin="anonymous"></script>
      </body>

    </html>
  );
}
