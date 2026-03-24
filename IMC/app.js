function traduzirTexto() {
    const textoOriginal = document.querySelector('.texto').value;
    const idiomaSelect = document.querySelectorAll('.idioma')[1];
    const idiomaDestino = idiomaSelect.value;
    const traducaoElement = document.querySelector('.traducao');
    
    if (!textoOriginal.trim()) {
        traducaoElement.textContent = 'Digite algo para traduzir';
        return;
    }
    
    traducaoElement.textContent = 'Traduzindo...';
    
    // Simulação de tradução (você pode substituir por uma API real)
    setTimeout(() => {
        const traducoes = {
            'Alemão': `Deutsch: ${textoOriginal}`,
            'ingles': `English: ${textoOriginal}`,
            'Japonês': `日本語: ${textoOriginal}`
        };
        traducaoElement.textContent = traducoes[idiomaDestino] || `Tradução para ${idiomaDestino}: ${textoOriginal}`;
    }, 500);
}

function iniciarMicrofone() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;
        
        recognition.start();
        
        const textoArea = document.querySelector('.texto');
        textoArea.placeholder = '🎤 Ouvindo...';
        
        recognition.onresult = function(event) {
            const fala = event.results[0][0].transcript;
            textoArea.value = fala;
            textoArea.placeholder = 'Digite ou fale aqui...';
            traduzirTexto();
        };
        
        recognition.onerror = function() {
            textoArea.placeholder = 'Erro no microfone. Digite aqui...';
        };
    } else {
        alert('Seu navegador não suporta reconhecimento de voz');
    }
}

function limparTexto() {
    const textoArea = document.querySelector('.texto');
    const traducaoElement = document.querySelector('.traducao');
    
    if (textoArea.value) {
        textoArea.value = '';
        traducaoElement.textContent = 'Texto Traduzido';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const botoes = document.querySelectorAll('button');
    if (botoes[0]) botoes[0].addEventListener('click', traduzirTexto);
    if (botoes[1]) botoes[1].addEventListener('click', iniciarMicrofone);
    
    const textoArea = document.querySelector('.texto');
    textoArea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            traduzirTexto();
        }
    });
    
    textoArea.addEventListener('focus', () => {
        textoArea.style.transform = 'scale(1.02)';
    });
    
    textoArea.addEventListener('blur', () => {
        textoArea.style.transform = 'scale(1)';
    });
    
    const idiomas = document.querySelectorAll('.idioma');
    idiomas.forEach(select => {
        select.addEventListener('change', () => {
            if (document.querySelector('.texto').value) {
                traduzirTexto();
            }
        });
    });
});