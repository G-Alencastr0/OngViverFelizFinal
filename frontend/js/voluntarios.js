let editandoId = null;
const API_URL = "http://localhost:8080/voluntarios";

function mostrarFormulario() {
  document.getElementById("formulario").style.display = "block";
}

function esconderFormulario() {
  document.getElementById("formulario").style.display = "none";
}

function limparFormulario() {
  document.getElementById("formVoluntario").reset();
  editandoId = null;
}

function cancelarEdicao() {
  limparFormulario();
  esconderFormulario();
}

async function carregarVoluntarios() {
  const lista = document.getElementById("listaVoluntarios");
  lista.innerHTML = "";

  try {
    const resposta = await fetch(API_URL);
    const voluntarios = await resposta.json();

    for (let i = 0; i < voluntarios.length; i++) {
      const v = voluntarios[i];

      lista.innerHTML += `
        <tr data-id="${v.id}">
          <td>${v.nome || ""}</td>
          <td>${v.telefone || ""}</td>
          <td>${v.email || ""}</td>
          <td>${v.area || ""}</td>
          <td>${v.disponibilidade || ""}</td>
          <td>
            <button class="editar" onclick="editarLinha(${v.id})">Editar</button>
            <button class="excluir" onclick="excluirLinha(${v.id})">Apagar</button>
          </td>
        </tr>
      `;
    }
  } catch (erro) {
    console.error("Erro ao carregar voluntários:", erro);
    lista.innerHTML = `<tr><td colspan="6">Erro ao carregar voluntários.</td></tr>`;
  }
}

async function editarLinha(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}`);

    if (!resposta.ok) {
      mostrarMensagem("Voluntário não encontrado.", "erro");
      return;
    }

    const v = await resposta.json();

    editandoId = id;

    document.getElementById("nome").value = v.nome || "";
    document.getElementById("nascimento").value = v.nascimento || "";
    document.getElementById("cpf").value = v.cpf || "";
    document.getElementById("telefone").value = v.telefone || "";
    document.getElementById("email").value = v.email || "";
    document.getElementById("rua").value = v.rua || "";
    document.getElementById("numero").value = v.numero || "";
    document.getElementById("bairro").value = v.bairro || "";
    document.getElementById("cidade").value = v.cidade || "";
    document.getElementById("estado").value = v.estado || "";
    document.getElementById("cep").value = v.cep || "";
    document.getElementById("area").value = v.area || "";
    document.getElementById("disponibilidade").value = v.disponibilidade || "";
    document.getElementById("dias").value = v.dias || "";
    document.getElementById("experiencia").value = v.experiencia || "";
    document.getElementById("habilidades").value = v.habilidades || "";
    document.getElementById("observacoes").value = v.observacoes || "";

    mostrarFormulario();
  } catch (erro) {
    console.error("Erro ao buscar voluntário:", erro);
    mostrarMensagem("Erro ao carregar dados do voluntário.", "erro");
  }
}

async function excluirLinha(id) {
  const confirmar = confirm("Deseja apagar este voluntário?");

  if (!confirmar) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!resposta.ok) {
      mostrarMensagem("Erro ao excluir voluntário.", "erro");
      return;
    }

    mostrarMensagem("Voluntário apagado com sucesso!", "sucesso");
    await carregarVoluntarios();
  } catch (erro) {
    console.error("Erro ao excluir voluntário:", erro);
    mostrarMensagem("Erro ao excluir voluntário.", "erro");
  }
}

document.getElementById("formVoluntario").addEventListener("submit", async function (e) {
  e.preventDefault();

  const voluntario = {
    nome: document.getElementById("nome").value,
    nascimento: document.getElementById("nascimento").value,
    cpf: document.getElementById("cpf").value,
    telefone: document.getElementById("telefone").value,
    email: document.getElementById("email").value,
    rua: document.getElementById("rua").value,
    numero: document.getElementById("numero").value,
    bairro: document.getElementById("bairro").value,
    cidade: document.getElementById("cidade").value,
    estado: document.getElementById("estado").value,
    cep: document.getElementById("cep").value,
    area: document.getElementById("area").value,
    disponibilidade: document.getElementById("disponibilidade").value,
    dias: document.getElementById("dias").value,
    experiencia: document.getElementById("experiencia").value,
    habilidades: document.getElementById("habilidades").value,
    observacoes: document.getElementById("observacoes").value
  };

  try {
    let resposta;

    if (editandoId !== null) {
      resposta = await fetch(`${API_URL}/${editandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(voluntario)
      });

      if (resposta.ok) {
        mostrarMensagem("Voluntário atualizado com sucesso!", "sucesso");
      }
    } else {
      resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(voluntario)
      });

      if (resposta.ok) {
        mostrarMensagem("Voluntário cadastrado com sucesso!", "sucesso");
      }
    }

    if (!resposta.ok) {
      mostrarMensagem("Erro ao salvar voluntário.", "erro");
      return;
    }

    limparFormulario();
    esconderFormulario();
    await carregarVoluntarios();
  } catch (erro) {
    console.error("Erro ao salvar voluntário:", erro);
    mostrarMensagem("Erro de conexão com o servidor.", "erro");
  }
});

window.onload = function () {
  configurarBuscaCep({
    cepInputId: "cep",
    ruaInputId: "rua",
    bairroInputId: "bairro",
    cidadeInputId: "cidade",
    estadoInputId: "estado",
    numeroInputId: "numero"
  });

  carregarVoluntarios();
};