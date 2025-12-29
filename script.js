const PASSWORD = "happybirthday";

const pwBtn = document.getElementById("password-btn");
const pwInput = document.getElementById("password-input");
const pwMsg = document.getElementById("password-msg");

const pwScreen = document.getElementById("password-container");
const site = document.getElementById("birthday-site");

pwBtn.onclick = () => {
  if (pwInput.value === PASSWORD) {
    pwScreen.classList.add("hidden");
    site.classList.remove("hidden");
    setup();
  } else {
    pwMsg.textContent = "Wrong password!";
    pwMsg.style.color = "red";
  }
};

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
  const cake = document.getElementById("cake-section");
  const final = document.getElementById("celebration-section");
  const song = document.getElementById("birthday-song");

  let power = 1;
  let finished = false;

  startBtn.onclick = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const ctx = new AudioContext();
      const mic = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      mic.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);

      function listen() {
        analyser.getByteFrequencyData(data);
        const vol = data.reduce((a, b) => a + b) / data.length;

        if (vol > 40) power -= vol * 0.0007;
        power = Math.max(power, 0);

        flames.forEach(f => {
          f.style.transform = `scale(${power})`;
          f.style.opacity = power;
        });

        if (power <= 0 && !finished) {
          finished = true;
          setTimeout(() => {
            cake.classList.add("hidden");
            const celebration = document.getElementById("celebration-section");
            celebration.style.display = "flex";  // 🔥 SHOW ONLY NOW
            const song = document.getElementById("birthday-song");
            song.play();
          }, 1500);
        }



        

        requestAnimationFrame(listen);
      }

      listen();
    });
  };
}
