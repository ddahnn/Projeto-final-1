export function renderizarTela(dadosApp, speakText) {
  const main = document.getElementById("app-content");
  const selectCategoria = document.getElementById("select-categoria");

  if (!main || !selectCategoria) return;

  main.innerHTML = "";
  selectCategoria.innerHTML = "";

  if (!Array.isArray(dadosApp) || dadosApp.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Nenhuma categoria cadastrada ainda.";
    main.appendChild(emptyMessage);
    return;
  }

  dadosApp.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria.id;
    option.textContent = categoria.nome;
    selectCategoria.appendChild(option);

    const hasPhrases =
      Array.isArray(categoria.frases) && categoria.frases.length > 0;

    if (!hasPhrases) return;

    const title = document.createElement("h3");
    title.className = "category-title";
    title.textContent = categoria.nome;
    main.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "grid";

    categoria.frases.forEach((frase) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "phrase-btn";
      button.textContent = frase;

      button.addEventListener("click", () => {
        speakText(frase);
      });

      grid.appendChild(button);
    });

    main.appendChild(grid);
  });

  if (!main.innerHTML.trim()) {
    const emptyPhraseMessage = document.createElement("p");
    emptyPhraseMessage.textContent =
      "As categorias existem, mas ainda não há frases cadastradas.";
    main.appendChild(emptyPhraseMessage);
  }
}