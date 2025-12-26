/* ========== PASSWORD PROTECTION ========== */
const PASSWORD = "happybirthday"; // Change to your password
const passwordContainer = document.getElementById("password-container");
const passwordInput = document.getElementById("password-input");
const passwordBtn = document.getElementById("password-btn");
const passwordMsg = document.getElementById("password-msg");
const birthdaySite = document.getElementById("birthday-site");

passwordBtn.addEventListener("click", () => {
  if (passwordInput.value === PASSWORD) {
    passwordContainer.style.display = "none";
    birthdaySite.style.display = "block";
    initBirthdaySite();
  } else {
    passwordMsg.textContent = "Incorrect password! Try again.";
    passwordMsg.style.color = "red";
  }
});

/* ========== BIRTHDAY SITE LOGIC ========== */
function initBirthdaySite() {
  const cakeSection = document.getElementById("cake-section");
  const celebrationSection = document.getElementById("celebration-section");

  /* CREATE 20 CANDLES */
  const candlesContainer = document.getElementById("candles");
  for (let i = 0; i < 20; i++) {
    const candle = document.createElement("div");
    candle.className = "candle";
    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);
    candlesContainer.appendChild(candle);
  }

  const flames = document.querySelectorAll(".flame");
  const instructions = document.getElementById("instructions");
  const startBtn = document.getElementById("startBtn");

  let flamePower = 1;
  let blownOut = false;

  /* CONFETTI */
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

  /* START BUTTON (MICROPHONE) */
  startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    instructions.innerHTML =
      "🎤 Blow steadily to put out all the candles!";

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const audioContext = new AudioContext();
      audioContext.resume();

      const mic = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      mic.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);

      function listen() {
        analyser.getByteFrequencyData(data);
        const volume = data.reduce((a, b) => a + b) / data.length;

        if (volume > 40 && flamePower > 0) {
          flamePower -= volume * 0.0006;
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

          // Smooth transition: hide cake, show celebration
          setTimeout(() => {
            cakeSection.style.display = "none";
            celebrationSection.style.display = "block";
          }, 3000);
        }

        requestAnimationFrame(listen);
      }

      listen();
    });
  });

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
