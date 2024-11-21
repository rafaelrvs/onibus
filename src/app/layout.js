import localFont from "next/font/local";
import "./globals.css";

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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
