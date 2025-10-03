const sobre = document.getElementById('sobre');
const mensaje = document.getElementById('mensaje');
const petalosContainer = document.getElementById('petalos-container');
const corazonesContainer = document.getElementById('corazones-container');

sobre.addEventListener('click', abrirSobre);

function abrirSobre() {
  const sobreDiv = document.getElementById('sobre');
  sobreDiv.style.animation = "fallFade 1s forwards";

  setTimeout(() => {
    sobreDiv.style.display = "none";
    const carta = document.getElementById('card');
    carta.classList.add('visible');
    soltarPetalos();
  }, 1000);
}

let petalosIntervaloActivo = false;

function soltarPetalos() {
  if (petalosIntervaloActivo) return; // Evita múltiples intervalos
  petalosIntervaloActivo = true;
  setInterval(() => {
    const petalo = document.createElement('div');
    petalo.className = 'petalo';
    petalo.style.left = Math.random() * window.innerWidth + 'px';
    petalo.style.animationDuration = (Math.random() * 2 + 2) + 's';
    petalosContainer.appendChild(petalo);
    petalo.addEventListener('animationend', () => petalo.remove());
  }, 200); // cada 200ms cae un pétalo, puedes ajustar la velocidad
}

document.addEventListener('click', mostrarCorazones);

function mostrarCorazones(event) {
    const colores = ['#FF69B4', '#FF1493', '#FF4500', '#FFD700', '#00FF7F'];
    const corazon = document.createElement('div');
    corazon.className = 'corazon';
    corazon.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
    corazon.style.left = event.clientX + 'px';
    corazon.style.top = event.clientY + 'px';
    corazonesContainer.appendChild(corazon);
    
    corazon.addEventListener('animationend', () => {
        corazon.remove();
    });
}