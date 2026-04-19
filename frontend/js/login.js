console.log("LOGIN JS CARREGOU");
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("formLogin");
    const campoSenha = document.getElementById("senha");
    const toggleSenha = document.getElementById("toggleSenha");

    // ✅ Mostrar / ocultar senha (só executa se existir)
    if (toggleSenha && campoSenha) {
        toggleSenha.addEventListener("click", function () {
            const tipoAtual = campoSenha.getAttribute("type");

            if (tipoAtual === "password") {
                campoSenha.setAttribute("type", "text");
                toggleSenha.classList.replace("bx-show", "bx-hide");
            } else {
                campoSenha.setAttribute("type", "password");
                toggleSenha.classList.replace("bx-hide", "bx-show");
            }
        });
    }

    // ✅ Submit do login
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = campoSenha.value.trim();

        // 🔒 Validação básica
        if (!email || !senha) {
            mostrarMensagem("Preencha todos os campos!", "aviso");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, senha })
            });

            // ⚠️ Se backend respondeu erro
            if (!response.ok) {
                mostrarMensagem("Email ou senha inválidos!", "erro");
                return;
            }

            const data = await response.json();

            // ✅ Login OK
            if (data && data.nome) {
                mostrarMensagem("Login realizado com sucesso!", "sucesso");

                // salva usuário
                localStorage.setItem("usuario", JSON.stringify(data));

                // redireciona
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1200);

            } else {
                mostrarMensagem(data.mensagem || "Erro no login!", "erro");
            }

        } catch (error) {
            console.error("Erro:", error);
            mostrarMensagem("Erro ao conectar com o servidor!", "erro");
        }
    });

});