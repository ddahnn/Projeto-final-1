import { dadosPadrao } from "./data.js";

const STORAGE_KEY = "comunicador_inclusivo_dados";

export function carregarDados() {
  try {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);

    if (!dadosSalvos) {
      return dadosPadrao;
    }

    const dadosConvertidos = JSON.parse(dadosSalvos);

    if (!Array.isArray(dadosConvertidos)) {
      return dadosPadrao;
    }

    return dadosConvertidos;
  } catch (error) {
    console.error("Erro ao carregar dados do localStorage:", error);
    return dadosPadrao;
  }
}

export function salvarDados(dados) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  } catch (error) {
    console.error("Erro ao salvar dados no localStorage:", error);
    alert("Não foi possível salvar os dados no navegador.");
  }
}