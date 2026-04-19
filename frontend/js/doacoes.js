const API_URL = "http://localhost:8080/doacoes";

function mostrarFormulario() {
    document.getElementById("formulario").style.display = "block";
}

function esconderFormulario() {
    document.getElementById("formulario").style.display = "none";
}

function limparFormulario() {
    document.getElementById("formDoacao").reset();
    atualizarItens();
}

function cancelarEdicao() {
    limparFormulario();
    esconderFormulario();
}

function formatarData(data) {
    if (!data) {
        return "-";
    }

    const partes = data.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

async function carregarDoacoes() {
    const lista = document.getElementById("listaDoacoes");
    lista.innerHTML = "";

    try {
        const resposta = await fetch(API_URL);
        const doacoes = await resposta.json();

        for (let i = 0; i < doacoes.length; i++) {
            const d = doacoes[i];

            lista.innerHTML += `
                <tr data-id="${d.id}">
                    <td>${d.item}</td>
                    <td>${d.categoria}</td>
                    <td>${d.quantidade}</td>
                    <td>${d.doador}</td>
                    <td>${formatarData(d.data)}</td>
                    <td>
                        <button class="editar" onclick="editarLinha(this)">Editar</button>
                        <button class="excluir" onclick="excluirLinha(this)">Apagar</button>
                    </td>
                </tr>
            `;
        }

        filtrarSelect();
    } catch (erro) {
        console.error("Erro ao carregar doações:", erro);
        mostrarMensagem("Erro ao carregar doações do servidor.", "erro");
    }
}

function editarLinha(botao) {
    const linha = botao.parentElement.parentElement;
    const id = linha.getAttribute("data-id");

    const item = linha.children[0].innerText;
    const categoria = linha.children[1].innerText;
    const quantidade = linha.children[2].innerText;
    const doador = linha.children[3].innerText;
    const dataFormatada = linha.children[4].innerText;

    const partesData = dataFormatada.split("/");
    const data = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;

    linha.innerHTML = `
        <td><input type="text" value="${item}"></td>
        <td>
            <select>
                <option ${categoria === "Roupas" ? "selected" : ""}>Roupas</option>
                <option ${categoria === "Alimentos" ? "selected" : ""}>Alimentos</option>
                <option ${categoria === "Brinquedos" ? "selected" : ""}>Brinquedos</option>
                <option ${categoria === "Higiene" ? "selected" : ""}>Higiene</option>
                <option ${categoria === "Limpeza" ? "selected" : ""}>Limpeza</option>
                <option ${categoria === "Material Escolar" ? "selected" : ""}>Material Escolar</option>
                <option ${categoria === "Utensílios" ? "selected" : ""}>Utensílios</option>
            </select>
        </td>
        <td><input type="number" min="1" value="${quantidade}"></td>
        <td><input type="text" value="${doador}"></td>
        <td><input type="date" value="${data}"></td>
        <td>
            <button class="salvar" onclick="salvarEdicao(this)">Salvar</button>
        </td>
    `;

    linha.setAttribute("data-id", id);
}

async function salvarEdicao(botao) {
    const linha = botao.parentElement.parentElement;
    const id = linha.getAttribute("data-id");

    const item = linha.children[0].children[0].value.trim();
    const categoria = linha.children[1].children[0].value;
    const quantidade = Number(linha.children[2].children[0].value);
    const doador = linha.children[3].children[0].value.trim();
    const data = linha.children[4].children[0].value;

    if (!item || !doador || !data) {
        mostrarMensagem("Preencha todos os campos da edição.", "aviso");
        return;
    }

    if (quantidade < 1 || isNaN(quantidade)) {
        mostrarMensagem("A quantidade deve ser maior que zero.", "aviso");
        return;
    }

    const doacaoAtualizada = {
        item,
        categoria,
        quantidade,
        doador,
        data
    };

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(doacaoAtualizada)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao atualizar doação.");
        }

        mostrarMensagem("Doação atualizada com sucesso!", "sucesso");
        await carregarDoacoes();
    } catch (erro) {
        console.error("Erro ao atualizar doação:", erro);
        mostrarMensagem("Erro ao atualizar doação.", "erro");
    }
}

async function excluirLinha(botao) {
    if (!confirm("Deseja apagar essa doação?")) {
        return;
    }

    const linha = botao.parentElement.parentElement;
    const id = linha.getAttribute("data-id");

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir doação.");
        }

        mostrarMensagem("Doação apagada com sucesso!", "sucesso");
        await carregarDoacoes();
    } catch (erro) {
        console.error("Erro ao excluir doação:", erro);
        mostrarMensagem("Erro ao excluir doação.", "erro");
    }
}

function filtrarSelect() {
    const tipo = document.getElementById("filtroCategoria").value;
    const linhas = document.querySelectorAll("#listaDoacoes tr");

    for (let i = 0; i < linhas.length; i++) {
        const categoria = linhas[i].children[1].innerText;

        if (tipo === "Todas" || categoria === tipo) {
            linhas[i].style.display = "";
        } else {
            linhas[i].style.display = "none";
        }
    }

    if (tipo === "Todas") {
        document.getElementById("tituloLista").innerText = "Todas as doações";
    } else {
        document.getElementById("tituloLista").innerText = "Doações de " + tipo;
    }
}

function atualizarItens() {
    const categoria = document.getElementById("categoria").value;
    const selectItem = document.getElementById("item");

    const itensPorCategoria = {
        "Roupas": ["Camisa", "Calça", "Vestido", "Sapato", "Cobertor"],
        "Alimentos": ["Arroz", "Feijão", "Macarrão", "Leite", "Óleo"],
        "Brinquedos": ["Boneca", "Carrinho", "Bola", "Quebra-cabeça", "Pelúcia"],
        "Higiene": ["Sabonete", "Shampoo", "Escova de dente", "Pasta de dente", "Absorvente"],
        "Limpeza": ["Vassoura", "Detergente", "Água sanitária", "Sabão em pó", "Desinfetante", "Esponja"],
        "Material Escolar": ["Caderno", "Lápis", "Caneta", "Borracha", "Mochila"],
        "Utensílios": ["Prato", "Copo", "Talher", "Panela", "Caneca"]
    };

    selectItem.innerHTML = '<option value="">Selecione um item</option>';

    if (itensPorCategoria[categoria]) {
        for (let i = 0; i < itensPorCategoria[categoria].length; i++) {
            selectItem.innerHTML += `<option value="${itensPorCategoria[categoria][i]}">${itensPorCategoria[categoria][i]}</option>`;
        }
    }

    selectItem.innerHTML += '<option value="Outro">Outro</option>';
    verificarOutroItem();
}

function verificarOutroItem() {
    const itemSelecionado = document.getElementById("item").value;
    const campoOutro = document.getElementById("campoOutroItem");

    if (itemSelecionado === "Outro") {
        campoOutro.style.display = "block";
    } else {
        campoOutro.style.display = "none";
        document.getElementById("outroItem").value = "";
    }
}

document.getElementById("formDoacao").addEventListener("submit", async function (e) {
    e.preventDefault();

    let item = document.getElementById("item").value;

    if (item === "") {
        mostrarMensagem("Selecione um item.", "aviso");
        return;
    }

    if (item === "Outro") {
        item = document.getElementById("outroItem").value.trim();

        if (item === "") {
            mostrarMensagem("Digite o nome do item.", "aviso");
            return;
        }
    }

    const categoria = document.getElementById("categoria").value;
    const quantidade = Number(document.getElementById("quantidade").value);
    const doador = document.getElementById("doador").value.trim();
    const data = document.getElementById("data").value;

    if (!doador || !data) {
        mostrarMensagem("Preencha todos os campos obrigatórios.", "aviso");
        return;
    }

    if (quantidade < 1 || isNaN(quantidade)) {
        mostrarMensagem("A quantidade deve ser maior que zero.", "aviso");
        return;
    }

    const novaDoacao = {
        item,
        categoria,
        quantidade,
        doador,
        data
    };

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novaDoacao)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar doação.");
        }

        mostrarMensagem("Doação cadastrada com sucesso!", "sucesso");
        limparFormulario();
        esconderFormulario();
        await carregarDoacoes();
    } catch (erro) {
        console.error("Erro ao cadastrar doação:", erro);
        mostrarMensagem("Erro ao cadastrar doação.", "erro");
    }
});

carregarDoacoes();
atualizarItens();
filtrarSelect();