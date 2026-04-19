function configurarBuscaCep(config) {
  const {
    cepInputId,
    ruaInputId,
    bairroInputId,
    cidadeInputId,
    estadoInputId,
    numeroInputId = null
  } = config;

  const cepInput = document.getElementById(cepInputId);
  const ruaInput = document.getElementById(ruaInputId);
  const bairroInput = document.getElementById(bairroInputId);
  const cidadeInput = document.getElementById(cidadeInputId);
  const estadoInput = document.getElementById(estadoInputId);
  const numeroInput = numeroInputId ? document.getElementById(numeroInputId) : null;

  if (!cepInput || !ruaInput || !bairroInput || !cidadeInput || !estadoInput) {
    return;
  }

  async function buscarEnderecoPorCep() {
    let cep = cepInput.value.replace(/\D/g, "");

    if (cep.length === 0) {
      return;
    }

    if (cep.length !== 8) {
      ruaInput.value = "";
      bairroInput.value = "";
      cidadeInput.value = "";
      estadoInput.value = "";
      mostrarMensagem("CEP inválido. Digite um CEP com 8 números.", "aviso");
      return;
    }

    ruaInput.value = "Carregando...";
    bairroInput.value = "Carregando...";
    cidadeInput.value = "Carregando...";
    estadoInput.value = "Carregando...";

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

      if (!resposta.ok) {
        throw new Error("Erro ao consultar o CEP.");
      }

      const dados = await resposta.json();

      if (dados.erro) {
        ruaInput.value = "";
        bairroInput.value = "";
        cidadeInput.value = "";
        estadoInput.value = "";
        mostrarMensagem("CEP não encontrado.", "erro");
        return;
      }

      ruaInput.value = dados.logradouro || "";
      bairroInput.value = dados.bairro || "";
      cidadeInput.value = dados.localidade || "";
      estadoInput.value = dados.uf || "";

      if (numeroInput) {
        numeroInput.focus();
      }
    } catch (erro) {
      console.error("Erro ao buscar CEP:", erro);
      ruaInput.value = "";
      bairroInput.value = "";
      cidadeInput.value = "";
      estadoInput.value = "";
      mostrarMensagem("Não foi possível buscar o endereço pelo CEP.", "erro");
    }
  }

  cepInput.addEventListener("input", function (e) {
    let valor = e.target.value.replace(/\D/g, "");

    if (valor.length > 8) {
      valor = valor.slice(0, 8);
    }

    if (valor.length > 5) {
      valor = valor.slice(0, 5) + "-" + valor.slice(5);
    }

    e.target.value = valor;
  });

  cepInput.addEventListener("blur", function () {
    buscarEnderecoPorCep();
  });
}