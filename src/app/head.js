// app/head.tsx
export default function Head() {
  return (
    <>
      {/* snippet SSR puro que o crawler do AdSense enxerga */}
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        data-ad-client="ca-pub-9552697386011881"
        crossOrigin="anonymous"
      ></script>
    </>
  );
}
