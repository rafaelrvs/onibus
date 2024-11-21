export async function POST(req) {
    try {
      const { text } = await req.json(); // Adicione `id` na requisição
      if (!text) {
        return NextResponse.json({ error: 'Texto ou ID ausente da requisição' }, { status: 400 });
      }
  
      // Fazer a requisição para a API Flask
      const response = await axios.post(API_URL, { text }, { responseType: 'arraybuffer' });
  
      // Salvar o arquivo no servidor Next.js
      const audioDir = path.join(process.cwd(), 'public/audio');
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }
      const filePath = path.join(audioDir, `audio.mp3`);
      fs.writeFileSync(filePath, response.data);
  
      return NextResponse.json({ message: 'Áudio gerado com sucesso', path: `/audio/audio.mp3` });
    } catch (error) {
      console.error('Erro ao processar o áudio:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  