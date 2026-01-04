// Run setup immediately since the password page is gone
window.onload = setup;

function setup() {
  const candlesDiv = document.getElementById("candles");
  candlesDiv.innerHTML = "";

  for (let i = 0; i < 20; i++) {
    const c = document.createElement("div");
    c.className = "candle";
    const f = document.createElement("div");
    f.className = "flame";
    c.appendChild(f);
    candlesDiv.appendChild(c);
  }

  const flames = document.querySelectorAll(".flame");
  const startBtn = document.getElementById("startBtn");
  const cakeSection = document.getElementById("cake-section");
  const celebrationSection = document.getElementById("celebration-section");
  const song = document.getElementById("birthday-song");

  let power = 1;
  let finished = false;

  startBtn.onclick = () => {
    startBtn.style.display = "none"; 
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const ctx = new AudioContext();
      const mic = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      mic.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      function listen() {
        analyser.getByteFrequencyData(data);
        const vol = data.reduce((a, b) => a + b) / data.length;

        if (vol > 35) power -= 0.02; 
        power = Math.max(power, 0);

        flames.forEach(f => {
          f.style.transform = `scale(${power})`;
          f.style.opacity = power;
        });

        if (power <= 0 && !finished) {
          finished = true;
          setTimeout(() => {
            cakeSection.classList.add("hidden");
            celebrationSection.classList.remove("hidden");
            song.play();
            startConfetti();
          }, 800);
        }
        if (!finished) requestAnimationFrame(listen);
      }
      listen();
    }).catch(err => alert("Please allow microphone access to blow out candles!"));
  };
}

// --- CONFETTI LOGIC ---
function startConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ["#ff69b4", "#ff1493", "#ffd700", "#00ced1", "#adff2f"];

  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * 6.28
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / 2, 0, 6.28);
      ctx.fill();
      p.y += p.speed;
      p.x += Math.sin(p.angle) * 2;
      if (p.y > canvas.height) p.y = -10;
    });
    requestAnimationFrame(draw);
  }
  draw();
}
