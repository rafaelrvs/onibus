// app/head.tsx
export default function Head() {
  return (
    <>
      {/* snippet SSR puro que o crawler do AdSense enxerga */}
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        data-ad-client="ca-pub-773600662110611"
        crossOrigin="anonymous"
      ></script>
    </>
  );
}
