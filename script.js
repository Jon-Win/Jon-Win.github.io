/* =========================
   RESET STATE ON LOAD
========================= */
let flamePower = 1;
let blownOut = false;

const flames = document.querySelectorAll(".flame");
const instructions = document.getElementById("instructions");

// Reset flames visually
flames.forEach(f => {
  f.style.display = "block";
  f.style.transform = "scale(1)";
  f.style.opacity = "1";
});

/* =========================
   CONFETTI SETUP
========================= */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confetti = [];
let confettiActive = false;

function startConfetti() {
  if (confettiActive) return;
  confettiActive = true;

  confetti = [];
  for (let i = 0; i < 250; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 5 + 2
    });
  }
  requestAnimationFrame(drawConfetti);
}

function drawConfetti() {
  if (!confettiActive) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${Math.random() * 360},100%,70%)`;
    ctx.fill();
    c.y += c.d;
    if (c.y > canvas.height) c.y = 0;
  });
  requestAnimationFrame(drawConfetti);
}

/* =========================
   MICROPHONE BLOW LOGIC
========================= */
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioContext = new AudioContext();
    const mic = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    mic.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);

    function listen() {
      analyser.getByteFrequencyData(data);
      const volume = data.reduce((a, b) => a + b) / data.length;

      if (volume > 40 && flamePower > 0) {
        flamePower -= volume * 0.0008;
        flamePower = Math.max(flamePower, 0);
      }

      flames.forEach(f => {
        f.style.transform = `scale(${flamePower})`;
        f.style.opacity = flamePower;
      });

      if (flamePower <= 0 && !blownOut) {
        blownOut = true;
        flames.forEach(f => f.style.display = "none");
        instructions.innerHTML = "🎉 Make a wish!!! 🎉";
        startConfetti();
      }

      requestAnimationFrame(listen);
    }

    listen();
  })
  .catch(() => {
    instructions.innerText =
      "🎤 Please allow microphone access to blow out the candles!";
  });

/* =========================
   HANDLE WINDOW RESIZE
========================= */
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
