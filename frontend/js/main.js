import { carregarDados, salvarDados } from "./storage.js";
import { adicionarCategoria, adicionarFrase } from "./crud.js";
import { renderizarTela } from "./render.js";
import {
  initializeSpeech,
  bindHoldToListen,
  speakText
} from "./speech.js";

let dadosApp = carregarDados();

function atualizarTela() {
  salvarDados(dadosApp);
  renderizarTela(dadosApp, speakText);
}

function getInputTextoLivre() {
  return document.getElementById("input-texto-livre");
}

function falarTextoLivre() {
  const input = getInputTextoLivre();
  if (!input) return;

  const texto = input.value.trim();

  if (!texto) {
    alert("Digite uma mensagem para o app falar.");
    input.focus();
    return;
  }

  speakText(texto);
}

function limparTextoLivre() {
  const input = getInputTextoLivre();
  if (!input) return;

  input.value = "";
  input.focus();
}

function falarMensagemSOS() {
  speakText("Preciso de ajuda imediata!");
}

function handleAdicionarCategoria() {
  const input = document.getElementById("input-nova-categoria");
  if (!input) return;

  const valor = input.value.trim();

  if (!valor) {
    alert("Digite o nome da categoria.");
    input.focus();
    return;
  }

  dadosApp = adicionarCategoria(dadosApp, valor);
  input.value = "";
  atualizarTela();
}

function handleAdicionarFrase() {
  const select = document.getElementById("select-categoria");
  const input = document.getElementById("input-nova-frase");

  if (!select || !input) return;

  const categoriaId = select.value;
  const frase = input.value.trim();

  if (!categoriaId) {
    alert("Selecione uma categoria.");
    return;
  }

  if (!frase) {
    alert("Digite uma frase.");
    input.focus();
    return;
  }

  dadosApp = adicionarFrase(dadosApp, categoriaId, frase);
  input.value = "";
  atualizarTela();
}

function configurarEventos() {
  const btnFalarTexto = document.getElementById("btn-falar-texto");
  const btnLimparTexto = document.getElementById("btn-limpar-texto");
  const btnSOS = document.getElementById("btn-sos");
  const btnCriarCategoria = document.getElementById("btn-criar-categoria");
  const btnSalvarFrase = document.getElementById("btn-salvar-frase");
  const inputTextoLivre = getInputTextoLivre();

  if (btnFalarTexto) {
    btnFalarTexto.addEventListener("click", falarTextoLivre);
  }

  if (btnLimparTexto) {
    btnLimparTexto.addEventListener("click", limparTextoLivre);
  }

  if (btnSOS) {
    btnSOS.addEventListener("click", falarMensagemSOS);
  }

  if (btnCriarCategoria) {
    btnCriarCategoria.addEventListener("click", handleAdicionarCategoria);
  }

  if (btnSalvarFrase) {
    btnSalvarFrase.addEventListener("click", handleAdicionarFrase);
  }

  if (inputTextoLivre) {
    inputTextoLivre.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        falarTextoLivre();
      }
    });
  }

  bindHoldToListen();
}

function init() {
  initializeSpeech();
  configurarEventos();
  atualizarTela();
}

init();