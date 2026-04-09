// test.js
const audioService = require('./backend/services/audioService');

const mockTranscricao = "Preciso de ajuda agora";
const resultado = audioService.processIncomingTranscription(mockTranscricao);

console.log("Teste de STT:");
console.log("Texto recebido:", resultado.originalText);
console.log("É urgente?:", resultado.isUrgent ? "SIM (Botão SOS acionado)" : "Não");