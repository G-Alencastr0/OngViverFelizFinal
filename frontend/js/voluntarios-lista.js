const API_URL = "http://localhost:8080/voluntarios";
let voluntariosCache = [];

async function carregarVoluntarios() {
  const lista = document.getElementById("lista");
  if (!lista) return;

  lista.innerHTML = "<p>Carregando...</p>";

  try {
    const resposta = await fetch(API_URL);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar voluntários.");
    }

    const voluntarios = await resposta.json();
    voluntariosCache = voluntarios;

    renderizarVoluntarios(voluntarios);
  } catch (erro) {
    console.error("Erro ao carregar voluntários:", erro);
    lista.innerHTML = "<p>Erro ao carregar lista de voluntários.</p>";
  }
}

function renderizarVoluntarios(voluntarios) {
  const lista = document.getElementById("lista");
  if (!lista) return;

  lista.innerHTML = "";

  if (!voluntarios || voluntarios.length === 0) {
    lista.innerHTML = "<p class='sem-dados'>Nenhum voluntário encontrado.</p>";
    return;
  }

  voluntarios.forEach((v) => {
    lista.innerHTML += `
      <div class="card-voluntario">
        <strong>${v.nome || "Sem nome"}</strong><br>
        <span><strong>Área:</strong> ${v.area || "Não informada"}</span><br>
        <span><strong>Telefone:</strong> ${v.telefone || "Não informado"}</span><br>
        <span><strong>Email:</strong> ${v.email || "Não informado"}</span><br>
        <span><strong>Disponibilidade:</strong> ${v.disponibilidade || "Não informada"}</span><br>
        <span><strong>Dias:</strong> ${v.dias || "Não informados"}</span>
      </div>
    `;
  });
}

function buscarVoluntario() {
  const input = document.getElementById("buscaVoluntario");
  const termo = input.value.toLowerCase().trim();

  const filtrados = voluntariosCache.filter((v) => {
    const nome = (v.nome || "").toLowerCase();
    const area = (v.area || "").toLowerCase();
    const disponibilidade = (v.disponibilidade || "").toLowerCase();

    return (
      nome.includes(termo) ||
      area.includes(termo) ||
      disponibilidade.includes(termo)
    );
  });

  renderizarVoluntarios(filtrados);
}

window.onload = function () {
  carregarVoluntarios();
};