const API_URL = "http://localhost:8080/familias";

let familiasCache = [];

async function pegarFamilias() {
  const resposta = await fetch(API_URL);

  if (!resposta.ok) {
    throw new Error("Erro ao buscar famílias.");
  }

  return await resposta.json();
}

function formatarData(data) {
  if (!data) return "Não informado";

  const partes = data.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

async function carregarLista() {
  const lista = document.getElementById("lista");

  lista.innerHTML = "<p>Carregando famílias...</p>";

  try {
    const familias = await pegarFamilias();
    familiasCache = familias;

    lista.innerHTML = "";

    if (familias.length === 0) {
      lista.innerHTML = "<p>Nenhuma família cadastrada.</p>";
      return;
    }

    for (let i = 0; i < familias.length; i++) {
      const f = familias[i];

      lista.innerHTML += `
        <div class="card-familia" onclick="mostrarDetalhes(${f.id})">
          <h3><strong>${f.nome}</strong></h3>
          <p>Nascimento: ${formatarData(f.nascimento)}</p>
          <p>CPF: ${f.cpf}</p>
          <p>Telefone: ${f.telefone}</p>
          <p>Bairro: ${f.bairro}</p>
        </div>
      `;
    }
  } catch (erro) {
    console.error(erro);
    lista.innerHTML = "<p>Erro ao carregar famílias.</p>";
  }
}

async function buscarFamilia() {
  const termo = document.getElementById("buscaFamilia").value.trim();
  const lista = document.getElementById("lista");

  if (termo === "") {
    renderizarLista(familiasCache);
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/buscar?termo=${encodeURIComponent(termo)}`);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar famílias.");
    }

    const familias = await resposta.json();
    renderizarLista(familias);
  } catch (erro) {
    console.error(erro);
    lista.innerHTML = "<p>Erro ao buscar famílias.</p>";
  }
}

function renderizarLista(familias) {
  const lista = document.getElementById("lista");

  lista.innerHTML = "";

  if (familias.length === 0) {
    lista.innerHTML = "<p>Nenhuma família encontrada.</p>";
    return;
  }

  for (let i = 0; i < familias.length; i++) {
    const f = familias[i];

    lista.innerHTML += `
      <div class="card-familia" onclick="mostrarDetalhes(${f.id})">
        <h3><strong>${f.nome}</strong></h3>
        <p>Nascimento: ${formatarData(f.nascimento)}</p>
        <p>CPF: ${f.cpf}</p>
        <p>Telefone: ${f.telefone}</p>
        <p>Bairro: ${f.bairro}</p>
      </div>
    `;
  }
}

window.mostrarDetalhes = async function (id) {
  const detalhes = document.getElementById("detalhesFamilia");

  detalhes.innerHTML = "<p>Carregando detalhes...</p>";
  detalhes.style.display = "block";

  try {
    const resposta = await fetch(`${API_URL}/${id}`);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar detalhes da família.");
    }

    const f = await resposta.json();

    let membrosHtml = "";

    if (f.genitor || f.genitora) {
      membrosHtml += `
        <div class="membro-detalhe">
          <p><strong>Genitor:</strong> ${f.genitor || "Não informado"}</p>
          <p><strong>Genitora:</strong> ${f.genitora || "Não informado"}</p>
        </div>
      `;
    }

    if (f.membrosFamilia && f.membrosFamilia.length > 0) {
      for (let i = 0; i < f.membrosFamilia.length; i++) {
        membrosHtml += `
          <div class="membro-detalhe">
            <p><strong>Nome:</strong> ${f.membrosFamilia[i].nome}</p>
            <p><strong>Idade:</strong> ${f.membrosFamilia[i].idade}</p>
            <p><strong>Parentesco:</strong> ${f.membrosFamilia[i].parentesco}</p>
          </div>
        `;
      }
    }

    if (membrosHtml === "") {
      membrosHtml = "<p>Nenhum membro cadastrado.</p>";
    }

    detalhes.innerHTML = `
      <h2>Ficha da Família</h2>

      <p><strong>Nome:</strong> ${f.nome || ""}</p>
      <p><strong>Data de Nascimento:</strong> ${formatarData(f.nascimento)}</p>
      <p><strong>CPF:</strong> ${f.cpf || ""}</p>
      <p><strong>RG:</strong> ${f.rg || ""}</p>
      <p><strong>Telefone:</strong> ${f.telefone || ""}</p>
      <p><strong>Email:</strong> ${f.email || ""}</p>

      <p><strong>Rua / Avenida:</strong> ${f.rua || ""}</p>
      <p><strong>Número:</strong> ${f.numero || ""}</p>
      <p><strong>Bairro:</strong> ${f.bairro || ""}</p>
      <p><strong>Cidade:</strong> ${f.cidade || ""}</p>
      <p><strong>Estado:</strong> ${f.estado || ""}</p>
      <p><strong>CEP:</strong> ${f.cep || ""}</p>
      <p><strong>Quantos moram na residência?</strong> ${f.moram || ""}</p>
      <p><strong>Casa própria ou alugada?</strong> ${f.casa || ""}</p>
      <p><strong>Quantos trabalham na casa?</strong> ${f.trabalham || ""}</p>
      <p><strong>Recebe benefícios?</strong> ${f.beneficios || ""}</p>
      <p><strong>Faz tratamento médico?</strong> ${f.tratamento || ""}</p>

      <p><strong>Cadastro realizado por:</strong> ${f.voluntario || ""}</p>

      <h3>Membros da Família</h3>
      ${membrosHtml}

      <button class="botao" onclick="fecharDetalhes()">Fechar</button>
    `;

    detalhes.style.display = "block";
    detalhes.scrollIntoView({ behavior: "smooth" });
  } catch (erro) {
    console.error(erro);
    detalhes.innerHTML = "<p>Erro ao carregar detalhes da família.</p>";
  }
};

window.fecharDetalhes = function () {
  document.getElementById("detalhesFamilia").style.display = "none";
};

window.buscarFamilia = buscarFamilia;

window.onload = function () {
  carregarLista();

  if (window.lucide) {
    lucide.createIcons();
  }
};