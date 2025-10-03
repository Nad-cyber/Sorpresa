const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

let hearts = [];
const colors = ['#FF0000', '#FF69B4', '#FFD700', '#00FF00', '#1E90FF'];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

// Crear corazón en (x, y)
function createHeart(x, y) {
  hearts.push({
    x: x,
    y: y,
    size: Math.random() * 20 + 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 1,
    speed: Math.random() * 2 + 1
  });
}

// Dibujar corazones
function drawHearts() {
  for (let i = hearts.length - 1; i >= 0; i--) {
    const heart = hearts[i];
    ctx.save();
    ctx.globalAlpha = heart.alpha;
    ctx.fillStyle = heart.color;
    ctx.beginPath();
    const x = heart.x;
    const y = heart.y;
    const s = heart.size;
    // Forma de corazón con curvas
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(
      x, y, 
      x - s, y, 
      x - s, y + s * 0.6
    );
    ctx.bezierCurveTo(
      x - s, y + s * 1.2, 
      x, y + s * 1.5, 
      x, y + s * 2
    );
    ctx.bezierCurveTo(
      x, y + s * 1.5, 
      x + s, y + s * 1.2, 
      x + s, y + s * 0.6
    );
    ctx.bezierCurveTo(
      x + s, y, 
      x, y, 
      x, y + s * 0.3
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    heart.y -= heart.speed;
    heart.alpha -= 0.01;

    if (heart.alpha <= 0) {
      hearts.splice(i, 1);
    }
  }
}

// Crear corazón al hacer clic
canvas.addEventListener('click', (event) => {
  createHeart(event.clientX, event.clientY);
});

// Animación
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawHearts();
  requestAnimationFrame(animate);
}

animate();
