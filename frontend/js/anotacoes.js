const API_ANOTACOES = "http://localhost:8080/anotacoes";

let anotacoes = [];

function formatarData(dataISO) {
  if (!dataISO) return "";

  const data = new Date(dataISO);

  return data.toLocaleDateString("pt-BR") + " às " + data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function limparFormulario() {
  document.getElementById("idAnotacaoEditando").value = "";
  document.getElementById("tituloAnotacao").value = "";
  document.getElementById("textoAnotacao").value = "";
  document.getElementById("btnCancelarEdicao").style.display = "none";
}

function cancelarEdicao() {
  limparFormulario();
}

async function carregarAnotacoes() {
  try {
    const resposta = await fetch(API_ANOTACOES);

    if (!resposta.ok) {
      throw new Error("Erro ao carregar anotações.");
    }

    anotacoes = await resposta.json();

    anotacoes.sort(function (a, b) {
      return new Date(b.dataCriacao) - new Date(a.dataCriacao);
    });

    renderizarAnotacoes();
  } catch (erro) {
    console.error("Erro ao buscar anotações:", erro);
    mostrarMensagem("Não foi possível carregar as anotações.", "erro");
  }
}

async function salvarAnotacao() {
  const idEditando = document.getElementById("idAnotacaoEditando").value;
  const titulo = document.getElementById("tituloAnotacao").value.trim();
  const texto = document.getElementById("textoAnotacao").value.trim();

  if (titulo === "" || texto === "") {
    mostrarMensagem("Preencha o título e a anotação.", "aviso");
    return;
  }

  const anotacao = {
    titulo: titulo,
    texto: texto
  };

  try {
    let resposta;

    if (idEditando !== "") {
      resposta = await fetch(`${API_ANOTACOES}/${idEditando}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(anotacao)
      });
    } else {
      resposta = await fetch(API_ANOTACOES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(anotacao)
      });
    }

    if (!resposta.ok) {
      throw new Error("Erro ao salvar anotação.");
    }

    mostrarMensagem(
      idEditando ? "Anotação atualizada com sucesso!" : "Anotação criada com sucesso!",
      "sucesso"
    );

    limparFormulario();
    await carregarAnotacoes();
  } catch (erro) {
    console.error("Erro ao salvar anotação:", erro);
    mostrarMensagem("Não foi possível salvar a anotação.", "erro");
  }
}

function editarAnotacao(id) {
  let anotacao = null;

  for (let i = 0; i < anotacoes.length; i++) {
    if (anotacoes[i].id === id) {
      anotacao = anotacoes[i];
      break;
    }
  }

  if (!anotacao) return;

  document.getElementById("idAnotacaoEditando").value = anotacao.id;
  document.getElementById("tituloAnotacao").value = anotacao.titulo;
  document.getElementById("textoAnotacao").value = anotacao.texto;
  document.getElementById("btnCancelarEdicao").style.display = "inline-block";

  document.getElementById("tituloAnotacao").focus();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

async function excluirAnotacao(id) {
  const confirmar = confirm("Tem certeza que deseja excluir esta anotação?");
  if (!confirmar) return;

  try {
    const resposta = await fetch(`${API_ANOTACOES}/${id}`, {
      method: "DELETE"
    });

    if (!resposta.ok) {
      throw new Error("Erro ao excluir anotação.");
    }

    const idEditando = document.getElementById("idAnotacaoEditando").value;
    if (idEditando == id) {
      limparFormulario();
    }

    mostrarMensagem("Anotação excluída com sucesso!", "sucesso");

    await carregarAnotacoes();
  } catch (erro) {
    console.error("Erro ao excluir anotação:", erro);
    mostrarMensagem("Não foi possível excluir a anotação.", "erro");
  }
}

function renderizarAnotacoes() {
  const lista = document.getElementById("listaAnotacoes");

  if (!lista) return;

  lista.innerHTML = "";

  if (anotacoes.length === 0) {
    lista.innerHTML = `<p class="sem-anotacoes">Nenhuma anotação cadastrada ainda.</p>`;
    return;
  }

  for (let i = 0; i < anotacoes.length; i++) {
    const anotacao = anotacoes[i];

    let dataEdicaoHtml = "";

    if (anotacao.dataEdicao) {
      dataEdicaoHtml = `<small><strong>Editado em:</strong> ${formatarData(anotacao.dataEdicao)}</small>`;
    }

    lista.innerHTML += `
      <div class="card-anotacao">
        <div class="topo-card-anotacao">
          <h3>${anotacao.titulo}</h3>
        </div>

        <p class="texto-card-anotacao">${anotacao.texto}</p>

        <div class="info-card-anotacao">
          <small><strong>Criado em:</strong> ${formatarData(anotacao.dataCriacao)}</small>
          ${dataEdicaoHtml}
        </div>

        <div class="acoes-card-anotacao">
          <button class="btn-editar-anotacao" onclick="editarAnotacao(${anotacao.id})">Editar</button>
          <button class="btn-excluir-anotacao" onclick="excluirAnotacao(${anotacao.id})">Excluir</button>
        </div>
      </div>
    `;
  }
}

window.onload = function () {
  carregarAnotacoes();
};