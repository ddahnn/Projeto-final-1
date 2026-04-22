export function adicionarCategoria(dadosApp, nomeCategoria) {
  const nome = nomeCategoria.trim();

  if (!nome) {
    return dadosApp;
  }

  const categoriaJaExiste = dadosApp.some(
    (categoria) => categoria.nome.toLowerCase() === nome.toLowerCase()
  );

  if (categoriaJaExiste) {
    alert("Essa categoria já existe.");
    return dadosApp;
  }

  const novaCategoria = {
    id: Date.now().toString(),
    nome,
    frases: []
  };

  return [...dadosApp, novaCategoria];
}

export function adicionarFrase(dadosApp, categoriaId, novaFrase) {
  const frase = novaFrase.trim();

  if (!frase) {
    return dadosApp;
  }

  return dadosApp.map((categoria) => {
    if (categoria.id !== categoriaId) {
      return categoria;
    }

    const fraseJaExiste = categoria.frases.some(
      (item) => item.toLowerCase() === frase.toLowerCase()
    );

    if (fraseJaExiste) {
      alert("Essa frase já existe nessa categoria.");
      return categoria;
    }

    return {
      ...categoria,
      frases: [...categoria.frases, frase]
    };
  });
}