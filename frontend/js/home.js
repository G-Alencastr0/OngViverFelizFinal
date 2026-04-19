let slides = document.querySelectorAll(".slide")
let index = 0

let titulos = [
"Solidariedade",
"Esperança",
"Transformando Vidas",
"Juntos Podemos Mais"
]

let textos = [
"Unindo pessoas que querem ajudar",
"Levando apoio para quem mais precisa",
"Cada gesto de amor faz diferença",
"Pequenas ações mudam grandes histórias"
]

function showSlide(i){

  slides.forEach(s => s.classList.remove("active"))

  slides[i].classList.add("active")

  document.getElementById("tituloBanner").innerText = titulos[i]
  document.getElementById("textoBanner").innerText = textos[i]

}

function nextSlide(){

  index++

  if(index >= slides.length){
    index = 0
  }

  showSlide(index)

}

function prevSlide(){

  index--

  if(index < 0){
    index = slides.length - 1
  }

  showSlide(index)

}

document.querySelector(".next").onclick = nextSlide
document.querySelector(".prev").onclick = prevSlide

setInterval(nextSlide, 5000)
