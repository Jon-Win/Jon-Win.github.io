const PASSWORD = "happybirthday";

const passwordBtn = document.getElementById("password-btn");
const passwordInput = document.getElementById("password-input");
const passwordMsg = document.getElementById("password-msg");
const passwordContainer = document.getElementById("password-container");
const birthdaySite = document.getElementById("birthday-site");

passwordBtn.onclick = () => {
  if (passwordInput.value === PASSWORD) {
    passwordContainer.style.display = "none";
    birthdaySite.style.display = "block";
    init();
  } else {
    passwordMsg.textContent = "Wrong password!";
    passwordMsg.style.color = "red";
  }
};

function init() {
  const candlesDiv = document.getElementById("candles");

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
  const instructions = document.getElementById("instructions");
  const cakeSection = document.getElementById("cake-section");
  const celebration = document.getElementById("celebration-section");
  const song = document.getElementById("birthday-song");

  let flamePower = 1;
  let done = false;

  // CONFETTI
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = Array.from({length: 300}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 6 + 2,
    d: Math.random() * 4 + 1
  }));

  function drawConfetti() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
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

  startBtn.onclick = () => {
    startBtn.style.display = "none";
    instructions.textContent = "🎤 Blow into your mic!";

    navigator.mediaDevices.getUserMedia({audio:true}).then(stream => {
      const audioCtx = new AudioContext();
      const mic = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      mic.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);

      function listen() {
        analyser.getByteFrequencyData(data);
        const volume = data.reduce((a,b)=>a+b)/data.length;

        if (volume > 40) flamePower -= volume * 0.0006;
        flamePower = Math.max(flamePower, 0);

        flames.forEach(f => {
          f.style.transform = `scale(${flamePower})`;
          f.style.opacity = flamePower;
        });

        if (flamePower <= 0 && !done) {
          done = true;
          instructions.textContent = "🎉 Make a wish!!! 🎉";
          drawConfetti();

          setTimeout(() => {
            cakeSection.style.display = "none";
            celebration.style.display = "block";
            song.play(); // 🔥 THIS IS WHY IT WORKS
          }, 2500);
        }

        requestAnimationFrame(listen);
      }

      listen();
    });
  };
}
