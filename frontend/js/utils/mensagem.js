function mostrarMensagem(texto, tipo = "sucesso") {
  const toast = document.createElement("div");
  toast.innerText = texto;

  // Estilo base
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "10px";
  toast.style.color = "#fff";
  toast.style.fontSize = "14px";
  toast.style.fontWeight = "500";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  toast.style.zIndex = "9999";
  toast.style.opacity = "0";
  toast.style.transition = "all 0.4s ease";

  // 🎨 Cores por tipo
  if (tipo === "sucesso") {
    toast.style.background = "#4CAF50";
  } else if (tipo === "erro") {
    toast.style.background = "#e74c3c";
  } else if (tipo === "aviso") {
    toast.style.background = "#f39c12";
  }

  document.body.appendChild(toast);

  // Animação de entrada
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.top = "40px";
  }, 10);

  // Remover com animação
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.top = "20px";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}