
export const ativaFrame = (inputUsuario, mapa, setLinkframe) => {
    const pesquisa = inputUsuario.toString().trim().toUpperCase();

    const urlsEncontradas = mapa.flatMap(element =>
        element.linhas.filter(item => item.name.trim().toUpperCase() === pesquisa)
                      .map(item => item.url)
    );

    if (urlsEncontradas.length > 0) {
        urlsEncontradas.forEach(url => {
            setLinkframe(url); // Exibe cada URL encontrada
        });
    }
};

// Função para processar o arquivo de texto
export const processaArquivoTexto = (conteudo, inputUsuario, setBlocosEncontrados, setResultado, enviaParaServidor) => {
    const linhas = conteudo.split('\n');
    let blocoAtual = '';
    let blocosTemp = [];
    let capturandoBloco = false;

    linhas.forEach((linha) => {
        if (linha.startsWith('Linha')) {
            if (capturandoBloco && blocoAtual) {
                blocosTemp.push(blocoAtual); // Armazena o bloco anterior
            }
            capturandoBloco = linha.toUpperCase().includes(inputUsuario);
            blocoAtual = capturandoBloco ? linha + '\n' : ''; // Reseta o bloco atual
        } else if (capturandoBloco) {
            blocoAtual += linha + '\n'; // Continua capturando o bloco
        }
    });

    if (capturandoBloco && blocoAtual) {
        blocosTemp.push(blocoAtual);
    }

    if (blocosTemp.length > 0) {
        setBlocosEncontrados(blocosTemp);
        enviaParaServidor(blocosTemp);
    } else {
        setResultado('Nenhum bloco correspondente encontrado.');
    }
};
