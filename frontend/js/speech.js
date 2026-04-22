let recognition = null;
let isListening = false;
let pressStarted = false;
let speechSupported = "speechSynthesis" in window;

function getListenButton() {
  return document.getElementById("btn-segurar-ouvir");
}

function getStatusElement() {
  return document.getElementById("status-escuta");
}

function getTranscriptElement() {
  return document.getElementById("texto-transcrito");
}

function setListeningUI(active) {
  const button = getListenButton();
  const status = getStatusElement();

  if (!button || !status) return;

  if (active) {
    button.classList.add("listening");
    button.textContent = "🎤 Ouvindo...";
    status.textContent = "Microfone ativo";
    status.classList.add("active");
  } else {
    button.classList.remove("listening");
    button.textContent = "🎤 Segure para ouvir";
    status.textContent = "Microfone parado";
    status.classList.remove("active");
  }
}

function setTranscriptText(text) {
  const transcriptBox = getTranscriptElement();
  if (!transcriptBox) return;
  transcriptBox.textContent = text;
}

function appendTranscriptText(text) {
  const transcriptBox = getTranscriptElement();
  if (!transcriptBox) return;

  const currentText = transcriptBox.textContent.trim();
  transcriptBox.textContent = currentText ? `${currentText} ${text}` : text;
}

export function speakText(text) {
  const content = text.trim();

  if (!content) return;

  if (!speechSupported) {
    alert("Seu navegador não suporta leitura em voz.");
    return;
  }

  if (isListening && recognition) {
    stopListening();
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(content);
  utterance.lang = "pt-BR";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
}

function createRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognitionInstance = new SpeechRecognition();
  recognitionInstance.lang = "pt-BR";
  recognitionInstance.continuous = true;
  recognitionInstance.interimResults = true;

  let finalTranscript = "";
  let interimTranscript = "";

  recognitionInstance.onstart = () => {
    isListening = true;
    setListeningUI(true);
    setTranscriptText("Ouvindo...");
  };

  recognitionInstance.onresult = (event) => {
    finalTranscript = "";
    interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const transcript = event.results[i][0].transcript.trim();

      if (event.results[i].isFinal) {
        finalTranscript += `${transcript} `;
      } else {
        interimTranscript += `${transcript} `;
      }
    }

    const fullText = `${finalTranscript}${interimTranscript}`.trim();

    if (fullText) {
      setTranscriptText(fullText);
    }
  };

  recognitionInstance.onerror = (event) => {
    console.error("Erro no reconhecimento de voz:", event.error);

    isListening = false;
    pressStarted = false;
    setListeningUI(false);

    if (event.error === "not-allowed") {
      setTranscriptText("Permissão do microfone negada.");
      alert("Permita o uso do microfone para usar a transcrição.");
      return;
    }

    if (event.error === "no-speech") {
      setTranscriptText("Nenhuma fala foi detectada.");
      return;
    }

    setTranscriptText("Não foi possível transcrever o áudio.");
  };

  recognitionInstance.onend = () => {
    isListening = false;
    setListeningUI(false);

    const transcriptBox = getTranscriptElement();
    if (!transcriptBox) return;

    const text = transcriptBox.textContent.trim();

    if (!text || text === "Ouvindo...") {
      setTranscriptText("O texto transcrito aparecerá aqui...");
    }
  };

  return recognitionInstance;
}

export function initializeSpeech() {
  recognition = createRecognition();

  if (!recognition) {
    const button = getListenButton();
    const status = getStatusElement();

    if (button) {
      button.disabled = true;
      button.textContent = "Microfone indisponível";
    }

    if (status) {
      status.textContent = "Seu navegador não suporta transcrição de voz.";
    }
  }
}

export function startListening() {
  if (!recognition || isListening) return;

  pressStarted = true;

  if (speechSupported) {
    window.speechSynthesis.cancel();
  }

  try {
    recognition.start();
  } catch (error) {
    console.error("Erro ao iniciar reconhecimento:", error);
  }
}

export function stopListening() {
  if (!recognition || !isListening) return;

  pressStarted = false;

  try {
    recognition.stop();
  } catch (error) {
    console.error("Erro ao parar reconhecimento:", error);
  }
}

export function bindHoldToListen() {
  const button = getListenButton();
  if (!button) return;

  const handlePressStart = (event) => {
    event.preventDefault();
    startListening();
  };

  const handlePressEnd = (event) => {
    event.preventDefault();
    stopListening();
  };

  button.addEventListener("mousedown", handlePressStart);
  button.addEventListener("mouseup", handlePressEnd);
  button.addEventListener("mouseleave", handlePressEnd);

  button.addEventListener("touchstart", handlePressStart, { passive: false });
  button.addEventListener("touchend", handlePressEnd, { passive: false });
  button.addEventListener("touchcancel", handlePressEnd, { passive: false });
}