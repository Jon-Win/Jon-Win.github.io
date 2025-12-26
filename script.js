// 🎉 COUNTDOWN (change date!)
const birthday = new Date("2025-01-01T00:00:00").getTime();
const countdownEl = document.getElementById("countdown");

const timer = setInterval(() => {
  const now = new Date().getTime();
  const diff = birthday - now;

  if (diff <= 0) {
    clearInterval(timer);
    countdownEl.innerText = "🎉 IT'S BIRTHDAY TIME!!! 🎉";
    startConfetti();
  } else {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    countdownEl.innerText =
      `⏳ ${days}d ${hours}h ${mins}m ${secs}s`;
  }
}, 1000);

// 🎊 CONFETTI
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confetti = [];

function startConfetti() {
  for (let i = 0; i < 300; i++) {
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${Math.random()*360},100%,70%)`;
    ctx.fill();
    c.y += c.d;
    if (c.y > canvas.height) c.y = 0;
  });
  requestAnimationFrame(drawConfetti);
}

// 🎤 MICROPHONE CANDLE BLOWING
const candles = document.getElementById("candles");

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioContext = new AudioContext();
    const mic = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    mic.connect(analyser);
    analyser.fftSize = 256;
    const data = new Uint8Array(analyser.frequencyBinCount);

    function detectBlow() {
      analyser.getByteFrequencyData(data);
      const volume = data.reduce((a, b) => a + b) / data.length;

      if (volume > 50) { // sensitivity
        candles.innerText = "💨✨";
        startConfetti();
      }
      requestAnimationFrame(detectBlow);
    }
    detectBlow();
  })
  .catch(() => {
    candles.innerText = "🎂 (Mic access needed!)";
  });
