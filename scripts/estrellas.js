const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let w = window.innerWidth, h = window.innerHeight;
canvas.width = w; canvas.height = h;

window.onresize = () => {
  w = window.innerWidth; h = window.innerHeight;
  canvas.width = w; canvas.height = h;
  crearEstrellasTexto();
};

// ---------------- Estrellas fugaces ----------------
function randomStar() {
  let startFromTop = Math.random() < 0.5;
  let x = startFromTop ? Math.random() * w : -50; 
  let y = startFromTop ? -50 : Math.random() * h;

  const speed = 3 + Math.random() * 3;
  const angle = (25 + Math.random() * 10) * Math.PI / 180;

  return {
    x,
    y,
    speedX: Math.cos(angle) * speed,
    speedY: Math.sin(angle) * speed,
    alpha: 0.7 + Math.random() * 0.3,
    width: 1.5 + Math.random() * 1.5,
    trail: Array.from({length: 15}, () => ({x, y}))
  };
}

let stars = [];
const maxStars = 400;
setInterval(() => {
  if (stars.length < maxStars) stars.push(randomStar());
}, 200);

function drawStar(s) {
  s.trail.pop();
  s.trail.unshift({x: s.x, y: s.y});

  for (let i = 0; i < s.trail.length - 1; i++) {
    const p1 = s.trail[i];
    const p2 = s.trail[i + 1];
    ctx.save();
    const alpha = s.alpha * (1 - i / s.trail.length);
    ctx.strokeStyle = `rgba(178, 240, 255, ${alpha})`; 
    ctx.lineWidth = s.width * (1 - i / s.trail.length) + 0.3;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.globalAlpha = s.alpha;
  ctx.beginPath();
  ctx.arc(s.x, s.y, s.width, 0, Math.PI * 2);
  ctx.fillStyle = "#b2f0ff";
  ctx.shadowColor = "#7ed6ff";
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.restore();
}

// ---------------- Texto con estrellas ----------------
const texto = "FELIZ CUMPLEAÑOS MI AMOR";
let todasEstrellasTexto = []; // todas las posiciones posibles
let textoEstrellas = [];      // las que ya se van iluminando
const textoFontSize = Math.min(w, h) > 700 ? 80 : 40;

function crearEstrellasTexto() {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w; tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.font = `bold ${textoFontSize}px 'Sacramento', cursive`;
  tempCtx.textAlign = "center";
  tempCtx.textBaseline = "middle";
  tempCtx.fillText(texto, w/2, h*0.2);

  const imageData = tempCtx.getImageData(0,0,w,h);
  todasEstrellasTexto = [];
  for(let y=0; y<h; y+=8){
    for(let x=0; x<w; x+=8){
      const idx = (y*w + x)*4;
      if(imageData.data[idx+3]>128){
        todasEstrellasTexto.push({
          x: x + (Math.random()-0.5)*2,
          y: y + (Math.random()-0.5)*2,
          baseAlpha: 0.7 + Math.random()*0.3,
          phase: Math.random()*Math.PI*2
        });
      }
    }
  }
  textoEstrellas = [];
}
crearEstrellasTexto();

// ---------------- Animación principal ----------------
function draw(){
  ctx.clearRect(0,0,w,h);

  for(let i = stars.length-1; i>=0; i--){
    let s = stars[i];
    drawStar(s);
    s.x += s.speedX;
    s.y += s.speedY;

    if(s.y > h+50 || s.x > w+50){
      // Cuando una fugaz sale, la convertimos en estrella del texto
      if (todasEstrellasTexto.length > 0) {
        let estrellaTexto = todasEstrellasTexto.shift();
        textoEstrellas.push(estrellaTexto);
      }
      stars[i] = randomStar(); // reciclamos fugaz
    }
  }

  // Dibujar estrellas del texto
  for(let star of textoEstrellas){
    const t = Date.now()/600 + star.phase;
    const dx = Math.sin(t)*1.2;
    const dy = Math.cos(t*1.3)*1.2;
    const x = star.x + dx;
    const y = star.y + dy;

    ctx.save();
    ctx.globalAlpha = star.baseAlpha*(0.7+0.3*Math.sin(Date.now()/700+star.phase));
    ctx.beginPath();
    ctx.arc(x,y,2,0,Math.PI*2);
    ctx.fillStyle = "#b2f0ff";
    ctx.shadowColor = "#7ed6ff";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  }

  requestAnimationFrame(draw);
}
draw();
