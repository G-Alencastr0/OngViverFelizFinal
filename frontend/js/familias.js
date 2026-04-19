const API_URL = "http://localhost:8080/familias";

let editandoId = null;

async function pegarFamilias() {
  const resposta = await fetch(API_URL);

  if (!resposta.ok) {
    throw new Error("Erro ao buscar famílias.");
  }

  return await resposta.json();
}

function mostrarFormulario() {
  document.getElementById("formulario").style.display = "block";
}

function esconderFormulario() {
  document.getElementById("formulario").style.display = "none";
}

function adicionarMembro(nome = "", idade = "", parentesco = "") {
  const container = document.getElementById("membrosFamilia");

  container.innerHTML += `
    <div class="membro-item">
      <label>Nome do Dependente</label>
      <input type="text" name="dependenteNome[]" value="${nome}">

      <label>Idade</label>
      <input type="number" name="dependenteIdade[]" class="campo-numero" value="${idade}">

      <label>Parentesco</label>
      <input type="text" name="dependenteParentesco[]" value="${parentesco}">
    </div>
  `;
}

function limparMembros() {
  document.getElementById("membrosFamilia").innerHTML = `
    <div class="membro-item">
      <label>Nome do Dependente</label>
      <input type="text" name="dependenteNome[]">

      <label>Idade</label>
      <input type="number" name="dependenteIdade[]" class="campo-numero">

      <label>Parentesco</label>
      <input type="text" name="dependenteParentesco[]">
    </div>
  `;
}

function limparFormulario() {
  document.getElementById("formFamilia").reset();
  limparMembros();
  editandoId = null;
}

function cancelarEdicao() {
  limparFormulario();
  esconderFormulario();
}

function formatarData(data) {
  if (!data) return "Não informado";

  const partes = data.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

async function carregarFamilias() {
  const lista = document.getElementById("listaFamilias");

  if (!lista) return;

  lista.innerHTML = `
    <tr>
      <td colspan="6" class="sem-dados">Carregando famílias...</td>
    </tr>
  `;

  try {
    const familias = await pegarFamilias();

    lista.innerHTML = "";

    if (familias.length === 0) {
      lista.innerHTML = `
        <tr>
          <td colspan="6" class="sem-dados">Nenhuma família cadastrada.</td>
        </tr>
      `;
      return;
    }

    for (let i = 0; i < familias.length; i++) {
      const f = familias[i];

      lista.innerHTML += `
        <tr data-id="${f.id}">
          <td>${f.nome || ""}</td>
          <td>${formatarData(f.nascimento)}</td>
          <td>${f.cpf || ""}</td>
          <td>${f.telefone || ""}</td>
          <td>${f.bairro || ""}</td>
          <td>
            <button class="editar" onclick="editarLinha(${f.id})">Editar</button>
            <button class="excluir" onclick="excluirLinha(${f.id})">Apagar</button>
          </td>
        </tr>
      `;
    }
  } catch (erro) {
    console.error(erro);
    lista.innerHTML = `
      <tr>
        <td colspan="6" class="sem-dados">Erro ao carregar famílias.</td>
      </tr>
    `;
  }
}

window.editarLinha = async function (id) {
  const linhas = document.querySelectorAll("#listaFamilias tr");

  for (let i = 0; i < linhas.length; i++) {
    linhas[i].classList.remove("linha-editando");
  }

  try {
    const resposta = await fetch(`${API_URL}/${id}`);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar família para edição.");
    }

    const f = await resposta.json();
    editandoId = id;

    document.getElementById("nome").value = f.nome || "";
    document.getElementById("nascimento").value = f.nascimento || "";
    document.getElementById("rua").value = f.rua || "";
    document.getElementById("numero").value = f.numero || "";
    document.getElementById("bairro").value = f.bairro || "";
    document.getElementById("cidade").value = f.cidade || "";
    document.getElementById("estado").value = f.estado || "";
    document.getElementById("cep").value = f.cep || "";
    document.getElementById("telefone").value = f.telefone || "";
    document.getElementById("email").value = f.email || "";
    document.getElementById("cpf").value = f.cpf || "";
    document.getElementById("rg").value = f.rg || "";
    document.getElementById("genitora").value = f.genitora || "";
    document.getElementById("genitor").value = f.genitor || "";
    document.getElementById("moram").value = f.moram || "";
    document.getElementById("casa").value = f.casa || "";
    document.getElementById("trabalham").value = f.trabalham || "";
    document.getElementById("beneficios").value = f.beneficios || "";
    document.getElementById("tratamento").value = f.tratamento || "";
    document.getElementById("voluntario").value = f.voluntario || "";

    limparMembros();

    if (f.membrosFamilia && f.membrosFamilia.length > 0) {
      document.getElementById("membrosFamilia").innerHTML = "";

      for (let j = 0; j < f.membrosFamilia.length; j++) {
        adicionarMembro(
          f.membrosFamilia[j].nome || "",
          f.membrosFamilia[j].idade || "",
          f.membrosFamilia[j].parentesco || ""
        );
      }
    }

    mostrarFormulario();

    const linhaAtual = document.querySelector(`#listaFamilias tr[data-id="${id}"]`);
    if (linhaAtual) {
      linhaAtual.classList.add("linha-editando");
    }

    document.getElementById("formulario").scrollIntoView({ behavior: "smooth" });
  } catch (erro) {
    console.error(erro);
    mostrarMensagem("Não foi possível carregar a família para edição.", "erro");
  }
};

window.excluirLinha = async function (id) {
  const confirmar = confirm("Deseja apagar esta família?");

  if (!confirmar) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!resposta.ok) {
      throw new Error("Erro ao excluir família.");
    }

    mostrarMensagem("Família apagada com sucesso.", "sucesso");

    if (editandoId === id) {
      limparFormulario();
      esconderFormulario();
    }

    carregarFamilias();
  } catch (erro) {
    console.error(erro);
    mostrarMensagem("Não foi possível apagar a família.", "erro");
  }
};

document.getElementById("formFamilia").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nomesDependentes = document.querySelectorAll('input[name="dependenteNome[]"]');
  const idadesDependentes = document.querySelectorAll('input[name="dependenteIdade[]"]');
  const parentescosDependentes = document.querySelectorAll('input[name="dependenteParentesco[]"]');

  const membrosFamilia = [];

  for (let i = 0; i < nomesDependentes.length; i++) {
    if (
      nomesDependentes[i].value !== "" ||
      idadesDependentes[i].value !== "" ||
      parentescosDependentes[i].value !== ""
    ) {
      membrosFamilia.push({
        nome: nomesDependentes[i].value,
        idade: idadesDependentes[i].value ? Number(idadesDependentes[i].value) : null,
        parentesco: parentescosDependentes[i].value
      });
    }
  }

  const novaFamilia = {
    nome: document.getElementById("nome").value,
    nascimento: document.getElementById("nascimento").value,
    rua: document.getElementById("rua").value,
    numero: document.getElementById("numero").value,
    bairro: document.getElementById("bairro").value,
    cidade: document.getElementById("cidade").value,
    estado: document.getElementById("estado").value,
    cep: document.getElementById("cep").value,
    telefone: document.getElementById("telefone").value,
    email: document.getElementById("email").value,
    cpf: document.getElementById("cpf").value,
    rg: document.getElementById("rg").value,
    genitora: document.getElementById("genitora").value,
    genitor: document.getElementById("genitor").value,
    moram: document.getElementById("moram").value ? Number(document.getElementById("moram").value) : null,
    casa: document.getElementById("casa").value,
    trabalham: document.getElementById("trabalham").value ? Number(document.getElementById("trabalham").value) : null,
    beneficios: document.getElementById("beneficios").value,
    tratamento: document.getElementById("tratamento").value,
    voluntario: document.getElementById("voluntario").value,
    membrosFamilia: membrosFamilia
  };

  try {
    let resposta;

    if (editandoId !== null) {
      resposta = await fetch(`${API_URL}/${editandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novaFamilia)
      });
    } else {
      resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novaFamilia)
      });
    }

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);
      const mensagem = erro?.erro || "Erro ao salvar família.";
      throw new Error(mensagem);
    }

    mostrarMensagem(
      editandoId !== null
        ? "Família atualizada com sucesso!"
        : "Família cadastrada com sucesso!",
      "sucesso"
    );

    limparFormulario();
    esconderFormulario();
    carregarFamilias();
  } catch (erro) {
    console.error(erro);
    mostrarMensagem(erro.message || "Erro ao salvar família.", "erro");
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

  carregarFamilias();
};