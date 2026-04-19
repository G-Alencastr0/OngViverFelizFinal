const API_URL = "http://localhost:8080/doacoes";

let doacoesCache = [];

function formatarData(data) {
    if (!data) {
        return "-";
    }

    const partes = data.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

async function carregar() {
    const lista = document.getElementById("lista");
    lista.innerHTML = "<p>Carregando doações...</p>";

    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar doações.");
        }

        const doacoes = await resposta.json();
        doacoesCache = doacoes;

        lista.innerHTML = "";

        if (doacoes.length === 0) {
            lista.innerHTML = "<p>Nenhuma doação cadastrada.</p>";
            return;
        }

        for (let i = 0; i < doacoes.length; i++) {
            const d = doacoes[i];

            lista.innerHTML += `
                <div class="card-doacao" onclick="mostrarDetalhesDoacao(${d.id})">
                    <strong>${d.item}</strong><br>
                    Categoria: ${d.categoria}<br>
                    Total recebido: ${d.quantidade}<br>
                    Doador: ${d.doador}
                </div>
            `;
        }
    } catch (erro) {
        console.error("Erro ao carregar lista de doações:", erro);
        lista.innerHTML = "<p>Erro ao carregar doações.</p>";
    }
}

function buscarDoacao() {
    const termo = document.getElementById("buscaDoacao").value.toLowerCase();
    const cards = document.querySelectorAll(".card-doacao");

    for (let i = 0; i < cards.length; i++) {
        const texto = cards[i].innerText.toLowerCase();

        if (texto.includes(termo)) {
            cards[i].style.display = "block";
        } else {
            cards[i].style.display = "none";
        }
    }
}

function mostrarDetalhesDoacao(id) {
    const d = doacoesCache.find(doacao => doacao.id === id);
    const detalhes = document.getElementById("detalhesDoacao");

    if (!d) {
        detalhes.innerHTML = `
            <p>Doação não encontrada.</p>
            <button class="botao" onclick="fecharDetalhesDoacao()">Fechar</button>
        `;
        detalhes.style.display = "block";
        return;
    }

    detalhes.innerHTML = `
        <h2>Detalhes da Doação</h2>

        <p><strong>Item:</strong> ${d.item}</p>
        <p><strong>Categoria:</strong> ${d.categoria}</p>
        <p><strong>Total recebido:</strong> ${d.quantidade}</p>
        <p><strong>Doador:</strong> ${d.doador}</p>
        <p><strong>Data:</strong> ${formatarData(d.data)}</p>

        <button class="botao" onclick="fecharDetalhesDoacao()">Fechar</button>
    `;

    detalhes.style.display = "block";
    detalhes.scrollIntoView({ behavior: "smooth" });
}

function fecharDetalhesDoacao() {
    document.getElementById("detalhesDoacao").style.display = "none";
}

carregar();