// app.js

// CONFIGURAÇÕES INICIAIS 
const textarea = document.querySelector('.texto');
const selectIdioma = document.querySelector('.idioma');
const botoes = document.querySelectorAll('button');
const btnTraduzir = botoes[0]; // Primeiro botão (Traduzir)
const btnMicrofone = botoes[1]; // Segundo botão (Microfone)
const traducaoParagrafo = document.querySelector('.traducao');
const tituloTraducao = document.querySelector('.titulo-traducao');

// Mapeamento de idiomas para códigos da API 
const idiomasMap = {
    'Alemão': 'de',
    'ingles': 'en',
    'Japones': 'ja'
};

// FUNÇÃO DE TRADUÇÃO 
async function traduzirTexto(texto, idiomaDestino) {
    try {
        // Verifica se o texto não está vazio
        if (!texto || !texto.trim()) {
            traducaoParagrafo.textContent = '✏️ Digite algo para traduzir!';
            return;
        }

        // Atualiza o título da tradução
        tituloTraducao.textContent = ` Traduzindo para ${idiomaDestino}...`;
        traducaoParagrafo.textContent = ' Aguarde...';
        
        // Obtém o código do idioma de destino
        const idiomaCode = idiomasMap[idiomaDestino];
        
        if (!idiomaCode) {
            throw new Error('Idioma não suportado');
        }
        
        // Usando a API gratuita MyMemory
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=pt|${idiomaCode}&de=email@example.com`;
        
        console.log('Traduzindo:', texto, 'para:', idiomaDestino, 'código:', idiomaCode);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verifica se a tradução foi encontrada
        if (data && data.responseData && data.responseData.translatedText) {
            let textoTraduzido = data.responseData.translatedText;
            
            // Remove possíveis tags HTML que a API pode retornar
            textoTraduzido = textoTraduzido.replace(/<[^>]*>/g, '');
            
            // Se a tradução for igual ao original, pode ser que não encontrou
            if (textoTraduzido === texto) {
                traducaoParagrafo.textContent = '⚠️ Não foi possível traduzir. Tente um texto diferente.';
                tituloTraducao.textContent = 'Tradução';
                return;
            }
            
            traducaoParagrafo.textContent = textoTraduzido;
            tituloTraducao.textContent = ' Tradução';
        } else {
            throw new Error('Tradução não encontrada');
        }
        
    } catch (error) {
        console.error('Erro detalhado na tradução:', error);
        traducaoParagrafo.textContent = '❌ Erro ao traduzir. Verifique sua conexão e tente novamente.';
        tituloTraducao.textContent = 'Tradução';
    }
}

// FUNÇÃO DE RECONHECIMENTO DE VOZ 
function iniciarReconhecimentoVoz() {
    // Verifica se o navegador suporta reconhecimento de voz
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('❌ Seu navegador não suporta reconhecimento de voz.\nUse Chrome, Edge ou Safari.');
        return;
    }
    
    // Cria uma instância do reconhecimento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configurações do reconhecimento
    recognition.lang = 'pt-BR'; // Português brasileiro
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Feedback visual no botão do microfone
    btnMicrofone.style.backgroundColor = '#ff6b6b';
    btnMicrofone.style.transform = 'scale(1.05)';
    btnMicrofone.textContent = ' Ouvindo...';
    
    // Inicia o reconhecimento
    recognition.start();
    
    // Quando o reconhecimento termina
    recognition.onresult = (event) => {
        const resultado = event.results[0][0].transcript;
        textarea.value = resultado;
        
        // Traduz automaticamente após reconhecer a voz
        const idiomaSelecionado = selectIdioma.value;
        traduzirTexto(resultado, idiomaSelecionado);
        
        // Restaura o botão do microfone
        btnMicrofone.style.backgroundColor = '';
        btnMicrofone.style.transform = '';
        btnMicrofone.textContent = ' Microfone';
    };
    
    // Tratamento de erros
    recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        
        let mensagemErro = '';
        switch(event.error) {
            case 'no-speech':
                mensagemErro = ' Nenhuma fala detectada. Tente novamente.';
                break;
            case 'audio-capture':
                mensagemErro = ' Microfone não encontrado. Verifique as permissões.';
                break;
            case 'not-allowed':
                mensagemErro = ' Permissão do microfone negada.';
                break;
            default:
                mensagemErro = ' Erro ao capturar áudio. Tente novamente.';
        }
        
        alert(mensagemErro);
        
        // Restaura o botão do microfone
        btnMicrofone.style.backgroundColor = '';
        btnMicrofone.style.transform = '';
        btnMicrofone.textContent = ' Microfone';
    };
    
    // Quando o reconhecimento termina
    recognition.onend = () => {
        setTimeout(() => {
            if (btnMicrofone.textContent !== ' Microfone') {
                btnMicrofone.style.backgroundColor = '';
                btnMicrofone.style.transform = '';
                btnMicrofone.textContent = ' Microfone';
            }
        }, 1000);
    };
}

//  EVENT LISTENERS 
// Botão traduzir
btnTraduzir.addEventListener('click', () => {
    const textoOriginal = textarea.value;
    const idiomaDestino = selectIdioma.value;
    
    if (!textoOriginal || !textoOriginal.trim()) {
        traducaoParagrafo.textContent = '✏️ Digite um texto para traduzir!';
        textarea.focus();
        return;
    }
    
    traduzirTexto(textoOriginal, idiomaDestino);
});

// Botão microfone
btnMicrofone.addEventListener('click', iniciarReconhecimentoVoz);

// Tecla Enter para traduzir (Ctrl+Enter ou Cmd+Enter para quebrar linha)
textarea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        btnTraduzir.click();
    }
});

// Tradução automática ao mudar o idioma
selectIdioma.addEventListener('change', () => {
    if (textarea.value && textarea.value.trim()) {
        traduzirTexto(textarea.value, selectIdioma.value);
    }
});

// Mensagem inicial
traducaoParagrafo.textContent = ' Fale ou digite algo e clique em Traduzir';
tituloTraducao.textContent = ' Tradutor';

// Teste de conexão com a API ao carregar
console.log('Tradutor carregado! Idiomas disponíveis:', Object.keys(idiomasMap));
