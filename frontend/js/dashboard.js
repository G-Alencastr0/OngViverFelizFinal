const usuario = localStorage.getItem("usuario");

if (!usuario) {
  window.location.href = "login.html";
}

const API_FAMILIAS = "http://localhost:8080/familias";
const API_DOACOES = "http://localhost:8080/doacoes";
const API_ENTREGAS = "http://localhost:8080/entregas";
const API_VOLUNTARIOS = "http://localhost:8080/voluntarios";

function normalizarTexto(texto) {
  return (texto || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s/g, "");
}

async function atualizarPainel() {
  let familias = [];
  let doacoes = [];
  let entregas = [];
  let voluntarios = [];

  try {
    const respostaFamilias = await fetch(API_FAMILIAS);

    if (!respostaFamilias.ok) {
      throw new Error("Erro ao buscar famílias.");
    }

    familias = await respostaFamilias.json();
  } catch (erro) {
    console.error("Erro ao carregar famílias do backend:", erro);
  }

  try {
    const respostaDoacoes = await fetch(API_DOACOES);

    if (!respostaDoacoes.ok) {
      throw new Error("Erro ao buscar doações.");
    }

    doacoes = await respostaDoacoes.json();
  } catch (erro) {
    console.error("Erro ao carregar doações do backend:", erro);
  }

  try {
    const respostaEntregas = await fetch(API_ENTREGAS);

    if (!respostaEntregas.ok) {
      throw new Error("Erro ao buscar entregas.");
    }

    entregas = await respostaEntregas.json();
  } catch (erro) {
    console.error("Erro ao carregar entregas do backend:", erro);
  }

  try {
    const respostaVoluntarios = await fetch(API_VOLUNTARIOS);

    if (!respostaVoluntarios.ok) {
      throw new Error("Erro ao buscar voluntários.");
    }

    voluntarios = await respostaVoluntarios.json();
  } catch (erro) {
    console.error("Erro ao carregar voluntários do backend:", erro);
  }

  const estoquePorCategoria = {
    roupas: 0,
    alimentos: 0,
    brinquedos: 0,
    higiene: 0,
    limpeza: 0,
    materialescolar: 0,
    utensilios: 0
  };

  for (let i = 0; i < doacoes.length; i++) {
    const categoria = normalizarTexto(doacoes[i].categoria);
    const quantidade = Number(doacoes[i].quantidade) || 0;

    if (estoquePorCategoria[categoria] !== undefined) {
      estoquePorCategoria[categoria] += quantidade;
    }
  }

  for (let i = 0; i < entregas.length; i++) {
    const categoria = normalizarTexto(entregas[i].categoria);
    const quantidade = Number(entregas[i].quantidade) || 0;

    if (estoquePorCategoria[categoria] !== undefined) {
      estoquePorCategoria[categoria] -= quantidade;
    }
  }

  for (let categoria in estoquePorCategoria) {
    if (estoquePorCategoria[categoria] < 0) {
      estoquePorCategoria[categoria] = 0;
    }
  }

  let totalEstoque = 0;

  for (let categoria in estoquePorCategoria) {
    totalEstoque += estoquePorCategoria[categoria];
  }

  document.getElementById("totalFamilias").innerText = familias.length;
  document.getElementById("totalDoacoes").innerText = doacoes.length;
  document.getElementById("totalVoluntarios").innerText = voluntarios.length;
  document.getElementById("totalEstoque").innerText = totalEstoque;
}

function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}

window.onload = function () {
  atualizarPainel();

  if (window.lucide) {
    lucide.createIcons();
  }
};