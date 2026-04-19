const API_DOACOES = "http://localhost:8080/doacoes";
const API_FAMILIAS = "http://localhost:8080/familias";
const API_ENTREGAS = "http://localhost:8080/entregas";

let itemSelecionadoEntrega = "";
let categoriaSelecionadaEntrega = "";
let estoqueSelecionadoEntrega = 0;
let itensDisponiveisEntrega = {};

let doacoesCache = [];
let familiasCache = [];
let entregasCache = [];

function normalizarTexto(texto) {
  return (texto || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s/g, "");
}

function mostrarFormularioEntrega() {
  document.getElementById("formEntrega").style.display = "block";
}

function esconderFormularioEntrega() {
  document.getElementById("formEntrega").style.display = "none";
}

function limparFormularioEntrega() {
  document.getElementById("quantidadeEntrega").value = "";
  document.getElementById("familiaEntrega").value = "";
}

function cancelarEntrega() {
  limparFormularioEntrega();
  esconderFormularioEntrega();
}

function atualizarTotaisNaTela(estoqueFinal) {
  document.getElementById("totalRoupas").innerText = estoqueFinal.roupas + " itens";
  document.getElementById("totalAlimentos").innerText = estoqueFinal.alimentos + " itens";
  document.getElementById("totalBrinquedos").innerText = estoqueFinal.brinquedos + " itens";
  document.getElementById("totalHigiene").innerText = estoqueFinal.higiene + " itens";
  document.getElementById("totalLimpeza").innerText = estoqueFinal.limpeza + " itens";
  document.getElementById("totalMaterialEscolar").innerText = estoqueFinal.materialescolar + " itens";
  document.getElementById("totalUtensilios").innerText = estoqueFinal.utensilios + " itens";
}

async function carregarDoacoes() {
  const resposta = await fetch(API_DOACOES);
  if (!resposta.ok) {
    throw new Error("Erro ao buscar doações.");
  }
  doacoesCache = await resposta.json();
}

async function carregarFamilias() {
  const resposta = await fetch(API_FAMILIAS);
  if (!resposta.ok) {
    throw new Error("Erro ao buscar famílias.");
  }
  familiasCache = await resposta.json();
}

async function carregarEntregas() {
  const resposta = await fetch(API_ENTREGAS);
  if (!resposta.ok) {
    throw new Error("Erro ao buscar entregas.");
  }
  entregasCache = await resposta.json();
}

function carregarEstoque() {
  const estoqueFinal = {
    roupas: 0,
    alimentos: 0,
    brinquedos: 0,
    higiene: 0,
    limpeza: 0,
    materialescolar: 0,
    utensilios: 0
  };

  for (let i = 0; i < doacoesCache.length; i++) {
    const categoria = normalizarTexto(doacoesCache[i].categoria);
    const quantidade = Number(doacoesCache[i].quantidade) || 0;

    if (estoqueFinal[categoria] !== undefined) {
      estoqueFinal[categoria] += quantidade;
    }
  }

  for (let i = 0; i < entregasCache.length; i++) {
    const categoria = normalizarTexto(entregasCache[i].categoria);
    const quantidade = Number(entregasCache[i].quantidade) || 0;

    if (estoqueFinal[categoria] !== undefined) {
      estoqueFinal[categoria] -= quantidade;
    }
  }

  for (let categoria in estoqueFinal) {
    if (estoqueFinal[categoria] < 0) {
      estoqueFinal[categoria] = 0;
    }
  }

  atualizarTotaisNaTela(estoqueFinal);
}

function carregarFamiliasNoSelect() {
  const selectFamilia = document.getElementById("familiaEntrega");

  if (familiasCache.length === 0) {
    selectFamilia.innerHTML = '<option value="">Nenhuma família cadastrada</option>';
    return;
  }

  selectFamilia.innerHTML = '<option value="">Selecione uma família</option>';

  for (let i = 0; i < familiasCache.length; i++) {
    const familia = familiasCache[i];
    const nomeFamilia =
      familia.nome ||
      familia.responsavel ||
      familia.nomeResponsavel ||
      "Família sem nome";

    selectFamilia.innerHTML += `<option value="${nomeFamilia}">${nomeFamilia}</option>`;
  }
}

function carregarItensNoSelect(categoria) {
  const selectItem = document.getElementById("itemEntrega");

  itensDisponiveisEntrega = {};
  selectItem.innerHTML = '<option value="">Selecione um item</option>';

  const categoriaNormalizada = normalizarTexto(categoria);

  for (let i = 0; i < doacoesCache.length; i++) {
    const d = doacoesCache[i];

    if (normalizarTexto(d.categoria) === categoriaNormalizada) {
      const nomeItem = d.item;
      const quantidade = Number(d.quantidade) || 0;

      itensDisponiveisEntrega[nomeItem] = (itensDisponiveisEntrega[nomeItem] || 0) + quantidade;
    }
  }

  for (let i = 0; i < entregasCache.length; i++) {
    const e = entregasCache[i];

    if (normalizarTexto(e.categoria) === categoriaNormalizada) {
      if (itensDisponiveisEntrega[e.item]) {
        itensDisponiveisEntrega[e.item] -= Number(e.quantidade) || 0;
      }
    }
  }

  for (let item in itensDisponiveisEntrega) {
    if (itensDisponiveisEntrega[item] > 0) {
      selectItem.innerHTML += `<option value="${item}">${item}</option>`;
    }
  }
}

window.atualizarEstoqueDoItemSelecionado = function () {
  const item = document.getElementById("itemEntrega").value;

  if (item && itensDisponiveisEntrega[item]) {
    itemSelecionadoEntrega = item;
    estoqueSelecionadoEntrega = itensDisponiveisEntrega[item];
  } else {
    itemSelecionadoEntrega = "";
    estoqueSelecionadoEntrega = 0;
  }
};

window.mostrarItensCategoria = function (categoriaSelecionada) {
  categoriaSelecionadaEntrega = categoriaSelecionada;
  document.getElementById("categoriaEntrega").value = categoriaSelecionada;

  carregarItensNoSelect(categoriaSelecionada);
  carregarFamiliasNoSelect();

  const lista = document.getElementById("listaItensCategoria");
  let html = "";
  const itens = {};

  for (let i = 0; i < doacoesCache.length; i++) {
    const d = doacoesCache[i];

    if (d.categoria === categoriaSelecionada) {
      itens[d.item] = (itens[d.item] || 0) + Number(d.quantidade);
    }
  }

  for (let i = 0; i < entregasCache.length; i++) {
    const e = entregasCache[i];

    if (e.categoria === categoriaSelecionada && itens[e.item]) {
      itens[e.item] -= Number(e.quantidade);
    }
  }

  let temItens = false;
  html += "<table><tr><th>Item</th><th>Qtd</th><th>Ação</th></tr>";

  for (let item in itens) {
    if (itens[item] > 0) {
      temItens = true;
      html += `<tr><td>${item}</td><td>${itens[item]}</td><td><button onclick="abrirFormularioEntrega('${item}', '${categoriaSelecionada}')">Entregar</button></td></tr>`;
    }
  }

  if (!temItens) {
    html += `<tr><td colspan="3">Nenhum item disponível</td></tr>`;
  }

  html += "</table>";

  lista.innerHTML = html;
  document.getElementById("detalhesCategoria").style.display = "block";
  mostrarFormularioEntrega();

  document.getElementById("formEntrega").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
};

window.abrirFormularioEntrega = function (item, categoria) {
  categoriaSelecionadaEntrega = categoria;
  itemSelecionadoEntrega = item;

  document.getElementById("categoriaEntrega").value = categoria;

  carregarItensNoSelect(categoria);
  carregarFamiliasNoSelect();

  document.getElementById("itemEntrega").value = item;
  atualizarEstoqueDoItemSelecionado();

  mostrarFormularioEntrega();

  document.getElementById("formEntrega").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
};

window.confirmarEntrega = async function () {
  const item = document.getElementById("itemEntrega").value;
  const quantidade = Number(document.getElementById("quantidadeEntrega").value);
  const familia = document.getElementById("familiaEntrega").value;

  if (!item || !quantidade || quantidade <= 0 || !familia) {
    mostrarMensagem("Preencha todos os campos corretamente.", "aviso");
    return;
  }

  if (quantidade > estoqueSelecionadoEntrega) {
    mostrarMensagem("Quantidade maior que o estoque.", "aviso");
    return;
  }

  const novaEntrega = {
    item,
    categoria: categoriaSelecionadaEntrega,
    quantidade,
    familia,
    data: new Date().toISOString().split("T")[0]
  };

  try {
    const resposta = await fetch(API_ENTREGAS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(novaEntrega)
    });

    if (!resposta.ok) {
      throw new Error("Erro ao registrar entrega.");
    }

    mostrarMensagem("Entrega registrada com sucesso!", "sucesso");

    const categoriaAtual = categoriaSelecionadaEntrega;

    await carregarEntregas();
    carregarEstoque();
    cancelarEntrega();

    if (categoriaAtual) {
      mostrarItensCategoria(categoriaAtual);
    }
  } catch (erro) {
    console.error("Erro ao salvar entrega:", erro);
    mostrarMensagem("Erro ao registrar entrega.", "erro");
  }
};

window.cancelarEntrega = cancelarEntrega;

async function iniciarPagina() {
  try {
    await carregarDoacoes();
    await carregarFamilias();
    await carregarEntregas();
    carregarEstoque();
  } catch (erro) {
    console.error("Erro ao carregar estoque:", erro);
    mostrarMensagem("Erro ao carregar dados do estoque.", "erro");
  }
}

window.onload = function () {
  iniciarPagina();
};