const API_URL = "http://localhost:8080/entregas";

function formatarData(data) {
    if (!data) {
        return "-";
    }

    const partes = data.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

async function carregarEntregas() {
    const lista = document.getElementById("listaEntregas");
    lista.innerHTML = "";

    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar entregas.");
        }

        const entregas = await resposta.json();

        if (entregas.length === 0) {
            lista.innerHTML = `
                <tr>
                    <td colspan="5" class="sem-dados">Nenhuma entrega registrada.</td>
                </tr>
            `;
            return;
        }

        for (let i = entregas.length - 1; i >= 0; i--) {
            const e = entregas[i];

            lista.innerHTML += `
                <tr>
                    <td>${e.item}</td>
                    <td>${e.categoria}</td>
                    <td>${e.quantidade}</td>
                    <td>${e.familia}</td>
                    <td>${formatarData(e.data)}</td>
                </tr>
            `;
        }
    } catch (erro) {
        console.error("Erro ao carregar entregas:", erro);
        lista.innerHTML = `
            <tr>
                <td colspan="5" class="sem-dados">Erro ao carregar entregas.</td>
            </tr>
        `;
    }
}

carregarEntregas();